<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { communityApi, postApi } from '@/services/api'
import type { Community } from '@/types/api'

const DRAFT_KEY = 'bluebell.postDraft'
const router = useRouter()
const communities = ref<Community[]>([])
const communityId = ref<number | ''>('')
const title = ref('')
const content = ref('')
const error = ref('')
const saved = ref(false)
const submitting = ref(false)
const canSubmit = computed(() => Boolean(title.value.trim() && content.value.trim() && communityId.value))

function saveDraft() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ title: title.value, content: content.value, communityId: communityId.value }))
  saved.value = true
  window.setTimeout(() => (saved.value = false), 1200)
}

watch([title, content, communityId], saveDraft)

async function submit() {
  if (!canSubmit.value) return
  submitting.value = true
  error.value = ''
  try {
    await postApi.create({ title: title.value.trim(), content: content.value.trim(), community_id: Number(communityId.value) })
    localStorage.removeItem(DRAFT_KEY)
    await router.push('/')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '发布失败，请稍后重试。'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null') as { title?: string; content?: string; communityId?: number } | null
  if (draft) {
    title.value = draft.title || ''
    content.value = draft.content || ''
    communityId.value = draft.communityId || ''
  }
  try {
    communities.value = await communityApi.list()
  } catch (cause) {
    error.value = `${cause instanceof Error ? cause.message : '频道加载失败'} 当前 Go 后端尚未实现频道接口。`
  }
})
</script>

<template>
  <div class="page-container editor-layout">
    <section>
      <div class="page-heading"><div><span class="eyebrow">CREATE</span><h1>写下新的想法</h1></div><span v-if="saved" class="saved-hint">草稿已保存</span></div>
      <form class="editor-card" @submit.prevent="submit">
        <label>发布到频道
          <select v-model="communityId" required :disabled="!communities.length">
            <option value="" disabled>{{ communities.length ? '选择一个频道' : '等待频道接口接入' }}</option>
            <option v-for="community in communities" :key="community.id" :value="community.id">b/{{ community.name }}</option>
          </select>
        </label>
        <label>标题 <span>{{ title.length }}/300</span>
          <input v-model="title" required maxlength="300" placeholder="一个清晰、有吸引力的标题" />
        </label>
        <label>正文
          <textarea v-model="content" required rows="14" placeholder="展开你的想法…"></textarea>
        </label>
        <p v-if="error" class="form-error">{{ error }}</p>
        <div class="editor-actions"><button type="button" class="button button--ghost" @click="router.push('/')">取消</button><button class="button button--primary" :disabled="!canSubmit || submitting">{{ submitting ? '正在发布…' : '发布帖子' }}</button></div>
      </form>
    </section>
    <aside class="sidebar">
      <section class="side-card"><div class="side-card__heading"><h2>发帖小贴士</h2><span>GUIDE</span></div><ol class="guide-list"><li>标题简洁，方便其他人快速理解。</li><li>说明背景和你已经尝试过的方法。</li><li>尊重不同观点，专注问题本身。</li></ol></section>
    </aside>
  </div>
</template>
