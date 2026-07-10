/* ----------------------------------------------------------------------------
   GET /api/gallery — live gallery feed (Vercel serverless function)

   Lists the Vercel Blob store server-side and returns shaped works as JSON, so
   the front-end reflects Blob changes (adds/deletes) without a rebuild. The
   BLOB_READ_WRITE_TOKEN must be set in the Vercel project's Environment
   Variables — it is read here on the server and never sent to the browser.

   SELF-CONTAINED ON PURPOSE. This file imports only `@vercel/blob` (a real
   package Vercel's tracer bundles reliably) and inlines its shaping logic. It
   must NOT import from `../src/*`: the project is `"type": "module"`, so the
   deployed function is ESM, and Vercel does not bundle local files outside
   `api/` into the lambda — an import into `src/` resolves at build but throws
   ERR_MODULE_NOT_FOUND at runtime (FUNCTION_INVOCATION_FAILED).

   The shaping logic + curation map below are duplicated from
   `src/lib/gallery-curation.ts`, which the front-end still uses for the `Work`
   type and hero picking. Keep the `curation` map here in sync when you curate
   new uploads. If the two drift, the only effect is server-side titles falling
   back to the auto-derived name — the site keeps working.
---------------------------------------------------------------------------- */

import { list } from '@vercel/blob'

// Minimal structural types so we don't depend on @vercel/node.
type Res = {
  setHeader(name: string, value: string): void
  status(code: number): Res
  json(body: unknown): void
}

type MediaType = 'image' | 'video'

