import { ref } from 'vue'
import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<Theme>((localStorage.getItem('bluebell.theme') as Theme) || 'light')
  const savedPostIds = ref<number[]>(JSON.parse(localStorage.getItem('bluebell.savedPosts') ?? '[]'))

  function applyTheme() {
    document.documentElement.dataset.theme = theme.value
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('bluebell.theme', theme.value)
    applyTheme()
  }

  function toggleSaved(postId: number) {
    savedPostIds.value = savedPostIds.value.includes(postId)
      ? savedPostIds.value.filter((id) => id !== postId)
      : [...savedPostIds.value, postId]
    localStorage.setItem('bluebell.savedPosts', JSON.stringify(savedPostIds.value))
  }

  return { theme, savedPostIds, applyTheme, toggleTheme, toggleSaved }
})
