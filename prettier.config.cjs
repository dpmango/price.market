/* eslint-env node */
module.exports = {
  plugins: [require('prettier-plugin-tailwindcss'), 'prettier-plugin-svelte'],
  semi: false,
  singleQuote: true,
  arrowParens: 'always',
  printWidth: 100,
  pluginSearchDirs: ['.'],
  overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
}
