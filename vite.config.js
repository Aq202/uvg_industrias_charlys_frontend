// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite'
// eslint-disable-next-line import/no-extraneous-dependencies
import react from '@vitejs/plugin-react'
// eslint-disable-next-line import/no-extraneous-dependencies
import eslint from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    alias: [
      { find: '@customerComponents', replacement: path.resolve(__dirname, './src/customer_view/components') },
      { find: '@customerPages', replacement: path.resolve(__dirname, './src/customer_view/pages') },
    ],
  },
})
