/* ----------------------------------------------------------------------------
   Flux Ads — upload optimized media to Vercel Blob
   Reads media-build/optimized-manifest.json (produced by optimize-media.mjs),
   uploads every optimized file to Vercel Blob under the `fluxads/` prefix, and
   writes src/media-manifest.json mapping each ORIGINAL filename (as used in
   content.ts) to its public CDN URL. The app reads that manifest at build time.

   Setup (one time):
     1. Create a Blob store in your Vercel project:  Storage → Create → Blob
     2. Copy its read/write token, then either:
          export BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"
        or put that line in a .env.local file at the project root.
     3. yarn add @vercel/blob
   Run:
     node scripts/optimize-media.mjs     # if not already run
     node scripts/upload-blob.mjs
---------------------------------------------------------------------------- */
import { put } from '@vercel/blob'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Tiny .env.local loader so you don't have to export the token every shell.
if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('✗ BLOB_READ_WRITE_TOKEN is not set. See the setup notes at the top of this file.')
  process.exit(1)
}

const BUILD = 'media-build'
const optimized = JSON.parse(readFileSync(join(BUILD, 'optimized-manifest.json'), 'utf8'))

const TYPES = { '.webp': 'image/webp', '.mp4': 'video/mp4' }
const ext = (f) => f.slice(f.lastIndexOf('.')).toLowerCase()

const cdn = {}
let n = 0
for (const [original, optimizedName] of Object.entries(optimized)) {
  const body = readFileSync(join(BUILD, optimizedName))
  const { url } = await put(`fluxads/${optimizedName}`, body, {
    access: 'public',
    token,
    contentType: TYPES[ext(optimizedName)],
    addRandomSuffix: false, // stable, human-readable URLs
    allowOverwrite: true,   // re-running replaces instead of erroring
  })
  cdn[original] = url
  n++
  console.log(`↑ ${original}  ->  ${url}`)
}

writeFileSync('src/media-manifest.json', JSON.stringify(cdn, null, 2) + '\n')
console.log(`\n✓ uploaded ${n} files and wrote src/media-manifest.json`)
