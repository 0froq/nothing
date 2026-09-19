<script setup lang="ts">
const { t } = useI18n()
const { toggle, resolvedDark } = useColorScheme()
</script>

<template>
  <button
    type="button"
    class="text-muted border border-line rounded-full inline-flex h-11 w-11 items-center justify-center touch-manipulation hover:text-ink hover:border-ink/30"
    :aria-label="resolvedDark ? t('theme.toLight') : t('theme.toDark')"
    @click="toggle"
  >
    <span
      aria-hidden="true"
      class="rounded-full h-2.5 w-2.5 block"
      :class="resolvedDark ? 'bg-paper' : 'bg-ink'"
    />
  </button>
</template>
