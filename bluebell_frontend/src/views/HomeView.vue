<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PostCard from '@/components/PostCard.vue'
import StatePanel from '@/components/StatePanel.vue'
import { communityApi, postApi } from '@/services/api'
import type { Community, Post } from '@/types/api'

const route = useRoute()
const order = ref<'time' | 'score'>('time')
const posts = ref<Post[]>([])
const communities = ref<Community[]>([])
const loading = ref(true)
const error = ref('')

const searchTerm = computed(() => String(route.query.q || '').toLowerCase())
const filteredPosts = computed(() => {
  if (!searchTerm.value) return posts.value
  return posts.value.filter((post) => `${post.title} ${post.content} ${post.community_name || ''}`.toLowerCase().includes(searchTerm.value))
})

async function load() {
  loading.value = true
  error.value = ''
  const [postResult, communityResult] = await Promise.allSettled([
    postApi.list(1, order.value),
    communityApi.list(),
  ])
  if (postResult.status === 'fulfilled') posts.value = postResult.value || []
  else error.value = postResult.reason instanceof Error ? postResult.reason.message : '帖子加载失败'
  if (communityResult.status === 'fulfilled') communities.value = communityResult.value || []
  loading.value = false
}

watch(order, load)
onMounted(load)
</script>

<template>
  <div class="page-container home-grid">
    <section>
      <div class="hero-card">
        <div>
          <span class="eyebrow">BLUEBELL COMMUNITY</span>
          <h1>分享想法，<br /><em>遇见同路的人。</em></h1>
          <p>一个小而真诚的学习型社区。记录技术探索，也收集生活中的灵光。</p>
        </div>
        <RouterLink class="button button--light" to="/publish">开始创作 →</RouterLink>
      </div>

      <div class="feed-toolbar">
        <div>
          <button :class="{ active: order === 'time' }" @click="order = 'time'">最新</button>
          <button :class="{ active: order === 'score' }" @click="order = 'score'">热门</button>
        </div>
        <span v-if="searchTerm">“{{ route.query.q }}” 的搜索结果</span>
      </div>

      <StatePanel v-if="loading" title="正在连接社区" message="正在从 Go 后端获取帖子…" kind="loading" />
      <StatePanel v-else-if="error" title="帖子接口暂不可用" :message="`${error} 当前后端尚未注册帖子路由，完成后端对应章节后这里会自动显示数据。`" kind="error" @retry="load" />
      <StatePanel v-else-if="!filteredPosts.length" title="这里还很安静" :message="searchTerm ? '没有找到匹配的帖子，换个关键词试试。' : '成为第一个分享想法的人吧。'" />
      <div v-else class="post-list">
        <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
      </div>
    </section>

    <aside class="sidebar">
      <section class="side-card welcome-card">
        <span class="side-card__icon">✦</span>
        <h2>欢迎来到 Bluebell</h2>
        <p>友善交流，认真表达。每一次分享都值得被看见。</p>
        <RouterLink class="button button--primary full" to="/publish">发布新帖子</RouterLink>
      </section>
      <section class="side-card">
        <div class="side-card__heading"><h2>探索频道</h2><span>COMMUNITIES</span></div>
        <ul v-if="communities.length" class="community-list">
          <li v-for="(community, index) in communities.slice(0, 5)" :key="community.id">
            <span class="rank">{{ String(index + 1).padStart(2, '0') }}</span>
            <div><strong>b/{{ community.name }}</strong><small>{{ community.introduction || '发现更多同好' }}</small></div>
          </li>
        </ul>
        <p v-else class="muted">频道接口接入后会显示在这里。</p>
      </section>
      <section class="quote-card"><p>“最好的学习，是把思考写下来。”</p><span>— BLUEBELL NOTES</span></section>
    </aside>
  </div>
</template>
