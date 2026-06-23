import { useEffect, useState } from 'react'
import { works as fallbackWorks } from './content'
import type { Work } from '../../lib/gallery-curation'

type GalleryState = {
  /** Current works — starts as the bundled fallback, swaps to live on load. */
  works: Work[]
  loading: boolean
  /** True once the live `/api/gallery` feed has populated the list. */
  live: boolean
  error: boolean
}

/**
 * Fetches the live gallery from `/api/gallery` (which lists Vercel Blob) and
 * falls back to the bundled snapshot for instant first paint and resilience if
 * the request fails. Adds/deletes in Blob appear here without a redeploy.
 */
export function useGallery(): GalleryState {
  const [state, setState] = useState<GalleryState>({
    works: fallbackWorks,
    loading: true,
    live: false,
    error: false,
  })

  useEffect(() => {
    let cancelled = false

    fetch('/api/gallery')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: { works?: Work[] }) => {
        if (cancelled) return
        const live = Array.isArray(data.works) ? data.works : []
        setState({
          works: live.length ? live : fallbackWorks,
          loading: false,
          live: live.length > 0,
          error: false,
        })
      })
      .catch(() => {
        if (cancelled) return
        // Keep the fallback on screen rather than blanking the gallery.
        setState((s) => ({ ...s, loading: false, error: true }))
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
