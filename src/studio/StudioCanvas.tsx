import {
  canPackOrdinalIntoDraftCase,
  canPackOrdinalIntoDraftLayout,
  packOrdinalIntoDraftCaseState,
  packOrdinalIntoDraftLayoutState,
  unpackDraftCaseState,
  unpackDraftLayoutState,
  unpackItemFromDraftLayoutState,
  unpackDraftStructuralContainerState,
  unpackItemFromDraftStructuralContainerState,
} from './draftEditing'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import StudioItemInfo from './StudioItemInfo'
import StudioNoteDialog from './StudioNoteDialog'
import StudioThumbnail from './StudioThumbnail'
import StudioDraftRuntime from './runtime/StudioDraftRuntime'

import {
  moveItemToStudioFolder,
  removeItemFromStudioFolders,
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

function draftCaseSlot(
  sourceSpec: unknown,
) {
  const spec: any =
    sourceSpec ?? {}

  const slots =
    spec?.slots ??
    spec?.spec?.slots ??
    spec?.layout?.slots ??
    []

  if (
    !Array.isArray(slots) ||
    slots.length === 0
  ) {
    return null
  }

  const slot =
    slots[0]

  const x = Number(slot?.x)
  const y = Number(slot?.y)

  const w = Number(
    slot?.w ??
    slot?.width,
  )

  const h = Number(
    slot?.h ??
    slot?.height,
  )

  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y) ||
    !Number.isFinite(w) ||
    !Number.isFinite(h)
  ) {
    return null
  }

  return {
    x,
    y,
    w,
    h,

    layoutW:
      Number(
        spec?.layout?.width ??
        spec?.width,
      ) || 1726,

    layoutH:
      Number(
        spec?.layout?.height ??
        spec?.height,
      ) || 1726,
  }
}

function StudioCaseDraftThumbnail({
  state,
  root,
  itemIds,
}: {
  state: StudioStateV1
  root: StudioItemSnapshot
  itemIds: string[]
}) {
  const childId =
    itemIds[0] ?? null

  const child =
    childId
      ? state.items[childId] ?? null
      : null

  const slot =
    draftCaseSlot(
      root.spec,
    )

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <StudioThumbnail
        thumbnail={
          root.rawThumbnail ??
          root.compositionThumbnail
        }
        alt={
          root.serial ||
          root.name ||
          root.id
        }
      />

      {child && slot ? (
        <div
          style={{
            position: 'absolute',

            left:
              `${(slot.x / slot.layoutW) * 100}%`,

            top:
              `${(slot.y / slot.layoutH) * 100}%`,

            width:
              `${(slot.w / slot.layoutW) * 100}%`,

            height:
              `${(slot.h / slot.layoutH) * 100}%`,

            overflow: 'hidden',
            zIndex: 10,
          }}
        >
          <StudioThumbnail
            thumbnail={
              child.compositionThumbnail ??
              child.rawThumbnail
            }
            alt={
              child.serial ||
              child.name ||
              child.label ||
              child.id
            }
          />
        </div>
      ) : null}

      {child ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 2,
            transform: 'translateX(-50%)',
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
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          Draft Mode
        </div>
      ) : null}
    </div>
  )
}

