import { updateStudioState } from './StudioStore'

/**
 * User-managed metadata only. No wallet fields, UTXO structures, notes, drafts,
 * folder state or thumbnails are altered.
 *
 * Format:
 * {"items":[{"inscriptionId":"<64 hex>i0","name":"Item name","collection":"Collection name"}]}
 */
type NamedItem = { inscriptionId: string; name?: string; collection?: string }
const ID_PATTERN = /^[a-fA-F0-9]{64}i\d{1,12}$/

function parseMetadata(text: string): NamedItem[] {
  const json: unknown = JSON.parse(text)
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    throw new Error('Expected a JSON object with an items array')
  }
  const items = (json as Record<string, unknown>).items
  if (!Array.isArray(items) || items.length > 10000) {
    throw new Error('Metadata JSON must contain an items array (maximum 10,000 entries)')
  }
  const seen = new Set<string>()
  return items.map((raw, index) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      throw new Error(`Invalid item at index ${index}`)
    }
    const item = raw as Record<string, unknown>
    const id = item.inscriptionId
    if (typeof id !== 'string' || !ID_PATTERN.test(id)) {
      throw new Error(`Invalid inscriptionId at index ${index}`)
    }
    if (seen.has(id)) throw new Error(`Duplicate inscriptionId: ${id}`)
    seen.add(id)
    for (const field of ['name', 'collection'] as const) {
      if (item[field] !== undefined && (typeof item[field] !== 'string' || (item[field] as string).length > 200)) {
        throw new Error(`Invalid ${field} at index ${index}`)
      }
    }
    if (item.name === undefined && item.collection === undefined) {
      throw new Error(`Item ${index} has no name or collection`)
    }
    return { inscriptionId: id, name: item.name as string | undefined, collection: item.collection as string | undefined }
  })
}

export function importItemMetadataJson(text: string): { updated: number; unchanged: number; missing: number } {
  const entries = parseMetadata(text)
  let updated = 0, unchanged = 0, missing = 0
  updateStudioState(current => {
    const nextItems = { ...current.items }
    for (const { inscriptionId, name, collection } of entries) {
      const item = nextItems[inscriptionId]
      if (!item) { missing++; continue }
      const nextName = name === undefined ? item.name : name.trim() || null
      const nextCollection = collection === undefined ? item.collection : collection.trim() || null
      if (nextName === item.name && nextCollection === item.collection) {
        unchanged++; continue
      }
      nextItems[inscriptionId] = { ...item, name: nextName, collection: nextCollection }
      updated++
    }
    return updated ? { ...current, items: nextItems } : current
  })
  return { updated, unchanged, missing }
}
