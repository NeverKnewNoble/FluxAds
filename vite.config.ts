import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Loads .env.local etc. into a plain object (BLOB_READ_WRITE_TOKEN included).
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
      galleryDevApi(env.BLOB_READ_WRITE_TOKEN),
    ],
  }
})

/**
 * Dev-only stand-in for the Vercel serverless function at /api/gallery, so
 * `yarn dev` reflects the live Blob store exactly like production does.
 */
function galleryDevApi(token?: string): PluginOption {
  return {
    name: 'flux-gallery-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.split('?')[0].endsWith('/api/gallery')) return next()
        // Loaded through Vite's module graph so it compiles TS and resolves deps.
        server
          .ssrLoadModule('/src/lib/gallery-server.ts')
          .then((mod) => (mod.loadGallery as (t?: string) => Promise<unknown>)(token))
          .then((works) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ works }))
          })
          .catch((err) => {
            server.config.logger.error(`[gallery] dev list failed: ${err?.message ?? err}`)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ works: [], error: 'Failed to load gallery' }))
          })
      })
    },
  }
}
