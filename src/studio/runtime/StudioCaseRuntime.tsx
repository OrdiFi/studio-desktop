import {
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import StudioThumbnail from '../StudioThumbnail'

import type {
  StudioDraft,
  StudioItemSnapshot,
  StudioStateV1,
} from '../studioState'

import SurfacePairRuntime from './SurfacePairRuntime'

import {
  resolveCaseSurface,
} from './studioRuntimeAssets'

type Props = {
  state: StudioStateV1
  root: StudioItemSnapshot
  draft: StudioDraft
  size: number
}

type ResolvedCaseSurface =
  Awaited<
    ReturnType<
      typeof resolveCaseSurface
    >
  >

function useCaseSurface(
  id: string | null,
) {
  const [
    surface,
    setSurface,
  ] =
    useState<
      ResolvedCaseSurface | null
    >(null)

  useEffect(() => {
    let cancelled = false
    let current:
      ResolvedCaseSurface | null =
      null

    setSurface(null)

    if (!id) return

    void resolveCaseSurface(id)
      .then((result) => {
        if (cancelled) {
          result.dispose()
          return
        }

        current = result
        setSurface(result)
      })
      .catch(() => {
        if (!cancelled) {
          setSurface(null)
        }
      })

    return () => {
      cancelled = true
      current?.dispose()
    }
  }, [id])

  return surface
}

function firstSlot(
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

  const slot = slots[0]

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

function Surface({
  surface,
  size,
  fallback = null,
}: {
  surface:
    | ResolvedCaseSurface
    | null

  size: number
  fallback?: ReactNode
}) {
  if (!surface) {
    return <>{fallback}</>
  }

  const scale =
    size / 1726

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: size,
        height: size,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 1726,
          height: 1726,
          transform:
            `scale(${scale})`,
          transformOrigin:
            'top left',
        }}
      >
        {surface.layers.map(
          (src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt=""
              draggable={false}
              style={{
                position: 'absolute',
                inset: 0,
                width: 1726,
                height: 1726,
                display: 'block',
              }}
            />
          ),
        )}

        {surface.footer ? (
          <div
            style={{
              position: 'absolute',
              left: 323,
              top: 355,
              width: 520,
              fontSize: 18,
              fontWeight: 650,
              letterSpacing: '1.4px',
              textAlign: 'center',
              color:
                'rgba(0,0,0,.62)',
            }}
          >
            {surface.footer}
          </div>
        ) : null}

        {surface.serial ? (
          <div
            style={{
              position: 'absolute',
              left: 930,
              top: 335,
              width: 420,
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: '2px',
              textAlign: 'right',
              color:
                'rgba(0,0,0,.78)',
            }}
          >
            {surface.serial}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function CaseFront({
  state,
  root,
  draft,
  surface,
  size,
}: {
  state: StudioStateV1
  root: StudioItemSnapshot
  draft: StudioDraft

  surface:
    | ResolvedCaseSurface
    | null

  size: number
}) {
  const childId =
    draft.itemIds[0] ??
    null

  const child =
    childId
      ? state.items[
          childId
        ] ?? null
      : null

  const slot =
    firstSlot(
      root.spec,
    )

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        overflow: 'hidden',
      }}
    >

      <Surface
        surface={surface}
        size={size}
        fallback={
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
              child.name ||
              child.label ||
              child.id
            }
          />
        </div>
      ) : null}

      {draft.itemIds.length > 0 ? (
        <div
          style={{
            position: 'absolute',
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

            padding: '4px 7px',

            fontSize:
              Math.max(
                8,
                size * 0.025,
              ),

            lineHeight: 1,
            fontWeight: 950,
            letterSpacing: .7,
            textTransform:
              'uppercase',

            pointerEvents: 'none',
          }}
        >
          Draft Mode
        </div>
      ) : null}
    </div>
  )
}

function CaseBack({
  item,
  surface,
  size,
}: {
  item:
    | StudioItemSnapshot
    | null

  surface:
    | ResolvedCaseSurface
    | null

  size: number
}) {
  const data =
    item
      ? {
          onchain: {
            number:
              item.number,

            id:
              item.id,

            content_type:
              item.mime,

            postage:
              item.postage,

            satpoint:
              item.satpoint,
          },

          metadata: {
            collection:
              item.collection,

            item:
              item.name,
          },
        }
      : null

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        overflow: 'hidden',
      }}
    >

      <Surface
        surface={surface}
        size={size}
      />

      {data ? (
        <div
          style={{
            position: 'absolute',

            left:
              `${(350 / 1726) * 100}%`,

            top:
              `${(529 / 1726) * 100}%`,

            width:
              `${(1024 / 1726) * 100}%`,

            height:
              `${(1024 / 1726) * 100}%`,

            boxSizing:
              'border-box',

            overflow: 'auto',

            background: '#000',
            color: '#d8d8d8',

            padding:
              `${Math.max(
                6,
                size * .015,
              )}px`,

            zIndex: 10,
          }}
        >
          <pre
            style={{
              margin: 0,

              whiteSpace:
                'pre-wrap',

              overflowWrap:
                'anywhere',

              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',

              fontSize:
                Math.max(
                  10,
                  size * .017 -
                    (size < 700 ? 2 : 0),
                ),

              lineHeight: 1.2,
            }}
          >
            {JSON.stringify(
              data,
              null,
              2,
            )}
          </pre>
        </div>
      ) : null}
    </div>
  )
}

export default function StudioCaseRuntime({
  state,
  root,
  draft,
  size,
}: Props) {
  console.log(
    '[StudioCaseRuntime]',
    {
      rootId: root.id,
      ordifiKind: root.ordifiKind,
      spec: root.spec,
      draftItemIds: draft.itemIds,
      child:
        draft.itemIds[0]
          ? state.items[draft.itemIds[0]]
          : null,
    },
  )
  const pairs =
    Array.isArray(
      root.surfacePairs,
    )
      ? root.surfacePairs as any[]
      : []

  const pair =
    pairs.find(
      (entry) =>
        entry?.frontId ===
        root.id,
    ) ??
    pairs[0] ??
    null

  const frontId =
    typeof pair?.frontId ===
    'string'
      ? pair.frontId
      : root.id

  const backId =
    typeof pair?.backId ===
    'string'
      ? pair.backId
      : null

  const frontSurface =
    useCaseSurface(
      frontId,
    )

  const backSurface =
    useCaseSurface(
      backId,
    )

  const content =
    draft.itemIds[0]
      ? state.items[
          draft.itemIds[0]
        ] ?? null
      : null

  const front = (
    <CaseFront
      state={state}
      root={root}
      draft={draft}
      surface={
        frontSurface
      }
      size={size}
    />
  )

  if (!backId) {
    return front
  }

  return (
    <SurfacePairRuntime
      front={front}
      back={
        <CaseBack
          item={content}
          surface={
            backSurface
          }
          size={size}
        />
      }
      size={size}
    />
  )
}
