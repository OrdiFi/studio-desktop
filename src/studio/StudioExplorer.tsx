import {
  useMemo,
  useState,
} from 'react'

import StudioItemCard from './StudioItemCard'
import StudioItemInfo from './StudioItemInfo'

import {
  createStudioFolder,
  deleteStudioFolder,
  moveItemToStudioFolder,
  removeItemFromStudioFolders,
  renameStudioFolder,
} from './StudioStore'

import type {
  StudioFolder,
  StudioItemSnapshot,
  StudioSource,
  StudioStateV1,
} from './studioState'

type Props = {
  state: StudioStateV1

  onAddToCanvas: (
    item: StudioItemSnapshot,
  ) => void
}

type Category =
  | 'ordinals'
  | 'cases'
  | 'layouts'
  | 'suitcases'
  | 'albums'

type Selection = {
  sourceId: string
  category: Category
} | null

type InfoSelection = {
  item: StudioItemSnapshot
  source: StudioSource
} | null

function matchesCategory(
  item: StudioItemSnapshot,
  category: Category,
) {
  if (category === 'ordinals') {
    return item.ordifiKind === null
  }

  if (category === 'cases') {
    return (
      item.ordifiKind === 'case'
    )
  }

  if (category === 'layouts') {
    return (
      item.ordifiKind === 'layout' ||
      item.ordifiKind === 'grid4' ||
      item.ordifiKind === 'grid9' ||
      item.ordifiKind === 'grid16'
    )
  }

  if (category === 'suitcases') {
    return (
      item.ordifiKind ===
      'suitcase'
    )
  }

  return item.ordifiKind === 'album'
}

function findItemFolder(
  state: StudioStateV1,
  itemId: string,
) {
  for (
    const [folderId, itemIds]
    of Object.entries(
      state.explorer.folderItems,
    )
  ) {
    if (
      itemIds.includes(itemId)
    ) {
      return folderId
    }
  }

  return null
}

