import {
  useEffect,
  useState,
} from 'react'

import {
  getStudioAsset,
} from './localAssetDb'

import type {
  StudioThumbnailRef,
} from './studioState'

type Props = {
  thumbnail:
    | StudioThumbnailRef
    | null
  alt?: string
}

export default function StudioThumbnail({
  thumbnail,
  alt = '',
}: Props) {
  const [src, setSrc] =
    useState<string | null>(null)

  const [missing, setMissing] =
    useState(false)

  useEffect(() => {
    let cancelled = false
    let objectUrl:
      string | null = null

    setSrc(null)
    setMissing(false)

    if (!thumbnail?.key) {
      setMissing(true)
      return
    }

    async function load() {
      try {
        const record =
          await getStudioAsset(
            thumbnail!.key,
          )

        if (cancelled) return

        if (!record?.blob) {
          setMissing(true)
          return
        }

        objectUrl =
          URL.createObjectURL(
            record.blob,
          )

        setSrc(objectUrl)
      } catch {
        if (!cancelled) {
          setMissing(true)
        }
      }
    }

    void load()

    return () => {
      cancelled = true

      if (objectUrl) {
        URL.revokeObjectURL(
          objectUrl,
        )
      }
    }
  }, [
    thumbnail?.key,
    thumbnail?.version,
  ])

  if (!src) {
    return (
      <div
        className={
          missing
            ? 'studio-thumbnail is-missing'
            : 'studio-thumbnail is-loading'
        }
      >
        {missing
          ? 'No thumbnail'
          : ''}
      </div>
    )
  }

  return (
    <img
      className="studio-thumbnail"
      src={src}
      alt={alt}
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  )
}
