import { useEffect, useState } from 'react'
import type { Work } from '../../lib/gallery-curation'

type GalleryState = {
  /** Works currently in the Vercel Blob store. Empty until the feed loads. */
  works: Work[]
  loading: boolean
  /** True once the live `/api/gallery` feed has responded successfully. */
  live: boolean
  error: boolean
}

/**
 * Fetches the live gallery from `/api/gallery` (which lists Vercel Blob) and
 * renders only what is actually in the store — there is no bundled snapshot, so
 * a file deleted from Blob disappears from the site and can never reappear.
 * Adds/deletes in Blob show up here within ~60s (the feed's edge cache).
 */
export function useGallery(): GalleryState {
  const [state, setState] = useState<GalleryState>({
    works: [],
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
        setState({ works: live, loading: false, live: true, error: false })
      })
      .catch(() => {
        if (cancelled) return
        // No snapshot to fall back to — leave the gallery empty rather than
        // resurrecting deleted media.
        setState({ works: [], loading: false, live: false, error: true })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
