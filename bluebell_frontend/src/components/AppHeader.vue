<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePreferencesStore } from '@/stores/preferences'

const router = useRouter()
const auth = useAuthStore()
const preferences = usePreferencesStore()
const query = ref('')

function search() {
  router.push({ name: 'home', query: query.value.trim() ? { q: query.value.trim() } : {} })
}

function logout() {
  auth.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <header class="topbar">
    <div class="topbar__inner">
      <RouterLink class="brand" to="/" aria-label="Bluebell 首页">
        <span class="brand__mark">B</span>
        <span>Bluebell</span>
      </RouterLink>

      <form class="search" role="search" @submit.prevent="search">
        <span aria-hidden="true">⌕</span>
        <input v-model="query" type="search" placeholder="搜索帖子" aria-label="搜索帖子" />
        <kbd>Enter</kbd>
      </form>

      <nav class="topbar__actions" aria-label="主导航">
        <button class="icon-button" :title="preferences.theme === 'light' ? '切换深色模式' : '切换浅色模式'" @click="preferences.toggleTheme">
          {{ preferences.theme === 'light' ? '☾' : '☀' }}
        </button>
        <template v-if="auth.isAuthenticated">
          <RouterLink class="button button--primary compact" to="/publish">写帖子</RouterLink>
          <details class="user-menu">
            <summary><span class="avatar">{{ auth.username.slice(0, 1).toUpperCase() }}</span>{{ auth.username }}</summary>
            <button @click="logout">退出登录</button>
          </details>
        </template>
        <template v-else>
          <RouterLink class="text-link desktop-only" to="/login">登录</RouterLink>
          <RouterLink class="button button--primary compact" to="/signup">加入社区</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>
