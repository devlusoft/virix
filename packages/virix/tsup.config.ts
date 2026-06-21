import {defineConfig} from 'tsup'

export default defineConfig({
  entry: ['lib/index.ts', 'bin/virix.ts', 'lib/entry-server.ts'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  target: 'node22',
  external: [
    'vue',
    'vue-router',
    'vite',
    '@vitejs/plugin-vue',
    'unplugin-auto-import',
    'unplugin-vue-components',
    '/app.vue'
  ]
})