import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { portalUrl } from './config.mjs'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  publicDir: fileURLToPath(new URL('./public', import.meta.url)),
  plugins: [react()],
  define: {
    'import.meta.env.VITE_PUBLIC_PORTAL_URL': JSON.stringify(portalUrl),
  },
  build: {
    outDir: '.vercel/output/static',
    emptyOutDir: true,
  },
  server: { host: '127.0.0.1', port: 5175, strictPort: true },
})
