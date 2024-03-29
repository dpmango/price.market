import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import path from 'path'

import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'vee-validate': ['useField', 'useForm'],
        },
        { '@vueuse/head': ['useHead'] },
      ],

      dirs: [
        './src/components/**',
        './src/composables',
        './src/core/**', // all nested modules
      ],
      dts: true,
      eslintrc: {
        enabled: true,
      },
    }),
    vue(),
    eslintPlugin({
      failOnError: false,
      cache: false,
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
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
        additionalData: '@import "@/assets/styles/utils/index.scss";',
      },
    },
  },
})
