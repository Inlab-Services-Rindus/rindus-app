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
        src: '/rindusLogo.svg',
        sizes: '192x192',
        type: 'image/svg',
      },
      {
        src: '/rindusLogo.svg',
        sizes: '512x512',
        type: 'image/svg',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/rindusLogo.svg',
        sizes: '512x512',
        type: 'image/svg',
      },
      {
        src: '/rindusLogo.svg',
        sizes: '180x180',
        type: 'image/svg',
        purpose: 'apple touch icon',
      },
      {
        src: '/rindusLogo.svg',
        sizes: '225x225',
        type: 'image/svg',
        purpose: 'any maskable',
      },
    ],
    theme_color: 'red',
    background_color: 'blue',
    display: 'standalone',
    scope: '/',
    start_url: '/',
  },
};
