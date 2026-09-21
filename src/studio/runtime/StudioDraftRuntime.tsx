import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import StudioThumbnail from '../StudioThumbnail'

import type {
  StudioDraft,
  StudioItemSnapshot,
  StudioStateV1,
} from '../studioState'

import {
  OrdiFiRuntime,
} from './OrdiFiRuntime'

import StudioCaseRuntime from './StudioCaseRuntime'
import StudioLayoutDraftRuntime from './StudioLayoutDraftRuntime'

import {
  resolveStudioRuntimeSpec,
} from './studioRuntimeAssets'

type Props = {
  state: StudioStateV1
  root: StudioItemSnapshot
  draft: StudioDraft
  size: number
  interactive?: boolean
}

type ResolvedRuntimeSpec =
  Awaited<
    ReturnType<
      typeof resolveStudioRuntimeSpec
    >
  >

function useResolvedRuntimeSpec(
  sourceSpec: unknown,
) {
  const [
    resolved,
    setResolved,
  ] =
    useState<
      ResolvedRuntimeSpec | null
    >(null)

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    )

  useEffect(() => {
    let cancelled = false

    let current:
      ResolvedRuntimeSpec | null =
      null

    setResolved(null)
    setError(null)

    if (
      !sourceSpec ||
      typeof sourceSpec !==
        'object'
    ) {
      setLoading(false)

      setError(
        'Missing runtime spec',
      )

      return
    }

    setLoading(true)

    void resolveStudioRuntimeSpec(
      sourceSpec,
    )
      .then((result) => {
        if (cancelled) {
          result.dispose()
          return
        }

        current = result

        setResolved(result)
        setLoading(false)
      })
      .catch((cause) => {
        if (cancelled) {
          return
        }

        setResolved(null)

        setError(
          cause instanceof Error
            ? cause.message
            : 'Runtime asset resolution failed',
        )

        setLoading(false)
      })

    return () => {
      cancelled = true
      current?.dispose()
    }
  }, [sourceSpec])

  return {
    spec:
      resolved?.spec ??
      null,

    loading,
    error,
  }
}

function logicalCompositionForDraft({
  state,
  root,
  draft,
}: {
  state: StudioStateV1
  root: StudioItemSnapshot
  draft: StudioDraft
}) {
  const children =
    draft.itemIds
      .map(
        (
          id,
          index,
        ) => {
          const item =
            state.items[id]

          if (!item) {
            return null
          }

          const group =
            index + 1

          return {
            level: 'B',
            group,
            side: '+',

            specId:
              item.id,

            storageBadge:
              state.drafts[
                item.id
              ]
                ? 'DRAFT MODE'
                : undefined,

            anchorIndex:
              group,

            members: [
              {
                placement: {
                  id:
                    item.id,

                  index:
                    group,

                  offset:
                    null,
                },

                specId:
                  item.id,

                spec:
                  item.serial
                    ? {
                        serial:
                          item.serial,
                      }
                    : null,

                group:
                  null,

                relation:
                  null,
              },
            ],

            children: [],

            ids: [
              item.id,
            ],
          }
        },
      )
      .filter(
        (
          child,
        ): child is NonNullable<
          typeof child
        > =>
          child !== null,
      )

  return {
    level: 'A',
    group: 1,
    side: '+',

    specId:
      root.id,

    anchorIndex: 0,

    members: [],
    children,

    ids: [
      root.id,
      ...children.map(
        (child) =>
          child.specId,
      ),
    ],
  }
}

function RuntimeChild({
  state,
  childComposition,
  size,
}: {
  state: StudioStateV1
  childComposition: any
  size: number
}) {
  const id =
    typeof childComposition
      ?.specId ===
      'string'
      ? childComposition
          .specId

      : Array.isArray(
            childComposition
              ?.ids,
          )
        ? childComposition
            .ids[0]

        : null

  if (!id) {
    return null
  }

  const item =
    state.items[id]

  if (!item) {
    return null
  }

  const draft =
    state.drafts[id] ??
    null

  if (draft) {
    return (
      <StudioDraftRuntime
        state={state}
        root={item}
        draft={draft}
        size={size}
        interactive={false}
      />
    )
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        overflow: 'hidden',
      }}
    >
      <StudioThumbnail
        thumbnail={
          item.compositionThumbnail ??
          item.rawThumbnail
        }
        alt={
          item.serial ||
          item.name ||
          item.label ||
          item.id
        }
      />
    </div>
  )
}

function StructuralDraftRuntime({
  state,
  root,
  draft,
  size,
  interactive = true,
}: Props) {
  const {
    spec,
    loading,
    error,
  } =
    useResolvedRuntimeSpec(
      root.spec,
    )

  const logicalComposition =
    useMemo(
      () =>
        logicalCompositionForDraft({
          state,
          root,
          draft,
        }),
      [
        state,
        root,
        draft,
      ],
    )

  if (loading) {
    return (
      <div
        style={{
          width: size,
          height: size,

          display: 'grid',

          placeItems:
            'center',

          fontSize: 10,
          opacity: .65,
        }}
      >
        Loading…
      </div>
    )
  }

  if (
    !spec ||
    error
  ) {
    return (
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
    )
  }

  return (
    <OrdiFiRuntime
      rootId={root.id}
      spec={spec}
      logicalComposition={
        logicalComposition
      }
      size={size}
      interactive={
        interactive
      }
      renderChild={(
        childComposition,
        childSize,
      ) => (
        <RuntimeChild
          state={state}
          childComposition={
            childComposition
          }
          size={childSize}
        />
      )}
    />
  )
}

export default function StudioDraftRuntime({
  state,
  root,
  draft,
  size,
  interactive = true,
}: Props) {
  let content:
    React.ReactNode

  if (
    draft.rootKind ===
    'case'
  ) {
    content = (
      <StudioCaseRuntime
        state={state}
        root={root}
        draft={draft}
        size={size}
      />
    )
  } else if (
    draft.rootKind ===
    'layout'
  ) {
    content = (
      <StudioLayoutDraftRuntime
        state={state}
        root={root}
        draft={draft}
        size={size}
      />
    )
  } else if (
    draft.rootKind ===
      'suitcase' ||
    draft.rootKind ===
      'album'
  ) {
    content = (
      <StructuralDraftRuntime
        state={state}
        root={root}
        draft={draft}
        size={size}
        interactive={
          interactive
        }
      />
    )
  } else {
    content = (
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
    )
  }

  return (
    <div
      className="studio-draft-runtime"
      style={{
        position:
          'relative',

        width: size,
        height: size,

        overflow:
          'visible',

        background:
          'transparent',
      }}
    >
      {content}
    </div>
  )
}
