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
        src: '/rindusLogo.svg',
        sizes: '48x48 72x72 96x96 128x128 256x256 512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    display: 'standalone',
    scope: '/',
    start_url: '/',
  },
};
