export const STUDIO_STATE_STORAGE_KEY =
  'ordifi:studio:state:v1'

export type StudioSource = {
  id: string
  label: string
  address: string
  enabled: boolean
  color: string
  createdAt: number
}

export type StudioFolder = {
  id: string
  sourceId: string | null
  name: string
  parentPath: string
  createdAt: number
}

export type StudioObjectType =
  | 'ordinal'
  | 'case'
  | 'grid'
  | 'suitcase'
  | 'album'

export type StudioOrdifiKind =
  | 'case'
  | 'grid4'
  | 'grid9'
  | 'grid16'
  | 'layout'
  | 'suitcase'
  | 'album'
  | null

export type StudioThumbnailRef = {
  key: string
  mime: string
  version: string
}

export type StudioItemSnapshot = {
  id: string

  sourceId: string


  /*
   * True when this item is a top-level
   * Explorer entry. Packed/composed child
   * inscriptions remain in the snapshot
   * but are not duplicated at wallet root.
   */
  explorerVisible?: boolean

  label: string
  name: string | null
  collection: string | null
  number: number | null
  mime: string | null

  utxo: string | null
  satpoint: string | null
  offset: number | null
  postage: number | null

  ordifiSupported: boolean
  ordifiKind: StudioOrdifiKind
  serial: string | null
  slotCount: number | null

  spec: unknown | null
  composition: unknown | null
  surfacePairs: unknown[]

  /*
   * Thumbnail of this inscription by itself.
   * Every synchronized inscription should
   * eventually have this asset.
   */
  rawThumbnail: StudioThumbnailRef | null

  /*
   * Optional thumbnail of the real current
   * on-chain composition rooted at this item.
   * Draft state is deliberately NOT stored here.
   */
  compositionThumbnail: StudioThumbnailRef | null

  syncedAt: number
}

export type StudioCanvasCard = {
  id: string
  itemId: string
  objectType: StudioObjectType
  x: number
  y: number
  z: number
  scale: 1 | 2 | 4
}

export type StudioCanvas = {
  id: string
  name: string
  topZ: number
  cards: StudioCanvasCard[]
}

export type StudioDraftRootKind =
  | 'case'
  | 'layout'
  | 'suitcase'
  | 'album'

export type StudioDraft = {
  rootId: string
  rootKind: StudioDraftRootKind
  itemIds: string[]
  updatedAt: number
}

export type StudioStateV1 = {
  schema: 'ordifi-studio'
  version: 1

  sources: StudioSource[]

  items: Record<
    string,
    StudioItemSnapshot
  >

  explorer: {
    folders: StudioFolder[]
    folderItems: Record<
      string,
      string[]
    >
  }

  canvas: {
    activeCanvasId: string
    canvases: StudioCanvas[]
  }

  drafts: Record<
    string,
    StudioDraft
  >

  updatedAt: number
}

export function createEmptyStudioState():
  StudioStateV1 {
  return {
    schema: 'ordifi-studio',
    version: 1,

    sources: [],

    items: {},

    explorer: {
      folders: [],
      folderItems: {},
    },

    canvas: {
      activeCanvasId: 'canvas-1',

      canvases: [
        {
          id: 'canvas-1',
          name: 'Canvas 1',
          topZ: 1,
          cards: [],
        },
      ],
    },

    drafts: {},

    updatedAt: Date.now(),
  }
}

export function readStudioState():
  StudioStateV1 {
  try {
    const raw =
      localStorage.getItem(
        STUDIO_STATE_STORAGE_KEY,
      )

    if (!raw) {
      return createEmptyStudioState()
    }

    const parsed =
      JSON.parse(raw)

    if (
      parsed?.schema !==
        'ordifi-studio' ||
      parsed?.version !== 1
    ) {
      return createEmptyStudioState()
    }

    const fallback =
      createEmptyStudioState()

    return {
      ...fallback,
      ...parsed,

      schema: 'ordifi-studio',
      version: 1,

      sources:
        Array.isArray(parsed.sources)
          ? parsed.sources
          : [],

      items:
        parsed.items &&
        typeof parsed.items ===
          'object' &&
        !Array.isArray(parsed.items)
          ? parsed.items
          : {},

      explorer: {
        folders:
          Array.isArray(
            parsed.explorer?.folders,
          )
            ? parsed.explorer.folders
            : [],

        folderItems:
          parsed.explorer
            ?.folderItems &&
          typeof parsed.explorer
            .folderItems ===
            'object'
            ? parsed.explorer
                .folderItems
            : {},
      },

      canvas: {
        activeCanvasId:
          typeof parsed.canvas
            ?.activeCanvasId ===
          'string'
            ? parsed.canvas
                .activeCanvasId
            : fallback.canvas
                .activeCanvasId,

        canvases:
          Array.isArray(
            parsed.canvas?.canvases,
          ) &&
          parsed.canvas.canvases
            .length > 0
            ? parsed.canvas
                .canvases
            : fallback.canvas
                .canvases,
      },

      drafts:
        parsed.drafts &&
        typeof parsed.drafts ===
          'object' &&
        !Array.isArray(parsed.drafts)
          ? parsed.drafts
          : {},

      updatedAt:
        Number(parsed.updatedAt) ||
        Date.now(),
    }
  } catch {
    return createEmptyStudioState()
  }
}

export function writeStudioState(
  state: StudioStateV1,
) {
  const next: StudioStateV1 = {
    ...state,
    updatedAt: Date.now(),
  }

  localStorage.setItem(
    STUDIO_STATE_STORAGE_KEY,
    JSON.stringify(next),
  )

  window.dispatchEvent(
    new CustomEvent(
      'ordifi:studio-state:changed',
      {
        detail: next,
      },
    ),
  )
}
