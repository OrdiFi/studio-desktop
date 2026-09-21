import {
  useMemo,
  useRef,
  useState,
} from 'react'

import StudioItemInfo from './StudioItemInfo'
import StudioThumbnail from './StudioThumbnail'
import StudioDraftRuntime from './runtime/StudioDraftRuntime'

import {
  updateStudioState,
} from './StudioStore'

import type {
  StudioCanvasCard,
  StudioItemSnapshot,
  StudioObjectType,
  StudioSource,
  StudioStateV1,
} from './studioState'

const CARD_W = 180
const CARD_H = 220

/*
 * The viewport is not the canvas boundary.
 * The working surface grows as objects move
 * further right or down.
 */
const SURFACE_RESERVE_X = 800
const SURFACE_RESERVE_Y = 600

type Props = {
  state: StudioStateV1
}

type DragState = {
  cardId: string
  pointerId: number
  offsetX: number
  offsetY: number
} | null

type MenuState = {
  cardId: string
  x: number
  y: number
} | null

type InfoState = {
  item: StudioItemSnapshot
  source: StudioSource
} | null

function objectTypeForItem(
  item: StudioItemSnapshot,
): StudioObjectType {
  if (item.ordifiKind === 'case') {
    return 'case'
  }

  if (
    item.ordifiKind === 'grid4' ||
    item.ordifiKind === 'grid9' ||
    item.ordifiKind === 'grid16' ||
    item.ordifiKind === 'layout'
  ) {
    return 'grid'
  }

  if (
    item.ordifiKind === 'suitcase'
  ) {
    return 'suitcase'
  }

  if (
    item.ordifiKind === 'album'
  ) {
    return 'album'
  }

  return 'ordinal'
}

function shortWalletAddress(
  address: string,
) {
  const value =
    address.trim()

  if (value.length <= 22) {
    return value
  }

  return `${value.slice(0, 10)}…${value.slice(-7)}`
}

function titleForItem(
  item: StudioItemSnapshot,
) {
  return (
    item.serial ||
    item.label ||
    item.name ||
    `${item.id.slice(0, 8)}…`
  )
}

export function addItemToActiveCanvas(
  state: StudioStateV1,
  item: StudioItemSnapshot,
): StudioStateV1 {
  const canvasIndex =
    state.canvas.canvases.findIndex(
      (canvas) =>
        canvas.id ===
        state.canvas.activeCanvasId,
    )

  if (canvasIndex < 0) {
    return state
  }

  const canvas =
    state.canvas.canvases[
      canvasIndex
    ]

  const existing =
    canvas.cards.find(
      (card) =>
        card.itemId === item.id,
    )

  if (existing) {
    return state
  }

  const nextZ =
    canvas.topZ + 1

  const card:
    StudioCanvasCard = {
      id: `card-${item.id}`,
      itemId: item.id,
      objectType:
        objectTypeForItem(item),

      x:
        24 +
        (canvas.cards.length % 5) *
          28,

      y:
        24 +
        (canvas.cards.length % 5) *
          24,

      z: nextZ,
      scale: 1,
    }

  const canvases =
    [...state.canvas.canvases]

  canvases[canvasIndex] = {
    ...canvas,
    topZ: nextZ,
    cards: [
      ...canvas.cards,
      card,
    ],
  }

  return {
    ...state,

    canvas: {
      ...state.canvas,
      canvases,
    },
  }
}

