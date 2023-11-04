import { VitePWAOptions } from 'vite-plugin-pwa';

export const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['/LOGO_Size_192px.png'],
  manifest: {
    name: 'Rindus',
    short_name: 'Rindus',
    description: 'Rindus app for employees.',
    icons: [
      {
        src: '/LOGO_Size_192px.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/LOGO_Size_512px.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/LOGO_Size_180px.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'apple touch icon',
      },

      {
        src: '/LOGO_Size_512px.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/LOGO_Size_512px.png',
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
