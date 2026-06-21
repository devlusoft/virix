import { build as viteBuild } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path'

export async function runBuild(cwd: string): Promise<void> {
  const userConfigModule = await import(resolve(cwd, 'virix.config.ts'))
  const userConfig = userConfigModule.default ?? {}
  const userVite = userConfig.vite ?? {}

  const frameworkPlugins = [
    vue(),
    VueRouter({routesFolder: 'pages'}),
    AutoImport({
      imports: ['vue'],
      dirs: ['composables'],
      dts: false,
    }),
    Components({
      dirs: ['components'],
      dts: false,
      directoryAsNamespace: true,
    })
  ]

  const baseConfig = {
    root: cwd,
    ...userVite,
    plugins: [
      ...frameworkPlugins,
      ...(userVite.plugins ?? [])
    ]
  }

  console.log('Building client...')
  await viteBuild({
    ...baseConfig,
    build: {
      outDir: 'dist/client',
      emptyOutDir: true,
      ...userVite.build
    }
  })

  console.log('Building server...')
  await viteBuild({
    ...baseConfig,
    build: {
      outDir: 'dist/server',
      ssr: resolve(cwd, 'node_modules/virix/dist/lib/entry-server.js'),
      emptyOutDir: true,
      ...userVite.build
    }
  })

  console.log('Build complete. Output in dist/')
}