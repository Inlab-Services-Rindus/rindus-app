import { VitePWAOptions } from 'vite-plugin-pwa';

export const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
  manifest: {
    name: 'Rindus App',
    short_name: 'Rindus App',
    description: 'Rindus app for employees.',
    icons: [
      {
        src: 'rindusLogo.svg',
        sizes: '48x48 72x72 96x96 128x128 256x256 512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    theme_color: 'red',
    background_color: 'blue',
    display: 'standalone',
    scope: '/',
    start_url: '/',
  },
};
