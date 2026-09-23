<script setup lang="ts">
import { changelog } from '~/data/changelog'

const { t } = useI18n()
const localePath = useLocalePath()
const version = changelog[0]?.version ?? 'v0.0.0'
</script>

<template>
  <footer class="border-t border-line bg-paper/70 backdrop-blur-xs">
    <div class="label-xs page-shell py-3 border-b border-line flex gap-4 items-center justify-between">
      <span class="flex gap-2 items-center">
        <span
          class="status-dot text-signal"
          aria-hidden="true"
        >●</span>
        {{ t('footer.status') }}
      </span>
      <NuxtLink
        :to="localePath('/changelog')"
        class="no-underline normal-case hover:text-ink"
      >
        <span v-scramble>{{ version }}</span>
      </NuxtLink>
    </div>
    <div class="page-shell py-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-[13px] text-muted m-0">
        {{ t('footer.left') }}
      </p>
      <p class="text-[13px] text-muted m-0">
        {{ t('footer.right') }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .status-dot {
    animation: pulse 2.4s var(--ease) infinite;
  }

  @keyframes pulse {
    50% {
      opacity: 0.25;
    }
  }
}
</style>
