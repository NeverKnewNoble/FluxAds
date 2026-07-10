/* ----------------------------------------------------------------------------
   Flux Ads — gallery types + hero picking (client-side)

   The canonical `Work` shape the UI renders, plus `pickHeroTiles` for the hero
   collage. Works arrive already-shaped from `/api/gallery` (see api/gallery.ts,
   which owns the Blob listing, curation map, and shaping) — the front-end never
   lists Blob itself, so none of that server logic lives here.
---------------------------------------------------------------------------- */

export type MediaType = 'image' | 'video'

export type Work = {
  id: string
  title: string
  category: string
  type: MediaType
  /** Tailwind aspect-ratio class for the masonry tile, or '' to flow naturally. */
  aspect: string
  /** Public CDN URL. */
  src: string
  /** Epoch ms the file was uploaded to Blob (used to surface new work first). */
  uploadedAt?: number
}

export type HeroTile = { tag: string; type: MediaType; src: string }

/** Choose three standout pieces for the hero collage from live works. */
export function pickHeroTiles(works: Work[]): HeroTile[] {
  const images = works.filter((w) => w.type === 'image')
  const videos = works.filter((w) => w.type === 'video')
  const toTile = (w: Work): HeroTile => ({ tag: w.category, type: w.type, src: w.src })

  const chosen: Work[] = []
  const add = (w?: Work) => {
    if (w && !chosen.includes(w)) chosen.push(w)
  }
  add(images[0])
  add(videos[0])
  add(images[1])
  // Pad from anything available if the store is small.
  for (const w of works) {
    if (chosen.length >= 3) break
    add(w)
  }
  return chosen.slice(0, 3).map(toTile)
}
