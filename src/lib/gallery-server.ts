/* ----------------------------------------------------------------------------
   Flux Ads — gallery loader (server-only)

   Lists the Blob store with the read/write token (which stays on the server),
   then shapes the result into the `Work[]` the UI consumes. Used by the Vercel
   serverless function (api/gallery.ts) and by the Vite dev middleware so that
   `yarn dev` behaves like production. Never import this from client code — it
   pulls in @vercel/blob and reads the secret token.
---------------------------------------------------------------------------- */
import { list } from '@vercel/blob'
import { shapeBlobs, type BlobInput, type Work } from './gallery-curation'

const PREFIX = 'fluxads/'

export async function loadGallery(token?: string): Promise<Work[]> {
  const blobs: BlobInput[] = []
  let cursor: string | undefined

  do {
    const res = await list({
      prefix: PREFIX,
      limit: 1000,
      cursor,
      ...(token ? { token } : {}),
    })
    for (const b of res.blobs) {
      blobs.push({ pathname: b.pathname, url: b.url, uploadedAt: b.uploadedAt.getTime() })
    }
    cursor = res.hasMore ? res.cursor : undefined
  } while (cursor)

  return shapeBlobs(blobs)
}
