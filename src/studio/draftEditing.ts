import type {
  StudioItemSnapshot,
  StudioStateV1,
} from './studioState'

function compositionItemIds(
  item: StudioItemSnapshot,
) {
  const composition =
    item.composition

  if (
    !composition ||
    typeof composition !== 'object'
  ) {
    return []
  }

  const itemIds =
    (
      composition as {
        itemIds?: unknown
      }
    ).itemIds

  if (!Array.isArray(itemIds)) {
    return []
  }

  return itemIds.filter(
    (id): id is string =>
      typeof id === 'string' &&
      id.length > 0 &&
      id !== item.id,
  )
}

function draftParentOf(
  state: StudioStateV1,
  itemId: string,
) {
  return (
    Object.values(
      state.drafts,
    ).find(
      (draft) =>
        draft.itemIds.includes(
          itemId,
        ),
    ) ?? null
  )
}

function isOnchainCompositionChild(
  state: StudioStateV1,
  itemId: string,
) {
  return Object.values(
    state.items,
  ).some(
    (item) =>
      item.id !== itemId &&
      compositionItemIds(
        item,
      ).includes(itemId),
  )
}

export function canPackOrdinalIntoDraftCase(
  state: StudioStateV1,
  caseId: string,
  ordinalId: string,
) {
  if (caseId === ordinalId) {
    return false
  }

  const caseItem =
    state.items[caseId]

  const ordinal =
    state.items[ordinalId]

  const draft =
    state.drafts[caseId]

  if (
    !caseItem ||
    !ordinal ||
    !draft
  ) {
    return false
  }

  /*
   * Only an actual editable Draft Case
   * can receive content.
   */
  if (
    draft.rootKind !== 'case' ||
    caseItem.ordifiKind !== 'case'
  ) {
    return false
  }

  /*
   * Case v1 has exactly one slot.
   */
  if (draft.itemIds.length > 0) {
    return false
  }

  /*
   * Only ordinary Ordinals are valid
   * Case content.
   */
  if (ordinal.ordifiKind !== null) {
    return false
  }

  /*
   * Draft composition stays inside one
   * wallet/source.
   */
  if (
    ordinal.sourceId !==
    caseItem.sourceId
  ) {
    return false
  }

  /*
   * An item may have only one Draft
   * parent.
   */
  if (
    draftParentOf(
      state,
      ordinalId,
    )
  ) {
    return false
  }

  /*
   * A Draft root itself is not treated
   * as a free Ordinal.
   */
  if (state.drafts[ordinalId]) {
    return false
  }

  /*
   * Do not treat content already bound
   * inside an onchain composition as a
   * free Draft input.
   */
  if (
    isOnchainCompositionChild(
      state,
      ordinalId,
    )
  ) {
    return false
  }

  return true
}

export function packOrdinalIntoDraftCaseState(
  state: StudioStateV1,
  caseId: string,
  ordinalId: string,
): StudioStateV1 {
  if (
    !canPackOrdinalIntoDraftCase(
      state,
      caseId,
      ordinalId,
    )
  ) {
    return state
  }

  const draft =
    state.drafts[caseId]

  return {
    ...state,

    drafts: {
      ...state.drafts,

      [caseId]: {
        ...draft,
        itemIds: [
          ordinalId,
        ],
        updatedAt:
          Date.now(),
      },
    },
  }
}

export function unpackDraftCaseState(
  state: StudioStateV1,
  caseId: string,
): StudioStateV1 {
  const draft =
    state.drafts[caseId]

  if (
    !draft ||
    draft.rootKind !== 'case' ||
    draft.itemIds.length === 0
  ) {
    return state
  }

  return {
    ...state,

    drafts: {
      ...state.drafts,

      [caseId]: {
        ...draft,
        itemIds: [],
        updatedAt:
          Date.now(),
      },
    },
  }
}
function layoutSlotCount(
  item: StudioItemSnapshot,
) {
  const explicit =
    Number(item.slotCount)

  if (
    Number.isFinite(explicit) &&
    explicit > 0
  ) {
    return Math.floor(explicit)
  }

  if (item.ordifiKind === 'grid4') {
    return 4
  }

  if (item.ordifiKind === 'grid9') {
    return 9
  }

  if (item.ordifiKind === 'grid16') {
    return 16
  }

  const spec: any =
    item.spec ?? {}

  const slots =
    spec?.slots ??
    spec?.layout?.slots

  if (Array.isArray(slots)) {
    return slots.length
  }

  return 0
}
export function canPackOrdinalIntoDraftLayout(
  state: StudioStateV1,
  layoutId: string,
  ordinalId: string,
) {
  if (layoutId === ordinalId) {
    return false
  }

  const layout =
    state.items[layoutId]

  const ordinal =
    state.items[ordinalId]

  const draft =
    state.drafts[layoutId]

  if (
    !layout ||
    !ordinal ||
    !draft
  ) {
    return false
  }

  if (
    draft.rootKind !== 'layout' ||
    !(
      layout.ordifiKind === 'grid4' ||
      layout.ordifiKind === 'grid9' ||
      layout.ordifiKind === 'grid16' ||
      layout.ordifiKind === 'layout'
    )
  ) {
    return false
  }

  /*
   * Layout slots currently receive normal
   * Ordinals only.
   */
  if (ordinal.ordifiKind !== null) {
    return false
  }

  /*
   * Draft composition stays inside one
   * wallet/source.
   */
  if (
    ordinal.sourceId !==
    layout.sourceId
  ) {
    return false
  }

  /*
   * An item may not belong to another Draft.
   */
  if (draftParentOf(
    state,
    ordinalId,
  )) {
    return false
  }

  if (state.drafts[ordinalId]) {
    return false
  }

  if (
    isOnchainCompositionChild(
      state,
      ordinalId,
    )
  ) {
    return false
  }

  const count =
    layoutSlotCount(layout)

  if (count <= 0) {
    return false
  }

  const slots =
    draft.slotItemIds ??
    Array.from(
      { length: count },
      (_, index) =>
        draft.itemIds[index] ??
        null,
    )

  return slots.some(
    (id) => id === null,
  )
}

