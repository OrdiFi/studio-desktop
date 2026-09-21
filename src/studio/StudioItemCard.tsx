import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'

import StudioThumbnail from './StudioThumbnail'

import type {
  StudioFolder,
  StudioItemSnapshot,
  StudioSource,
} from './studioState'

type Props = {
  item: StudioItemSnapshot
  source: StudioSource

  folders?: StudioFolder[]
  currentFolderId?: string | null

  onInfo: (
    item: StudioItemSnapshot,
    source: StudioSource,
  ) => void

  onAddToCanvas: (
    item: StudioItemSnapshot,
  ) => void

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
  folders = [],
  currentFolderId = null,
  onInfo,
  onAddToCanvas,
  onMoveToFolder,
  onRemoveFromFolder,
}: Props) {
  const [menuOpen, setMenuOpen] =
    useState(false)

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
      className="studio-item-card"
      style={{
        '--wallet-color':
          source.color,
      } as CSSProperties}
      onContextMenu={(event) => {
        event.preventDefault()
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
        <StudioThumbnail
          thumbnail={(item.compositionThumbnail ?? item.rawThumbnail)}
          alt={itemTitle(item)}
        />
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
    </div>
  )
}
