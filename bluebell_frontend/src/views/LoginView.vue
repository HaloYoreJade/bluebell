<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function submit() {
  error.value = ''
  submitting.value = true
  try {
    await auth.login(username.value.trim(), password.value)
    await router.push(String(route.query.redirect || '/'))
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '登录失败，请稍后重试。'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <section class="auth-copy">
      <span class="eyebrow">WELCOME BACK</span>
      <h1>继续你的<br /><em>探索与分享。</em></h1>
      <p>登录后可以发布帖子、参与投票，并保存你喜欢的内容。</p>
      <blockquote>“保持好奇，也保持真诚。”</blockquote>
    </section>
    <section class="form-card">
      <div class="form-card__header"><span class="brand__mark">B</span><div><h2>登录 Bluebell</h2><p>很高兴再次见到你</p></div></div>
      <form @submit.prevent="submit">
        <label>用户名<input v-model="username" required autocomplete="username" placeholder="输入用户名" /></label>
        <label>密码<input v-model="password" required type="password" autocomplete="current-password" placeholder="输入密码" /></label>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="button button--primary full" :disabled="submitting">{{ submitting ? '正在登录…' : '登录' }}</button>
      </form>
      <p class="form-foot">还没有账号？<RouterLink to="/signup">立即注册</RouterLink></p>
    </section>
  </div>
</template>
