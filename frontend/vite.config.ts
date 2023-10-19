/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';

const projectRootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(projectRootDir, 'src') },
      { find: '@mocks', replacement: path.resolve(projectRootDir, 'mock') },
      {
        find: '@scss',
        replacement: path.resolve(projectRootDir, 'src/assets/scss'),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test.config.ts'],
    globals: true,
  },
});
