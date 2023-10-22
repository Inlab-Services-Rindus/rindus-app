import { VitePWAOptions } from 'vite-plugin-pwa';

export const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['rindusLogo.svg'],
  manifest: {
    name: 'Rindus App',
    short_name: 'Rindus App',
    description: 'Rindus app for employees.',
    icons: [
      {
        src: '/rindusLogo192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/rindusLogo512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/rindusLogo180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'apple touch icon',
      },
    ],
    display: 'standalone',
    scope: '/',
    start_url: '/',
  },
};
