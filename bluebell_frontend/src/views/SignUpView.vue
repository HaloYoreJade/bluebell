<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/api'

const router = useRouter()
const username = ref('')
const password = ref('')
const confirmation = ref('')
const error = ref('')
const submitting = ref(false)

async function submit() {
  error.value = ''
  if (password.value !== confirmation.value) {
    error.value = '两次输入的密码不一致。'
    return
  }
  submitting.value = true
  try {
    await authApi.signup({ username: username.value.trim(), password: password.value, re_password: confirmation.value })
    await router.push({ name: 'login', query: { registered: '1' } })
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '注册失败，请稍后重试。'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-page auth-page--signup">
    <section class="auth-copy">
      <span class="eyebrow">JOIN BLUEBELL</span>
      <h1>从一篇帖子，<br /><em>开始你的社区旅程。</em></h1>
      <p>用一个简单账号记录学习、交换观点、认识有趣的人。</p>
    </section>
    <section class="form-card">
      <div class="form-card__header"><span class="brand__mark">B</span><div><h2>创建账号</h2><p>只需填写三项信息</p></div></div>
      <form @submit.prevent="submit">
        <label>用户名<input v-model="username" required minlength="3" autocomplete="username" placeholder="至少 3 个字符" /></label>
        <label>密码<input v-model="password" required minlength="6" type="password" autocomplete="new-password" placeholder="至少 6 个字符" /></label>
        <label>确认密码<input v-model="confirmation" required type="password" autocomplete="new-password" placeholder="再次输入密码" /></label>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="button button--primary full" :disabled="submitting">{{ submitting ? '正在创建…' : '创建账号' }}</button>
      </form>
      <p class="form-foot">已有账号？<RouterLink to="/login">返回登录</RouterLink></p>
    </section>
  </div>
</template>
