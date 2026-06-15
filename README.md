# Flux Ads — React + TypeScript + Vite

## Media pipeline (Vercel Blob)

Gallery images and videos are **not committed to Git** — they're optimized and
served from a Vercel Blob CDN. The repo stays lightweight; the site reads URLs
from `src/media-manifest.json`.

**Folders**
- `src/assets/gallery/` — original source media (git-ignored; kept locally to re-optimize)
- `media-build/` — web-optimized output (git-ignored; generated)
- `src/media-manifest.json` — committed map of `filename -> CDN URL` (the app reads this)

**One-time setup**
1. In your Vercel project: **Storage → Create → Blob**, then open the store's
   **`.env.local`** tab and copy `BLOB_READ_WRITE_TOKEN`.
2. `cp .env.example .env.local` and paste the token in.

**Publish / update media**
```bash
node scripts/optimize-media.mjs   # src/assets/gallery -> media-build (WebP + MP4)
node scripts/upload-blob.mjs      # media-build -> Vercel Blob; writes src/media-manifest.json
```
To add new work: drop the original into `src/assets/gallery/`, add a `works`
entry in `src/components/home/content.ts` referencing its filename, then re-run
both scripts above and commit the updated `src/media-manifest.json`.

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
