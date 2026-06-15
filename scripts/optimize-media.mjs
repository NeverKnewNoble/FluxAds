/* ----------------------------------------------------------------------------
   Flux Ads — media optimizer
   Reads the original gallery media in src/assets/gallery/ and writes web-ready
   versions into media-build/ (git-ignored):
     • images  -> WebP, resized so the long edge <= 1280px, quality 80
     • videos  -> H.264 MP4, scaled so the long edge <= 1280px, CRF 26, muted,
                  +faststart (streams/plays before the whole file downloads)

   It also writes media-build/optimized-manifest.json mapping each ORIGINAL
   filename (as referenced in content.ts) to its optimized local file. The
   upload step reads that manifest, pushes each file to Vercel Blob, and emits
   the final filename -> CDN-URL manifest the app consumes.

   Requires `cwebp` and `ffmpeg` on PATH (both already installed on this machine).
   Run:  node scripts/optimize-media.mjs
---------------------------------------------------------------------------- */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, writeFileSync, statSync } from 'node:fs'
import { join, parse } from 'node:path'

const SRC = 'src/assets/gallery'
const OUT = 'media-build'
const MAX = 1280 // longest edge, px
const IMG_EXT = new Set(['.jpg', '.jpeg', '.png'])
const VID_EXT = new Set(['.mp4'])

if (!existsSync(SRC)) {
  console.error(`✗ source folder not found: ${SRC}`)
  process.exit(1)
}
mkdirSync(OUT, { recursive: true })

const human = (b) => (b / 1024 / 1024).toFixed(2) + ' MB'
const manifest = {}
let srcTotal = 0
let outTotal = 0

for (const file of readdirSync(SRC).sort()) {
  const ext = parse(file).ext.toLowerCase()
  const base = parse(file).name
  const inPath = join(SRC, file)
  const isImg = IMG_EXT.has(ext)
  const isVid = VID_EXT.has(ext)
  if (!isImg && !isVid) continue // skip .DS_Store etc.

  srcTotal += statSync(inPath).size

  if (isImg) {
    const outName = `${base}.webp`
    const outPath = join(OUT, outName)
    // -resize 0 H keeps aspect; cap the long edge by resizing whichever is larger.
    execFileSync('cwebp', [
      '-q', '80',
      '-resize', `${MAX}`, '0', // width cap; if portrait, swapped below
      inPath, '-o', outPath,
    ], { stdio: 'pipe' })
    // cwebp's -resize W 0 forces width; for tall images that upsizes height.
    // Re-run with a height cap when the result is taller than wide.
    const { width, height } = probeImage(outPath)
    if (height > width && height > MAX) {
      execFileSync('cwebp', ['-q', '80', '-resize', '0', `${MAX}`, inPath, '-o', outPath], { stdio: 'pipe' })
    }
    outTotal += statSync(outPath).size
    manifest[file] = outName
    console.log(`img  ${file}  ${human(statSync(inPath).size)} -> ${human(statSync(outPath).size)}  ${outName}`)
  } else {
    const outName = `${base}.mp4`
    const outPath = join(OUT, outName)
    execFileSync('ffmpeg', [
      '-y', '-i', inPath,
      '-vf', `scale='if(gt(iw,ih),min(${MAX},iw),-2)':'if(gt(iw,ih),-2,min(${MAX},ih))'`,
      '-c:v', 'libx264', '-crf', '26', '-preset', 'slow',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      '-an', // gallery videos are muted
      outPath,
    ], { stdio: 'pipe' })
    outTotal += statSync(outPath).size
    manifest[file] = outName
    console.log(`vid  ${file}  ${human(statSync(inPath).size)} -> ${human(statSync(outPath).size)}  ${outName}`)
  }
}

writeFileSync(join(OUT, 'optimized-manifest.json'), JSON.stringify(manifest, null, 2))
console.log(`\n✓ optimized ${Object.keys(manifest).length} files`)
console.log(`  source:    ${human(srcTotal)}`)
console.log(`  optimized: ${human(outTotal)}  (${(100 - (outTotal / srcTotal) * 100).toFixed(0)}% smaller)`)
console.log(`  manifest:  ${join(OUT, 'optimized-manifest.json')}`)

function probeImage(p) {
  // webpinfo isn't guaranteed; use ffprobe which is present with ffmpeg.
  const out = execFileSync('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'csv=p=0:s=x', p,
  ]).toString().trim()
  const [width, height] = out.split('x').map(Number)
  return { width, height }
}
