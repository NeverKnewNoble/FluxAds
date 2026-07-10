/* ----------------------------------------------------------------------------
   GET /api/gallery — live gallery feed (Vercel serverless function)

   Lists the Vercel Blob store server-side and returns shaped works as JSON, so
   the front-end reflects Blob changes (adds/deletes) without a rebuild. The
   BLOB_READ_WRITE_TOKEN must be set in the Vercel project's Environment
   Variables — it is read here on the server and never sent to the browser.

   `loadGallery` is imported STATICALLY (not `await import()`): Vercel's function
   bundler inlines static local imports into the deployed bundle, whereas a
   dynamic import of a file outside `api/` is left as an unresolved runtime
   require (`Cannot find module '/var/task/src/lib/gallery-server'`). Runtime
   failures from the Blob API are still caught below and returned as readable
   JSON instead of a hard FUNCTION_INVOCATION_FAILED crash.
---------------------------------------------------------------------------- */

import { loadGallery } from '../src/lib/gallery-server'

// Minimal structural types so we don't depend on @vercel/node.
type Res = {
  setHeader(name: string, value: string): void
  status(code: number): Res
  json(body: unknown): void
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
