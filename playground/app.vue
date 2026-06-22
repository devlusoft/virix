<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
import {VuxeLayout} from 'vuxe/components/vuxe-layout'
</script>

<template>
  <div>
    <nav style="background: #f5f5f5; padding: 1rem; display: flex; gap: 1rem;">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/admin">Admin</RouterLink>
    </nav>
    <VuxeLayout>
      <RouterView/>
    </VuxeLayout>
  </div>
</template>
