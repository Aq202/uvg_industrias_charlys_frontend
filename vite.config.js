// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import react from '@vitejs/plugin-react';
// eslint-disable-next-line import/no-extraneous-dependencies
import eslint from 'vite-plugin-eslint';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
      { find: '@helpers', replacement: path.resolve(__dirname, './src/helpers') },
      { find: '@styles', replacement: path.resolve(__dirname, './src/styles') },
      { find: '@assets', replacement: path.resolve(__dirname, './src/assets') },
      { find: '@context', replacement: path.resolve(__dirname, './src/context') },
      { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks') },
    ],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },

});
