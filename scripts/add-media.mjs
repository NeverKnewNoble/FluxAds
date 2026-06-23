/* ----------------------------------------------------------------------------
   Flux Ads — add media to the live gallery

   Optimizes one or more local image/video files and uploads the web-ready
   copies into the Blob `fluxads/` folder, which the live gallery (GET
   /api/gallery) lists. New files appear on the site automatically — no rebuild,
   no edits to content.ts. (They show at the TOP of the gallery with an
   auto-generated title; add a matching entry to src/lib/gallery-curation.ts if
   you want a custom title / category / pinned position.)

   Requires `cwebp` and `ffmpeg` on PATH and BLOB_READ_WRITE_TOKEN in .env.local.

   Usage:
     node scripts/add-media.mjs ~/Downloads/new-shot.jpg ~/Desktop/clip.mp4
---------------------------------------------------------------------------- */
import { put } from '@vercel/blob'
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, parse } from 'node:path'

const files = process.argv.slice(2)
if (!files.length) {
  console.error('Usage: node scripts/add-media.mjs <file> [<file> ...]')
  process.exit(1)
}

if (existsSync('.env.local')) {
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}
const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('✗ BLOB_READ_WRITE_TOKEN not set (see .env.local).')
  process.exit(1)
}

const MAX = 1280
const IMG = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const VID = new Set(['.mp4', '.mov', '.m4v', '.webm'])
const TMP = 'media-build/_add'
mkdirSync(TMP, { recursive: true })

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const probe = (p) => {
  const out = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0:s=x', p]).toString().trim()
  const [width, height] = out.split('x').map(Number)
  return { width, height }
}
const aspectClass = (w, h) => {
  const r = w / h
  return [['aspect-[9/16]', 9 / 16], ['aspect-[3/4]', 3 / 4], ['aspect-[4/5]', 4 / 5], ['aspect-square', 1], ['aspect-[16/9]', 16 / 9]]
    .reduce((best, o) => (Math.abs(o[1] - r) < Math.abs(best[1] - r) ? o : best))[0]
}

for (const file of files) {
  if (!existsSync(file)) { console.error(`✗ not found: ${file}`); continue }
  const ext = parse(file).ext.toLowerCase()
  const stem = slug(parse(file).name)

  if (IMG.has(ext)) {
    const { width, height } = probe(file)
    const out = join(TMP, `${stem}.webp`)
    const resize = height > width ? ['0', `${MAX}`] : [`${MAX}`, '0']
    execFileSync('cwebp', ['-q', '80', '-resize', ...resize, file, '-o', out], { stdio: 'pipe' })
    const d = probe(out)
    const { url } = await put(`fluxads/${stem}.webp`, readFileSync(out), { access: 'public', token, contentType: 'image/webp', addRandomSuffix: false, allowOverwrite: true })
    console.log(`↑ image  ${url}`)
    console.log(`   curation (optional): '${stem}': { title: '…', category: '…', aspect: '${aspectClass(d.width, d.height)}', order: -1 },`)
  } else if (VID.has(ext)) {
    const out = join(TMP, `${stem}.mp4`)
    execFileSync('ffmpeg', ['-y', '-i', file, '-vf', `scale='if(gt(iw,ih),min(${MAX},iw),-2)':'if(gt(iw,ih),-2,min(${MAX},ih))'`, '-c:v', 'libx264', '-crf', '26', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out], { stdio: 'pipe' })
    const d = probe(out)
    const { url } = await put(`fluxads/${stem}.mp4`, readFileSync(out), { access: 'public', token, contentType: 'video/mp4', addRandomSuffix: false, allowOverwrite: true })
    console.log(`↑ video  ${url}`)
    console.log(`   curation (optional): '${stem}': { title: '…', category: '…', aspect: '${aspectClass(d.width, d.height)}', order: -1 },`)
  } else {
    console.error(`✗ unsupported type: ${file}`)
  }
}

console.log('\n✓ done — refresh the site; new media shows at the top of the gallery within ~60s.')
