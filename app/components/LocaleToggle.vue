<script setup lang="ts">
const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const target = computed(() => (locale.value === 'zh' ? 'en' : 'zh'))
</script>

<template>
  <NuxtLink
    :to="switchLocalePath(target)"
    class="text-[11px] text-muted tracking-[0.08em] px-3 border border-line rounded-full no-underline inline-flex h-11 uppercase items-center hover:text-ink hover:border-ink/30"
  >
    {{ t(`locale.${target}`) }}
  </NuxtLink>
</template>
