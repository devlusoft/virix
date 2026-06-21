<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute } from 'vue-router'

const layoutModules = import.meta.glob<{default: Component}>('./layouts/*.vue', {eager: true})
const layouts: Record<string, Component> = {}
for (const [path, mod] of Object.entries(layoutModules)) {
  const name = path.replace(/^.*\/(.*)\.vue$/, '$1').toLowerCase()
  layouts[name] = mod.default
}

const route = useRoute()
const layout = computed(() => {
  const name = ((route.meta.layout as string) || 'default').toLowerCase()
  return layouts[name] ?? layouts['default']
})
</script>

<template>
  <div>
    <nav style="background: #f5f5f5; padding: 1rem; display: flex; gap: 1rem;">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/admin">Admin</RouterLink>
    </nav>
    <component :is="layout">
      <RouterView />
    </component>
  </div>
</template>
