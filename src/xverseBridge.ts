import { request, AddressPurpose } from 'sats-connect'

const button = document.getElementById('import') as HTMLButtonElement
const status = document.getElementById('status') as HTMLElement
const token = location.hash.slice(1)
history.replaceState(null, '', '/')

function message(s: string) { status.textContent = s }
function errorText(e: unknown) { return e instanceof Error ? e.message : String(e) }

button.onclick = async () => {
  button.disabled = true
  try {
    if (!/^[a-f0-9-]{36}$/.test(token)) throw new Error('Import session expired. Restart from Studio.')
    message('Connecting to Xverse...')
    const connected = await request('wallet_connect', {
      addresses: [AddressPurpose.Ordinals, AddressPurpose.Payment],
      message: 'OrdiFi Studio: one-time, read-only import',
    })
    if (connected.status !== 'success') throw new Error(connected.error?.message ?? 'Connection declined')
    const accounts = connected.result.addresses
    const ordinal = accounts.find(a => a.purpose === AddressPurpose.Ordinals)
    if (!ordinal?.address) throw new Error('No Ordinals address was returned')
    const network = connected.result.network?.bitcoin?.name ?? 'Mainnet'
    if (String(network).toLowerCase() !== 'mainnet') throw new Error('Only Bitcoin mainnet is supported')

    const items: Record<string, unknown>[] = []
    let total = 0
    let offset = 0
    do {
      message(`Reading wallet inscriptions: ${items.length}${total ? ' / ' + total : ''}`)
      const response = await request('ord_getInscriptions', { limit: 100, offset })
      if (response.status !== 'success') throw new Error(response.error?.message ?? 'Read failed')
      total = Number(response.result.total)
      if (!Number.isSafeInteger(total) || total < 0 || total > 100000) throw new Error('Invalid wallet count')
      const page = response.result.inscriptions as unknown as Record<string, unknown>[]
      if (!Array.isArray(page) || (page.length === 0 && items.length < total)) throw new Error('Incomplete wallet response')
      items.push(...page)
      offset += page.length
      if (items.length > total) throw new Error('Wallet changed during import. Retry from Studio.')
    } while (items.length < total)

    const payload = {
      schema: 'ordifi-xverse-import', version: 1, blockchain: 'bitcoin',
      walletAddress: ordinal.address, network: 'Mainnet', exportedAt: Date.now(), total,
      inscriptions: items.map(item => ({
        inscriptionId: item.inscriptionId,
        inscriptionNumber: item.inscriptionNumber,
        collectionName: item.collectionName ?? null,
        contentType: item.contentType,
        address: item.address,
        output: item.output,
        offset: item.offset,
        postage: item.postage,
      })),
    }
    message(`Sending ${total} inscriptions to Studio...`)
    const transfer = await fetch('/import', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-OrdiFi-Token': token },
      body: JSON.stringify(payload), cache: 'no-store',
    })
    if (!transfer.ok) throw new Error(`Studio did not accept data: HTTP ${transfer.status}`)
    message(`${total} inscriptions sent successfully. Return to Studio to review and confirm the import. You can close this tab.`)
  } catch (e) {
    message(`Import unsuccessful: ${errorText(e)}\nReturn to Studio and restart the import.`)
  } finally {
    button.disabled = false
  }
}
