<script setup lang="ts">
const { t } = useI18n()
const { toggle, resolvedDark } = useColorScheme()

function onToggle(event: MouseEvent): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !('startViewTransition' in document)) {
    toggle()
    return
  }

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX || rect.left + rect.width / 2
  const y = event.clientY || rect.top + rect.height / 2
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

  const transition = document.startViewTransition(() => toggle())
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 720, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
    )
  }).catch(() => {})
}
</script>

<template>
  <button
    type="button"
    class="theme-toggle group border border-line inline-flex shrink-0 h-9 w-9 items-center justify-center touch-manipulation hover:border-ink"
    :aria-label="resolvedDark ? t('theme.toLight') : t('theme.toDark')"
    :title="resolvedDark ? t('theme.toLight') : t('theme.toDark')"
    @click="onToggle"
  >
    <span
      aria-hidden="true"
      class="theme-toggle-disc border border-ink rounded-full h-3 w-3 block"
    />
  </button>
</template>

<style scoped>
.theme-toggle-disc {
  background: linear-gradient(90deg, var(--ink) 50%, transparent 50%);
}

@media (prefers-reduced-motion: no-preference) {
  .theme-toggle {
    transition: border-color 0.3s var(--ease);
  }

  .theme-toggle-disc {
    transition: transform 0.5s var(--ease);
  }

  .theme-toggle:hover .theme-toggle-disc {
    transform: rotate(180deg);
  }
}
</style>
