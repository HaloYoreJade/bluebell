<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import StatePanel from '@/components/StatePanel.vue'
import { postApi } from '@/services/api'
import type { Post } from '@/types/api'

const route = useRoute()
const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    post.value = await postApi.detail(Number(route.params.id))
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '帖子加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="page-container detail-page">
    <RouterLink class="back-link" to="/">← 返回帖子列表</RouterLink>
    <StatePanel v-if="loading" title="正在加载帖子" message="请稍候…" kind="loading" />
    <StatePanel v-else-if="error" title="无法打开这篇帖子" :message="error" kind="error" @retry="load" />
    <article v-else-if="post" class="article-card">
      <div class="post-card__meta"><span class="community-dot"></span><span>b/{{ post.community_name || 'bluebell' }}</span><span>· {{ post.author_name || '社区成员' }}</span></div>
      <h1>{{ post.title }}</h1>
      <div class="article-content">{{ post.content }}</div>
    </article>
  </div>
</template>
