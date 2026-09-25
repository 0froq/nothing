<script setup lang="ts">
const { product } = useAppConfig()
const { t } = useI18n()
const localeHead = useLocaleHead()

useHead({
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs?.lang,
    style: `--brand: ${product.accent.light}; --brand-dark: ${product.accent.dark ?? product.accent.light}`,
  },
  titleTemplate: (title) => {
    const brand = product.name ? `${product.name}${product.mark}` : ''
    if (title)
      return brand ? `${title} — ${brand}` : title
    return t('site.title')
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
