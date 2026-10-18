import {
  useEffect,
  useRef,
  useState,
} from 'react'

export type ExplorerView =
  | 'classic'
  | 'grid'

export type CardTheme =
  | 'transparent'
  | 'dark'
  | 'light'

export type WalletLabelMode =
  | 'auto'
  | 'always'
  | 'hidden'

export type AppTheme =
  | 'system'
  | 'light'
  | 'dark'

type Props = {
  explorerView: ExplorerView
  explorerVisible: boolean
  hasSelectedItem: boolean
  cardTheme: CardTheme
  walletLabels: WalletLabelMode
  appTheme: AppTheme

  onExplorerViewChange: (
    value: ExplorerView,
  ) => void

  onExplorerVisibleChange: (
    value: boolean,
  ) => void

  onCardThemeChange: (
    value: CardTheme,
  ) => void

  onWalletLabelsChange: (
    value: WalletLabelMode,
  ) => void

  onAppThemeChange: (
    value: AppTheme,
  ) => void

  onNewProject?: () => void
  onFileOpen?: () => void
  onImportFrom?: () => void
  onSave?: () => void
  onSaveAs?: () => void
  onExportWallet?: () => void
  onExit?: () => void

  canUndo: boolean
  canRedo: boolean
  onUndo?: () => void
  onRedo?: () => void

  onSelectedItemInfo?: () => void
  onSelectedItemNotes?: () => void
  onAddSelectedToCanvas?: () => void
  onPackSelected?: () => void
  onUnpackSelected?: () => void
  onMoveSelectedToFolder?: () => void
  onRemoveSelectedFromFolder?: () => void

  onCreateFolder?: () => void
  onGoToFolder?: () => void
  onGoToWallet?: () => void
  onCreateCanvas?: () => void
}

type OpenMenu =
  | null
  | 'file'
  | 'edit'
  | 'view'

function Check({
  active,
}: {
  active: boolean
}) {
  return (
    <span className="studio-menu-check">
      {active ? '✓' : ''}
    </span>
  )
}

