import {
  useState,
} from 'react'

import {
  updateStudioState,
} from './StudioStore'

import type {
  StudioStateV1,
} from './studioState'

const MAX_CANVASES = 6

type Props = {
  state: StudioStateV1
}

export default function StudioCanvasTabs({
  state,
}: Props) {
  const [editingId, setEditingId] =
    useState<string | null>(null)

  const [editingName, setEditingName] =
    useState('')

  function selectCanvas(
    canvasId: string,
  ) {
    updateStudioState(
      (current) => ({
        ...current,

        canvas: {
          ...current.canvas,
          activeCanvasId: canvasId,
        },
      }),
    )
  }

  function addCanvas() {
    if (
      state.canvas.canvases.length >=
      MAX_CANVASES
    ) {
      return
    }

    const id =
      typeof crypto !== 'undefined' &&
      'randomUUID' in crypto
        ? crypto.randomUUID()
        : `canvas-${Date.now()}`

    const number =
      state.canvas.canvases.length + 1

    updateStudioState(
      (current) => ({
        ...current,

        canvas: {
          activeCanvasId: id,

          canvases: [
            ...current.canvas.canvases,

            {
              id,
              name: `Canvas ${number}`,
              topZ: 1,
              cards: [],
            },
          ],
        },
      }),
    )
  }

  function beginRename(
    canvasId: string,
    currentName: string,
  ) {
    setEditingId(canvasId)
    setEditingName(currentName)
  }

  function commitRename() {
    if (!editingId) return

    const nextName =
      editingName.trim() ||
      'Canvas'

    updateStudioState(
      (current) => ({
        ...current,

        canvas: {
          ...current.canvas,

          canvases:
            current.canvas.canvases.map(
              (canvas) =>
                canvas.id === editingId
                  ? {
                      ...canvas,
                      name: nextName,
                    }
                  : canvas,
            ),
        },
      }),
    )

    setEditingId(null)
    setEditingName('')
  }

  function cancelRename() {
    setEditingId(null)
    setEditingName('')
  }

  function closeCanvas(
    canvasId: string,
  ) {
    if (
      state.canvas.canvases.length <= 1
    ) {
      return
    }

    const target = state.canvas.canvases.find(
      (canvas) => canvas.id === canvasId,
    )

    if (!target) return

    if (
      target.cards.length > 0 &&
      !window.confirm(
        `Remove "${target.name}" and its canvas placements? Wallets, Ordinals and Drafts will remain.`,
      )
    ) {
      return
    }

    updateStudioState(
      (current) => {
        const index =
          current.canvas.canvases.findIndex(
            (canvas) =>
              canvas.id === canvasId,
          )

        if (index < 0) {
          return current
        }

        const canvases =
          current.canvas.canvases.filter(
            (canvas) =>
              canvas.id !== canvasId,
          )

        let activeCanvasId =
          current.canvas.activeCanvasId

        if (
          activeCanvasId === canvasId
        ) {
          const replacement =
            canvases[
              Math.max(
                0,
                Math.min(
                  index - 1,
                  canvases.length - 1,
                ),
              )
            ]

          activeCanvasId =
            replacement?.id ??
            canvases[0].id
        }

        return {
          ...current,

          canvas: {
            activeCanvasId,
            canvases,
          },
        }
      },
    )
  }

  return (
    <div className="studio-canvas-tabs">
      {state.canvas.canvases.map(
        (canvas) => {
          const active =
            canvas.id ===
            state.canvas.activeCanvasId

          return (
            <div
              key={canvas.id}
              className={
                active
                  ? 'studio-canvas-tab is-active'
                  : 'studio-canvas-tab'
              }
            >
              {editingId ===
              canvas.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={(event) =>
                    setEditingName(
                      event.target.value,
                    )
                  }
                  onBlur={
                    commitRename
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter'
                    ) {
                      commitRename()
                    }

                    if (
                      event.key === 'Escape'
                    ) {
                      cancelRename()
                    }
                  }}
                />
              ) : (
                <button
                  type="button"
                  className="studio-canvas-tab-main"
                  onClick={() =>
                    selectCanvas(
                      canvas.id,
                    )
                  }
                  onDoubleClick={() =>
                    beginRename(
                      canvas.id,
                      canvas.name,
                    )
                  }
                  title="Double-click to rename"
                >
                  {canvas.name}
                </button>
              )}

              {state.canvas.canvases
                .length > 1 ? (
                <button
                  type="button"
                  className="studio-canvas-tab-close"
                  title="Close canvas"
                  aria-label={`Close ${canvas.name}`}
                  onClick={() =>
                    closeCanvas(
                      canvas.id,
                    )
                  }
                >
                  ×
                </button>
              ) : null}
            </div>
          )
        },
      )}

      <button
        type="button"
        className="studio-canvas-tab-add"
        title={
          state.canvas.canvases.length >=
          MAX_CANVASES
            ? 'Maximum 6 canvases'
            : 'New canvas'
        }
        disabled={
          state.canvas.canvases.length >=
          MAX_CANVASES
        }
        onClick={addCanvas}
      >
        +
      </button>
    </div>
  )
}
