<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { usePreferencesStore } from '@/stores/preferences'

const preferences = usePreferencesStore()
onMounted(() => preferences.applyTheme())
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <footer class="site-footer">
      <span>Bluebell 学习社区</span>
      <span>Vue 3 · TypeScript · Go</span>
    </footer>
  </div>
</template>
