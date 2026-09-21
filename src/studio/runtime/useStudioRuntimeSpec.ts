import {
  useEffect,
  useState,
} from 'react'

import {
  resolveStudioRuntimeSpec,
} from './studioRuntimeAssets'

type RuntimeSpecState = {
  spec: any | null
  loading: boolean
  error: string | null
}

export default function useStudioRuntimeSpec(
  sourceSpec: unknown,
) {
  const [
    state,
    setState,
  ] = useState<RuntimeSpecState>({
    spec: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled =
      false

    let dispose:
      (() => void) | null =
      null

    setState({
      spec: null,
      loading: true,
      error: null,
    })

    async function load() {
      try {
        const resolved =
          await resolveStudioRuntimeSpec(
            sourceSpec,
          )

        if (cancelled) {
          resolved.dispose()
          return
        }

        dispose =
          resolved.dispose

        setState({
          spec:
            resolved.spec,

          loading:
            false,

          error:
            null,
        })
      } catch (error) {
        if (cancelled) {
          return
        }

        setState({
          spec: null,
          loading: false,

          error:
            error instanceof Error
              ? error.message
              : 'Studio runtime asset resolution failed.',
        })
      }
    }

    void load()

    return () => {
      cancelled =
        true

      dispose?.()
    }
  }, [
    sourceSpec,
  ])

  return state
}
