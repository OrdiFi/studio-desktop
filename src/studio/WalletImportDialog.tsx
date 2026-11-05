import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { updateStudioState } from './StudioStore'
import { readStudioState } from './studioState'
import { hydrateWalletThumbnails } from './walletThumbnails'
import type { StudioItemSnapshot, StudioSource } from './studioState'
import bitcoinLogo from '../assets/wallet-import/bitcoin.png'
import solanaLogo from '../assets/wallet-import/solana.png'
import ethereumLogo from '../assets/wallet-import/ethereum.png'
import xverseLogo from '../assets/wallet-import/xverse.png'
import './WalletImportDialog.css'

type WalletRecord = {
  inscriptionId: string
  inscriptionNumber: string
  collectionName?: string | null
  contentType: string
  address: string
  output: string
  offset: number
  postage: number
}
type WalletFile = {
  schema: 'ordifi-xverse-import'
  version: 1
  blockchain: 'bitcoin'
  walletAddress: string
  network?: string
  exportedAt: number
  total: number
  inscriptions: WalletRecord[]
}

const inscriptionPattern = /^[a-fA-F0-9]{64}i\d+$/
const outpointPattern = /^[a-fA-F0-9]{64}:\d+$/
const colors = ['#f7931a', '#3b82f6', '#10b981', '#a855f7', '#ef4444', '#eab308']

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function parseWalletFile(value: unknown): WalletFile {
  if (!isRecord(value) || value.schema !== 'ordifi-xverse-import' || value.version !== 1 || value.blockchain !== 'bitcoin' || typeof value.walletAddress !== 'string' || !value.walletAddress.trim() || !Array.isArray(value.inscriptions) || value.inscriptions.length > 100000 || typeof value.total !== 'number' || !Number.isSafeInteger(value.total) || typeof value.exportedAt !== 'number' || !Number.isFinite(value.exportedAt)) {
    throw new Error('Not a supported Xverse wallet response.')
  }
  if (typeof value.network === 'string' && !/mainnet/i.test(value.network)) {
    throw new Error('This version supports Bitcoin mainnet only.')
  }
  const seen = new Set<string>()
  const items: WalletRecord[] = []
  for (const entry of value.inscriptions) {
    if (!isRecord(entry) || typeof entry.inscriptionId !== 'string' || !inscriptionPattern.test(entry.inscriptionId) || typeof entry.address !== 'string' || entry.address !== value.walletAddress || typeof entry.output !== 'string' || !outpointPattern.test(entry.output) || typeof entry.contentType !== 'string' || typeof entry.inscriptionNumber !== 'string' || !Number.isSafeInteger(Number(entry.inscriptionNumber)) || typeof entry.offset !== 'number' || !Number.isSafeInteger(entry.offset) || entry.offset < 0 || typeof entry.postage !== 'number' || !Number.isSafeInteger(entry.postage) || entry.postage < 0) {
      throw new Error('Wallet response contains invalid inscription information.')
    }
    if (seen.has(entry.inscriptionId)) throw new Error('Duplicate inscription detected in wallet response.')
    seen.add(entry.inscriptionId)
    items.push({
      inscriptionId: entry.inscriptionId,
      inscriptionNumber: entry.inscriptionNumber,
      collectionName: typeof entry.collectionName === 'string' ? entry.collectionName.slice(0, 200) : null,
      contentType: entry.contentType.slice(0, 120),
      address: entry.address,
      output: entry.output,
      offset: entry.offset,
      postage: entry.postage,
    })
  }
  if (value.total !== items.length) throw new Error('Incomplete import: item count does not match.')
  return {
    schema: 'ordifi-xverse-import', version: 1, blockchain: 'bitcoin',
    walletAddress: value.walletAddress, network: typeof value.network === 'string' ? value.network : undefined,
    exportedAt: value.exportedAt as number, total: value.total as number, inscriptions: items,
  }
}

