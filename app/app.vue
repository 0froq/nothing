<script setup lang="ts">
const { product } = useAppConfig()
const { t } = useI18n()
const localeHead = useLocaleHead()

useHead({
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs?.lang,
    style: `--brand: ${product.accent.light}; --brand-dark: ${product.accent.dark ?? product.accent.light}`,
  },
  titleTemplate: title => title ? `${title} — ${product.name}${product.mark}` : t('site.title'),
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
