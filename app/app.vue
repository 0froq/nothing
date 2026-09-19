<script setup lang="ts">
const { t, locale } = useI18n()
const { vanished } = useVanish()
const { resolvedDark, syncFromStorage } = useColorScheme()

onMounted(() => {
  syncFromStorage()
})

useHead({
  htmlAttrs: {
    lang: () => (locale.value === 'zh' ? 'zh-CN' : 'en'),
  },
  meta: [
    {
      name: 'theme-color',
      content: () => (resolvedDark.value ? '#101012' : '#FBFBF9'),
    },
  ],
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <a
      href="#main"
      class="skip-link"
    >
      {{ t('nav.skip') }}
    </a>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <div
      v-if="vanished"
      class="vanish-done"
      role="status"
    >
      {{ t('vanish.done') }}
    </div>
  </div>
</template>
