import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'
import path from 'path'

import eslintPlugin from 'vite-plugin-eslint'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const config: UserConfig = {
  plugins: [
    sveltekit(),
    eslintPlugin({
      failOnError: false,
      cache: false,
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "$lib/styles/utils/index.scss";',
      },
    },
  },
}

export default config
