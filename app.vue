<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Default from './layouts/default.vue'
import Admin from './layouts/admin.vue'

const layouts = { Default, Admin }
const route = useRoute()
const layout = computed(() => {
  const name = (route.meta.layout as keyof typeof layouts) || 'Default'
  return layouts[name] || Default
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
