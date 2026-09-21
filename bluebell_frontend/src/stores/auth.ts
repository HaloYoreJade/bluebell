import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/services/api'

interface AuthState {
  token: string
  username: string
  userId?: number
}

const STORAGE_KEY = 'bluebell.auth'

function loadAuth(): AuthState | null {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as AuthState | null
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const session = ref<AuthState | null>(loadAuth())
  const isAuthenticated = computed(() => Boolean(session.value?.token))
  const username = computed(() => session.value?.username ?? '')

  async function login(username: string, password: string) {
    const result = await authApi.login({ username, password })
    const token = typeof result === 'string' ? result : result.token || result.accessToken || ''
    if (!token) throw new Error('登录成功，但后端没有返回 token。')
    session.value = {
      token,
      username: typeof result === 'string' ? username : result.username || username,
      userId: typeof result === 'string' ? undefined : result.user_id || result.userID,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session.value))
  }

  function logout() {
    session.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { session, isAuthenticated, username, login, logout }
})
