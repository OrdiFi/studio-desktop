import {
  useState,
} from 'react'

import {
  createPortal,
} from 'react-dom'

import {
  updateStudioState,
} from './StudioStore'

import type {
  StudioStateV1,
} from './studioState'

type Props = {
  state: StudioStateV1
  itemId: string
  onClose: () => void
}

export default function StudioNoteDialog({
  state,
  itemId,
  onClose,
}: Props) {
  const savedNote =
    state.notes?.[itemId] ?? ''

  const [
    noteDraft,
    setNoteDraft,
  ] = useState(savedNote)

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'rgba(0,0,0,.18)',
      }}
      onClick={onClose}
      onContextMenu={(event) =>
        event.preventDefault()
      }
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        style={{
          width: 300,
          maxWidth:
            'calc(100vw - 32px)',
          padding: 12,
          boxSizing: 'border-box',
          border:
            '1px solid rgba(0,0,0,.22)',
          background: '#fff',
          color: '#111',
          boxShadow:
            '0 12px 36px rgba(0,0,0,.24)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            marginBottom: 8,
          }}
        >
          <strong
            style={{
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            Note
          </strong>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 0,
              background:
                'transparent',
              color: '#111',
              padding: 0,
              fontSize: 18,
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        <textarea
          autoFocus
          value={noteDraft}
          maxLength={100}
          placeholder="Add a note…"
          onChange={(event) =>
            setNoteDraft(
              event.target.value,
            )
          }
          style={{
            width: '100%',
            height: 82,
            resize: 'none',
            boxSizing:
              'border-box',
            border:
              '1px solid rgba(0,0,0,.22)',
            outline: 0,
            background: '#fff',
            color: '#111',
            padding: 8,
            fontFamily: 'inherit',
            fontSize: 11,
            lineHeight: 1.4,
          }}
        />

        <div
          style={{
            marginTop: 5,
            textAlign: 'right',
            fontSize: 9,
            opacity: .55,
          }}
        >
          {noteDraft.length} / 100
        </div>

        <div
          style={{
            marginTop: 9,
            display: 'flex',
            justifyContent:
              'space-between',
            gap: 8,
          }}
        >
          <button
            type="button"
            disabled={!savedNote}
            onClick={() => {
              updateStudioState(
                (current) => {
                  const notes = {
                    ...current.notes,
                  }

                  delete notes[
                    itemId
                  ]

                  return {
                    ...current,
                    notes,
                  }
                },
              )

              onClose()
            }}
            style={{
              minWidth: 68,
              height: 30,
              border:
                '1px solid rgba(0,0,0,.22)',
              background:
                'transparent',
              color: '#111',
              fontSize: 10,
              fontWeight: 800,
              cursor: savedNote
                ? 'pointer'
                : 'default',
              opacity: savedNote
                ? 1
                : .35,
            }}
          >
            Delete
          </button>

          <button
            type="button"
            onClick={() => {
              const normalized =
                noteDraft.trim()

              updateStudioState(
                (current) => {
                  const notes = {
                    ...current.notes,
                  }

                  if (normalized) {
                    notes[itemId] =
                      normalized
                  } else {
                    delete notes[
                      itemId
                    ]
                  }

                  return {
                    ...current,
                    notes,
                  }
                },
              )

              onClose()
            }}
            style={{
              minWidth: 68,
              height: 30,
              border:
                '1px solid #111',
              background: '#111',
              color: '#fff',
              fontSize: 10,
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}