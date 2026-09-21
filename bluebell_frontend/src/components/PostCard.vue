<script setup lang="ts">
import { computed, ref } from 'vue'
import { postApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { usePreferencesStore } from '@/stores/preferences'
import type { Post } from '@/types/api'

const props = defineProps<{ post: Post }>()
const auth = useAuthStore()
const preferences = usePreferencesStore()
const score = ref(props.post.vote_num ?? 0)
const voting = ref(false)
const saved = computed(() => preferences.savedPostIds.includes(props.post.id))

async function vote(direction: 1 | -1) {
  if (!auth.isAuthenticated || voting.value) return
  voting.value = true
  try {
    await postApi.vote(props.post.id, direction)
    score.value += direction
  } finally {
    voting.value = false
  }
}
</script>

<template>
  <article class="post-card">
    <div class="vote-column">
      <button :disabled="!auth.isAuthenticated || voting" aria-label="赞同" title="登录后可投票" @click="vote(1)">⌃</button>
      <strong>{{ score }}</strong>
      <button :disabled="!auth.isAuthenticated || voting" aria-label="反对" title="登录后可投票" @click="vote(-1)">⌄</button>
    </div>
    <div class="post-card__body">
      <div class="post-card__meta">
        <span class="community-dot"></span>
        <span>b/{{ post.community_name || 'bluebell' }}</span>
        <span>·</span>
        <span>{{ post.author_name || '社区成员' }}</span>
        <span v-if="post.create_time">· {{ post.create_time }}</span>
      </div>
      <RouterLink class="post-card__link" :to="`/post/${post.id}`">
        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>
      </RouterLink>
      <div class="post-card__footer">
        <RouterLink :to="`/post/${post.id}`">阅读全文</RouterLink>
        <button :class="{ active: saved }" @click="preferences.toggleSaved(post.id)">{{ saved ? '★ 已收藏' : '☆ 收藏' }}</button>
      </div>
    </div>
  </article>
</template>
