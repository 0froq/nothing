<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    tone?: 'solid' | 'ghost'
  }>(),
  {
    to: undefined,
    tone: 'solid',
  },
)

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    :type="to ? undefined : 'button'"
    :data-tone="tone"
    class="ink-button text-[12px] leading-none tracking-[0.14em] px-5 border no-underline inline-flex gap-3 h-11 cursor-pointer select-none whitespace-nowrap uppercase items-center justify-center touch-manipulation font-mono active:translate-y-px"
  >
    <span v-scramble><slot /></span>
    <span
      class="ink-button-arrow"
      aria-hidden="true"
    >→</span>
  </component>
</template>

<style scoped>
.ink-button[data-tone='solid'] {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--paper);
}

.ink-button[data-tone='ghost'] {
  background: transparent;
  border-color: var(--line);
  color: var(--ink);
}

.ink-button[data-tone='solid']:hover {
  background: var(--signal);
  border-color: var(--signal);
  color: var(--paper);
}

.ink-button[data-tone='ghost']:hover {
  border-color: var(--ink);
}

@media (prefers-reduced-motion: no-preference) {
  .ink-button {
    transition:
      background-color 0.3s var(--ease),
      border-color 0.3s var(--ease),
      color 0.3s var(--ease),
      transform 0.15s var(--ease);
  }

  .ink-button-arrow {
    transition: transform 0.3s var(--ease);
  }

  .ink-button:hover .ink-button-arrow {
    transform: translateX(3px);
  }
}
</style>
