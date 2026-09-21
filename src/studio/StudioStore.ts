import {
  readStudioState,
  writeStudioState,
  type StudioSource,
  type StudioStateV1,
} from './studioState'

export function getStudioState():
  StudioStateV1 {
  return readStudioState()
}

export function saveStudioState(
  state: StudioStateV1,
) {
  writeStudioState(state)
}

export function upsertSource(
  source: StudioSource,
): StudioStateV1 {
  const current =
    readStudioState()

  const exists =
    current.sources.some(
      (entry) =>
        entry.id === source.id,
    )

  const sources =
    exists
      ? current.sources.map(
          (entry) =>
            entry.id === source.id
              ? source
              : entry,
        )
      : [
          ...current.sources,
          source,
        ]

  const next: StudioStateV1 = {
    ...current,
    sources,
  }

  writeStudioState(next)

  return next
}

export function removeSource(
  sourceId: string,
): StudioStateV1 {
  const current =
    readStudioState()

  const itemIdsToRemove =
    new Set(
      Object.values(
        current.items,
      )
        .filter(
          (item) =>
            item.sourceId ===
            sourceId,
        )
        .map(
          (item) => item.id,
        ),
    )

  const items =
    Object.fromEntries(
      Object.entries(
        current.items,
      ).filter(
        ([itemId]) =>
          !itemIdsToRemove.has(
            itemId,
          ),
      ),
    )

  const next: StudioStateV1 = {
    ...current,

    sources:
      current.sources.filter(
        (source) =>
          source.id !== sourceId,
      ),

    items,
  }

  writeStudioState(next)

  return next
}

export function updateStudioState(
  updater: (
    current: StudioStateV1,
  ) => StudioStateV1,
): StudioStateV1 {
  const current =
    readStudioState()

  const next =
    updater(current)

  writeStudioState(next)

  return next
}

export function createStudioFolder({
  sourceId,
  name = 'New Folder',
  parentPath = 'folders',
}: {
  sourceId: string
  name?: string
  parentPath?: string
}): StudioStateV1 {
  const id =
    typeof crypto !== 'undefined' &&
    'randomUUID' in crypto
      ? crypto.randomUUID()
      : `folder-${Date.now()}`

  return updateStudioState(
    (current) => ({
      ...current,

      explorer: {
        ...current.explorer,

        folders: [
          ...current.explorer.folders,
          {
            id,
            sourceId,
            name,
            parentPath,
            createdAt: Date.now(),
          },
        ],

        folderItems: {
          ...current.explorer.folderItems,
          [id]: [],
        },
      },
    }),
  )
}

export function renameStudioFolder(
  folderId: string,
  name: string,
): StudioStateV1 {
  const normalized =
    name.trim() || 'New Folder'

  return updateStudioState(
    (current) => ({
      ...current,

      explorer: {
        ...current.explorer,

        folders:
          current.explorer.folders.map(
            (folder) =>
              folder.id === folderId
                ? {
                    ...folder,
                    name: normalized,
                  }
                : folder,
          ),
      },
    }),
  )
}

export function moveItemToStudioFolder(
  itemId: string,
  folderId: string,
): StudioStateV1 {
  return updateStudioState(
    (current) => {
      const folder =
        current.explorer.folders.find(
          (entry) =>
            entry.id === folderId,
        )

      const item =
        current.items[itemId]

      if (
        !folder ||
        !item ||
        folder.sourceId !== item.sourceId
      ) {
        return current
      }

      const folderItems =
        Object.fromEntries(
          Object.entries(
            current.explorer.folderItems,
          ).map(
            ([id, itemIds]) => [
              id,
              itemIds.filter(
                (id) => id !== itemId,
              ),
            ],
          ),
        )

      folderItems[folderId] = [
        ...(
          folderItems[folderId] ?? []
        ),
        itemId,
      ]

      return {
        ...current,

        explorer: {
          ...current.explorer,
          folderItems,
        },
      }
    },
  )
}

export function removeItemFromStudioFolders(
  itemId: string,
): StudioStateV1 {
  return updateStudioState(
    (current) => ({
      ...current,

      explorer: {
        ...current.explorer,

        folderItems:
          Object.fromEntries(
            Object.entries(
              current.explorer.folderItems,
            ).map(
              ([folderId, itemIds]) => [
                folderId,
                itemIds.filter(
                  (id) =>
                    id !== itemId,
                ),
              ],
            ),
          ),
      },
    }),
  )
}

export function deleteStudioFolder(
  folderId: string,
): StudioStateV1 {
  return updateStudioState(
    (current) => {
      const folderItems = {
        ...current.explorer.folderItems,
      }

      delete folderItems[folderId]

      return {
        ...current,

        explorer: {
          folders:
            current.explorer.folders.filter(
              (folder) =>
                folder.id !== folderId,
            ),

          folderItems,
        },
      }
    },
  )
}
