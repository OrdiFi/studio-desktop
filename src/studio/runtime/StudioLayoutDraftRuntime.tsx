import StudioThumbnail from '../StudioThumbnail'

import type {
  StudioDraft,
  StudioItemSnapshot,
  StudioStateV1,
} from '../studioState'

type Props = {
  state: StudioStateV1
  root: StudioItemSnapshot
  draft: StudioDraft
  size: number
}

type Slot = {
  slot?: number
  index?: number
  id?: number | string

  x: number
  y: number

  w?: number
  h?: number

  width?: number
  height?: number
}

type LayoutSpec = {
  layout: {
    width: number
    height: number
  }

  slotCount: number
  slots: Slot[]
}

const DEFAULT_GRID4_SPEC: LayoutSpec = {
  layout: {
    width: 2048,
    height: 2048,
  },

  slotCount: 4,

  slots: [
    {
      slot: 1,
      x: 80,
      y: 80,
      w: 900,
      h: 900,
    },
    {
      slot: 2,
      x: 1068,
      y: 80,
      w: 900,
      h: 900,
    },
    {
      slot: 3,
      x: 80,
      y: 1068,
      w: 900,
      h: 900,
    },
    {
      slot: 4,
      x: 1068,
      y: 1068,
      w: 900,
      h: 900,
    },
  ],
}

const DEFAULT_GRID9_SPEC: LayoutSpec = {
  layout: {
    width: 3072,
    height: 3072,
  },

  slotCount: 9,

  slots: [
    { slot: 1, x: 93, y: 93, w: 900, h: 900 },
    { slot: 2, x: 1086, y: 93, w: 900, h: 900 },
    { slot: 3, x: 2079, y: 93, w: 900, h: 900 },

    { slot: 4, x: 93, y: 1086, w: 900, h: 900 },
    { slot: 5, x: 1086, y: 1086, w: 900, h: 900 },
    { slot: 6, x: 2079, y: 1086, w: 900, h: 900 },

    { slot: 7, x: 93, y: 2079, w: 900, h: 900 },
    { slot: 8, x: 1086, y: 2079, w: 900, h: 900 },
    { slot: 9, x: 2079, y: 2079, w: 900, h: 900 },
  ],
}

const DEFAULT_GRID16_SPEC: LayoutSpec = {
  layout: {
    width: 4096,
    height: 4096,
  },

  slotCount: 16,

  slots: [
    { slot: 1, x: 104, y: 104, w: 900, h: 900 },
    { slot: 2, x: 1100, y: 104, w: 900, h: 900 },
    { slot: 3, x: 2096, y: 104, w: 900, h: 900 },
    { slot: 4, x: 3092, y: 104, w: 900, h: 900 },

    { slot: 5, x: 104, y: 1100, w: 900, h: 900 },
    { slot: 6, x: 1100, y: 1100, w: 900, h: 900 },
    { slot: 7, x: 2096, y: 1100, w: 900, h: 900 },
    { slot: 8, x: 3092, y: 1100, w: 900, h: 900 },

    { slot: 9, x: 104, y: 2096, w: 900, h: 900 },
    { slot: 10, x: 1100, y: 2096, w: 900, h: 900 },
    { slot: 11, x: 2096, y: 2096, w: 900, h: 900 },
    { slot: 12, x: 3096, y: 2096, w: 900, h: 900 },

    { slot: 13, x: 104, y: 3092, w: 900, h: 900 },
    { slot: 14, x: 1100, y: 3092, w: 900, h: 900 },
    { slot: 15, x: 2096, y: 3092, w: 900, h: 900 },
    { slot: 16, x: 3092, y: 3092, w: 900, h: 900 },
  ],
}

function slotsFromSpec(
  spec: any,
): Slot[] {
  const slots =
    spec?.slots ??
    spec?.spec?.slots ??
    spec?.layout?.slots ??
    []

  return Array.isArray(slots)
    ? slots
    : []
}