type Work = {
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

type Meta = { title: string; category: string; aspect: string; order: number }
type BlobInput = { pathname: string; url: string; uploadedAt: number }

const PREFIX = 'fluxads/'
const VIDEO_EXT = new Set(['mp4', 'webm', 'mov', 'm4v'])

/** Filename without its directory or extension — the curation lookup key. */
const stemOf = (pathname: string): string => {
  const base = pathname.slice(pathname.lastIndexOf('/') + 1)
  const dot = base.lastIndexOf('.')
  return dot === -1 ? base : base.slice(0, dot)
}

const typeForFile = (pathname: string): MediaType => {
  const ext = pathname.slice(pathname.lastIndexOf('.') + 1).toLowerCase()
  return VIDEO_EXT.has(ext) ? 'video' : 'image'
}

/** Best-effort title for an uncurated upload, derived from its filename. */
const humanize = (stem: string): string => {
  const cleaned = stem
    .replace(/[_-]+/g, ' ')
    .replace(/\b[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\b/gi, '') // uuids
    .replace(/\b\d{6,}\b/g, '') // long ids / timestamps
    .replace(/\s+/g, ' ')
    .trim()
  if (!cleaned) return 'New Work'
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase())
}

/* Curation overlay. Keyed by file stem (name without extension). The `order`
   pins curated items into a deliberate masonry sequence; uncurated uploads are
   surfaced ahead of these, newest first. Mirror of src/lib/gallery-curation.ts. */
const curation: Record<string, Meta> = {
  'africanwear': { title: 'African Wear — Editorial', category: 'Fashion', aspect: 'aspect-[9/16]', order: -2 },
  'african-mum': { title: 'African Mum — Motion', category: 'Advertising', aspect: 'aspect-[16/9]', order: -1 },
  'A_cinematic_4K_vertical_9_16_202605051608': { title: 'Mother & Child — Cinematic', category: 'Advertising', aspect: 'aspect-[9/16]', order: 0 },
  '04afa4de-9b0c-4e30-97c8-f1f1f5fee9b6': { title: 'Studio Beauty Portrait', category: 'Beauty', aspect: 'aspect-[3/4]', order: 1 },
  'doc_2026-06-15_13-45-51': { title: 'Wrap Dress — Motion Try-On', category: 'Fashion', aspect: 'aspect-[9/16]', order: 2 },
  'menswear-portrait': { title: 'Menswear — Studio Portrait', category: 'Fashion', aspect: 'aspect-[4/5]', order: 3 },
  '81c65654-d7aa-4e88-8de8-9ca45eb3b814': { title: 'Laundry Capsules — Product Ad', category: 'Product', aspect: 'aspect-[9/16]', order: 4 },
  'A_premium_4K_vertical_9_16_202605051519 (2)': { title: 'Skincare — Premium Still', category: 'Beauty', aspect: 'aspect-[9/16]', order: 5 },
  'freepik_use_the_uploaded_image_as_referencetransform_the_s_15439': { title: 'Court Side — Sport Editorial', category: 'Fashion', aspect: 'aspect-[9/16]', order: 6 },
  'menswear-coastal-linen': { title: 'Coastal Linen — Motion', category: 'Fashion', aspect: 'aspect-[9/16]', order: 7 },
  'menswear-profile': { title: 'Profile — Cinematic Light', category: 'Fashion', aspect: 'aspect-[9/16]', order: 8 },
  'menswear-beach-walk': { title: 'Beach Walk — Editorial', category: 'Fashion', aspect: 'aspect-[9/16]', order: 9 },
  'rEMOVE_cookies_by_crumbel_text_202605052153': { title: 'Cookie Crumbles — Food Ad', category: 'Food & Beverage', aspect: 'aspect-[3/4]', order: 10 },
  '47c3ebf5-879b-494a-b354-82ba1f0b7dd2': { title: 'Celebration — Beverage Ad', category: 'Advertising', aspect: 'aspect-[9/16]', order: 11 },
  '37fba723-4279-48c7-89bd-19d88e3f73fe': { title: 'Clean & Fresh — Campaign', category: 'Product', aspect: 'aspect-[9/16]', order: 12 },
  'f131c548-b327-42bb-9003-03544d3677cb': { title: 'Coastal — Menswear', category: 'Fashion', aspect: 'aspect-square', order: 13 },
  'menswear-knitwear-orbit': { title: 'Knitwear — Orbit Shot', category: 'Fashion', aspect: 'aspect-[9/16]', order: 14 },
  'menswear-closeup': { title: 'Knit Texture — Close-Up', category: 'Fashion', aspect: 'aspect-[9/16]', order: 15 },
  'menswear-tailoring': { title: 'Tailoring — Steady Medium', category: 'Fashion', aspect: 'aspect-[9/16]', order: 16 },
  'menswear-barefoot': { title: 'Barefoot — Scene Direction', category: 'Fashion', aspect: 'aspect-[9/16]', order: 17 },
  'remove_all_text_2K_202606151141': { title: 'Team Lookbook — Apparel', category: 'E-Commerce', aspect: 'aspect-[16/9]', order: 18 },
  '3408c83c-3d8b-4cc2-880d-845ca42c7779': { title: 'Natural Glow Headshot', category: 'Beauty', aspect: 'aspect-[4/5]', order: 19 },
  'ebad76c5-4b66-4e79-ba1c-d9177bb9bbd3': { title: 'Together — Lifestyle Set', category: 'Advertising', aspect: 'aspect-[9/16]', order: 20 },
  'menswear-calm-presence': { title: 'Calm Presence — Dolly In', category: 'Fashion', aspect: 'aspect-[9/16]', order: 21 },
  'menswear-over-shoulder': { title: 'Lounge — Over the Shoulder', category: 'Fashion', aspect: 'aspect-[9/16]', order: 22 },
  'menswear-tight-crop': { title: 'Tight Crop — Portrait', category: 'Fashion', aspect: 'aspect-[9/16]', order: 23 },
  'menswear-open-shirt': { title: 'Open Shirt — Push & Tilt', category: 'Fashion', aspect: 'aspect-[9/16]', order: 24 },
  'the_exact_same_two_girls_202605051524': { title: 'Duo — Product Feature', category: 'Advertising', aspect: 'aspect-[9/16]', order: 25 },
  'freepik__tile-1__16375': { title: 'Physique — Retouch & Restore', category: 'Restoration', aspect: 'aspect-[16/9]', order: 26 },
  '9b43a469-c0f2-436e-b1e8-11a31dd0a43e': { title: 'On-Pack — Food Promo', category: 'Food & Beverage', aspect: 'aspect-[9/16]', order: 27 },
  '3b35c68c-e266-4b37-8e87-31fc93b00f46': { title: 'Family Living — Lifestyle', category: 'Advertising', aspect: 'aspect-[9/16]', order: 28 },
}

/** Shape a raw Blob listing into ordered gallery works (newest uncurated first). */
function shapeBlobs(blobs: BlobInput[]): Work[] {
  const NEW = Number.MIN_SAFE_INTEGER // uncurated uploads sort first (newest first)

  const rows = blobs
    .filter((b) => b.pathname && !b.pathname.endsWith('/')) // skip folder markers
    .map((b) => {
      const stem = stemOf(b.pathname)
      const meta = curation[stem]
      const work: Work = {
        id: stem || b.pathname,
        title: meta?.title ?? humanize(stem),
        category: meta?.category ?? 'New Work',
        type: typeForFile(b.pathname),
        aspect: meta?.aspect ?? '',
        src: b.url,
        uploadedAt: b.uploadedAt,
      }
      return { work, order: meta?.order ?? NEW }
    })

  rows.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return (b.work.uploadedAt ?? 0) - (a.work.uploadedAt ?? 0)
  })

  return rows.map((r) => r.work)
}

/** List the whole Blob store (paging through cursors) and shape it. */
async function loadGallery(token: string): Promise<Work[]> {
  const blobs: BlobInput[] = []
  let cursor: string | undefined

  do {
    const res = await list({ prefix: PREFIX, limit: 1000, cursor, token })
    for (const b of res.blobs) {
      blobs.push({ pathname: b.pathname, url: b.url, uploadedAt: b.uploadedAt.getTime() })
    }
    cursor = res.hasMore ? res.cursor : undefined
  } while (cursor)

  return shapeBlobs(blobs)
}

export default async function handler(_req: unknown, res: Res) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) {
      // Not a crash — surface the most common misconfig explicitly.
      res.status(500).json({
        works: [],
        error:
          'BLOB_READ_WRITE_TOKEN is not set in this environment. Add it in the Vercel project → Settings → Environment Variables (Production), then redeploy.',
      })
      return
    }

    const works = await loadGallery(token)

    // Cache at the edge for a minute; serve stale while revalidating so the
    // gallery stays fast but still picks up Blob changes within ~60s.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    res.status(200).json({ works })
  } catch (err) {
    console.error('[gallery] list failed:', err)
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    res.status(500).json({ works: [], error: `Failed to load gallery — ${message}` })
  }
}
