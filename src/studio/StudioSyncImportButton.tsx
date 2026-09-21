import {
  useRef,
  useState,
} from 'react'

import {
  Upload,
  X,
} from 'lucide-react'

import StudioLoader
  from './StudioLoader'

import {
  importStudioBundle,
  type StudioImportProgress,
} from './studioBundleImport'

type Status =
  | 'idle'
  | 'working'
  | 'done'
  | 'error'

function stageLabel(
  progress:
    StudioImportProgress | null,
) {
  switch (progress?.stage) {
    case 'reading':
      return 'Reading Studio bundle…'

    case 'validating':
      return 'Validating Studio assets…'

    case 'installing':
      return 'Installing Studio locally…'

    case 'ready':
      return 'Studio imported.'

    default:
      return 'Preparing import…'
  }
}

export default function StudioSyncImportButton() {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    )

  const [status, setStatus] =
    useState<Status>('idle')

  const [progress, setProgress] =
    useState<
      StudioImportProgress | null
    >(null)

  const [summary, setSummary] =
    useState<string | null>(null)

  const [error, setError] =
    useState<string | null>(null)

  async function handleFile(
    file: File,
  ) {
    setStatus('working')
    setProgress(null)
    setSummary(null)
    setError(null)

    try {
      const result =
        await importStudioBundle(
          file,
          setProgress,
        )

      setSummary(
        [
          `${result.sourceCount} source`,
          `${result.itemCount} items`,
          `${result.assetCount} assets`,
          `${result.draftCount} drafts`,
          `${result.canvasCount} canvases`,
        ].join(' · '),
      )

      setStatus('done')
    } catch (err) {
      console.error(
        '[studio import] failed:',
        err,
      )

      setError(
        err instanceof Error
          ? err.message
          : 'Studio import failed.',
      )

      setStatus('error')
    } finally {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const completed =
    progress?.completed ?? 0

  const total =
    progress?.total ?? 0

  const percent =
    total > 0
      ? Math.min(
          100,
          Math.round(
            (
              completed /
              total
            ) * 100,
          ),
        )
      : 0

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".ordifi-studio,application/vnd.ordifi.studio+zip"
        hidden
        onChange={(event) => {
          const file =
            event.target.files?.[0]

          if (file) {
            void handleFile(file)
          }
        }}
      />

      <button
        type="button"
        className="studio-sync-button"
        title="Import Studio sync"
        aria-label="Import Studio sync"
        disabled={
          status === 'working'
        }
        onClick={() => {
          inputRef.current?.click()
        }}
      >
        <Upload
          size={16}
          strokeWidth={1.8}
        />

        <span>Import</span>
      </button>

      {status !== 'idle' ? (
        <div
          className="studio-sync-overlay"
        >
          <div
            className="studio-sync-dialog"
          >
            {status !==
            'working' ? (
              <button
                type="button"
                className="studio-sync-close"
                aria-label="Close"
                onClick={() => {
                  setStatus('idle')
                }}
              >
                <X size={17} />
              </button>
            ) : null}

            <StudioLoader
              label=""
              size={78}
            />

            <div
              className="studio-sync-title"
            >
              {status === 'working'
                ? stageLabel(
                    progress,
                  )
                : status === 'done'
                  ? 'Studio import complete'
                  : 'Studio import failed'}
            </div>

            {status ===
            'working' ? (
              <>
                <div
                  className="studio-sync-progress-label"
                >
                  {total > 0
                    ? `${completed} / ${total}`
                    : 'Preparing…'}
                </div>

                <div
                  className="studio-sync-progress"
                >
                  <div
                    className="studio-sync-progress-value"
                    style={{
                      width:
                        `${percent}%`,
                    }}
                  />
                </div>
              </>
            ) : null}

            {status === 'done' &&
            summary ? (
              <div
                className="studio-sync-summary"
              >
                {summary}
              </div>
            ) : null}

            {status === 'error' &&
            error ? (
              <div
                className="studio-sync-error"
              >
                {error}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
