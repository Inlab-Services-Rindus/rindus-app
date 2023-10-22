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
        sizes: '180x180',
        type: 'image/svg+xml',
        purpose: 'apple touch icon',
      },
    ],
    display: 'standalone',
    scope: '/',
    start_url: '/',
  },
};
