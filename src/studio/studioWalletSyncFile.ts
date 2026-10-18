import {
  strToU8,
  zipSync,
} from 'fflate'

import {
  save,
} from '@tauri-apps/plugin-dialog'

import {
  writeFile,
} from '@tauri-apps/plugin-fs'

import {
  getStudioState,
} from './StudioStore'

import type {
  StudioDraft,
  StudioFolder,
  StudioItemSnapshot,
  StudioSource,
} from './studioState'

const WALLET_SYNC_EXTENSION =
  'osync'

type WalletSyncManifestV1 = {
  schema:
    'ordifi-studio-wallet-sync'
  version: 1
  exportedAt: number
  walletAddress: string
  walletSourceId: string
  statePath: 'wallet-state.json'
}

type WalletSyncStateV1 = {
  schema:
    'ordifi-studio-wallet-state'
  version: 1

  source: StudioSource

  items: Record<
    string,
    StudioItemSnapshot
  >

  explorer: {
    folders: StudioFolder[]

    folderItems: Record<
      string,
      string[]
    >
  }

  drafts: Record<
    string,
    StudioDraft
  >

  notes: Record<
    string,
    string
  >

  exportedAt: number
}

function syncFilter() {
  return [
    {
      name:
        'OrdiFi Studio Wallet Sync',

      extensions: [
        WALLET_SYNC_EXTENSION,
      ],
    },
  ]
}

function ensureSyncExtension(
  path: string,
) {
  const suffix =
    `.${WALLET_SYNC_EXTENSION}`

  return path
    .toLowerCase()
    .endsWith(
      suffix.toLowerCase(),
    )
      ? path
      : `${path}${suffix}`
}

function walletSyncFilename(
  source: StudioSource,
) {
  const normalized =
    source.address.trim()

  const suffix =
    normalized.length > 5
      ? normalized.slice(-5)
      : normalized || 'wallet'

  return `${suffix}-ordifi-studio.osync`
}

function portableItem(
  item: StudioItemSnapshot,
): StudioItemSnapshot {
  /*
   * .osync contains portable wallet state.
   *
   * Local IndexedDB thumbnail/assets are
   * intentionally not part of this file.
   * The receiving Studio/Webapp resolves
   * visuals again from its own data source.
   */
  return {
    ...item,

    rawThumbnail:
      null,

    compositionThumbnail:
      null,
  }
}

function buildWalletSyncState(
  source: StudioSource,
): WalletSyncStateV1 {
  const state =
    getStudioState()

  const itemEntries =
    Object.entries(
      state.items,
    ).filter(
      ([, item]) =>
        item.sourceId ===
        source.id,
    )

  const items =
    Object.fromEntries(
      itemEntries.map(
        ([id, item]) => [
          id,
          portableItem(
            item,
          ),
        ],
      ),
    ) as Record<
      string,
      StudioItemSnapshot
    >

  const itemIds =
    new Set(
      Object.keys(items),
    )

  const folders =
    state.explorer.folders.filter(
      (folder) =>
        folder.sourceId ===
        source.id,
    )

  const folderIds =
    new Set(
      folders.map(
        (folder) =>
          folder.id,
      ),
    )

  const folderItems =
    Object.fromEntries(
      Object.entries(
        state.explorer
          .folderItems,
      )
        .filter(
          ([folderId]) =>
            folderIds.has(
              folderId,
            ),
        )
        .map(
          ([
            folderId,
            ids,
          ]) => [
            folderId,

            ids.filter(
              (id) =>
                itemIds.has(id),
            ),
          ],
        ),
    )

  const drafts =
    Object.fromEntries(
      Object.entries(
        state.drafts,
      )
        .filter(
          ([rootId]) =>
            itemIds.has(
              rootId,
            ),
        )
        .map(
          ([
            rootId,
            draft,
          ]) => {
            const foreignChild =
              draft.itemIds.find(
                (id) =>
                  !itemIds.has(id),
              )

            if (foreignChild) {
              throw new Error(
                `Wallet sync cannot contain a cross-wallet Draft relationship. Draft ${rootId} references ${foreignChild}.`,
              )
            }

            return [
              rootId,
              draft,
            ]
          },
        ),
    ) as Record<
      string,
      StudioDraft
    >

  const notes =
    Object.fromEntries(
      Object.entries(
        state.notes ?? {},
      ).filter(
        ([itemId]) =>
          itemIds.has(
            itemId,
          ),
      ),
    )

  return {
    schema:
      'ordifi-studio-wallet-state',

    version: 1,

    source,

    items,

    explorer: {
      folders,
      folderItems,
    },

    drafts,

    notes,

    exportedAt:
      Date.now(),
  }
}

function selectWalletSource():
  StudioSource | null {
  const state =
    getStudioState()

  const sources =
    state.sources.filter(
      (source) =>
        source.enabled !== false,
    )

  if (
    sources.length === 0
  ) {
    window.alert(
      'No wallet is available to export.',
    )

    return null
  }

  if (
    sources.length === 1
  ) {
    return sources[0]
  }

  const lines =
    sources.map(
      (
        source,
        index,
      ) => {
        const address =
          source.address.trim()

        const shortAddress =
          address.length > 18
            ? `${address.slice(
                0,
                8,
              )}...${address.slice(
                -6,
              )}`
            : address

        return `${index + 1}. ${source.label} — ${shortAddress}`
      },
    )

  const answer =
    window.prompt(
      [
        'Select wallet to export:',
        '',
        ...lines,
        '',
        `Enter 1-${sources.length}`,
      ].join('\n'),
      '1',
    )

  if (
    answer === null
  ) {
    return null
  }

  const index =
    Number.parseInt(
      answer.trim(),
      10,
    ) - 1

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= sources.length
  ) {
    throw new Error(
      'Invalid wallet selection.',
    )
  }

  return sources[index]
}

function buildWalletSyncBytes(
  source: StudioSource,
) {
  const payload =
    buildWalletSyncState(
      source,
    )

  const manifest:
    WalletSyncManifestV1 = {
      schema:
        'ordifi-studio-wallet-sync',

      version: 1,

      exportedAt:
        Date.now(),

      walletAddress:
        source.address,

      walletSourceId:
        source.id,

      statePath:
        'wallet-state.json',
    }

  const files:
    Record<
      string,
      Uint8Array
    > = {
      'manifest.json':
        strToU8(
          JSON.stringify(
            manifest,
            null,
            2,
          ),
        ),

      'wallet-state.json':
        strToU8(
          JSON.stringify(
            payload,
            null,
            2,
          ),
        ),
    }

  return zipSync(
    files,
    {
      level: 6,
    },
  )
}

export async function exportStudioWalletSync() {
  const source =
    selectWalletSource()

  if (!source) {
    return null
  }

  const target =
    await save({
      title:
        'Export OrdiFi Studio Wallet Sync',

      defaultPath:
        walletSyncFilename(
          source,
        ),

      filters:
        syncFilter(),
    })

  if (!target) {
    return null
  }

  const path =
    ensureSyncExtension(
      target,
    )

  const bytes =
    buildWalletSyncBytes(
      source,
    )

  await writeFile(
    path,
    bytes,
  )

  return path
}