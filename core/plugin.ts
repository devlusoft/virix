import type { Plugin } from 'vite'

const ENTRY_CLIENT_SOURCE = `
import { createApp } from 'vue'
import App from '/app.vue'
import { router } from 'virtual:virix/router' 

createApp(App).use(router).mount('#app')
`

const ROUTER_SOURCE = `
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(),
  routes
})
`

export default function virix(): Plugin {
  return {
    name: 'virix:framework',

    resolveId(id) {
      if (id === 'virtual:virix/entry-client') return '\0virtual:virix/entry-client'
      if (id === 'virtual:virix/router') return '\0virtual:virix/router'
    },

    load(id) {
      if (id === '\0virtual:virix/entry-client') return ENTRY_CLIENT_SOURCE
      if (id === '\0virtual:virix/router') return ROUTER_SOURCE
    },

    transformIndexHtml() {
      return [{
        tag: 'script',
        attrs: { type: 'module', src: '/@id/virtual:virix/entry-client' },
        injectTo: 'body'
      }]
    }
  }
}