export default function StudioCanvas({
  state,
}: Props) {
  const canvasRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  const [drag, setDrag] =
    useState<DragState>(null)

  const [menu, setMenu] =
    useState<MenuState>(null)

  const [info, setInfo] =
    useState<InfoState>(null)

  const activeCanvas =
    useMemo(
      () =>
        state.canvas.canvases.find(
          (canvas) =>
            canvas.id ===
            state.canvas
              .activeCanvasId,
        ) ??
        state.canvas.canvases[0],
      [
        state.canvas.canvases,
        state.canvas
          .activeCanvasId,
      ],
    )

  const surfaceSize =
    useMemo(() => {
      let right = 0
      let bottom = 0

      for (
        const card
        of activeCanvas.cards
      ) {
        right = Math.max(
          right,
          card.x +
            CARD_W *
              card.scale,
        )

        bottom = Math.max(
          bottom,
          card.y +
            CARD_H *
              card.scale,
        )
      }

      return {
        width:
          right +
          SURFACE_RESERVE_X,

        height:
          bottom +
          SURFACE_RESERVE_Y,
      }
    }, [activeCanvas.cards])

  function sourceForItem(
    item: StudioItemSnapshot,
  ) {
    return (
      state.sources.find(
        (source) =>
          source.id ===
          item.sourceId,
      ) ?? null
    )
  }

  function updateCard(
    cardId: string,
    updater: (
      card: StudioCanvasCard,
    ) => StudioCanvasCard,
  ) {
    updateStudioState(
      (current) => ({
        ...current,

        canvas: {
          ...current.canvas,

          canvases:
            current.canvas.canvases.map(
              (canvas) =>
                canvas.id ===
                current.canvas
                  .activeCanvasId
                  ? {
                      ...canvas,

                      cards:
                        canvas.cards.map(
                          (card) =>
                            card.id ===
                            cardId
                              ? updater(
                                  card,
                                )
                              : card,
                        ),
                    }
                  : canvas,
            ),
        },
      }),
    )
  }

  function bringToFront(
    cardId: string,
  ) {
    updateStudioState(
      (current) => ({
        ...current,

        canvas: {
          ...current.canvas,

          canvases:
            current.canvas.canvases.map(
              (canvas) => {
                if (
                  canvas.id !==
                  current.canvas
                    .activeCanvasId
                ) {
                  return canvas
                }

                const nextZ =
                  canvas.topZ + 1

                return {
                  ...canvas,
                  topZ: nextZ,

                  cards:
                    canvas.cards.map(
                      (card) =>
                        card.id ===
                        cardId
                          ? {
                              ...card,
                              z: nextZ,
                            }
                          : card,
                    ),
                }
              },
            ),
        },
      }),
    )
  }

  function removeCard(
    cardId: string,
  ) {
    updateStudioState(
      (current) => ({
        ...current,

        canvas: {
          ...current.canvas,

          canvases:
            current.canvas.canvases.map(
              (canvas) =>
                canvas.id ===
                current.canvas
                  .activeCanvasId
                  ? {
                      ...canvas,
                      cards:
                        canvas.cards.filter(
                          (card) =>
                            card.id !==
                            cardId,
                        ),
                    }
                  : canvas,
            ),
        },
      }),
    )

    setMenu(null)
  }

  function toggleSize(
    cardId: string,
  ) {
    updateCard(
      cardId,
      (card) => {
        const scale:
          1 | 2 | 4 =
          card.scale === 1
            ? 2
            : card.scale === 2
              ? 4
              : 1

        return {
          ...card,
          scale,
        }
      },
    )

    setMenu(null)
  }

  return (
    <>
      <div
        ref={canvasRef}
        className="studio-canvas"
        onPointerMove={(event) => {
          if (!drag) return

          const viewport =
            canvasRef.current

          const bounds =
            viewport
              ?.getBoundingClientRect()

          if (
            !viewport ||
            !bounds
          ) {
            return
          }

          /*
           * Coordinates live in the scrollable
           * surface, not in the visible viewport.
           */
          const x =
            Math.max(
              8,
              event.clientX -
                bounds.left +
                viewport.scrollLeft -
                drag.offsetX,
            )

          const y =
            Math.max(
              8,
              event.clientY -
                bounds.top +
                viewport.scrollTop -
                drag.offsetY,
            )

          updateCard(
            drag.cardId,
            (current) => ({
              ...current,
              x,
              y,
            }),
          )
        }}
        onPointerUp={() =>
          setDrag(null)
        }
        onPointerCancel={() =>
          setDrag(null)
        }
        onPointerDown={() =>
          setMenu(null)
        }
      >
        <div
          className="canvas-surface"
          style={{
            width:
              `max(100%, ${surfaceSize.width}px)`,

            height:
              `max(100%, ${surfaceSize.height}px)`,
          }}
        >
        {activeCanvas.cards.length ===
        0 ? (
          <div className="canvas-empty">
            <div className="canvas-empty-mark">
              O
            </div>

            <strong>
              Studio Canvas
            </strong>

            <span>
              Add collection items from
              the Explorer.
            </span>
          </div>
        ) : null}

        {activeCanvas.cards.map(
          (card) => {
            const item =
              state.items[
                card.itemId
              ]

            if (!item) return null

            const source =
              sourceForItem(item)

            if (!source) return null

            const draft =
              state.drafts[
                item.id
              ] ?? null

            const runtimeSize =
              Math.max(
                1,
                Math.min(
                  CARD_W *
                    card.scale,

                  CARD_H *
                    card.scale -
                    42,
                ),
              )

            return (
              <article
                key={card.id}
                className="canvas-card"
                style={{
                  left: card.x,
                  top: card.y,

                  width:
                    CARD_W *
                    card.scale,

                  height:
                    CARD_H *
                    card.scale,

                  zIndex: card.z,

                  '--wallet-color':
                    source.color,
                } as React.CSSProperties}
                onPointerDown={(
                  event,
                ) => {
                  if (
                    event.button !== 0
                  ) {
                    return
                  }

                  const target =
                    event.target as
                      HTMLElement

                  if (
                    target.closest(
                      '.canvas-card-menu',
                    ) ||
                    target.closest(
                      '.studio-draft-runtime',
                    )
                  ) {
                    return
                  }

                  const bounds =
                    event.currentTarget
                      .getBoundingClientRect()

                  event.currentTarget
                    .setPointerCapture(
                      event.pointerId,
                    )

                  bringToFront(
                    card.id,
                  )

                  setDrag({
                    cardId: card.id,
                    pointerId:
                      event.pointerId,

                    offsetX:
                      event.clientX -
                      bounds.left,

                    offsetY:
                      event.clientY -
                      bounds.top,
                  })
                }}
                onContextMenu={(
                  event,
                ) => {
                  event.preventDefault()

                  setMenu({
                    cardId:
                      card.id,
                    x:
                      event.clientX,
                    y:
                      event.clientY,
                  })
                }}
              >
                <div
                  className="canvas-card-wallet"
                  title={source.address}
                >
                  {shortWalletAddress(
                    source.address,
                  )}
                </div>

                <div className="canvas-card-image">
                  {draft ? (
                    <StudioDraftRuntime
                      state={state}
                      root={item}
                      draft={draft}
                      size={runtimeSize}
                      interactive
                    />
                  ) : (
                    <StudioThumbnail
                      thumbnail={
                        item.compositionThumbnail ??
                        item.rawThumbnail
                      }
                      alt={titleForItem(
                        item,
                      )}
                    />
                  )}
                </div>

                <div className="canvas-card-meta">
                  <strong>
                    {titleForItem(
                      item,
                    )}
                  </strong>

                  <span>
                    {item.collection ||
                      item.ordifiKind ||
                      'Ordinal'}
                  </span>
                </div>
              </article>
            )
          },
        )}
        </div>
      </div>

      {menu ? (() => {
        const card =
          activeCanvas.cards.find(
            (entry) =>
              entry.id ===
              menu.cardId,
          )

        const item =
          card
            ? state.items[
                card.itemId
              ]
            : null

        const source =
          item
            ? sourceForItem(item)
            : null

        if (
          !card ||
          !item ||
          !source
        ) {
          return null
        }

        return (
          <div
            className="canvas-card-menu"
            style={{
              left: menu.x,
              top: menu.y,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setInfo({
                  item,
                  source,
                })

                setMenu(null)
              }}
            >
              Info
            </button>

            <div />

            <button
              type="button"
              onClick={() =>
                toggleSize(
                  card.id,
                )
              }
            >
              {card.scale === 1
                ? 'Resize 2×'
                : card.scale === 2
                  ? 'Resize 4×'
                  : 'Resize 1×'}
            </button>

            <button
              type="button"
              onClick={() => {
                bringToFront(
                  card.id,
                )

                setMenu(null)
              }}
            >
              Bring to Front
            </button>

            <button
              type="button"
              onClick={() =>
                removeCard(
                  card.id,
                )
              }
            >
              Remove from Canvas
            </button>
          </div>
        )
      })() : null}

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