export function packOrdinalIntoDraftLayoutState(
  state: StudioStateV1,
  layoutId: string,
  ordinalId: string,
): StudioStateV1 {
  if (
    !canPackOrdinalIntoDraftLayout(
      state,
      layoutId,
      ordinalId,
    )
  ) {
    return state
  }

  const layout =
    state.items[layoutId]

  const draft =
    state.drafts[layoutId]

  const count =
    layoutSlotCount(layout)

  const slots =
    draft.slotItemIds
      ? [...draft.slotItemIds]
      : Array.from(
          { length: count },
          (_, index) =>
            draft.itemIds[index] ??
            null,
        )

  while (slots.length < count) {
    slots.push(null)
  }

  const freeIndex =
    slots.findIndex(
      (id) => id === null,
    )

  if (freeIndex < 0) {
    return state
  }

  slots[freeIndex] =
    ordinalId

  const itemIds =
    slots.filter(
      (id): id is string =>
        typeof id === 'string',
    )

  return {
    ...state,

    drafts: {
      ...state.drafts,

      [layoutId]: {
        ...draft,
        itemIds,
        slotItemIds: slots,
        updatedAt:
          Date.now(),
      },
    },
  }
}

export function unpackItemFromDraftLayoutState(
  state: StudioStateV1,
  layoutId: string,
  ordinalId: string,
): StudioStateV1 {
  const draft =
    state.drafts[layoutId]

  if (
    !draft ||
    draft.rootKind !== 'layout' ||
    !draft.itemIds.includes(
      ordinalId,
    )
  ) {
    return state
  }

  const layout =
    state.items[layoutId]

  if (!layout) {
    return state
  }

  const count =
    Math.max(
      layoutSlotCount(layout),
      draft.slotItemIds?.length ?? 0,
      draft.itemIds.length,
    )

  const slots =
    draft.slotItemIds
      ? [...draft.slotItemIds]
      : Array.from(
          { length: count },
          (_, index) =>
            draft.itemIds[index] ??
            null,
        )

  const slotIndex =
    slots.findIndex(
      (id) =>
        id === ordinalId,
    )

  if (slotIndex >= 0) {
    slots[slotIndex] = null
  }

  const itemIds =
    draft.itemIds.filter(
      (id) =>
        id !== ordinalId,
    )

  return {
    ...state,

    drafts: {
      ...state.drafts,

      [layoutId]: {
        ...draft,
        itemIds,
        slotItemIds: slots,
        updatedAt:
          Date.now(),
      },
    },
  }
}
export function unpackDraftLayoutState(
  state: StudioStateV1,
  layoutId: string,
): StudioStateV1 {
  const draft =
    state.drafts[layoutId]

  if (
    !draft ||
    draft.rootKind !== 'layout' ||
    draft.itemIds.length === 0
  ) {
    return state
  }

  const slotCount =
    draft.slotItemIds?.length ??
    layoutSlotCount(
      state.items[layoutId],
    )

  return {
    ...state,

    drafts: {
      ...state.drafts,

      [layoutId]: {
        ...draft,
        itemIds: [],
        slotItemIds:
          Array.from(
            {
              length:
                Math.max(
                  0,
                  slotCount,
                ),
            },
            () => null,
          ),
        updatedAt:
          Date.now(),
      },
    },
  }
}
function isLayoutContainerItem(
  item: StudioItemSnapshot,
) {
  return (
    item.ordifiKind === 'grid4' ||
    item.ordifiKind === 'grid9' ||
    item.ordifiKind === 'grid16' ||
    item.ordifiKind === 'layout'
  )
}

function structuralContainerCapacity(
  item: StudioItemSnapshot,
) {
  if (
    item.ordifiKind ===
    'suitcase'
  ) {
    return 48
  }

  if (
    item.ordifiKind ===
    'album'
  ) {
    const value =
      Number(item.slotCount)

    return (
      Number.isFinite(value) &&
      value > 0
    )
      ? Math.floor(value)
      : 20
  }

  return 0
}