export default function WalletImportDialog({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<WalletFile | null>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [label, setLabel] = useState('Xverse Bitcoin')
  const [color, setColor] = useState(colors[0])
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [thumbnailStatus, setThumbnailStatus] = useState('')

  useEffect(() => {
    let active = true
    const cleanup = listen<unknown>('ordifi-wallet-import', event => {
      if (!active) return
      try {
        const parsed = parseWalletFile(event.payload)
        setFile(parsed)
        // Preserve the existing wallet's user-selected label and color on refresh.
        const source = readStudioState().sources.find(s => s.address === parsed.walletAddress)
        if (source) { setLabel(source.label); setColor(source.color) }
        setStatus('Wallet data received. Review the import below.')
        setBusy(false)
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Invalid wallet data.')
        setBusy(false)
      }
    })
    void cleanup.catch(e => setError(String(e)))
    return () => { active = false; void cleanup.then(unlisten => unlisten()).catch(() => {}) }
  }, [])

  async function connect() {
    setError(null)
    setResult(null)
    setFile(null)
    setBusy(true)
    setStatus('Opening Chrome with Xverse...')
    try {
      const response = await invoke<string>('start_wallet_import')
      setStatus(response)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      setBusy(false)
      setStatus('')
    }
  }

  async function commit() {
    if (!file) return
    try {
      let inserted = 0
      let refreshed = 0
      let conflicts = 0
      updateStudioState(current => {
        const now = Date.now()
        const existing = current.sources.find(s => s.address === file.walletAddress)
        const sourceId = existing?.id ?? `bitcoin:${file.walletAddress}`
        const source: StudioSource = existing
          ? { ...existing, label: label.trim() || existing.label, color }
          : { id: sourceId, label: label.trim() || 'Xverse Bitcoin', address: file.walletAddress, enabled: true, color, createdAt: now }
        const items = { ...current.items }
        for (const row of file.inscriptions) {
          const old = items[row.inscriptionId]
          if (old && old.sourceId !== sourceId) {
            conflicts++
            continue
          }
          const n = Number(row.inscriptionNumber)
          const updated: StudioItemSnapshot = {
            id: row.inscriptionId,
            sourceId,
            explorerVisible: old?.explorerVisible ?? true,
            label: old?.label ?? `Inscription #${n}`,
            name: old?.name ?? null,
            collection: old?.collection ?? null,
            number: n,
            mime: row.contentType,
            utxo: row.output,
            satpoint: `${row.output}:${row.offset}`,
            offset: row.offset,
            postage: row.postage,
            ordifiSupported: old?.ordifiSupported ?? false,
            ordifiKind: old?.ordifiKind ?? null,
            serial: old?.serial ?? null,
            slotCount: old?.slotCount ?? null,
            spec: old?.spec ?? null,
            composition: old?.composition ?? null,
            surfacePairs: old?.surfacePairs ?? [],
            rawThumbnail: old?.rawThumbnail ?? null,
            compositionThumbnail: old?.compositionThumbnail ?? null,
            syncedAt: now,
          }
          items[row.inscriptionId] = updated
          if (old) refreshed++
          else inserted++
        }
        return {
          ...current,
          sources: existing ? current.sources.map(s => s.id === sourceId ? source : s) : [...current.sources, source],
          items,
        }
      })
      setResult(`${inserted} added, ${refreshed} refreshed, ${conflicts} ownership conflicts skipped. Local folders, notes, canvases and drafts retained.`)
      setFile(null)
      setThumbnailStatus('Saving RAW inscription content to local Studio cache...')
      const report = await hydrateWalletThumbnails(file.inscriptions.map(row => ({
        id: row.inscriptionId, mime: row.contentType,
      })), (done, total, failed) => {
        setThumbnailStatus(`RAW content: ${done}/${total} processed${failed ? ` · ${failed} failed` : ''}`)
      })
      setThumbnailStatus(`${report.saved} RAW files cached (${report.images} image thumbnails, ${report.other} other files); ${report.failed} failed, ${report.skipped} unsupported. HTML preview rendering is a separate step.${report.errors.length ? ` Errors: ${report.errors.join(' | ')}` : ''}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed.')
    }
  }

  return (
    <div className="wallet-import-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <section className="wallet-import-dialog" role="dialog" aria-modal="true" aria-label="Import from Wallet">
        <header className="wallet-import-heading"><h2>Import from Wallet</h2><button type="button" onClick={onClose} aria-label="Close">×</button></header>
        <p>Import a collection snapshot into Studio. No permanent wallet connection or signing required.</p>
        <h3>Blockchain</h3>
        <div className="wallet-import-options">
          <div className="is-selected" aria-label="Bitcoin available">
            <span className="wallet-import-chain-name"><img src={bitcoinLogo} alt="" /><b>Bitcoin</b></span>
            <small>Available</small>
          </div>
          <div className="is-disabled" aria-label="Solana coming soon">
            <span className="wallet-import-chain-name"><img src={solanaLogo} alt="" /><b>Solana</b></span>
            <small>Coming soon</small>
          </div>
          <div className="is-disabled" aria-label="Ethereum coming soon">
            <span className="wallet-import-chain-name"><img src={ethereumLogo} alt="" /><b>Ethereum</b></span>
            <small>Coming soon</small>
          </div>
        </div>
        <h3>Wallet</h3>
        <div className="wallet-import-provider">
          <span className="wallet-import-wallet-name"><img src={xverseLogo} alt="" /><b>Xverse</b></span>
          <span className="wallet-import-provider-description">Chrome extension · Read-only import</span>
        </div>
        <p className="wallet-import-hint">Studio opens Chrome for a one-time Xverse read. After you approve the wallet access, the data is sent directly into Studio for review. No JSON download is created.</p>
        <button type="button" disabled={busy} onClick={() => void connect()}>{busy ? 'Waiting for Xverse...' : 'Import from Xverse'}</button>
        {status && <p role="status">{status}</p>}
        {file && <div className="wallet-import-preview">
          <h3>Import Preview</h3>
          <p><b>{file.total}</b> inscriptions · {file.network ?? 'Bitcoin'}</p>
          <p className="wallet-import-address">{file.walletAddress}</p>
          <label>Wallet Name<input value={label} maxLength={80} onChange={e => setLabel(e.target.value)} /></label>
          <label>Wallet Color<select value={color} onChange={e => setColor(e.target.value)}>{colors.map(c => <option value={c} key={c}>{c}</option>)}</select></label>
          <p>Existing item notes, thumbnails, folders and draft data are preserved. Missing items are not deleted.</p>
          <button type="button" onClick={() => void commit()}>Import {file.total} Inscriptions to Studio</button>
        </div>}
        {result && <p role="status" className="wallet-import-success">{result}</p>}
        {thumbnailStatus && <p role="status">{thumbnailStatus}</p>}
        {error && <p role="alert" className="wallet-import-error">{error}</p>}
      </section>
    </div>
  )
}
