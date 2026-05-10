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
    let lastFetch = 0
    let lastSeen = parseInt(localStorage.getItem('portfolio_data_updated') ?? '0')

    const check = () => {
      if (!fetcherRef.current) return
      const now = Date.now()
      const saved = parseInt(localStorage.getItem('portfolio_data_updated') ?? '0')
      const dataChanged = saved > lastSeen
      if (dataChanged || now - lastFetch > 60_000) {
        lastSeen = saved
        lastFetch = now
        setTick((t) => t + 1)
      }
    }

    // Same tab coming back into focus
    window.addEventListener('focus', check)
    // Admin saved in a different tab
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key === 'portfolio_data_updated') check()
    })
    return () => {
      window.removeEventListener('focus', check)
      window.removeEventListener('storage', check as EventListener)
    }
  }, [])

  return { data, loading, error, refetch }
}
