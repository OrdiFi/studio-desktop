import {
  useMemo,
  useRef,
  useState,
} from 'react'

import { Folder } from 'lucide-react'

import StudioItemCard from './StudioItemCard'
import StudioItemInfo from './StudioItemInfo'

import {
  createStudioFolder,
  deleteStudioFolder,
  moveItemToStudioFolder,
  removeItemFromStudioFolders,
  renameStudioFolder,
  updateStudioState,
} from './StudioStore'

import {
  canPackIntoDraftStructuralContainer,
  canPackOrdinalIntoDraftCase,
  canPackOrdinalIntoDraftLayout,
  createDraftForItemState,
  packIntoDraftStructuralContainerState,
  packOrdinalIntoDraftCaseState,
  packOrdinalIntoDraftLayoutState,
} from './draftEditing'

import type {
  StudioFolder,
  StudioItemSnapshot,
  StudioSource,
  StudioStateV1,
} from './studioState'

type Props = {
  state: StudioStateV1
  classic: boolean

  selectedItemId: string | null

  onSelectedItemChange: (
    itemId: string | null,
  ) => void

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

function draftParentOf(
  state: StudioStateV1,
  itemId: string,
) {
  return (
    Object.values(
      state.drafts,
    ).find(
      (draft) =>
        draft.itemIds.includes(
          itemId,
        ),
    ) ?? null
  )
}

function effectiveCompositionItemIds(
  state: StudioStateV1,
  item: StudioItemSnapshot,
) {
  const draft =
    state.drafts[item.id]

  if (draft) {
    return draft.itemIds
  }

  return compositionItemIds(item)
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

function compositionItemIds(
  item: StudioItemSnapshot,
) {
  const composition =
    item.composition

  if (
    !composition ||
    typeof composition !== 'object'
  ) {
    return []
  }

  const itemIds =
    (
      composition as {
        itemIds?: unknown
      }
    ).itemIds

  if (!Array.isArray(itemIds)) {
    return []
  }

  return itemIds.filter(
    (id): id is string =>
      typeof id === 'string' &&
      id.length > 0 &&
      id !== item.id,
  )
}

export default function StudioExplorer({
  state,
  classic,
  selectedItemId,
  onSelectedItemChange,
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

  const [openItems, setOpenItems] =
    useState<Set<string>>(
      () => new Set(),
    )

  const [selection, setSelection] =
    useState<Selection>(null)

  const [info, setInfo] =
    useState<InfoSelection>(null)


  const [
    packItemId,
    setPackItemId,
  ] = useState<string | null>(null)

  const touchDragRef =
    useRef<{
      pointerId: number
      itemId: string
      startX: number
      startY: number
      dragging: boolean
    } | null>(null)

  const [
    touchDragGhost,
    setTouchDragGhost,
  ] = useState<{
    itemId: string
    x: number
    y: number
  } | null>(null)

  const items = useMemo(
    () => Object.values(state.items),
    [state.items],
  )

  function beginTouchDrag(
    event: React.PointerEvent<HTMLElement>,
  ) {
    if (
      event.pointerType !== 'touch' &&
      event.pointerType !== 'pen'
    ) {
      return
    }

    const target =
      event.target as HTMLElement

    if (
      target.closest(
        '.studio-item-menu',
      )
    ) {
      return
    }

    const card =
      target.closest<HTMLElement>(
        '.studio-item-card[data-studio-item-id]',
      )

    if (!card) {
      return
    }

    const itemId =
      card.dataset.studioItemId

    if (
      !itemId ||
      !state.items[itemId]
    ) {
      return
    }

    onSelectedItemChange(itemId)

    touchDragRef.current = {
      pointerId: event.pointerId,
      itemId,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
    }

    /*
     * Capture immediately.
     * WebView2 may otherwise hand the pointer
     * to native touch handling before our
     * horizontal drag threshold is reached.
     */
    try {
      event.currentTarget
        .setPointerCapture(
          event.pointerId,
        )
    } catch {
      // Pointer capture is optional.
    }
  }

  function moveTouchDrag(
    event: React.PointerEvent<HTMLElement>,
  ) {
    const current =
      touchDragRef.current

    if (
      !current ||
      current.pointerId !==
        event.pointerId
    ) {
      return
    }

    const dx =
      event.clientX -
      current.startX

    const dy =
      event.clientY -
      current.startY

    if (!current.dragging) {
      /*
       * Vertical gesture:
       * leave it to Explorer scrolling.
       */
      if (
        Math.abs(dy) >= 10 &&
        Math.abs(dy) >
          Math.abs(dx)
      ) {
        touchDragRef.current = null
        return
      }

      /*
       * Horizontal gesture:
       * this becomes Studio drag.
       */
      if (
        Math.abs(dx) < 10 ||
        Math.abs(dx) <=
          Math.abs(dy)
      ) {
        return
      }

      current.dragging = true
    }

    event.preventDefault()

    setTouchDragGhost({
      itemId: current.itemId,
      x: event.clientX,
      y: event.clientY,
    })
  }

  function endTouchDrag(
    event: React.PointerEvent<HTMLElement>,
  ) {
    const current =
      touchDragRef.current

    if (
      !current ||
      current.pointerId !==
        event.pointerId
    ) {
      return
    }

    touchDragRef.current = null
    setTouchDragGhost(null)

    if (!current.dragging) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    try {
      if (
        event.currentTarget
          .hasPointerCapture(
            event.pointerId,
          )
      ) {
        event.currentTarget
          .releasePointerCapture(
            event.pointerId,
          )
      }
    } catch {
      // Pointer capture is optional.
    }

    window.dispatchEvent(
      new CustomEvent(
        'ordifi-studio-touch-drop',
        {
          detail: {
            itemId:
              current.itemId,

            clientX:
              event.clientX,

            clientY:
              event.clientY,
          },
        },
      ),
    )
  }

  function cancelTouchDrag() {
    touchDragRef.current = null
    setTouchDragGhost(null)
  }

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

  function renderExplorerItem(
    item: StudioItemSnapshot,
    source: StudioSource,
    folders: StudioFolder[],
    currentFolderId:
      string | null = null,
  ) {
    if (!classic) {
      return (
        <StudioItemCard
          key={item.id}
          item={item}
          source={source}
          state={state}
          selected={
            selectedItemId ===
            item.id
          }
          onSelect={() =>
            onSelectedItemChange(
              item.id,
            )
          }
          folders={folders}
          currentFolderId={
            currentFolderId
          }
          onInfo={(
            infoItem,
            infoSource,
          ) =>
            setInfo({
              item: infoItem,
              source: infoSource,
            })
          }
          onAddToCanvas={
            onAddToCanvas
          }
          onPack={(packItem) =>
            setPackItemId(packItem.id)
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
      )
    }

    const childItems =
      item.ordifiKind === 'case'
        ? effectiveCompositionItemIds(
            state,
            item,
          )
            .map(
              (id) =>
                state.items[id],
            )
            .filter(
              (
                child,
              ): child is StudioItemSnapshot =>
                Boolean(child) &&
                child.sourceId ===
                  source.id,
            )
        : []

    const hasChildren =
      childItems.length > 0

    const itemOpen =
      openItems.has(item.id)

    return (
      <div
        key={item.id}
        className="explorer-classic-node"
      >
        <div
          className={
            hasChildren
              ? 'explorer-classic-node-row is-expandable'
              : 'explorer-classic-node-row'
          }
          onClick={(event) => {
            if (!hasChildren) {
              return
            }

            const target =
              event.target as HTMLElement

            if (
              target.closest(
                '.studio-item-menu',
              )
            ) {
              return
            }

            toggleSet(
              setOpenItems,
              item.id,
            )
          }}
        >
          {hasChildren ? (
            <button
              type="button"
              className="explorer-classic-toggle"
              aria-label={
                itemOpen
                  ? 'Collapse item'
                  : 'Expand item'
              }
              onClick={(event) => {
                event.stopPropagation()

                toggleSet(
                  setOpenItems,
                  item.id,
                )
              }}
            >
              {itemOpen
                ? '▾'
                : '▸'}
            </button>
          ) : (
            <span className="explorer-classic-toggle-spacer" />
          )}

          <StudioItemCard
            item={item}
            source={source}
          state={state}
            selected={
              selectedItemId ===
              item.id
            }
            onSelect={() =>
              onSelectedItemChange(
                item.id,
              )
            }
            folders={folders}
            currentFolderId={
              currentFolderId
            }
            onInfo={(
              infoItem,
              infoSource,
            ) =>
              setInfo({
                item: infoItem,
                source: infoSource,
              })
            }
            onAddToCanvas={
              onAddToCanvas
            }
            onPack={(packItem) =>
              setPackItemId(packItem.id)
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
        </div>

        {hasChildren &&
        itemOpen ? (
          <div className="explorer-classic-children">
            {childItems.map(
              (child) => {
                const childFolderId =
                  findItemFolder(
                    state,
                    child.id,
                  )

                return (
                  <div
                    key={child.id}
                    className="explorer-classic-child-row"
                  >
                    <span className="explorer-classic-child-branch">
                      {'└”'}
                    </span>

                    <StudioItemCard
                      item={child}
                      source={source}
          state={state}
                      selected={
                        selectedItemId ===
                        child.id
                      }
                      onSelect={() =>
                        onSelectedItemChange(
                          child.id,
                        )
                      }
                      folders={
                        folders
                      }
                      currentFolderId={
                        childFolderId
                      }
                      onInfo={(
                        infoItem,
                        infoSource,
                      ) =>
                        setInfo({
                          item:
                            infoItem,
                          source:
                            infoSource,
                        })
                      }
                      onAddToCanvas={
                        onAddToCanvas
                      }
                      onPack={(packItem) =>
                        setPackItemId(packItem.id)
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
                  </div>
                )
              },
            )}
          </div>
        ) : null}
      </div>
    )
  }

  function createFolder(
    source: StudioSource,
  ) {
    /*
     * Ask for the final name first.
     * This avoids creating a temporary
     * "New Folder" state and renaming it
     * in a second write.
     */
    const rawName =
      window.prompt(
        'Folder name',
        '',
      )

    if (rawName === null) {
      return
    }

    const name =
      rawName.trim()

    if (!name) {
      return
    }

    const result =
      createStudioFolder({
        sourceId: source.id,
        name,
      })

    const created =
      result.explorer.folders[
        result.explorer.folders
          .length - 1
      ]

    if (!created) {
      return
    }

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
      <aside
        className="studio-explorer"
        onPointerDown={
          beginTouchDrag
        }
        onPointerMove={
          moveTouchDrag
        }
        onPointerUp={
          endTouchDrag
        }
        onPointerCancel={
          cancelTouchDrag
        }
      >
        {touchDragGhost ? (
          <div
            className="studio-touch-drag-ghost"
            style={{
              left:
                touchDragGhost.x,
              top:
                touchDragGhost.y,
            }}
          >
            {(() => {
              const item =
                state.items[
                  touchDragGhost
                    .itemId
                ]

              return (
                item?.serial ||
                item?.label ||
                item?.name ||
                'Item'
              )
            })()}
          </div>
        ) : null}
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
                        false &&
                      !draftParentOf(
                        state,
                        item.id,
                      ),
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
                                        (item) =>
                                          renderExplorerItem(
                                            item,
                                            source,
                                            folders,
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
                                              source.id &&
                                            item.explorerVisible !==
                                              false &&
                                            !draftParentOf(
                                              state,
                                              item.id,
                                            ),
                                        )

                                    return (
                                      <div
                                        key={
                                          folder.id
                                        }
                                        className="explorer-folder"
                                        onDragOver={(
                                          event,
                                        ) => {
                                          const itemId =
                                            event.dataTransfer.getData(
                                              'application/x-ordifi-studio-item',
                                            ) ||
                                            event.dataTransfer.getData(
                                              'text/plain',
                                            )

                                          if (!itemId) {
                                            return
                                          }

                                          const item =
                                            state.items[
                                              itemId
                                            ]

                                          if (
                                            !item ||
                                            item.sourceId !==
                                              source.id
                                          ) {
                                            return
                                          }

                                          event.preventDefault()

                                          event.dataTransfer.dropEffect =
                                            'move'
                                        }}
                                        onDrop={(
                                          event,
                                        ) => {
                                          event.preventDefault()
                                          event.stopPropagation()

                                          const itemId =
                                            event.dataTransfer.getData(
                                              'application/x-ordifi-studio-item',
                                            ) ||
                                            event.dataTransfer.getData(
                                              'text/plain',
                                            )

                                          if (!itemId) {
                                            return
                                          }

                                          const item =
                                            state.items[
                                              itemId
                                            ]

                                          if (
                                            !item ||
                                            item.sourceId !==
                                              source.id
                                          ) {
                                            return
                                          }

                                          moveItemToStudioFolder(
                                            itemId,
                                            folder.id,
                                          )

                                          setOpenFolderGroups(
                                            (
                                              current,
                                            ) =>
                                              new Set([
                                                ...current,
                                                source.id,
                                              ]),
                                          )

                                          setOpenFolders(
                                            (
                                              current,
                                            ) =>
                                              new Set([
                                                ...current,
                                                folder.id,
                                              ]),
                                          )
                                        }}
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

                                            <span
                                              className="explorer-folder-icon"
                                              aria-hidden="true"
                                            >
                                              <Folder
                                                size={13}
                                                strokeWidth={1.7}
                                              />
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
                                                ) =>
                                                  renderExplorerItem(
                                                    item,
                                                    source,
                                                    folders,
                                                    folder.id,
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

      {packItemId &&
      state.items[packItemId] ? (
        <div
          className="studio-info-backdrop"
          onPointerDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setPackItemId(null)
            }
          }}
        >
          <section
            className="studio-info-dialog studio-pack-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Pack ordinal"
          >
            <header className="studio-info-header">
              <div>
                <strong>Pack</strong>
                <span>
                  Select compatible Case or Layout
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPackItemId(null)
                }
              >
                ×
              </button>
            </header>

            <div className="studio-pack-targets">
              {(() => {
                const packItem =
                  state.items[packItemId]

                if (!packItem) {
                  return null
                }

                const packItemIsLayout =
                  packItem.ordifiKind ===
                    'grid4' ||
                  packItem.ordifiKind ===
                    'grid9' ||
                  packItem.ordifiKind ===
                    'grid16' ||
                  packItem.ordifiKind ===
                    'layout'

                const targetDescription =
                  packItem.ordifiKind ===
                    null
                    ? 'Case or Layout'
                    : packItem.ordifiKind ===
                        'case'
                      ? 'Suitcase'
                      : packItemIsLayout
                        ? 'Album'
                        : 'container'

                const targets =
                  items.filter(
                    (target) => {
                      if (
                        target.sourceId !==
                        packItem.sourceId
                      ) {
                        return false
                      }

                      const candidate =
                        createDraftForItemState(
                          state,
                          target.id,
                        )

                      if (
                        target.ordifiKind === 'album' ||
                        target.ordifiKind === 'suitcase'
                      ) {
                        console.log(
                          '[STRUCTURAL PACK TARGET]',
                          {
                            packItem: {
                              id: packItem.id,
                              kind:
                                packItem.ordifiKind,
                              sourceId:
                                packItem.sourceId,
                            },

                            target: {
                              id: target.id,
                              kind:
                                target.ordifiKind,
                              sourceId:
                                target.sourceId,
                              slotCount:
                                target.slotCount,
                            },

                            draft:
                              candidate.drafts[
                                target.id
                              ] ?? null,

                            allowed:
                              canPackIntoDraftStructuralContainer(
                                candidate,
                                target.id,
                                packItem.id,
                              ),
                          },
                        )
                      }

                      if (
                        packItem.ordifiKind ===
                        null
                      ) {
                        if (
                          target.ordifiKind ===
                          'case'
                        ) {
                          return canPackOrdinalIntoDraftCase(
                            candidate,
                            target.id,
                            packItem.id,
                          )
                        }

                        const targetIsLayout =
                          target.ordifiKind ===
                            'grid4' ||
                          target.ordifiKind ===
                            'grid9' ||
                          target.ordifiKind ===
                            'grid16' ||
                          target.ordifiKind ===
                            'layout'

                        return (
                          targetIsLayout &&
                          canPackOrdinalIntoDraftLayout(
                            candidate,
                            target.id,
                            packItem.id,
                          )
                        )
                      }

                      if (
                        packItem.ordifiKind ===
                          'case' &&
                        target.ordifiKind ===
                          'suitcase'
                      ) {
                        return canPackIntoDraftStructuralContainer(
                          candidate,
                          target.id,
                          packItem.id,
                        )
                      }

                      if (
                        packItemIsLayout &&
                        target.ordifiKind ===
                          'album'
                      ) {
                        return canPackIntoDraftStructuralContainer(
                          candidate,
                          target.id,
                          packItem.id,
                        )
                      }

                      return false
                    },
                  )

                if (
                  targets.length === 0
                ) {
                  return (
                    <div className="explorer-empty">
                      {`No compatible ${targetDescription}s available.`}
                    </div>
                  )
                }

                return targets.map(
                  (target) => {
                    const isCase =
                      target.ordifiKind ===
                      'case'

                    const isLayout =
                      target.ordifiKind ===
                        'grid4' ||
                      target.ordifiKind ===
                        'grid9' ||
                      target.ordifiKind ===
                        'grid16' ||
                      target.ordifiKind ===
                        'layout'

                    const isSuitcase =
                      target.ordifiKind ===
                      'suitcase'

                    const isAlbum =
                      target.ordifiKind ===
                      'album'

                    const slotCount =
                      isSuitcase
                        ? 48
                        : isAlbum
                          ? (
                              target.slotCount ??
                              20
                            )
                          : target.slotCount ??
                            (
                              target.ordifiKind ===
                                'grid4'
                                ? 4
                                : target.ordifiKind ===
                                    'grid9'
                                  ? 9
                                  : target.ordifiKind ===
                                      'grid16'
                                    ? 16
                                    : null
                            )

                    return (
                      <button
                        key={target.id}
                        type="button"
                        className="studio-pack-target"
                        onClick={() => {
                          updateStudioState(
                            (current) => {
                              const currentPackItem =
                                current.items[
                                  packItemId
                                ]

                              if (!currentPackItem) {
                                return current
                              }

                              const withDraft =
                                createDraftForItemState(
                                  current,
                                  target.id,
                                )

                              if (isCase) {
                                return packOrdinalIntoDraftCaseState(
                                  withDraft,
                                  target.id,
                                  currentPackItem.id,
                                )
                              }

                              if (isLayout) {
                                return packOrdinalIntoDraftLayoutState(
                                  withDraft,
                                  target.id,
                                  currentPackItem.id,
                                )
                              }

                              if (
                                isSuitcase ||
                                isAlbum
                              ) {
                                return packIntoDraftStructuralContainerState(
                                  withDraft,
                                  target.id,
                                  currentPackItem.id,
                                )
                              }

                              return current
                            },
                          )

                          setPackItemId(
                            null,
                          )
                        }}
                      >
                        <span>
                          {target.serial ||
                            target.label ||
                            target.name ||
                            (
                              isCase
                                ? 'Case'
                                : isLayout
                                  ? 'Layout'
                                  : isSuitcase
                                    ? 'Suitcase'
                                    : 'Album'
                            )}
                        </span>

                        <strong>
                          {slotCount
                            ? `${slotCount} slots`
                            : 'Pack here'}
                        </strong>
                      </button>
                    )
                  },
                )
              })()}
            </div>
          </section>
        </div>
      ) : null}

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








