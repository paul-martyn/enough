import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Repo name on GitHub. The app is served from https://<user>.github.io/enough/,
// so every asset URL must be prefixed with this base path.
const REPO = 'enough'

export default defineConfig({
  base: `/${REPO}/`,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Enough — личный помощник',
        short_name: 'Enough',
        description: 'Личный помощник: задачи, идеи, финансы',
        theme_color: '#f7f4ee',
        background_color: '#f7f4ee',
        display: 'standalone',
        start_url: `/${REPO}/`,
        scope: `/${REPO}/`,
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