export default function StudioExplorer({
  state,
  onAddToCanvas,
}: Props) {
  const [openWallets, setOpenWallets] =
    useState<Set<string>>(
      () => new Set(),
    )

  const [openFolderGroups, setOpenFolderGroups] =
    useState<Set<string>>(
      () => new Set(),
    )

  const [openFolders, setOpenFolders] =
    useState<Set<string>>(
      () => new Set(),
    )

  const [selection, setSelection] =
    useState<Selection>(null)

  const [info, setInfo] =
    useState<InfoSelection>(null)

  const items = useMemo(
    () => Object.values(state.items),
    [state.items],
  )

  function toggleSet(
    setter: React.Dispatch<
      React.SetStateAction<
        Set<string>
      >
    >,
    id: string,
  ) {
    setter((current) => {
      const next =
        new Set(current)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  function walletFolders(
    sourceId: string,
  ) {
    return state.explorer.folders.filter(
      (folder) =>
        folder.sourceId === sourceId,
    )
  }

  function createFolder(
    source: StudioSource,
  ) {
    const result =
      createStudioFolder({
        sourceId: source.id,
      })

    const created =
      result.explorer.folders[
        result.explorer.folders
          .length - 1
      ]

    if (!created) return

    const name =
      window.prompt(
        'Folder name',
        created.name,
      )

    if (
      name === null ||
      !name.trim()
    ) {
      return
    }

    renameStudioFolder(
      created.id,
      name,
    )

    setOpenFolderGroups(
      (current) =>
        new Set([
          ...current,
          source.id,
        ]),
    )

    setOpenFolders(
      (current) =>
        new Set([
          ...current,
          created.id,
        ]),
    )
  }

  function renameFolder(
    folder: StudioFolder,
  ) {
    const name =
      window.prompt(
        'Rename folder',
        folder.name,
      )

    if (
      name === null ||
      !name.trim()
    ) {
      return
    }

    renameStudioFolder(
      folder.id,
      name,
    )
  }

  function removeFolder(
    folder: StudioFolder,
  ) {
    const confirmed =
      window.confirm(
        `Delete "${folder.name}"? Items will return to their wallet categories.`,
      )

    if (!confirmed) return

    deleteStudioFolder(
      folder.id,
    )

    setOpenFolders(
      (current) => {
        const next =
          new Set(current)

        next.delete(folder.id)

        return next
      },
    )
  }

  return (
    <>
      <aside className="studio-explorer">
        <div className="explorer-header">
          <strong>Explorer</strong>

          <span>
            {state.sources.length}
          </span>
        </div>

        <div className="explorer-wallet-list">
          {state.sources.length === 0 ? (
            <div className="explorer-empty">
              <span>
                No wallets synced yet.
              </span>

              <small>
                Synced Web Studio wallets
                will appear here.
              </small>
            </div>
          ) : (
            state.sources.map(
              (source) => {
                const walletOpen =
                  openWallets.has(
                    source.id,
                  )

                const allWalletItems =
                  items.filter(
                    (item) =>
                      item.sourceId ===
                      source.id,
                  )

                const walletItems =
                  allWalletItems.filter(
                    (item) =>
                      item.explorerVisible !==
                      false,
                  )

                const folders =
                  walletFolders(
                    source.id,
                  )

                /*
                 * Root categories contain only
                 * items which are not currently
                 * assigned to a folder.
                 */
                const rootItems =
                  walletItems.filter(
                    (item) =>
                      !findItemFolder(
                        state,
                        item.id,
                      ),
                  )

                const categories:
                  Array<{
                    id: Category
                    label: string
                  }> = [
                    {
                      id: 'ordinals',
                      label: 'Ordinals',
                    },
                    {
                      id: 'cases',
                      label: 'Cases',
                    },
                    {
                      id: 'layouts',
                      label: 'Layouts',
                    },
                    {
                      id: 'suitcases',
                      label: 'Suitcases',
                    },
                    {
                      id: 'albums',
                      label: 'Albums',
                    },
                  ]

                return (
                  <section
                    key={source.id}
                    className="wallet-node"
                  >
                    <button
                      type="button"
                      className="wallet-node-header"
                      onClick={() =>
                        toggleSet(
                          setOpenWallets,
                          source.id,
                        )
                      }
                    >
                      <span className="wallet-chevron">
                        {walletOpen
                          ? '▾'
                          : '▸'}
                      </span>

                      <span
                        className="wallet-color"
                        style={{
                          background:
                            source.color,
                        }}
                      />

                      <span className="wallet-name">
                        {source.label}
                      </span>

                      <span className="wallet-count">
                        {
                          walletItems.length
                        }
                      </span>
                    </button>

                    {walletOpen ? (
                      <div className="wallet-children">
                        {categories.map(
                          (category) => {
                            const categoryItems =
                              rootItems.filter(
                                (item) =>
                                  matchesCategory(
                                    item,
                                    category.id,
                                  ),
                              )

                            const active =
                              selection
                                ?.sourceId ===
                                source.id &&
                              selection
                                .category ===
                                category.id

                            return (
                              <div
                                key={
                                  category.id
                                }
                              >
                                <button
                                  type="button"
                                  className={
                                    active
                                      ? 'explorer-row is-active'
                                      : 'explorer-row'
                                  }
                                  onClick={() =>
                                    setSelection(
                                      active
                                        ? null
                                        : {
                                            sourceId:
                                              source.id,

                                            category:
                                              category.id,
                                          },
                                    )
                                  }
                                >
                                  <span
                                    className="explorer-row-mark"
                                    style={{
                                      borderColor:
                                        source.color,
                                    }}
                                  />

                                  <span>
                                    {
                                      category.label
                                    }
                                  </span>

                                  <span className="explorer-row-count">
                                    {
                                      categoryItems.length
                                    }
                                  </span>
                                </button>

                                {active ? (
                                  <div className="explorer-item-grid">
                                    {categoryItems.length ===
                                    0 ? (
                                      <div className="explorer-category-empty">
                                        Empty
                                      </div>
                                    ) : (
                                      categoryItems.map(
                                        (item) => (
                                          <StudioItemCard
                                            key={
                                              item.id
                                            }
                                            item={
                                              item
                                            }
                                            source={
                                              source
                                            }
                                            folders={
                                              folders
                                            }
                                            onInfo={(
                                              infoItem,
                                              infoSource,
                                            ) =>
                                              setInfo(
                                                {
                                                  item:
                                                    infoItem,

                                                  source:
                                                    infoSource,
                                                },
                                              )
                                            }
                                            onAddToCanvas={
                                              onAddToCanvas
                                            }
                                            onMoveToFolder={(
                                              itemId,
                                              folderId,
                                            ) =>
                                              moveItemToStudioFolder(
                                                itemId,
                                                folderId,
                                              )
                                            }
                                          />
                                        ),
                                      )
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            )
                          },
                        )}

                        <div className="explorer-folder-group">
                          <div className="explorer-folder-group-row">
                            <button
                              type="button"
                              className="explorer-row"
                              onClick={() =>
                                toggleSet(
                                  setOpenFolderGroups,
                                  source.id,
                                )
                              }
                            >
                              <span className="wallet-chevron">
                                {openFolderGroups.has(
                                  source.id,
                                )
                                  ? '▾'
                                  : '▸'}
                              </span>

                              <span>
                                Folders
                              </span>

                              <span className="explorer-row-count">
                                {
                                  folders.length
                                }
                              </span>
                            </button>

                            <button
                              type="button"
                              className="explorer-folder-add"
                              title="Create folder"
                              onClick={() =>
                                createFolder(
                                  source,
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          {openFolderGroups.has(
                            source.id,
                          ) ? (
                            <div className="explorer-folder-list">
                              {folders.length ===
                              0 ? (
                                <div className="explorer-category-empty">
                                  No folders
                                </div>
                              ) : (
                                folders.map(
                                  (
                                    folder,
                                  ) => {
                                    const folderOpen =
                                      openFolders.has(
                                        folder.id,
                                      )

                                    const folderItemIds =
                                      state.explorer
                                        .folderItems[
                                        folder.id
                                      ] ?? []

                                    const folderItems =
                                      folderItemIds
                                        .map(
                                          (
                                            id,
                                          ) =>
                                            state
                                              .items[
                                              id
                                            ],
                                        )
                                        .filter(
                                          (
                                            item,
                                          ): item is StudioItemSnapshot =>
                                            Boolean(
                                              item,
                                            ) &&
                                            item.sourceId ===
                                              source.id,
                                        )

                                    return (
                                      <div
                                        key={
                                          folder.id
                                        }
                                        className="explorer-folder"
                                      >
                                        <div className="explorer-folder-row">
                                          <button
                                            type="button"
                                            className="explorer-folder-main"
                                            onClick={() =>
                                              toggleSet(
                                                setOpenFolders,
                                                folder.id,
                                              )
                                            }
                                          >
                                            <span>
                                              {folderOpen
                                                ? '▾'
                                                : '▸'}
                                            </span>

                                            <span>
                                              📁
                                            </span>

                                            <span>
                                              {
                                                folder.name
                                              }
                                            </span>

                                            <small>
                                              {
                                                folderItems.length
                                              }
                                            </small>
                                          </button>

                                          <button
                                            type="button"
                                            className="explorer-folder-action"
                                            title="Rename folder"
                                            onClick={() =>
                                              renameFolder(
                                                folder,
                                              )
                                            }
                                          >
                                            ✎
                                          </button>

                                          <button
                                            type="button"
                                            className="explorer-folder-action"
                                            title="Delete folder"
                                            onClick={() =>
                                              removeFolder(
                                                folder,
                                              )
                                            }
                                          >
                                            ×
                                          </button>
                                        </div>

                                        {folderOpen ? (
                                          <div className="explorer-item-grid explorer-folder-items">
                                            {folderItems.length ===
                                            0 ? (
                                              <div className="explorer-category-empty">
                                                Empty
                                              </div>
                                            ) : (
                                              folderItems.map(
                                                (
                                                  item,
                                                ) => (
                                                  <StudioItemCard
                                                    key={
                                                      item.id
                                                    }
                                                    item={
                                                      item
                                                    }
                                                    source={
                                                      source
                                                    }
                                                    folders={
                                                      folders
                                                    }
                                                    currentFolderId={
                                                      folder.id
                                                    }
                                                    onInfo={(
                                                      infoItem,
                                                      infoSource,
                                                    ) =>
                                                      setInfo(
                                                        {
                                                          item:
                                                            infoItem,

                                                          source:
                                                            infoSource,
                                                        },
                                                      )
                                                    }
                                                    onAddToCanvas={
                                                      onAddToCanvas
                                                    }
                                                    onMoveToFolder={(
                                                      itemId,
                                                      folderId,
                                                    ) =>
                                                      moveItemToStudioFolder(
                                                        itemId,
                                                        folderId,
                                                      )
                                                    }
                                                    onRemoveFromFolder={(
                                                      itemId,
                                                    ) =>
                                                      removeItemFromStudioFolders(
                                                        itemId,
                                                      )
                                                    }
                                                  />
                                                ),
                                              )
                                            )}
                                          </div>
                                        ) : null}
                                      </div>
                                    )
                                  },
                                )
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </section>
                )
              },
            )
          )}
        </div>
      </aside>

      {info ? (
        <StudioItemInfo
          item={info.item}
          source={info.source}
          onClose={() =>
            setInfo(null)
          }
        />
      ) : null}
    </>
  )
}