function fallbackSpec(
  root: StudioItemSnapshot,
): LayoutSpec {
  const spec: any =
    root.spec ?? {}

  const count =
    Number(
      root.slotCount ??
      spec?.slotCount ??
      0,
    )

  if (
    root.ordifiKind === 'grid4' ||
    count <= 4
  ) {
    return DEFAULT_GRID4_SPEC
  }

  if (
    root.ordifiKind === 'grid9' ||
    count <= 9
  ) {
    return DEFAULT_GRID9_SPEC
  }

  return DEFAULT_GRID16_SPEC
}

function numberValue(
  value: unknown,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  const parsed =
    Number(value)

  return Number.isFinite(parsed)
    ? parsed
    : null
}

function slotNumber(
  slot: Slot,
  index: number,
) {
  return (
    numberValue(slot.slot) ??
    numberValue(slot.index) ??
    numberValue(slot.id) ??
    index + 1
  )
}

export default function StudioLayoutDraftRuntime({
  state,
  root,
  draft,
  size,
}: Props) {
  const spec: any =
    root.spec ?? {}

  const actualSlots =
    slotsFromSpec(
      spec,
    )

  const fallback =
    fallbackSpec(
      root,
    )

  const slots =
    actualSlots.length > 0
      ? actualSlots
      : fallback.slots

  const layoutW =
    Number(
      spec?.layout?.width ??
      spec?.width,
    ) ||
    fallback.layout.width

  const layoutH =
    Number(
      spec?.layout?.height ??
      spec?.height,
    ) ||
    fallback.layout.height

  return (
    <div
      style={{
        position: 'relative',

        width: size,
        height: size,

        overflow: 'hidden',

        background:
          'transparent',
      }}
    >
      {/* Layout inscription itself remains
          the canonical local background. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      >
        <StudioThumbnail
          thumbnail={
            root.rawThumbnail
          }
          alt={
            root.serial ||
            root.name ||
            root.id
          }
        />
      </div>

      {slots.map(
        (
          slot,
          index,
        ) => {
          /*
           * Draft item order maps to stable
           * structural slot order.
           * Missing IDs leave real gaps.
           */
          const id =
            draft.slotItemIds
              ? draft.slotItemIds[
                  index
                ]
              : draft.itemIds[
                  index
                ]

          if (!id) {
            return null
          }

          const item =
            state.items[id]

          if (!item) {
            return null
          }

          const x =
            Number(slot.x)

          const y =
            Number(slot.y)

          const w =
            Number(
              slot.w ??
              slot.width,
            )

          const h =
            Number(
              slot.h ??
              slot.height,
            )

          if (
            !Number.isFinite(x) ||
            !Number.isFinite(y) ||
            !Number.isFinite(w) ||
            !Number.isFinite(h) ||
            w <= 0 ||
            h <= 0
          ) {
            return null
          }

          return (
            <div
              key={
                `${slotNumber(
                  slot,
                  index,
                )}-${id}`
              }
              title={
                item.serial ||
                item.name ||
                item.label ||
                id
              }
              data-slot={
                slotNumber(
                  slot,
                  index,
                )
              }
              style={{
                position:
                  'absolute',

                left:
                  `${(x / layoutW) * 100}%`,

                top:
                  `${(y / layoutH) * 100}%`,

                width:
                  `${(w / layoutW) * 100}%`,

                height:
                  `${(h / layoutH) * 100}%`,

                overflow:
                  'hidden',

                background:
                  'transparent',

                zIndex: 10,
              }}
            >
              <StudioThumbnail
                thumbnail={
                  item.rawThumbnail
                }
                alt={
                  item.name ||
                  item.label ||
                  id
                }
              />
            </div>
          )
        },
      )}

      <div
        style={{
          position:
            'absolute',

          left: '50%',
          bottom: 0,

          transform:
            'translateX(-50%)',

          zIndex: 30,

          border:
            '1px solid rgba(255,75,75,.82)',

          background:
            'rgba(125,0,0,.78)',

          color:
            'rgb(255,220,220)',

          padding:
            '4px 7px',

          fontSize:
            Math.max(
              8,
              size * 0.025,
            ),

          lineHeight: 1,
          fontWeight: 950,

          letterSpacing:
            0.7,

          textTransform:
            'uppercase',

          pointerEvents:
            'none',
        }}
      >
        Draft Mode
      </div>
    </div>
  )
}
