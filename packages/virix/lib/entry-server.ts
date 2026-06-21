import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from '/app.vue'

export async function render(url: string): Promise<string> {
  const app = createSSRApp(App)
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })
  app.use(router)
  await router.push(url)
  await router.isReady()
  return renderToString(app)
}