export default function StudioMenuBar({
  explorerView,
  explorerVisible,
  hasSelectedItem,
  cardTheme,
  walletLabels,
  appTheme,

  onExplorerViewChange,
  onExplorerVisibleChange,
  onCardThemeChange,
  onWalletLabelsChange,
  onAppThemeChange,

  onNewProject,
  onFileOpen,
  onImportFrom,
  onSave,
  onSaveAs,
  onExportWallet,
  onExit,

  canUndo,
  canRedo,
  onUndo,
  onRedo,

  onSelectedItemInfo,
  onSelectedItemNotes,
  onAddSelectedToCanvas,
  onPackSelected,
  onUnpackSelected,
  onMoveSelectedToFolder,
  onRemoveSelectedFromFolder,

  onCreateFolder,
  onGoToFolder,
  onGoToWallet,
  onCreateCanvas,
}: Props) {
  const [open, setOpen] =
    useState<OpenMenu>(null)

  const [
    settingsOpen,
    setSettingsOpen,
  ] = useState(false)

  const rootRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  useEffect(() => {
    function handleUndoRedo(
      event: KeyboardEvent,
    ) {
      const target =
        event.target as
          HTMLElement | null

      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      ) {
        return
      }

      const modifier =
        event.ctrlKey ||
        event.metaKey

      if (!modifier) {
        return
      }

      const key =
        event.key.toLowerCase()

      if (
        key === 'z' &&
        event.shiftKey
      ) {
        if (!canRedo) {
          return
        }

        event.preventDefault()
        onRedo?.()
        return
      }

      if (key === 'z') {
        if (!canUndo) {
          return
        }

        event.preventDefault()
        onUndo?.()
        return
      }

      if (key === 'y') {
        if (!canRedo) {
          return
        }

        event.preventDefault()
        onRedo?.()
      }
    }

    window.addEventListener(
      'keydown',
      handleUndoRedo,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleUndoRedo,
      )
    }
  }, [
    canUndo,
    canRedo,
    onUndo,
    onRedo,
  ])

  useEffect(() => {
    function closeFromOutside(
      event: MouseEvent,
    ) {
      if (
        rootRef.current &&
        !rootRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(null)
      }
    }

    function closeFromEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        setOpen(null)
      }
    }

    window.addEventListener(
      'mousedown',
      closeFromOutside,
    )

    window.addEventListener(
      'keydown',
      closeFromEscape,
    )

    return () => {
      window.removeEventListener(
        'mousedown',
        closeFromOutside,
      )

      window.removeEventListener(
        'keydown',
        closeFromEscape,
      )
    }
  }, [])

  function toggle(
    menu: Exclude<
      OpenMenu,
      null
    >,
  ) {
    setOpen(
      (current) =>
        current === menu
          ? null
          : menu,
    )
  }

  return (
    <div
      ref={rootRef}
      className="studio-menu-bar"
    >
      <button
        type="button"
        className={
          open === 'file'
            ? 'is-open'
            : ''
        }
        onClick={() =>
          toggle('file')
        }
      >
        File
      </button>

      <button
        type="button"
        className={
          open === 'edit'
            ? 'is-open'
            : ''
        }
        onClick={() =>
          toggle('edit')
        }
      >
        Edit
      </button>

      <button
        type="button"
        className={
          open === 'view'
            ? 'is-open'
            : ''
        }
        onClick={() =>
          toggle('view')
        }
      >
        View
      </button>

      <button
        type="button"
        className={
          settingsOpen
            ? 'is-open'
            : ''
        }
        onClick={() => {
          setOpen(null)
          setSettingsOpen(true)
        }}
      >
        Settings
      </button>


      {open === 'file' ? (
        <div className="studio-menu-dropdown">
          <div className="studio-menu-section">
            <button
              type="button"
              className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onNewProject?.()
              }}
            >
              <span>New Project</span>
            </button>

            <button
              type="button"
              className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onFileOpen?.()
              }}
            >
              <span>Open...</span>
            </button>

            <button
              type="button"
              className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onImportFrom?.()
              }}
            >
              <span>Import From...</span>
            </button>
          </div>

          <div className="studio-menu-separator" />

          <div className="studio-menu-section">
            <button
              type="button"
              className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onSave?.()
              }}
            >
              <span>Save</span>
            </button>

            <button
              type="button"
              className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onSaveAs?.()
              }}
            >
              <span>Save As...</span>
            </button>
          </div>

          <div className="studio-menu-separator" />

          <div className="studio-menu-section">
            <button
              type="button"
              className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onExportWallet?.()
              }}
            >
              <span>Export Studio Sync...</span>
            </button>
          </div>

          <div className="studio-menu-separator" />

          <div className="studio-menu-section">
            <button
              type="button"
              className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onExit?.()
              }}
            >
              <span>Exit</span>
            </button>
          </div>
        </div>
      ) : null}

      {open === 'edit' ? (
        <div className="studio-menu-dropdown studio-menu-dropdown-edit">

          <div className="studio-menu-section">
            <button
              type="button"
              className="studio-menu-item studio-menu-item-shortcut"
              disabled={!canUndo}
              onClick={() => {
                setOpen(null)
                onUndo?.()
              }}
            >
              <span>Undo</span>
              <span>Ctrl+Z</span>
            </button>

            <button
              type="button"
              className="studio-menu-item studio-menu-item-shortcut"
              disabled={!canRedo}
              onClick={() => {
                setOpen(null)
                onRedo?.()
              }}
            >
              <span>Redo</span>
              <span>Ctrl+Y</span>
            </button>
          </div>

          <div className="studio-menu-separator" />

          {hasSelectedItem ? (
            <div className="studio-menu-section">
              <div className="studio-menu-section-title">
                Selected Item
              </div>

            <button type="button" className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onSelectedItemInfo?.()
              }}
            >
              <span>Info</span>
            </button>

            <button type="button" className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onSelectedItemNotes?.()
              }}
            >
              <span>Notes</span>
            </button>

            <button type="button" className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onAddSelectedToCanvas?.()
              }}
            >
              <span>Add to Canvas</span>
            </button>

            <button type="button" className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onPackSelected?.()
              }}
            >
              <span>Pack</span>
            </button>

            <button type="button" className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onUnpackSelected?.()
              }}
            >
              <span>Unpack</span>
            </button>

            <button type="button" className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onMoveSelectedToFolder?.()
              }}
            >
              <span>Move to Folder...</span>
            </button>

            <button type="button" className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onRemoveSelectedFromFolder?.()
              }}
            >
              <span>Remove from Folder</span>
            </button>
          </div>
          ) : null}

          {hasSelectedItem ? (
            <div className="studio-menu-separator" />
          ) : null}

          <div className="studio-menu-section">
            <div className="studio-menu-section-title">
              Explorer
            </div>

            <button type="button" className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onCreateFolder?.()
              }}
            >
              <span>Create New Folder</span>
            </button>

            <button type="button" className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onGoToFolder?.()
              }}
            >
              <span>Go to Folder...</span>
            </button>

            <button type="button" className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onGoToWallet?.()
              }}
            >
              <span>Go to Wallet...</span>
            </button>
          </div>

          <div className="studio-menu-separator" />

          <div className="studio-menu-section">
            <div className="studio-menu-section-title">
              Canvas
            </div>

            <button type="button" className="studio-menu-item"
              onClick={() => {
                setOpen(null)
                onCreateCanvas?.()
              }}
            >
              <span>Create Canvas</span>
            </button>
          </div>

        </div>
      ) : null}


      {open === 'view' ? (
        <div className="studio-menu-dropdown studio-menu-dropdown-view">
          <div className="studio-menu-section">
            <div className="studio-menu-section-title">
              Explorer
            </div>

            <button
              type="button"
              className="studio-menu-item"
              onClick={() => {
                onExplorerVisibleChange(
                  !explorerVisible,
                )
                setOpen(null)
              }}
            >
              <Check
                active={explorerVisible}
              />
              <span>
                Show Explorer
              </span>
            </button>

            <div className="studio-menu-subtitle">
              View
            </div>

            {(
              [
                ['classic', 'Classic'],
                ['grid', 'Grid'],
              ] as const
            ).map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className="studio-menu-item"
                  onClick={() => {
                    onExplorerViewChange(
                      value,
                    )
                    setOpen(null)
                  }}
                >
                  <Check
                    active={
                      explorerView ===
                      value
                    }
                  />
                  <span>{label}</span>
                </button>
              ),
            )}
          </div>

          <div className="studio-menu-separator" />

          <div className="studio-menu-section">
            <div className="studio-menu-section-title">
              Themes
            </div>

            <div className="studio-menu-subtitle">
              App Theme
            </div>

            {(
              [
                ['system', 'System'],
                ['dark', 'Dark'],
                ['light', 'Light'],
              ] as const
            ).map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className="studio-menu-item"
                  onClick={() => {
                    onAppThemeChange(
                      value,
                    )
                  }}
                >
                  <Check
                    active={
                      appTheme ===
                      value
                    }
                  />
                  <span>{label}</span>
                </button>
              ),
            )}

            <div className="studio-menu-subtitle">
              Card Theme
            </div>

            {(
              [
                [
                  'transparent',
                  'Transparent',
                ],
                ['dark', 'Dark'],
                ['light', 'Light'],
              ] as const
            ).map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className="studio-menu-item"
                  onClick={() => {
                    onCardThemeChange(
                      value,
                    )
                  }}
                >
                  <Check
                    active={
                      cardTheme ===
                      value
                    }
                  />
                  <span>{label}</span>
                </button>
              ),
            )}
          </div>

          <div className="studio-menu-separator" />

          <div className="studio-menu-section">
            <div className="studio-menu-section-title">
              Wallet Labels
            </div>

            {(
              [
                ['auto', 'Auto'],
                ['always', 'Always'],
                ['hidden', 'Hidden'],
              ] as const
            ).map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className="studio-menu-item"
                  onClick={() => {
                    onWalletLabelsChange(
                      value,
                    )
                    setOpen(null)
                  }}
                >
                  <Check
                    active={
                      walletLabels ===
                      value
                    }
                  />
                  <span>{label}</span>
                </button>
              ),
            )}
          </div>
        </div>
      ) : null}
      {settingsOpen ? (
        <div
          onClick={(event) =>
            event.stopPropagation()
          }
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 5000,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            background:
              'rgba(0,0,0,.58)',
          }}
        >
          <div
            style={{
              width: 620,
              maxWidth:
                'calc(100vw - 40px)',
              maxHeight:
                'calc(100vh - 40px)',

              overflowY: 'auto',

              border:
                '1px solid rgba(255,255,255,.12)',

              background: '#090b0c',
              color: '#fff',

              boxShadow:
                '0 24px 70px rgba(0,0,0,.55)',
            }}
          >
            <div
              style={{
                height: 52,

                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'space-between',

                padding: '0 16px',

                borderBottom:
                  '1px solid rgba(255,255,255,.10)',
              }}
            >
              <strong
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                }}
              >
                Settings
              </strong>

              <button
                type="button"
                onClick={() =>
                  setSettingsOpen(false)
                }
                style={{
                  width: 34,
                  height: 34,

                  border:
                    '1px solid rgba(255,255,255,.12)',
                  borderRadius: '50%',

                  background:
                    'rgba(255,255,255,.04)',
                  color: '#fff',

                  fontSize: 18,
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: 20,

                display: 'grid',
                gap: 20,
              }}
            >
              <section
                style={{
                  border:
                    '1px solid #00bfae',
                  background:
                    'rgba(255,255,255,.025)',
                  padding: 18,
                }}
              >
                <div
                  style={{
                    marginBottom: 18,
                    fontSize: 14,
                    fontWeight: 950,
                    letterSpacing: .4,
                  }}
                >
                  STUDIO
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr auto',
                    gap: 14,
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color:
                        'rgba(255,255,255,.60)',
                      fontSize: 12,
                    }}
                  >
                    Current version
                  </span>

                  <strong
                    style={{
                      fontSize: 12,
                    }}
                  >
                    0.1.0
                  </strong>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: 'flex',
                    justifyContent:
                      'flex-end',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {}}
                    style={{
                      minHeight: 34,
                      padding: '0 13px',

                      border:
                        '1px solid rgba(255,255,255,.12)',

                      background:
                        'rgba(255,255,255,.04)',

                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    Check for Updates
                  </button>
                </div>
              </section>

              <section
                style={{
                  border:
                    '1px solid #00bfae',
                  background:
                    'rgba(255,255,255,.025)',
                  padding: 18,
                }}
              >
                <div
                  style={{
                    marginBottom: 18,
                    fontSize: 14,
                    fontWeight: 950,
                    letterSpacing: .4,
                  }}
                >
                  RUNTIME
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr auto',
                    gap: 12,
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color:
                        'rgba(255,255,255,.60)',
                      fontSize: 12,
                    }}
                  >
                    OrdiFi Runtime
                  </span>

                  <strong
                    style={{
                      fontSize: 12,
                    }}
                  >
                    Enabled
                  </strong>

                  <span
                    style={{
                      color:
                        'rgba(255,255,255,.60)',
                      fontSize: 12,
                    }}
                  >
                    Runtime version
                  </span>

                  <strong
                    style={{
                      fontSize: 12,
                    }}
                  >
                    —
                  </strong>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: 'flex',
                    justifyContent:
                      'flex-end',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {}}
                    style={{
                      minHeight: 34,
                      padding: '0 13px',

                      border:
                        '1px solid rgba(255,255,255,.12)',

                      background:
                        'rgba(255,255,255,.04)',

                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    Check Runtime Update
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
