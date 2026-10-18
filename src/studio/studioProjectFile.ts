import {
  strToU8,
  zipSync,
} from 'fflate'

import {
  open,
  save,
} from '@tauri-apps/plugin-dialog'

import {
  readFile,
  writeFile,
} from '@tauri-apps/plugin-fs'


import {
  createStudioSyncManifest,
} from './studioSync'

import {
  importStudioBundle,
} from './studioBundleImport'

import {
  clearStudioAssets,
  listStudioAssets,
} from './localAssetDb'

import {
  clearStudioHistory,
  getStudioState,
  saveStudioState,
} from './StudioStore'

import {
  createEmptyStudioState,
} from './studioState'

const PROJECT_EXTENSION =
  'ostu'

let currentProjectPath:
  string | null = null

function projectFilter() {
  return [
    {
      name: 'OrdiFi Studio',
      extensions: [
        PROJECT_EXTENSION,
      ],
    },
  ]
}

function ensureProjectExtension(
  path: string,
) {
  const suffix =
    `.${PROJECT_EXTENSION}`

  return path
    .toLowerCase()
    .endsWith(
      suffix.toLowerCase(),
    )
      ? path
      : `${path}${suffix}`
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
    .map(
      (byte) =>
        byte
          .toString(16)
          .padStart(2, '0'),
    )
    .join('')
}

async function buildProjectBytes() {
  const state =
    getStudioState()

  const assets =
    await listStudioAssets()

  const manifest =
    createStudioSyncManifest()

  const files:
    Record<string, Uint8Array> = {}

  files[
    manifest.statePath
  ] = strToU8(
    JSON.stringify(
      state,
      null,
      2,
    ),
  )

  for (
    let index = 0;
    index < assets.length;
    index += 1
  ) {
    const asset =
      assets[index]

    const bytes =
      new Uint8Array(
        await asset.blob
          .arrayBuffer(),
      )

    const assetPath =
      `assets/${String(
        index + 1,
      ).padStart(
        6,
        '0',
      )}.bin`

    manifest.assets[
      asset.key
    ] = {
      key:
        asset.key,

      path:
        assetPath,

      mime:
        asset.mime,

      version:
        asset.version,

      size:
        bytes.byteLength,

      sha256:
        await sha256Hex(
          bytes,
        ),
    }

    files[
      assetPath
    ] = bytes
  }

  files[
    'manifest.json'
  ] = strToU8(
    JSON.stringify(
      manifest,
      null,
      2,
    ),
  )

  return zipSync(
    files,
    {
      level: 6,
    },
  )
}

function suggestedProjectFilename() {
  if (!currentProjectPath) {
    return 'ordifi-studio01.ostu'
  }

  const normalized =
    currentProjectPath.replace(
      /\\/g,
      '/',
    )

  const filename =
    normalized
      .split('/')
      .pop() ?? ''

  const match =
    filename.match(
      /^ordifi-studio(\d+)\.ostu$/i,
    )

  if (!match) {
    return 'ordifi-studio01.ostu'
  }

  const currentNumber =
    Number(match[1])

  if (
    !Number.isFinite(
      currentNumber,
    )
  ) {
    return 'ordifi-studio01.ostu'
  }

  return `ordifi-studio${String(
    currentNumber + 1,
  ).padStart(
    2,
    '0',
  )}.ostu`
}
async function writeProject(
  path: string,
) {
  const bytes =
    await buildProjectBytes()

  await writeFile(
    path,
    bytes,
  )
}

export function getCurrentProjectPath() {
  return currentProjectPath
}

export async function newStudioProject() {
  /*
   * A project is a complete isolated
   * Studio workspace.
   *
   * Starting a new project must therefore
   * remove both the semantic workspace
   * state and the local assets belonging
   * to the previously opened project.
   */
  await clearStudioAssets()

  saveStudioState(
    createEmptyStudioState(),
  )

  clearStudioHistory()

  currentProjectPath =
    null

  return getStudioState()
}

export async function saveStudioProject() {
  if (!currentProjectPath) {
    return await saveStudioProjectAs()
  }

  await writeProject(
    currentProjectPath,
  )

  return currentProjectPath
}

export async function saveStudioProjectAs() {
  const target =
    await save({
      title:
        'Save OrdiFi Studio Project',

      defaultPath:
        suggestedProjectFilename(),

      filters:
        projectFilter(),
    })

  if (!target) {
    return null
  }

  const path =
    ensureProjectExtension(
      target,
    )

  await writeProject(
    path,
  )

  currentProjectPath =
    path

  return path
}

export async function openStudioProject() {
  const selected =
    await open({
      title:
        'Open OrdiFi Studio Project',

      multiple:
        false,

      directory:
        false,

      filters:
        projectFilter(),
    })

  if (
    !selected ||
    Array.isArray(selected)
  ) {
    return null
  }

  const bytes =
    await readFile(
      selected,
    )

  const copy =
    new Uint8Array(
      bytes.byteLength,
    )

  copy.set(bytes)

  const file =
    new File(
      [
        copy,
      ],
      selected,
      {
        type:
          'application/vnd.ordifi.studio',
      },
    )

  const result =
    await importStudioBundle(
      file,
    )

  clearStudioHistory()

  currentProjectPath =
    selected

  return result
}

export async function exportFullStudioSync() {
  const target = await save({
    title: 'Export OrdiFi Studio Sync',
    defaultPath: 'ordifi-studio-sync.osync',
    filters: [
      {
        name: 'OrdiFi Studio Sync',
        extensions: ['osync'],
      },
    ],
  })

  if (!target) return null

  const path = target.toLowerCase().endsWith('.osync')
    ? target
    : `${target}.osync`

  const bytes = await buildProjectBytes()

  await writeFile(path, bytes)

  return path
}
