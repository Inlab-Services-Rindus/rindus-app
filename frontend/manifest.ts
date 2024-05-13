import { VitePWAOptions } from 'vite-plugin-pwa';

export const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/avatars\.slack-edge\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'avatars-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        urlPattern: /^https:\/\/api\.app\.rindus\.de\/images\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  manifest: {
    name: 'Rindus',
    short_name: 'Rindus',
    background_color: '#4dd699',
    description: 'Rindus app for employees.',
    icons: [
      {
        src: '/LOGO_Size_192px_square.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/LOGO_Size_512px_square.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/LOGO_Size_512px_square.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/LOGO_Size_512px_square.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  devOptions: {
    enabled: true,
  },
};
