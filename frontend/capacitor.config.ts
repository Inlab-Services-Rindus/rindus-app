import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rindus.app',
  appName: 'Rindus',
  webDir: 'dist',
  server: {
    url: 'https://staging.app.rindus.de',
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      androidClientId:
        '107296892437-kc7gj9958n07tjr821q49p779lp0dv5m.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
