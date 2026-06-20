import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import virix from 'virix'

export default defineConfig({
  plugins: [
    VueRouter({routesFolder: 'pages'}),
    vue(),
    AutoImport({
      imports: ['vue'],
      dirs: ['composables'],
      dts: 'auto-imports.d.ts'
    }),
    Components({
      dirs: ['components'],
      dts: 'components.d.ts',
      directoryAsNamespace: true,
    }),
    virix()
  ],
})