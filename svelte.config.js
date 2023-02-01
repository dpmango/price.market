import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-')) {
      return
    }
    handler(warning)
  },
  kit: {
    adapter: adapter(),
    alias: {
      '@': './src',
      '@/*': './src/*',
      '@c': './src/components',
      '@c/*': './src/components/*',
    },
    files: {
      lib: 'src/assets',
      routes: 'src/pages',
    },
  },
}

export default config
