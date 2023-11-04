/// <reference types="vitest" />
import { manifestForPlugin } from './manifest';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const projectRootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(projectRootDir, 'src') },
      { find: '@mocks', replacement: path.resolve(projectRootDir, 'mock') },
      {
        find: '@scss',
        replacement: path.resolve(projectRootDir, 'src/assets/scss'),
      },
      {
        find: '@helpers',
        replacement: path.resolve(projectRootDir, 'src/helpers'),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test.config.ts'],
    globals: true,
  },
});
