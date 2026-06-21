import type { Plugin } from 'vite'

export const DEFAULT_INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>virix app</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/virtual:virix/entry-client"></script>
  </body>
</html>
`

const ROUTER_SOURCE = `
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(),
  routes
})
`

const ENTRY_SERVER_SOURCE = `
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from '/app.vue'

export async function render(url) {
  const app = createSSRApp(App)
  const router = createRouter({
    history: createMemoryHistory(),
    routes
  })

  app.use(router)
  await router.push(url)
  await router.isReady()
  return renderToString(app)
}
`

export interface VirixOptions {
  layouts: string[]
}

function buildLayoutsModule(layouts: string[]): string {
  if (layouts.length === 0) {
    return 'export default {}\n'
  }

  const imports = layouts
    .map((file, i) => `import __layout_${i} from '/layouts/${file}'`)
    .join('\n')

  const map = layouts
    .map((file, i) => {
      const name = file.replace(/\.vue$/, '').toLowerCase()
      return `  '${name}': __layout_${i}`
    })
    .join(',\n')

  return `${imports}\n\nexport default {\n${map}\n}\n`
}

export default function virix(options: VirixOptions = { layouts: [] }): Plugin {
  const layoutsModule = buildLayoutsModule(options.layouts)

  return {
    name: 'virix:framework',

    resolveId(id) {
      if (
        id === 'virtual:virix/entry-client' ||
        id === '/@id/virtual:virix/entry-client' ||
        id === '/virtual:virix/entry-client'
      ) return '\0virtual:virix/entry-client'

      if (
        id === 'virtual:virix/router' ||
        id === '/@id/virtual:virix/router' ||
        id === '/virtual:virix/router'
      ) return '\0virtual:virix/router'

      if (id === 'virtual:virix/entry-server') return '\0virtual:virix/entry-server'

      if (id === 'virtual:virix/layouts' || id === '\0virtual:virix/layouts') {
        return '\0virtual:virix/layouts'
      }
    },

    load(id) {
      if (id === '\0virtual:virix/entry-client') return `
import { createApp } from 'vue'
import App from '/app.vue'
import { router } from 'virtual:virix/router'

createApp(App).use(router).mount('#app')
`
      if (id === '\0virtual:virix/router') return ROUTER_SOURCE
      if (id === '\0virtual:virix/entry-server') return ENTRY_SERVER_SOURCE
      if (id === '\0virtual:virix/layouts') return layoutsModule
    },

    transformIndexHtml() {
      return []
    }
  }
}