export function canPackIntoDraftStructuralContainer(
  state: StudioStateV1,
  containerId: string,
  childId: string,
) {
  if (
    containerId === childId
  ) {
    return false
  }

  const container =
    state.items[containerId]

  const child =
    state.items[childId]

  const draft =
    state.drafts[containerId]

  if (
    !container ||
    !child ||
    !draft
  ) {
    return false
  }

  const suitcaseCase =
    draft.rootKind ===
      'suitcase' &&
    container.ordifiKind ===
      'suitcase' &&
    child.ordifiKind ===
      'case'

  const albumLayout =
    draft.rootKind ===
      'album' &&
    container.ordifiKind ===
      'album' &&
    isLayoutContainerItem(
      child,
    )

  if (
    !suitcaseCase &&
    !albumLayout
  ) {
    return false
  }

  /*
   * Structural Draft composition stays
   * inside one wallet/source.
   */
  if (
    child.sourceId !==
    container.sourceId
  ) {
    return false
  }

  /*
   * A Case/Layout may itself be a Draft
   * root. That is allowed here because
   * nested Draft Runtime must remain
   * intact.
   *
   * It may however have only one parent.
   */
  if (
    draftParentOf(
      state,
      childId,
    )
  ) {
    return false
  }

  if (
    isOnchainCompositionChild(
      state,
      childId,
    )
  ) {
    return false
  }

  if (
    draft.itemIds.includes(
      childId,
    )
  ) {
    return false
  }

  const capacity =
    structuralContainerCapacity(
      container,
    )

  if (
    capacity <= 0 ||
    draft.itemIds.length >=
      capacity
  ) {
    return false
  }

  return true
}

export function packIntoDraftStructuralContainerState(
  state: StudioStateV1,
  containerId: string,
  childId: string,
): StudioStateV1 {
  if (
    !canPackIntoDraftStructuralContainer(
      state,
      containerId,
      childId,
    )
  ) {
    return state
  }

  const draft =
    state.drafts[
      containerId
    ]

  return {
    ...state,

    drafts: {
      ...state.drafts,

      [containerId]: {
        ...draft,

        itemIds: [
          ...draft.itemIds,
          childId,
        ],

        updatedAt:
          Date.now(),
      },
    },
  }
}

export function unpackItemFromDraftStructuralContainerState(
  state: StudioStateV1,
  containerId: string,
  childId: string,
): StudioStateV1 {
  const draft =
    state.drafts[
      containerId
    ]

  if (
    !draft ||
    (
      draft.rootKind !==
        'suitcase' &&
      draft.rootKind !==
        'album'
    ) ||
    !draft.itemIds.includes(
      childId,
    )
  ) {
    return state
  }

  return {
    ...state,

    drafts: {
      ...state.drafts,

      [containerId]: {
        ...draft,

        itemIds:
          draft.itemIds.filter(
            (id) =>
              id !== childId,
          ),

        updatedAt:
          Date.now(),
      },
    },
  }
}

export function unpackDraftStructuralContainerState(
  state: StudioStateV1,
  containerId: string,
): StudioStateV1 {
  const draft =
    state.drafts[
      containerId
    ]

  if (
    !draft ||
    (
      draft.rootKind !==
        'suitcase' &&
      draft.rootKind !==
        'album'
    ) ||
    draft.itemIds.length === 0
  ) {
    return state
  }

  return {
    ...state,

    drafts: {
      ...state.drafts,

      [containerId]: {
        ...draft,
        itemIds: [],
        updatedAt:
          Date.now(),
      },
    },
  }
}
export function createDraftForItemState(
  state: StudioStateV1,
  itemId: string,
): StudioStateV1 {
  const item =
    state.items[itemId]

  if (!item) {
    return state
  }

  if (state.drafts[itemId]) {
    return state
  }

  let rootKind:
    | 'case'
    | 'layout'
    | 'suitcase'
    | 'album'
    | null = null

  if (item.ordifiKind === 'case') {
    rootKind = 'case'
  } else if (
    item.ordifiKind === 'grid4' ||
    item.ordifiKind === 'grid9' ||
    item.ordifiKind === 'grid16' ||
    item.ordifiKind === 'layout'
  ) {
    rootKind = 'layout'
  } else if (
    item.ordifiKind === 'suitcase'
  ) {
    rootKind = 'suitcase'
  } else if (
    item.ordifiKind === 'album'
  ) {
    rootKind = 'album'
  }

  if (!rootKind) {
    return state
  }

  return {
    ...state,

    drafts: {
      ...state.drafts,

      [itemId]: {
        rootId: itemId,
        rootKind,

        itemIds:
          compositionItemIds(item),

        slotItemIds:
          rootKind === 'layout'
            ? (() => {
                const ids =
                  compositionItemIds(item)

                const count =
                  Math.max(
                    layoutSlotCount(item),
                    ids.length,
                  )

                return Array.from(
                  {
                    length: count,
                  },
                  (_, index) =>
                    ids[index] ?? null,
                )
              })()
            : undefined,

        updatedAt:
          Date.now(),
      },
    },
  }
}

