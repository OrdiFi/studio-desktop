import {
  getStudioAsset,
} from '../localAssetDb'

export type ResolvedStudioRuntimeSpec = {
  spec: any
  dispose: () => void
}

export type ResolvedCaseSurface = {
  id: string
  layers: string[]
  footer: string | null
  serial: string | null
  dispose: () => void
}

type CaseSurfaceDescriptor = {
  id: string
  layers: string[]
  footer: string | null
  serial: string | null
}

function runtimeAssetKey(
  source: string,
) {
  return `runtime:${source}`
}

function caseSurfaceKey(
  id: string,
) {
  return `case-surface:${id}`
}

async function studioAssetUrl(
  key: string,
  urls: Map<string, string>,
) {
  const existing =
    urls.get(key)

  if (existing) {
    return existing
  }

  const record =
    await getStudioAsset(
      key,
    )

  if (!record?.blob) {
    throw new Error(
      `Studio runtime asset is missing: ${key}`,
    )
  }

  const url =
    URL.createObjectURL(
      record.blob,
    )

  urls.set(
    key,
    url,
  )

  return url
}

function disposeUrls(
  urls: Map<string, string>,
) {
  for (
    const url
    of urls.values()
  ) {
    URL.revokeObjectURL(
      url,
    )
  }

  urls.clear()
}

async function resolveAssetTree(
  value: unknown,
  urls: Map<string, string>,
): Promise<unknown> {
  if (
    typeof value === 'string'
  ) {
    return await studioAssetUrl(
      runtimeAssetKey(
        value,
      ),
      urls,
    )
  }

  if (
    Array.isArray(value)
  ) {
    return await Promise.all(
      value.map(
        (entry) =>
          resolveAssetTree(
            entry,
            urls,
          ),
      ),
    )
  }

  if (
    value &&
    typeof value === 'object'
  ) {
    const result:
      Record<string, unknown> = {}

    for (
      const [key, entry]
      of Object.entries(
        value,
      )
    ) {
      result[key] =
        await resolveAssetTree(
          entry,
          urls,
        )
    }

    return result
  }

  return value
}

/*
 * Create a runtime-only copy of the spec.
 *
 * Canonical Studio state is never mutated.
 * Only spec.assets is rewritten from its
 * immutable source identifiers to temporary
 * local blob: URLs.
 */
export async function resolveStudioRuntimeSpec(
  sourceSpec: unknown,
): Promise<ResolvedStudioRuntimeSpec> {
  if (
    !sourceSpec ||
    typeof sourceSpec !== 'object'
  ) {
    throw new Error(
      'Studio runtime spec is missing.',
    )
  }

  const spec: any =
    structuredClone(
      sourceSpec,
    )

  const urls =
    new Map<string, string>()

  try {
    if (
      spec.assets &&
      typeof spec.assets ===
        'object'
    ) {
      spec.assets =
        await resolveAssetTree(
          spec.assets,
          urls,
        )
    }

    return {
      spec,

      dispose: () =>
        disposeUrls(
          urls,
        ),
    }
  } catch (error) {
    disposeUrls(
      urls,
    )

    throw error
  }
}

function isCaseSurfaceDescriptor(
  value: unknown,
): value is CaseSurfaceDescriptor {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return false
  }

  const candidate =
    value as Partial<
      CaseSurfaceDescriptor
    >

  return (
    typeof candidate.id ===
      'string' &&
    Array.isArray(
      candidate.layers,
    ) &&
    candidate.layers.every(
      (layer) =>
        typeof layer ===
          'string' &&
        layer.length > 0,
    ) &&
    (
      candidate.footer === null ||
      typeof candidate.footer ===
        'string'
    ) &&
    (
      candidate.serial === null ||
      typeof candidate.serial ===
        'string'
    )
  )
}

/*
 * Resolve a Case front/back descriptor plus
 * all layer assets completely offline.
 */
export async function resolveCaseSurface(
  id: string,
): Promise<ResolvedCaseSurface> {
  const descriptorRecord =
    await getStudioAsset(
      caseSurfaceKey(
        id,
      ),
    )

  if (!descriptorRecord?.blob) {
    throw new Error(
      `Studio case surface is missing: ${id}`,
    )
  }

  let raw:
    unknown

  try {
    raw =
      JSON.parse(
        await descriptorRecord
          .blob
          .text(),
      )
  } catch {
    throw new Error(
      `Invalid Studio case surface descriptor: ${id}`,
    )
  }

  if (
    !isCaseSurfaceDescriptor(
      raw,
    )
  ) {
    throw new Error(
      `Unsupported Studio case surface descriptor: ${id}`,
    )
  }

  const urls =
    new Map<string, string>()

  try {
    const layers:
      string[] = []

    for (
      const source
      of raw.layers
    ) {
      layers.push(
        await studioAssetUrl(
          runtimeAssetKey(
            source,
          ),
          urls,
        ),
      )
    }

    return {
      id:
        raw.id,

      layers,

      footer:
        raw.footer,

      serial:
        raw.serial,

      dispose: () =>
        disposeUrls(
          urls,
        ),
    }
  } catch (error) {
    disposeUrls(
      urls,
    )

    throw error
  }
}
