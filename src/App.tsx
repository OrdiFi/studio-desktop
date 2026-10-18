import {
  useEffect,
  useState,
} from 'react'

import './App.css'

import StudioExplorer from './studio/StudioExplorer'
import StudioCanvasTabs from './studio/StudioCanvasTabs'
import StudioLoader from './studio/StudioLoader'
import StudioMenuBar, {
  type AppTheme,
  type CardTheme,
  type ExplorerView,
  type WalletLabelMode,
} from './studio/StudioMenuBar'
import StudioSyncImportButton from './studio/StudioSyncImportButton'
import StudioCanvas, {
  addItemToActiveCanvas,
} from './studio/StudioCanvas'
import {
  canRedoStudioState,
  canUndoStudioState,
  redoStudioState,
  undoStudioState,
  updateStudioState,
} from './studio/StudioStore'
import {
  newStudioProject,
  openStudioProject,
  saveStudioProject,
  exportFullStudioSync,
  saveStudioProjectAs,
} from './studio/studioProjectFile'



import { useStudioState } from './studio/useStudioState'
import type {
  StudioItemSnapshot,
} from './studio/studioState'

type ThemeMode = AppTheme

const THEME_KEY =
  'ordifi:studio:theme'

const EXPLORER_VIEW_KEY =
  'ordifi:studio:explorer-view'

const EXPLORER_VISIBLE_KEY =
  'ordifi:studio:explorer-visible'

const CARD_THEME_KEY =
  'ordifi:studio:card-theme'

const WALLET_LABEL_KEY =
  'ordifi:studio:wallet-labels'

function readPreference<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  try {
    const value =
      localStorage.getItem(key)

    if (
      value &&
      allowed.includes(
        value as T,
      )
    ) {
      return value as T
    }
  } catch {
    // Ignore local storage failures.
  }

  return fallback
}

function readTheme(): ThemeMode {
  try {
    const saved =
      localStorage.getItem(THEME_KEY)

    if (
      saved === 'light' ||
      saved === 'dark' ||
      saved === 'system'
    ) {
      return saved
    }
  } catch {
    // Ignore local storage failures.
  }

  return 'system'
}

function resolveTheme(
  mode: ThemeMode,
): 'light' | 'dark' {
  if (mode === 'light') {
    return 'light'
  }

  if (mode === 'dark') {
    return 'dark'
  }

  return window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches
    ? 'dark'
    : 'light'
}

