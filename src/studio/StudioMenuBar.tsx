import {
  useEffect,
  useRef,
  useState,
} from 'react'

export type ExplorerView =
  | 'visual'
  | 'classic'
  | 'grid'
  | 'list'

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
  cardTheme: CardTheme
  walletLabels: WalletLabelMode
  appTheme: AppTheme

  onExplorerViewChange: (
    value: ExplorerView,
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
}

type OpenMenu =
  | null
  | 'start'
  | 'edit'
  | 'view'
  | 'layer'

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
  cardTheme,
  walletLabels,
  appTheme,

  onExplorerViewChange,
  onCardThemeChange,
  onWalletLabelsChange,
  onAppThemeChange,
}: Props) {
  const [open, setOpen] =
    useState<OpenMenu>(null)

  const rootRef =
    useRef<HTMLDivElement | null>(
      null,
    )

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
          open === 'start'
            ? 'is-open'
            : ''
        }
        onClick={() =>
          toggle('start')
        }
      >
        Start
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
        Bearbeiten
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
        Ansicht
      </button>

      <button
        type="button"
        className={
          open === 'layer'
            ? 'is-open'
            : ''
        }
        onClick={() =>
          toggle('layer')
        }
      >
        Ebene
      </button>

      {open === 'start' ? (
        <div className="studio-menu-dropdown studio-menu-placeholder">
          <span>
            Studio actions
          </span>
        </div>
      ) : null}

      {open === 'edit' ? (
        <div className="studio-menu-dropdown studio-menu-dropdown-edit studio-menu-placeholder">
          <span>
            Editing actions
          </span>
        </div>
      ) : null}

      {open === 'layer' ? (
        <div className="studio-menu-dropdown studio-menu-dropdown-layer studio-menu-placeholder">
          <span>
            Layer actions
          </span>
        </div>
      ) : null}

      {open === 'view' ? (
        <div className="studio-menu-dropdown studio-menu-dropdown-view">
          <div className="studio-menu-section">
            <div className="studio-menu-section-title">
              Explorer
            </div>

            {(
              [
                ['visual', 'Visual'],
                ['classic', 'Classic'],
                ['grid', 'Grid'],
                ['list', 'List'],
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
    </div>
  )
}
