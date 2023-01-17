import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      failOnError: false,
      cache: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@c': fileURLToPath(new URL('./src/components', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/styles/utilities/index.scss";',
      },
    },
  },
})
