import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

import StudioThumbnail from './StudioThumbnail'
import StudioNoteDialog from './StudioNoteDialog'
import StudioDraftRuntime from './runtime/StudioDraftRuntime'


import type {
  StudioFolder,
  StudioItemSnapshot,
  StudioSource,
  StudioStateV1,
} from './studioState'

type Props = {
  item: StudioItemSnapshot
  source: StudioSource
  state: StudioStateV1

  folders?: StudioFolder[]
  currentFolderId?: string | null

  onInfo: (
    item: StudioItemSnapshot,
    source: StudioSource,
  ) => void

  onAddToCanvas: (
    item: StudioItemSnapshot,
  ) => void

  onPack?: (
    item: StudioItemSnapshot,
  ) => void

  selected: boolean
  onSelect: () => void

  onMoveToFolder?: (
    itemId: string,
    folderId: string,
  ) => void

  onRemoveFromFolder?: (
    itemId: string,
  ) => void
}

function itemTitle(
  item: StudioItemSnapshot,
) {
  return (
    item.serial ||
    item.label ||
    item.name ||
    `${item.id.slice(0, 8)}…`
  )
}

export default function StudioItemCard({
  item,
  source,
  state,
  folders = [],
  currentFolderId = null,
  onInfo,
  onAddToCanvas,
  onPack,
  selected,
  onSelect,
  onMoveToFolder,
  onRemoveFromFolder,
}: Props) {
  const [menuOpen, setMenuOpen] =
    useState(false)

  const [noteOpen, setNoteOpen] =
    useState(false)


  const draft =
    state.drafts[item.id] ?? null

  const layoutPreviewRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  const [
    layoutPreviewSize,
    setLayoutPreviewSize,
  ] = useState(1)

  useEffect(() => {
    const element =
      layoutPreviewRef.current

    if (!element) {
      return
    }

    const previewElement =
      element

    function updateSize() {
      const bounds =
        previewElement.getBoundingClientRect()

      setLayoutPreviewSize(
        Math.max(
          1,
          Math.min(
            bounds.width,
            bounds.height,
          ),
        ),
      )
    }

    updateSize()

    const observer =
      new ResizeObserver(
        updateSize,
      )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  const draftChild =
    draft?.rootKind === 'case' &&
    draft.itemIds[0]
      ? state.items[
          draft.itemIds[0]
        ] ?? null
      : null

  const menuRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  useEffect(() => {
    if (!menuOpen) return

    function close(
      event: PointerEvent,
    ) {
      const target =
        event.target as Node | null

      if (
        target &&
        menuRef.current?.contains(
          target,
        )
      ) {
        return
      }

      setMenuOpen(false)
    }

    window.addEventListener(
      'pointerdown',
      close,
    )

    return () => {
      window.removeEventListener(
        'pointerdown',
        close,
      )
    }
  }, [menuOpen])

  return (
    <div
      className={
        selected
          ? 'studio-item-card is-selected'
          : 'studio-item-card'
      }
      data-studio-item-id={item.id}
      draggable
      onDragStart={(event) => {
        setMenuOpen(false)
        onSelect()

        /*
         * Canvas uses copy semantics.
         * User folders use move semantics.
         */
        event.dataTransfer.effectAllowed =
          'copyMove'

        event.dataTransfer.setData(
          'application/x-ordifi-studio-item',
          item.id,
        )

        /*
         * text/plain is the WebView-compatible
         * fallback used by Tauri drag-and-drop.
         */
        event.dataTransfer.setData(
          'text/plain',
          item.id,
        )
      }}
      style={{
        '--wallet-color':
          source.color,
      } as CSSProperties}
      onClick={(event) => {
        event.stopPropagation()
        onSelect()
      }}
      onContextMenu={(event) => {
        event.preventDefault()
        onSelect()
        setMenuOpen(true)
      }}
      title={itemTitle(item)}
    >
      <div className="studio-item-wallet-bar">
        <span />

        <span>
          {source.label}
        </span>
      </div>

      <div className="studio-item-image">
        <div
          ref={layoutPreviewRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          {draft &&
          (draft.rootKind === 'layout' ||
            draft.rootKind === 'case') &&
          draft.itemIds.length > 0 ? (
            <StudioDraftRuntime
              state={state}
              root={item}
              draft={draft}
              size={layoutPreviewSize}
              interactive={false}
            />
          ) : (
            <StudioThumbnail
              thumbnail={
                item.compositionThumbnail ??
                item.rawThumbnail
              }
              alt={itemTitle(item)}
            />
          )}

          {draftChild &&
          !(draft?.rootKind === 'case' &&
            draft.itemIds.length > 0) ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: '20%',
                  top: '24%',
                  width: '60%',
                  height: '60%',
                  overflow: 'hidden',
                  zIndex: 10,
                }}
              >
                <StudioThumbnail
                  thumbnail={
                    draftChild.compositionThumbnail ??
                    draftChild.rawThumbnail
                  }
                  alt={itemTitle(draftChild)}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 2,
                  transform:
                    'translateX(-50%)',
                  zIndex: 30,
                  padding: '3px 6px',
                  border:
                    '1px solid rgba(255,75,75,.82)',
                  background:
                    'rgba(125,0,0,.78)',
                  color:
                    'rgb(255,220,220)',
                  fontSize: 8,
                  lineHeight: 1,
                  fontWeight: 950,
                  letterSpacing: .5,
                  textTransform:
                    'uppercase',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                Draft Mode
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="studio-item-meta">
        <strong>
          {itemTitle(item)}
        </strong>

        <span>
          {item.collection ||
            item.ordifiKind ||
            'Ordinal'}
        </span>
      </div>

      {menuOpen ? (
        <div
          ref={menuRef}
          className="studio-item-menu"
        >
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              onInfo(item, source)
            }}
          >
            Info
          </button>

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              setNoteOpen(true)
            }}
          >
            Notes
          </button>

          <div className="studio-item-menu-separator" />

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              onAddToCanvas(item)
            }}
          >
            Add to Canvas
          </button>

          {(
            item.ordifiKind === null ||
            item.ordifiKind === 'case' ||
            item.ordifiKind === 'grid4' ||
            item.ordifiKind === 'grid9' ||
            item.ordifiKind === 'grid16' ||
            item.ordifiKind === 'layout'
          ) &&
          onPack ? (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                onPack(item)
              }}
            >
              Pack
            </button>
          ) : null}

          {currentFolderId &&
          onRemoveFromFolder ? (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)

                onRemoveFromFolder(
                  item.id,
                )
              }}
            >
              Remove from Folder
            </button>
          ) : null}

          {folders.length > 0 &&
          onMoveToFolder ? (
            <>
              <div className="studio-item-menu-separator" />

              <div className="studio-item-menu-label">
                Move to Folder
              </div>

              {folders.map(
                (folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    disabled={
                      folder.id ===
                      currentFolderId
                    }
                    onClick={() => {
                      setMenuOpen(false)

                      onMoveToFolder(
                        item.id,
                        folder.id,
                      )
                    }}
                  >
                    {folder.name}
                  </button>
                ),
              )}
            </>
          ) : null}
        </div>
      ) : null}

      {noteOpen ? (
        <StudioNoteDialog
          state={state}
          itemId={item.id}
          onClose={() =>
            setNoteOpen(false)
          }
        />
      ) : null}
    </div>
  )
}


