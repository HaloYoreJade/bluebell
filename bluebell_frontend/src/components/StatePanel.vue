<script setup lang="ts">
defineProps<{
  title: string
  message: string
  kind?: 'empty' | 'error' | 'loading'
}>()

defineEmits<{ retry: [] }>()
</script>

<template>
  <section class="state-panel" :class="`state-panel--${kind || 'empty'}`">
    <div class="state-panel__icon" aria-hidden="true">{{ kind === 'error' ? '!' : kind === 'loading' ? '…' : '✦' }}</div>
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <button v-if="kind === 'error'" class="button button--secondary" @click="$emit('retry')">重新尝试</button>
  </section>
</template>
