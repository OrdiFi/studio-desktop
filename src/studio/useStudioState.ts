import {
  useEffect,
  useState,
} from 'react'

import {
  readStudioState,
  type StudioStateV1,
} from './studioState'

export function useStudioState():
  StudioStateV1 {
  const [state, setState] =
    useState<StudioStateV1>(
      () => readStudioState(),
    )

  useEffect(() => {
    function refresh() {
      setState(readStudioState())
    }

    window.addEventListener(
      'ordifi:studio-state:changed',
      refresh,
    )

    window.addEventListener(
      'storage',
      refresh,
    )

    return () => {
      window.removeEventListener(
        'ordifi:studio-state:changed',
        refresh,
      )

      window.removeEventListener(
        'storage',
        refresh,
      )
    }
  }, [])

  return state
}
