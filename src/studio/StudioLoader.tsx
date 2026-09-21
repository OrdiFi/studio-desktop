type Props = {
  label?: string
  size?: number
}

export default function StudioLoader({
  label = 'Loading…',
  size = 54,
}: Props) {
  return (
    <div
      className="studio-loader"
      role="status"
      aria-live="polite"
    >
      <img
        src="/btc-loader.webp"
        alt=""
        draggable={false}
        style={{
          width: size,
          height: size,
        }}
      />

      {label ? (
        <span>{label}</span>
      ) : null}
    </div>
  )
}