type Props = {
  state: StudioStateV1

  onDropItem: (
    itemId: string,
    x: number,
    y: number,
  ) => void
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
  position?: {
    x: number
    y: number
  },
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
        position?.x ??
        (
          24 +
          (canvas.cards.length % 5) *
            28
        ),

      y:
        position?.y ??
        (
          24 +
          (canvas.cards.length % 5) *
            24
        ),

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
  onDropItem,
}: Props) {
  const canvasRef =
    useRef<HTMLDivElement | null>(
      null,
    )

  const [drag, setDrag] =
    useState<DragState>(null)

  const [menu, setMenu] =
    useState<MenuState>(null)

  const [
    folderMenuOpen,
    setFolderMenuOpen,
  ] = useState(false)

  useEffect(() => {
    function handleTouchDrop(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<{
          itemId: string
          clientX: number
          clientY: number
        }>

      const {
        itemId,
        clientX,
        clientY,
      } = customEvent.detail ?? {}

      if (
        !itemId ||
        !state.items[itemId]
      ) {
        return
      }

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
       * Ignore touch releases outside
       * the visible Canvas viewport.
       */
      if (
        clientX < bounds.left ||
        clientX > bounds.right ||
        clientY < bounds.top ||
        clientY > bounds.bottom
      ) {
        return
      }

      const x =
        Math.max(
          8,
          clientX -
            bounds.left +
            viewport.scrollLeft -
            CARD_W / 2,
        )

      const y =
        Math.max(
          8,
          clientY -
            bounds.top +
            viewport.scrollTop -
            CARD_H / 2,
        )

      onDropItem(
        itemId,
        x,
        y,
      )
    }

    window.addEventListener(
      'ordifi-studio-touch-drop',
      handleTouchDrop,
    )

    return () => {
      window.removeEventListener(
        'ordifi-studio-touch-drop',
        handleTouchDrop,
      )
    }
  }, [
    onDropItem,
    state.items,
  ])

  const [info, setInfo] =
    useState<InfoState>(null)

  const [
    noteItemId,
    setNoteItemId,
  ] = useState<string | null>(
    null,
  )

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

  /*
   * Draft membership controls Canvas
   * visibility globally.
   *
   * A child remains part of its Draft
   * even when the parent container is
   * not currently present on this Canvas.
   *
   * Only Unpack releases the child and
   * makes an existing Canvas card visible
   * as a standalone item again.
   */
  const hiddenDraftChildIds =
    useMemo(() => {
      const hidden =
        new Set<string>()

      for (
        const draft
        of Object.values(
          state.drafts,
        )
      ) {
        for (
          const childId
          of draft.itemIds
        ) {
          hidden.add(
            childId,
          )
        }
      }

      return hidden
    }, [
      state.drafts,
    ])
  const visibleCanvasCards =
    useMemo(
      () =>
        activeCanvas.cards.filter(
          (card) =>
            !hiddenDraftChildIds.has(
              card.itemId,
            ),
        ),
      [
        activeCanvas.cards,
        hiddenDraftChildIds,
      ],
    )

  const surfaceSize =
    useMemo(() => {
      let right = 0
      let bottom = 0

      for (
        const card
        of visibleCanvasCards
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
    }, [visibleCanvasCards])

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

  function draftContainerCardAtPoint(
    clientX: number,
    clientY: number,
    excludeCardId?: string,
  ) {
    const elements =
      document.elementsFromPoint(
        clientX,
        clientY,
      )

    const seen =
      new Set<string>()

    for (const element of elements) {
      const cardElement =
        element.closest<HTMLElement>(
          '.canvas-card[data-canvas-card-id]',
        )

      if (!cardElement) {
        continue
      }

      const cardId =
        cardElement.dataset
          .canvasCardId

      if (
        !cardId ||
        cardId === excludeCardId ||
        seen.has(cardId)
      ) {
        continue
      }

      seen.add(cardId)

      const card =
        activeCanvas.cards.find(
          (entry) =>
            entry.id === cardId,
        )

      if (!card) {
        continue
      }

      const draft =
        state.drafts[
          card.itemId
        ]

      if (
        draft?.rootKind === 'case' ||
        draft?.rootKind === 'layout'
      ) {
        return card
      }
    }

    return null
  }

  function packCanvasCardIntoCase(
    sourceCardId: string,
    targetCardId: string,
  ) {
    updateStudioState(
      (current) => {
        const canvas =
          current.canvas.canvases.find(
            (entry) =>
              entry.id ===
              current.canvas
                .activeCanvasId,
          )

        if (!canvas) {
          return current
        }

        const sourceCard =
          canvas.cards.find(
            (entry) =>
              entry.id ===
              sourceCardId,
          )

        const targetCard =
          canvas.cards.find(
            (entry) =>
              entry.id ===
              targetCardId,
          )

        if (
          !sourceCard ||
          !targetCard
        ) {
          return current
        }

        const packed =
          packOrdinalIntoDraftCaseState(
            current,
            targetCard.itemId,
            sourceCard.itemId,
          )

        if (packed === current) {
          return current
        }

        const canvasIndex =
          packed.canvas.canvases.findIndex(
            (entry) =>
              entry.id ===
              packed.canvas.activeCanvasId,
          )

        if (canvasIndex < 0) {
          return packed
        }

        const packedCanvas =
          packed.canvas.canvases[
            canvasIndex
          ]

        const canvases = [
          ...packed.canvas.canvases,
        ]

        canvases[canvasIndex] = {
          ...packedCanvas,
          cards:
            packedCanvas.cards.filter(
              (entry) =>
                entry.id !==
                sourceCardId,
            ),
        }

        return {
          ...packed,

          canvas: {
            ...packed.canvas,
            canvases,
          },
        }
      },
    )
  }

  function finishCardDrag(
    event:
      React.PointerEvent<HTMLDivElement>,
  ) {
    if (drag) {
      const sourceCard =
        activeCanvas.cards.find(
          (entry) =>
            entry.id ===
            drag.cardId,
        )

      const targetCard =
        draftContainerCardAtPoint(
          event.clientX,
          event.clientY,
          drag.cardId,
        )

      if (
        sourceCard &&
        targetCard
      ) {
        const targetDraft =
          state.drafts[
            targetCard.itemId
          ]

        if (
          targetDraft?.rootKind ===
            'case' &&
          canPackOrdinalIntoDraftCase(
            state,
            targetCard.itemId,
            sourceCard.itemId,
          )
        ) {
          packCanvasCardIntoCase(
            sourceCard.id,
            targetCard.id,
          )
        } else if (
          targetDraft?.rootKind ===
            'layout' &&
          canPackOrdinalIntoDraftLayout(
            state,
            targetCard.itemId,
            sourceCard.itemId,
          )
        ) {
          updateStudioState(
            (current) =>
              packOrdinalIntoDraftLayoutState(
                current,
                targetCard.itemId,
                sourceCard.itemId,
              ),
          )
        }
      }
    }

    setDrag(null)
  }

  function unpackDraftCaseOnCanvas(
    caseCardId: string,
    caseItemId: string,
  ) {
    updateStudioState(
      (current) => {
        const draft =
          current.drafts[
            caseItemId
          ]

        if (
          !draft ||
          draft.rootKind !==
            'case' ||
          draft.itemIds.length === 0
        ) {
          return current
        }

        const childId =
          draft.itemIds[0]

        const child =
          current.items[childId]

        /*
         * First mutate only Draft
         * semantics.
         */
        let next =
          unpackDraftCaseState(
            current,
            caseItemId,
          )

        if (!child) {
          return next
        }

        const canvasIndex =
          next.canvas.canvases
            .findIndex(
              (canvas) =>
                canvas.id ===
                next.canvas
                  .activeCanvasId,
            )

        if (canvasIndex < 0) {
          return next
        }

        const canvas =
          next.canvas.canvases[
            canvasIndex
          ]

        const caseCard =
          canvas.cards.find(
            (entry) =>
              entry.id ===
              caseCardId,
          )

        if (!caseCard) {
          return next
        }

        const x =
          Math.max(
            8,
            caseCard.x +
              CARD_W *
                caseCard.scale +
              24,
          )

        const y =
          Math.max(
            8,
            caseCard.y,
          )

        const nextZ =
          canvas.topZ + 1

        const existing =
          canvas.cards.find(
            (entry) =>
              entry.itemId ===
              childId,
          )

        const cards =
          existing
            ? canvas.cards.map(
                (entry) =>
                  entry.itemId ===
                  childId
                    ? {
                        ...entry,
                        x,
                        y,
                        z: nextZ,
                      }
                    : entry,
              )
            : [
                ...canvas.cards,

                {
                  id:
                    `card-${child.id}`,

                  itemId:
                    child.id,

                  objectType:
                    objectTypeForItem(
                      child,
                    ),

                  x,
                  y,
                  z: nextZ,
                  scale: 1 as const,
                },
              ]

        const canvases =
          [
            ...next.canvas
              .canvases,
          ]

        canvases[
          canvasIndex
        ] = {
          ...canvas,
          topZ: nextZ,
          cards,
        }

        next = {
          ...next,

          canvas: {
            ...next.canvas,
            canvases,
          },
        }

        return next
      },
    )

    setMenu(null)
  }

  function unpackDraftLayoutItemOnCanvas(
    layoutCardId: string,
    layoutItemId: string,
    childId: string,
  ) {
    updateStudioState(
      (current) => {
        const child =
          current.items[childId]

        if (!child) {
          return current
        }

        let next =
          unpackItemFromDraftLayoutState(
            current,
            layoutItemId,
            childId,
          )

        if (next === current) {
          return current
        }

        const canvasIndex =
          next.canvas.canvases
            .findIndex(
              (canvas) =>
                canvas.id ===
                next.canvas
                  .activeCanvasId,
            )

        if (canvasIndex < 0) {
          return next
        }

        const canvas =
          next.canvas.canvases[
            canvasIndex
          ]

        const layoutCard =
          canvas.cards.find(
            (entry) =>
              entry.id ===
              layoutCardId,
          )

        if (!layoutCard) {
          return next
        }

        const x =
          Math.max(
            8,
            layoutCard.x +
              CARD_W *
                layoutCard.scale +
              24,
          )

        const y =
          Math.max(
            8,
            layoutCard.y,
          )

        const nextZ =
          canvas.topZ + 1

        const existing =
          canvas.cards.find(
            (entry) =>
              entry.itemId ===
              childId,
          )

        const cards =
          existing
            ? canvas.cards.map(
                (entry) =>
                  entry.itemId ===
                  childId
                    ? {
                        ...entry,
                        x,
                        y,
                        z: nextZ,
                      }
                    : entry,
              )
            : [
                ...canvas.cards,

                {
                  id:
                    `card-${child.id}`,

                  itemId:
                    child.id,

                  objectType:
                    objectTypeForItem(
                      child,
                    ),

                  x,
                  y,
                  z: nextZ,
                  scale: 1 as const,
                },
              ]

        const canvases =
          [
            ...next.canvas.canvases,
          ]

        canvases[
          canvasIndex
        ] = {
          ...canvas,
          topZ: nextZ,
          cards,
        }

        next = {
          ...next,

          canvas: {
            ...next.canvas,
            canvases,
          },
        }

        return next
      },
    )

    setMenu(null)
  }

  function unpackAllDraftLayoutOnCanvas(
    layoutCardId: string,
    layoutItemId: string,
  ) {
    updateStudioState(
      (current) => {
        const draft =
          current.drafts[
            layoutItemId
          ]

        if (
          !draft ||
          draft.rootKind !==
            'layout' ||
          draft.itemIds.length === 0
        ) {
          return current
        }

        const childIds =
          [...draft.itemIds]

        let next =
          unpackDraftLayoutState(
            current,
            layoutItemId,
          )

        const canvasIndex =
          next.canvas.canvases
            .findIndex(
              (canvas) =>
                canvas.id ===
                next.canvas
                  .activeCanvasId,
            )

        if (canvasIndex < 0) {
          return next
        }

        const canvas =
          next.canvas.canvases[
            canvasIndex
          ]

        const layoutCard =
          canvas.cards.find(
            (entry) =>
              entry.id ===
              layoutCardId,
          )

        if (!layoutCard) {
          return next
        }

        let topZ =
          canvas.topZ

        let cards =
          [...canvas.cards]

        childIds.forEach(
          (childId, index) => {
            const child =
              next.items[childId]

            if (!child) {
              return
            }

            topZ += 1

            const column =
              index % 3

            const row =
              Math.floor(
                index / 3,
              )

            const x =
              Math.max(
                8,
                layoutCard.x +
                  CARD_W *
                    layoutCard.scale +
                  24 +
                  column *
                    (CARD_W + 16),
              )

            const y =
              Math.max(
                8,
                layoutCard.y +
                  row *
                    (CARD_H + 16),
              )

            const existingIndex =
              cards.findIndex(
                (entry) =>
                  entry.itemId ===
                  childId,
              )

            if (
              existingIndex >= 0
            ) {
              cards[
                existingIndex
              ] = {
                ...cards[
                  existingIndex
                ],
                x,
                y,
                z: topZ,
              }
            } else {
              cards.push({
                id:
                  `card-${child.id}`,

                itemId:
                  child.id,

                objectType:
                  objectTypeForItem(
                    child,
                  ),

                x,
                y,
                z: topZ,
                scale: 1 as const,
              })
            }
          },
        )

        const canvases =
          [
            ...next.canvas.canvases,
          ]

        canvases[
          canvasIndex
        ] = {
          ...canvas,
          topZ,
          cards,
        }

        next = {
          ...next,

          canvas: {
            ...next.canvas,
            canvases,
          },
        }

        return next
      },
    )

    setMenu(null)
  }

  function unpackDraftSuitcaseItemOnCanvas(
    suitcaseCardId: string,
    suitcaseItemId: string,
    childId: string,
  ) {
    updateStudioState(
      (current) => {
        const draft =
          current.drafts[
            suitcaseItemId
          ]

        const child =
          current.items[
            childId
          ]

        if (
          !draft ||
          draft.rootKind !==
            'suitcase' ||
          !draft.itemIds.includes(
            childId,
          ) ||
          !child
        ) {
          return current
        }

        let next =
          unpackItemFromDraftStructuralContainerState(
            current,
            suitcaseItemId,
            childId,
          )

        if (next === current) {
          return current
        }

        const canvasIndex =
          next.canvas.canvases
            .findIndex(
              (canvas) =>
                canvas.id ===
                next.canvas
                  .activeCanvasId,
            )

        if (canvasIndex < 0) {
          return next
        }

        const canvas =
          next.canvas.canvases[
            canvasIndex
          ]

        const suitcaseCard =
          canvas.cards.find(
            (entry) =>
              entry.id ===
              suitcaseCardId,
          )

        if (!suitcaseCard) {
          return next
        }

        const x =
          Math.max(
            8,
            suitcaseCard.x +
              CARD_W *
                suitcaseCard.scale +
              24,
          )

        let y =
          Math.max(
            8,
            suitcaseCard.y,
          )

        /*
         * Find the next free vertical
         * position so repeated single
         * unpack operations do not stack
         * Cases on top of each other.
         */
        for (
          let attempt = 0;
          attempt < 100;
          attempt += 1
        ) {
          const occupied =
            canvas.cards.some(
              (entry) =>
                entry.id !==
                  suitcaseCardId &&
                Math.abs(
                  entry.x - x,
                ) < CARD_W &&
                Math.abs(
                  entry.y - y,
                ) < CARD_H,
            )

          if (!occupied) {
            break
          }

          y +=
            CARD_H + 16
        }

        const nextZ =
          canvas.topZ + 1

        const existingIndex =
          canvas.cards.findIndex(
            (entry) =>
              entry.itemId ===
              childId,
          )

        const cards =
          [...canvas.cards]

        if (existingIndex >= 0) {
          cards[
            existingIndex
          ] = {
            ...cards[
              existingIndex
            ],
            x,
            y,
            z: nextZ,
          }
        } else {
          cards.push({
            id:
              `card-${child.id}`,

            itemId:
              child.id,

            objectType:
              objectTypeForItem(
                child,
              ),

            x,
            y,
            z: nextZ,
            scale: 1 as const,
          })
        }

        const canvases =
          [
            ...next.canvas
              .canvases,
          ]

        canvases[
          canvasIndex
        ] = {
          ...canvas,
          topZ: nextZ,
          cards,
        }

        next = {
          ...next,

          canvas: {
            ...next.canvas,
            canvases,
          },
        }

        return next
      },
    )

    /*
     * Intentionally keep the context
     * menu open. This makes unpacking
     * several Cases from a large
     * Suitcase practical.
     */
  }

  function unpackAllDraftSuitcaseOnCanvas(
    suitcaseCardId: string,
    suitcaseItemId: string,
  ) {
    updateStudioState(
      (current) => {
        const draft =
          current.drafts[
            suitcaseItemId
          ]

        if (
          !draft ||
          draft.rootKind !==
            'suitcase' ||
          draft.itemIds.length === 0
        ) {
          return current
        }

        const childIds =
          [...draft.itemIds]

        let next =
          unpackDraftStructuralContainerState(
            current,
            suitcaseItemId,
          )

        const canvasIndex =
          next.canvas.canvases
            .findIndex(
              (canvas) =>
                canvas.id ===
                next.canvas
                  .activeCanvasId,
            )

        if (canvasIndex < 0) {
          return next
        }

        const canvas =
          next.canvas.canvases[
            canvasIndex
          ]

        const suitcaseCard =
          canvas.cards.find(
            (entry) =>
              entry.id ===
              suitcaseCardId,
          )

        if (!suitcaseCard) {
          return next
        }

        let topZ =
          canvas.topZ

        let cards =
          [...canvas.cards]

        childIds.forEach(
          (childId, index) => {
            const child =
              next.items[
                childId
              ]

            if (!child) {
              return
            }

            topZ += 1

            const column =
              index % 4

            const row =
              Math.floor(
                index / 4,
              )

            const x =
              Math.max(
                8,
                suitcaseCard.x +
                  CARD_W *
                    suitcaseCard.scale +
                  24 +
                  column *
                    (CARD_W + 16),
              )

            const y =
              Math.max(
                8,
                suitcaseCard.y +
                  row *
                    (CARD_H + 16),
              )

            const existingIndex =
              cards.findIndex(
                (entry) =>
                  entry.itemId ===
                  childId,
              )

            if (
              existingIndex >= 0
            ) {
              cards[
                existingIndex
              ] = {
                ...cards[
                  existingIndex
                ],
                x,
                y,
                z: topZ,
              }
            } else {
              cards.push({
                id:
                  `card-${child.id}`,

                itemId:
                  child.id,

                objectType:
                  objectTypeForItem(
                    child,
                  ),

                x,
                y,
                z: topZ,
                scale: 1 as const,
              })
            }
          },
        )

        const canvases =
          [
            ...next.canvas
              .canvases,
          ]

        canvases[
          canvasIndex
        ] = {
          ...canvas,
          topZ,
          cards,
        }

        next = {
          ...next,

          canvas: {
            ...next.canvas,
            canvases,
          },
        }

        return next
      },
    )

    setMenu(null)
  }

  return (
    <>
      <div
        ref={canvasRef}
        className="studio-canvas"
        onDragOver={(event) => {
          /*
           * preventDefault() is what makes this
           * element a valid HTML drop target.
           *
           * Do not filter by custom MIME type here:
           * WebView2 may omit custom types during
           * dragover even though they are available
           * when the drop actually happens.
           */
          event.preventDefault()

          event.dataTransfer.dropEffect =
            'copy'
        }}
        onDrop={(event) => {
          const itemId =
            event.dataTransfer.getData(
              'application/x-ordifi-studio-item',
            ) ||
            event.dataTransfer.getData(
              'text/plain',
            )

          if (
            !itemId ||
            !state.items[itemId]
          ) {
            return
          }

          event.preventDefault()

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
           * Drop coordinates use the same
           * scrollable-surface coordinate system
           * as normal Canvas card dragging.
           *
           * Center the new card on the cursor.
           */
          const x =
            Math.max(
              8,
              event.clientX -
                bounds.left +
                viewport.scrollLeft -
                CARD_W / 2,
            )

          const y =
            Math.max(
              8,
              event.clientY -
                bounds.top +
                viewport.scrollTop -
                CARD_H / 2,
            )

          onDropItem(
            itemId,
            x,
            y,
          )
        }}
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
        onPointerUp={(event) =>
          finishCardDrag(event)
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
        {visibleCanvasCards.length ===
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

        {visibleCanvasCards.map(
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
                data-canvas-card-id={
                  card.id
                }
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

                  setFolderMenuOpen(false)

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
                  {draft &&
                  (
                    card.scale !== 1 ||
                    draft.rootKind === 'layout' ||
                    draft.rootKind === 'suitcase' ||
                    draft.rootKind === 'album'
                  ) ? (
                    <StudioDraftRuntime
                      state={state}
                      root={item}
                      draft={draft}
                      size={runtimeSize}
                      interactive={
                        card.scale !== 1
                      }
                    />
                  ) : draft?.rootKind === 'case' ? (
                    <StudioCaseDraftThumbnail
                      state={state}
                      root={item}
                      itemIds={draft.itemIds}
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

        const menuDraft =
          state.drafts[
            item.id
          ] ?? null

        const menuFolders =
          state.explorer.folders.filter(
            (folder) =>
              folder.sourceId ===
              item.sourceId,
          )

        const currentFolderId =
          Object.entries(
            state.explorer.folderItems,
          ).find(
            ([, itemIds]) =>
              itemIds.includes(
                item.id,
              ),
          )?.[0] ?? null

        return (
          <>
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

            <button
              type="button"
              onClick={() => {
                setNoteItemId(
                  item.id,
                )

                setMenu(null)
              }}
            >
              Notes
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
                ? 'Resize 2x'
                : card.scale === 2
                  ? 'Resize 4x'
                  : 'Resize 1x'}
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

            {menuDraft?.rootKind ===
              'layout' &&
            menuDraft.itemIds.length >
              0 ? (
              <>
                <div
                  style={{
                    padding:
                      '7px 10px 4px',

                    fontSize: 10,
                    fontWeight: 800,

                    opacity: .55,

                    textTransform:
                      'uppercase',

                    letterSpacing:
                      '.5px',
                  }}
                >
                  Unpack
                </div>

                {menuDraft.itemIds.map(
                  (childId) => {
                    const child =
                      state.items[
                        childId
                      ]

                    if (!child) {
                      return null
                    }

                    return (
                      <button
                        key={childId}
                        type="button"
                        onClick={() =>
                          unpackDraftLayoutItemOnCanvas(
                            card.id,
                            item.id,
                            childId,
                          )
                        }
                        title={
                          child.id
                        }
                      >
                        {child.serial ||
                          child.name ||
                          child.label ||
                          child.id}
                      </button>
                    )
                  },
                )}

                <button
                  type="button"
                  onClick={() =>
                    unpackAllDraftLayoutOnCanvas(
                      card.id,
                      item.id,
                    )
                  }
                >
                  Unpack All
                </button>
              </>
            ) : null}
            {menuDraft?.rootKind ===
              'suitcase' &&
            menuDraft.itemIds.length >
              0 ? (
              <>
                <div
                  style={{
                    padding:
                      '7px 10px 4px',

                    fontSize: 10,
                    fontWeight: 800,

                    opacity: .55,

                    textTransform:
                      'uppercase',

                    letterSpacing:
                      '.5px',
                  }}
                >
                  Unpack
                </div>

                <div
                  style={{
                    maxHeight: 260,
                    overflowY: 'auto',
                  }}
                >
                  {menuDraft.itemIds.map(
                    (childId) => {
                      const child =
                        state.items[
                          childId
                        ]

                      if (!child) {
                        return null
                      }

                      return (
                        <button
                          key={
                            childId
                          }
                          type="button"
                          onClick={() =>
                            unpackDraftSuitcaseItemOnCanvas(
                              card.id,
                              item.id,
                              childId,
                            )
                          }
                          title={
                            child.id
                          }
                        >
                          Unpack{' '}
                          {child.serial ||
                            child.name ||
                            child.label ||
                            child.id}
                        </button>
                      )
                    },
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    unpackAllDraftSuitcaseOnCanvas(
                      card.id,
                      item.id,
                    )
                  }
                >
                  Unpack All
                </button>
              </>
            ) : null}

            {menuDraft?.rootKind ===
              'case' &&
            menuDraft.itemIds.length >
              0 ? (
              <button
                type="button"
                onClick={() =>
                  unpackDraftCaseOnCanvas(
                    card.id,
                    item.id,
                  )
                }
              >
                Unpack
              </button>
            ) : null}

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

            {menuFolders.length > 0 ? (
              <>
                <div />

                <div
                  className="canvas-folder-menu-entry"
                  onMouseEnter={() =>
                    setFolderMenuOpen(true)
                  }
                  onMouseLeave={() =>
                    setFolderMenuOpen(false)
                  }
                >
                  <button
                    type="button"
                    className="canvas-menu-submenu-trigger"
                    onFocus={() =>
                      setFolderMenuOpen(true)
                    }
                  >
                    <span>
                      Move to Folder
                    </span>

                    <span
                      aria-hidden="true"
                    >
                      ›
                    </span>
                  </button>

                  {folderMenuOpen ? (
                    <div
                      className="canvas-card-menu canvas-folder-submenu"
                    >
                      {menuFolders.map(
                        (folder) => (
                          <button
                            key={folder.id}
                            type="button"
                            disabled={
                              folder.id ===
                              currentFolderId
                            }
                            onClick={() => {
                              moveItemToStudioFolder(
                                item.id,
                                folder.id,
                              )

                              setFolderMenuOpen(
                                false,
                              )

                              setMenu(null)
                            }}
                          >
                            {folder.name}
                          </button>
                        ),
                      )}

                      {currentFolderId ? (
                        <>
                          <div />

                          <button
                            type="button"
                            onClick={() => {
                              removeItemFromStudioFolders(
                                item.id,
                              )

                              setFolderMenuOpen(
                                false,
                              )

                              setMenu(null)
                            }}
                          >
                            Remove from Folder
                          </button>
                        </>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>


        </>
        )
      })() : null}

      {noteItemId ? (
        <StudioNoteDialog
          state={state}
          itemId={noteItemId}
          onClose={() =>
            setNoteItemId(null)
          }
        />
      ) : null}

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




