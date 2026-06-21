#!/usr/bin/env node
import {createServer as createViteServer} from 'vite'
import {createServer as createHttpServer} from 'node:http'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import virix from '../lib/index'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

const command = process.argv[2]

if (command !== 'dev') {
  console.error('Usage: virix dev')
  process.exit(1)
}

const configPath = resolve(process.cwd(), 'virix.config.ts')
const userConfigModule = await import(configPath)
const userConfig = userConfigModule.default ?? {}
const userVite = userConfig.vite ?? {}

const port = Number(userConfig.port ?? process.env.PORT ?? 3000)

const vite = await createViteServer({
  appType: 'custom',
  server: {middlewareMode: true},
  plugins: [
    vue(),
    VueRouter({ routesFolder: 'pages' }),
    AutoImport({
      imports: ['vue'],
      dirs: ['composables'],
      dts: 'auto-imports.d.ts'
    }),
    Components({
      dirs: ['components'],
      dts: 'components.d.ts',
      directoryAsNamespace: true
    }),
    virix(),
    ...(userVite.plugins ?? [])
  ]
})

const server = createHttpServer(async (req, res) => {
  vite.middlewares(req, res, async () => {
    const url = req.url || '/'

    try {
      const template = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8')
      const transformed = await vite.transformIndexHtml(url, template)
      const {render} = await vite.ssrLoadModule('virtual:virix/entry-server')
      const appHtml = await render(url)
      const html = transformed.replace(
        '<div id="app"></div>',
        `<div id="app">${appHtml}</div>`
      )
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(html)
    } catch (err) {
      vite.ssrFixStacktrace(err as Error)
      res.statusCode = 500
      res.end((err as Error).stack)
    }
  })
})

server.listen(port, () => {
  console.log(`http://localhost:${port}`)
})