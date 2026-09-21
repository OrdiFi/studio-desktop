import type {
  StudioStateV1,
} from './studioState'

export const STUDIO_SYNC_SCHEMA =
  'ordifi-studio-sync'

export const STUDIO_SYNC_VERSION = 1

export type StudioSyncAssetEntry = {
  key: string
  path: string

  mime: string
  version: string

  size: number

  sha256?: string
}

export type StudioSyncManifestV1 = {
  schema:
    typeof STUDIO_SYNC_SCHEMA

  version:
    typeof STUDIO_SYNC_VERSION

  exportedAt: number

  /*
   * Relative path inside the bundle.
   */
  statePath: 'studio-state.json'

  assets: Record<
    string,
    StudioSyncAssetEntry
  >
}

export type StudioSyncPackageV1 = {
  manifest:
    StudioSyncManifestV1

  state:
    StudioStateV1
}

export function createStudioSyncManifest():
  StudioSyncManifestV1 {
  return {
    schema:
      STUDIO_SYNC_SCHEMA,

    version:
      STUDIO_SYNC_VERSION,

    exportedAt:
      Date.now(),

    statePath:
      'studio-state.json',

    assets: {},
  }
}

export function isStudioSyncManifestV1(
  value: unknown,
): value is StudioSyncManifestV1 {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return false
  }

  const input =
    value as Partial<
      StudioSyncManifestV1
    >

  return (
    input.schema ===
      STUDIO_SYNC_SCHEMA &&
    input.version ===
      STUDIO_SYNC_VERSION &&
    input.statePath ===
      'studio-state.json' &&
    typeof input.exportedAt ===
      'number' &&
    !!input.assets &&
    typeof input.assets ===
      'object'
  )
}
