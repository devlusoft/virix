import {createServer as createViteServer} from 'vite'
import {createServer as createHttpServer} from 'node:http'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'

const vite = await createViteServer({
  appType: 'custom',
  server: {middlewareMode: true},
})

const server = createHttpServer(async (req, res) => {
  vite.middlewares(req, res, async () => {
    const url = req.url || '/'

    try {
      const template = readFileSync(resolve('./index.html'), 'utf-8')

      const transformed = await vite.transformIndexHtml(url, template)
      const { render } = await vite.ssrLoadModule('virtual:virix/entry-server')
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

server.listen(3000, () => {
  console.log('http://localhost:3000')
})