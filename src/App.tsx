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
  updateStudioState,
} from './studio/StudioStore'
import { useStudioState } from './studio/useStudioState'
import type {
  StudioItemSnapshot,
} from './studio/studioState'

type ThemeMode = AppTheme

const THEME_KEY =
  'ordifi:studio:theme'

const EXPLORER_VIEW_KEY =
  'ordifi:studio:explorer-view'

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
          'visual',
          'classic',
          'grid',
          'list',
        ] as const,
        'visual',
      ),
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
          cardTheme={cardTheme}
          walletLabels={walletLabels}
          appTheme={themeMode}
          onExplorerViewChange={
            changeExplorerView
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

      <section className="studio-workspace">
        <StudioExplorer
          state={studioState}
          onAddToCanvas={
            addToCanvas
          }
        />

        <section className="studio-canvas-area">
          <StudioCanvas
            state={studioState}
          />
        </section>
      </section>
        <img
          className="studio-corner-logo"
          src="/studio-logo.png"
          alt="OrdiFi Studio"
          draggable={false}
        />
      </main>
    </>
  )
}

export default App