function App() {
  const studioState = useStudioState()

  const [showStartup, setShowStartup] =
    useState(true)

  const [themeMode, setThemeMode] =
    useState<ThemeMode>(readTheme)

  const [
    explorerView,
    setExplorerView,
  ] = useState<ExplorerView>(
    () =>
      readPreference(
        EXPLORER_VIEW_KEY,
        [
          'classic',
          'grid',
        ] as const,
        'grid',
      ),
  )

  const [
    selectedItemId,
    setSelectedItemId,
  ] = useState<string | null>(null)

  const [
    explorerVisible,
    setExplorerVisible,
  ] = useState(
    () => {
      try {
        return (
          localStorage.getItem(
            EXPLORER_VISIBLE_KEY,
          ) !== '0'
        )
      } catch {
        return true
      }
    },
  )

  const [
    cardTheme,
    setCardTheme,
  ] = useState<CardTheme>(
    () =>
      readPreference(
        CARD_THEME_KEY,
        [
          'transparent',
          'dark',
          'light',
        ] as const,
        'transparent',
      ),
  )

  const [
    walletLabels,
    setWalletLabels,
  ] = useState<WalletLabelMode>(
    () =>
      readPreference(
        WALLET_LABEL_KEY,
        [
          'auto',
          'always',
          'hidden',
        ] as const,
        'auto',
      ),
  )

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowStartup(false),
      1300,
    )

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.explorerView =
      explorerView

    document.documentElement.dataset.cardTheme =
      cardTheme

    document.documentElement.dataset.walletLabels =
      walletLabels
  }, [
    explorerView,
    cardTheme,
    walletLabels,
  ])

  useEffect(() => {
    const media = window.matchMedia(
      '(prefers-color-scheme: dark)',
    )

    function applyTheme() {
      const resolved =
        resolveTheme(themeMode)

      document.documentElement.dataset.theme =
        resolved

      document.documentElement.style.colorScheme =
        resolved
    }

    applyTheme()

    if (themeMode === 'system') {
      media.addEventListener(
        'change',
        applyTheme,
      )

      return () => {
        media.removeEventListener(
          'change',
          applyTheme,
        )
      }
    }

    return undefined
  }, [themeMode])

  function addToCanvas(
    item: StudioItemSnapshot,
  ) {
    updateStudioState(
      (current) =>
        addItemToActiveCanvas(
          current,
          item,
        ),
    )
  }

  function dropOnCanvas(
    itemId: string,
    x: number,
    y: number,
  ) {
    updateStudioState(
      (current) => {
        const item =
          current.items[itemId]

        if (!item) {
          return current
        }

        return addItemToActiveCanvas(
          current,
          item,
          {
            x,
            y,
          },
        )
      },
    )
  }

  function changeExplorerView(
    mode: ExplorerView,
  ) {
    setExplorerView(mode)

    try {
      localStorage.setItem(
        EXPLORER_VIEW_KEY,
        mode,
      )
    } catch {
      // Ignore local storage failures.
    }
  }

  function changeExplorerVisible(
    visible: boolean,
  ) {
    setExplorerVisible(visible)

    try {
      localStorage.setItem(
        EXPLORER_VISIBLE_KEY,
        visible ? '1' : '0',
      )
    } catch {
      // Ignore local storage failures.
    }
  }

  function changeCardTheme(
    mode: CardTheme,
  ) {
    setCardTheme(mode)

    document.documentElement.dataset.cardTheme =
      mode

    try {
      localStorage.setItem(
        CARD_THEME_KEY,
        mode,
      )
    } catch {
      // Ignore local storage failures.
    }
  }

  function changeWalletLabels(
    mode: WalletLabelMode,
  ) {
    setWalletLabels(mode)

    document.documentElement.dataset.walletLabels =
      mode

    try {
      localStorage.setItem(
        WALLET_LABEL_KEY,
        mode,
      )
    } catch {
      // Ignore local storage failures.
    }
  }

  function changeTheme(
    mode: ThemeMode,
  ) {
    setThemeMode(mode)

    try {
      localStorage.setItem(
        THEME_KEY,
        mode,
      )
    } catch {
      // Ignore local storage failures.
    }
  }

  return (
    <>
      {showStartup ? (
        <div className="studio-startup">
          <img
            className="studio-startup-logo"
            src="/studio-logo.png"
            alt="OrdiFi Studio"
            draggable={false}
          />

          <StudioLoader
            label="Starting Studio…"
            size={58}
          />
        </div>
      ) : null}

      <main className="studio-shell">
      <header className="studio-toolbar">
        <StudioMenuBar
          explorerView={explorerView}
          explorerVisible={explorerVisible}
          hasSelectedItem={
            selectedItemId !== null
          }
          cardTheme={cardTheme}
          walletLabels={walletLabels}
          appTheme={themeMode}
          onExplorerViewChange={
            changeExplorerView
          }
          onExplorerVisibleChange={
            changeExplorerVisible
          }
          onCardThemeChange={
            changeCardTheme
          }
          onWalletLabelsChange={
            changeWalletLabels
          }
          onAppThemeChange={
            changeTheme
          }

          onNewProject={() => {
            const hasWorkspaceData =
              studioState.sources.length > 0 ||
              Object.keys(
                studioState.items,
              ).length > 0 ||
              studioState.explorer
                .folders.length > 0 ||
              Object.keys(
                studioState.drafts,
              ).length > 0 ||
              Object.keys(
                studioState.notes ?? {},
              ).length > 0 ||
              studioState.canvas.canvases
                .some(
                  (canvas) =>
                    canvas.cards.length > 0,
                )

            if (
              hasWorkspaceData &&
              !window.confirm(
                'Start a new project? Unsaved changes in the current workspace will be lost.',
              )
            ) {
              return
            }

            void newStudioProject()
              .then(() => {
                setSelectedItemId(
                  null,
                )
              })
              .catch((error) => {
                console.error(
                  'New Studio project failed.',
                  error,
                )

                window.alert(
                  error instanceof Error
                    ? error.message
                    : String(error),
                )
              })
          }}

          onFileOpen={() => {
            void openStudioProject()
              .catch((error) => {
                console.error(
                  'Open Studio project failed.',
                  error,
                )

                window.alert(
                  error instanceof Error
                    ? error.message
                    : 'Failed to open Studio project.',
                )
              })
          }}

          onSave={() => {
            void saveStudioProject()
              .catch((error) => {
                console.error(
                  'Save Studio project failed.',
                  error,
                )

                window.alert(
                  error instanceof Error
                    ? error.message
                    : 'Failed to save Studio project.',
                )
              })
          }}

          onSaveAs={() => {
            void saveStudioProjectAs()
              .catch((error) => {
                console.error(
                  'Save Studio project as failed.',
                  error,
                )

                window.alert(
                  error instanceof Error
                    ? error.message
                    : 'Failed to save Studio project.',
                )
              })
          }}

          onExportWallet={() => {
            void exportFullStudioSync()
              .catch((error) => {
                console.error(
                  'Export Studio Sync failed.',
                  error,
                )

                window.alert(
                  error instanceof Error
                    ? error.message
                    : String(error),
                )
              })
          }}

          canUndo={
            canUndoStudioState()
          }
          canRedo={
            canRedoStudioState()
          }
          onUndo={
            undoStudioState
          }
          onRedo={
            redoStudioState
          }
        />

        <div className="studio-toolbar-center">
          <StudioCanvasTabs
            state={studioState}
          />
        </div>

        <div className="studio-toolbar-actions">
          <StudioSyncImportButton />

        </div>
      </header>

      <section
        className={
          explorerVisible
            ? 'studio-workspace'
            : 'studio-workspace is-explorer-hidden'
        }
      >
        {explorerVisible ? (
          <StudioExplorer
            state={studioState}
            classic={
              explorerView ===
              'classic'
            }
            selectedItemId={
              selectedItemId
            }
            onSelectedItemChange={
              setSelectedItemId
            }
            onAddToCanvas={
              addToCanvas
            }
          />
        ) : null}

        <button
          type="button"
          className={
            explorerVisible
              ? 'studio-explorer-edge-toggle is-open'
              : 'studio-explorer-edge-toggle is-closed'
          }
          aria-label={
            explorerVisible
              ? 'Hide Explorer'
              : 'Show Explorer'
          }
          title={
            explorerVisible
              ? 'Hide Explorer'
              : 'Show Explorer'
          }
          onClick={() =>
            changeExplorerVisible(
              !explorerVisible,
            )
          }
        >
          {explorerVisible
            ? '‹'
            : '›'}
        </button>

        <section className="studio-canvas-area">
          <StudioCanvas
            state={studioState}
            onDropItem={
              dropOnCanvas
            }
          />
        </section>
      </section>
        {explorerVisible ? (
          <img
            className="studio-corner-logo"
            src="/studio-logo.png"
            alt="OrdiFi Studio"
            draggable={false}
          />
        ) : null}
      </main>
    </>
  )
}

export default App
