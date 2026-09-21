import {
  strFromU8,
  unzipSync,
} from 'fflate'

import {
  isStudioSyncManifestV1,
  type StudioSyncManifestV1,
} from './studioSync'

import {
  writeStudioState,
  type StudioStateV1,
} from './studioState'

import {
  clearStudioAssets,
  setStudioAsset,
} from './localAssetDb'

export type StudioImportProgress = {
  stage:
    | 'reading'
    | 'validating'
    | 'installing'
    | 'ready'

  completed: number
  total: number
}

export type StudioImportResult = {
  state: StudioStateV1

  manifest:
    StudioSyncManifestV1

  assetCount: number
  itemCount: number
  sourceCount: number
  draftCount: number
  canvasCount: number
}

type PreparedAsset = {
  key: string
  mime: string
  version: string
  bytes: Uint8Array
}

function parseJson<T>(
  bytes: Uint8Array,
  label: string,
): T {
  try {
    return JSON.parse(
      strFromU8(bytes),
    ) as T
  } catch {
    throw new Error(
      `Invalid ${label}.`,
    )
  }
}

function isStudioStateV1(
  value: unknown,
): value is StudioStateV1 {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return false
  }

  const state =
    value as Partial<StudioStateV1>

  return (
    state.schema ===
      'ordifi-studio' &&
    state.version === 1 &&
    Array.isArray(
      state.sources,
    ) &&
    !!state.items &&
    typeof state.items ===
      'object' &&
    !!state.explorer &&
    typeof state.explorer ===
      'object' &&
    !!state.canvas &&
    typeof state.canvas ===
      'object' &&
    !!state.drafts &&
    typeof state.drafts ===
      'object' &&
    typeof state.updatedAt ===
      'number'
  )
}

async function sha256Hex(
  bytes: Uint8Array,
) {
  const source =
    new Uint8Array(
      bytes.byteLength,
    )

  source.set(bytes)

  const digest =
    await crypto.subtle.digest(
      'SHA-256',
      source.buffer,
    )

  return Array.from(
    new Uint8Array(digest),
  )
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')
}

function assertSafeBundlePath(
  path: string,
) {
  if (
    !path ||
    path.startsWith('/') ||
    path.includes('\\') ||
    path
      .split('/')
      .some(
        (part) =>
          part === '..' ||
          part === '',
      )
  ) {
    throw new Error(
      `Unsafe bundle path: ${path}`,
    )
  }
}

export async function importStudioBundle(
  file: File,
  onProgress?: (
    progress:
      StudioImportProgress,
  ) => void,
): Promise<StudioImportResult> {
  onProgress?.({
    stage: 'reading',
    completed: 0,
    total: 1,
  })

  const archiveBytes =
    new Uint8Array(
      await file.arrayBuffer(),
    )

  let files:
    Record<string, Uint8Array>

  try {
    files =
      unzipSync(
        archiveBytes,
      )
  } catch {
    throw new Error(
      'The selected file is not a valid OrdiFi Studio bundle.',
    )
  }

  onProgress?.({
    stage: 'reading',
    completed: 1,
    total: 1,
  })

  const manifestBytes =
    files['manifest.json']

  if (!manifestBytes) {
    throw new Error(
      'manifest.json is missing.',
    )
  }

  const manifest =
    parseJson<unknown>(
      manifestBytes,
      'manifest.json',
    )

  if (
    !isStudioSyncManifestV1(
      manifest,
    )
  ) {
    throw new Error(
      'Unsupported Studio sync manifest.',
    )
  }

  assertSafeBundlePath(
    manifest.statePath,
  )

  const stateBytes =
    files[
      manifest.statePath
    ]

  if (!stateBytes) {
    throw new Error(
      `${manifest.statePath} is missing.`,
    )
  }

  const state =
    parseJson<unknown>(
      stateBytes,
      'Studio state',
    )

  if (
    !isStudioStateV1(
      state,
    )
  ) {
    throw new Error(
      'Unsupported or invalid Studio state.',
    )
  }

  const assetEntries =
    Object.values(
      manifest.assets,
    )

  const preparedAssets:
    PreparedAsset[] = []

  onProgress?.({
    stage: 'validating',
    completed: 0,
    total:
      assetEntries.length,
  })

  let validated = 0

  for (
    const entry
    of assetEntries
  ) {
    if (
      !entry.key ||
      !entry.path ||
      !entry.mime ||
      !entry.version
    ) {
      throw new Error(
        'Invalid asset entry in manifest.',
      )
    }

    assertSafeBundlePath(
      entry.path,
    )

    const bytes =
      files[
        entry.path
      ]

    if (!bytes) {
      throw new Error(
        `Bundle asset is missing: ${entry.key}`,
      )
    }

    if (
      bytes.byteLength !==
      entry.size
    ) {
      throw new Error(
        `Asset size mismatch: ${entry.key}`,
      )
    }

    if (entry.sha256) {
      const actual =
        await sha256Hex(
          bytes,
        )

      if (
        actual.toLowerCase() !==
        entry.sha256.toLowerCase()
      ) {
        throw new Error(
          `Asset checksum mismatch: ${entry.key}`,
        )
      }
    }

    preparedAssets.push({
      key:
        entry.key,

      mime:
        entry.mime,

      version:
        entry.version,

      bytes,
    })

    validated += 1

    onProgress?.({
      stage: 'validating',
      completed:
        validated,
      total:
        assetEntries.length,
    })
  }

  /*
   * The complete bundle has now passed
   * structural and checksum validation.
   */
  onProgress?.({
    stage: 'installing',
    completed: 0,
    total:
      preparedAssets.length + 1,
  })

  /*
   * Full snapshot import:
   * stale assets from an older sync
   * must not remain available.
   */
  await clearStudioAssets()

  let installed = 0

  for (
    const asset
    of preparedAssets
  ) {
    const copy =
      new Uint8Array(
        asset.bytes.byteLength,
      )

    copy.set(
      asset.bytes,
    )

    await setStudioAsset({
      key:
        asset.key,

      mime:
        asset.mime,

      version:
        asset.version,

      blob:
        new Blob(
          [copy],
          {
            type:
              asset.mime,
          },
        ),

      updatedAt:
        manifest.exportedAt,
    })

    installed += 1

    onProgress?.({
      stage: 'installing',
      completed:
        installed,
      total:
        preparedAssets.length + 1,
    })
  }

  /*
   * Write semantic state last so the UI
   * never references not-yet-installed
   * assets during a successful import.
   */
  writeStudioState(
    state,
  )

  onProgress?.({
    stage: 'installing',
    completed:
      preparedAssets.length + 1,
    total:
      preparedAssets.length + 1,
  })

  onProgress?.({
    stage: 'ready',
    completed: 1,
    total: 1,
  })

  return {
    state,
    manifest,

    assetCount:
      preparedAssets.length,

    itemCount:
      Object.keys(
        state.items,
      ).length,

    sourceCount:
      state.sources.length,

    draftCount:
      Object.keys(
        state.drafts,
      ).length,

    canvasCount:
      state.canvas.canvases.length,
  }
}
