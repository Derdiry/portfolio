import { useState, useEffect, useCallback, useRef } from 'react'

export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useApi<T>(
  fetcher: (() => Promise<T>) | null,
  deps: unknown[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(fetcher !== null)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (!fetcherRef.current) return
    let cancelled = false
    setLoading(true)
    setError(null)

    fetcherRef.current()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps])

  useEffect(() => {
    let last = 0
    const onFocus = () => {
      const now = Date.now()
      if (fetcherRef.current && now - last > 60_000) {
        last = now
        setTick((t) => t + 1)
      }
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  return { data, loading, error, refetch }
}
