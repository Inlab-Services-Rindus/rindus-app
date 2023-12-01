import { VitePWAOptions } from 'vite-plugin-pwa';

export const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
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
