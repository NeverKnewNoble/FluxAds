# Flux Ads — React + TypeScript + Vite

## Gallery (live from Vercel Blob)

The gallery is **live**: the site fetches `GET /api/gallery`, which lists the
Blob store's `fluxads/` folder server-side and returns the media. Add or delete
files in `fluxads/` and the change shows on the site within ~60s — **no rebuild
or code edit required**.

- `api/gallery.ts` — serverless function that lists Blob (token stays server-side).
- `src/lib/gallery-server.ts` — the listing logic (also used by the Vite dev server).
- `src/lib/gallery-curation.ts` — optional overlay of nice titles/categories/order,
  keyed by filename. Files without an entry still appear (auto title, newest first).
- `src/components/home/content.ts` — a bundled snapshot used only as an instant
  fallback for first paint / if the API is unreachable.

**Required env var (local AND Vercel)**
`BLOB_READ_WRITE_TOKEN` must be set both in `.env.local` *and* in your Vercel
project's **Settings → Environment Variables** — the function reads it at runtime.
1. Vercel project: **Storage → Create → Blob**, open the store's **`.env.local`**
   tab, copy `BLOB_READ_WRITE_TOKEN`.
2. `cp .env.example .env.local` and paste it in (for local dev).
3. Add the same variable in the Vercel project's Environment Variables (for prod).

**Add media (optimized) to the gallery**
```bash
node scripts/add-media.mjs <file> [<file> ...]   # optimizes -> uploads to fluxads/
```
This converts images to WebP and videos to streaming MP4 (long edge ≤ 1280px),
uploads them to `fluxads/`, and prints an optional curation line you can paste
into `src/lib/gallery-curation.ts` for a custom title. New media appears at the
top of the gallery automatically.

**Remove media:** delete the file from the `fluxads/` folder in the Blob
dashboard — it disappears from the live gallery within ~60s.

> Note: files uploaded to the Blob store **root** (e.g. via the dashboard's
> default upload) are *not* shown — only the `fluxads/` folder is listed. Use
> `scripts/add-media.mjs` (or upload into the `fluxads/` path) so files are both
> optimized and in the right place.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
