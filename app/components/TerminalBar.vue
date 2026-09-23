<script setup lang="ts">
defineProps<{
  command: string
  status?: string
}>()
</script>

<template>
  <div
    class="label mb-10 pb-4 border-b border-line flex gap-4 select-none items-center justify-between"
    aria-hidden="true"
  >
    <span class="truncate normal-case">
      <span class="text-muted/60">~/void $ </span><span class="text-ink">{{ command }}</span><span class="terminal-cursor" />
    </span>
    <span
      v-if="status"
      class="text-signal shrink-0"
    >[ {{ status }} ]</span>
  </div>
</template>
