import StudioThumbnail from './StudioThumbnail'

import type {
  StudioItemSnapshot,
  StudioSource,
} from './studioState'

type Props = {
  item: StudioItemSnapshot
  source: StudioSource
  onClose: () => void
}

function value(
  input:
    | string
    | number
    | null
    | undefined,
) {
  if (
    input === null ||
    input === undefined ||
    input === ''
  ) {
    return '—'
  }

  return String(input)
}

export default function StudioItemInfo({
  item,
  source,
  onClose,
}: Props) {
  return (
    <div
      className="studio-info-backdrop"
      onPointerDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <section
        className="studio-info-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Ordinal information"
      >
        <header className="studio-info-header">
          <div>
            <strong>
              {item.serial ||
                item.label ||
                item.name ||
                'Ordinal'}
            </strong>

            <span>
              Item information
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="studio-info-body">
          <div className="studio-info-thumbnail">
            <StudioThumbnail
              thumbnail={
                (item.compositionThumbnail ?? item.rawThumbnail)
              }
              alt=""
            />

            <div
              className="studio-info-wallet"
              style={{
                borderColor:
                  source.color,
              }}
            >
              <span
                style={{
                  background:
                    source.color,
                }}
              />

              <div>
                <strong>
                  {source.label}
                </strong>

                <small>
                  {source.address}
                </small>
              </div>
            </div>
          </div>

          <div className="studio-info-fields">
            <InfoRow
              label="Wallet"
              value={source.label}
            />

            <InfoRow
              label="Collection"
              value={value(
                item.collection,
              )}
            />

            <InfoRow
              label="Name"
              value={value(
                item.name ||
                  item.label,
              )}
            />

            <InfoRow
              label="Number"
              value={value(
                item.number,
              )}
            />

            <InfoRow
              label="Type"
              value={
                item.ordifiKind ??
                'ordinal'
              }
            />

            <InfoRow
              label="Serial"
              value={value(
                item.serial,
              )}
            />

            <InfoRow
              label="Inscription ID"
              value={item.id}
              mono
            />

            <InfoRow
              label="UTXO"
              value={value(
                item.utxo,
              )}
              mono
            />

            <InfoRow
              label="Satpoint"
              value={value(
                item.satpoint,
              )}
              mono
            />

            <InfoRow
              label="Offset"
              value={value(
                item.offset,
              )}
            />

            <InfoRow
              label="Postage"
              value={
                item.postage === null
                  ? '—'
                  : `${item.postage} sats`
              }
            />

            <InfoRow
              label="MIME"
              value={value(
                item.mime,
              )}
            />

            <InfoRow
              label="Slots"
              value={value(
                item.slotCount,
              )}
            />

            <InfoRow
              label="Last synced"
              value={
                item.syncedAt
                  ? new Date(
                      item.syncedAt,
                    ).toLocaleString()
                  : '—'
              }
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function InfoRow({
  label,
  value: rowValue,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="studio-info-row">
      <span>{label}</span>

      <strong
        className={
          mono
            ? 'is-mono'
            : undefined
        }
      >
        {rowValue}
      </strong>
    </div>
  )
}
