import { invoke } from '@tauri-apps/api/core'
import { getStudioAsset, setStudioAsset } from './localAssetDb'
import { updateStudioState } from './StudioStore'
import type { StudioThumbnailRef } from './studioState'

// Ingest the RAW content of each inscription. Images are also used as
// thumbnails. HTML/JSON/text remain inert cached Blobs (never executed).
const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'])
const MIME_TYPES = new Set([...IMAGE_TYPES, 'text/html', 'application/json', 'text/plain', 'image/svg+xml'])
type ContentJob = { id: string; mime: string }

function bytesFromBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function normalizedMime(mime: string): string {
  return mime.split(';', 1)[0]?.trim().toLowerCase() ?? ''
}

// JSON/text content receives a safe local static preview, without executing it.
function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
function textualPreview(text: string, mime: string): Blob {
  const lines = text.replace(/[\x00-\x1f]/g, ' ').slice(0, 400)
    .match(/.{1,38}/g)?.slice(0, 11) ?? []
  const label = mime === 'application/json' ? 'JSON' : 'TEXT'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">
  <rect width="480" height="480" fill="#1a1f27"/>
  <text x="24" y="43" fill="#f7931a" font-family="monospace" font-size="22">${label}</text>
  ${lines.map((line, i) => `<text x="24" y="${82 + i * 30}" fill="#e8edf3" font-family="monospace" font-size="16">${escapeXml(line)}</text>`).join('')}
  </svg>`
  return new Blob([svg], { type: 'image/svg+xml' })
}

async function importOne(job: ContentJob): Promise<'image' | 'other' | 'unsupported'> {
  const mime = normalizedMime(job.mime)
  if (!MIME_TYPES.has(mime)) return 'unsupported'
  const key = `wallet:bitcoin:content:${job.id}`
  const version = '1'
  let cached = await getStudioAsset(key)
  if (!cached) {
    const encoded = await invoke<string>('fetch_ordinal_content', { inscriptionId: job.id })
    const bytes = bytesFromBase64(encoded)
    if (!bytes.length || bytes.length > 16 * 1024 * 1024) throw new Error('Invalid content size')
    await setStudioAsset({ key, mime, version, blob: new Blob([bytes], { type: mime }), updatedAt: Date.now() })
    cached = await getStudioAsset(key)
    if (!cached) throw new Error('Local RAW cache write failed')
  }

  let ref: StudioThumbnailRef
  if (IMAGE_TYPES.has(mime) || mime === 'image/svg+xml') {
    ref = { key, mime, version }
  } else {
    const previewKey = `wallet:bitcoin:preview:v2:${job.id}`
    let preview = await getStudioAsset(previewKey)
    if (!preview) {
      let blob: Blob
      if (mime === 'text/html') {
        // Browser screenshot captures HTML art as actually rendered, not source code.
        const encoded = await invoke<string>('render_ordinal_preview', { inscriptionId: job.id })
        blob = new Blob([bytesFromBase64(encoded)], { type: 'image/png' })
      } else {
        blob = textualPreview(await cached.blob.text(), mime)
      }
      await setStudioAsset({ key: previewKey, mime: blob.type, version, blob, updatedAt: Date.now() })
      preview = await getStudioAsset(previewKey)
      if (!preview) throw new Error('Local thumbnail cache write failed')
    }
    ref = { key: previewKey, mime: preview.mime, version }
  }
  updateStudioState(current => {
    const item = current.items[job.id]
    if (!item || (item.rawThumbnail && !item.rawThumbnail.key.startsWith("wallet:bitcoin:preview:"))) return current // Preserve user/StudioSync previews.
    return { ...current, items: { ...current.items, [job.id]: { ...item, rawThumbnail: ref } } }
  })
  return IMAGE_TYPES.has(mime) || mime === 'image/svg+xml' ? 'image' : 'other'
}

export async function hydrateWalletThumbnails(
  jobs: ContentJob[],
  onProgress: (done: number, total: number, failed: number) => void,
): Promise<{ saved: number; failed: number; skipped: number; errors: string[]; images: number; other: number }> {
  let next = 0
  let done = 0
  let saved = 0
  let failed = 0
  let skipped = 0
  let images = 0
  let other = 0
  const errors = new Map<string, number>()
  // Modest concurrency to avoid hammering public or private ord servers.
  const workers = Array.from({ length: Math.min(1, jobs.length) }, async () => {
    while (next < jobs.length) {
      const job = jobs[next++]!
      try {
        const result = await importOne(job)
        if (result === 'unsupported') skipped++
        else { saved++; if (result === 'image') images++; else other++ }
      } catch (error) {
        failed++
        const message = error instanceof Error ? error.message : String(error)
        errors.set(message, (errors.get(message) ?? 0) + 1)
        console.warn('[OrdiFi RAW content]', job.id, message)
      }
      done++
      onProgress(done, jobs.length, failed)
    }
  })
  await Promise.all(workers)
  return {
    saved, failed, skipped, images, other,
    errors: [...errors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([message, count]) => `${count}Ã— ${message}`),
  }
}
