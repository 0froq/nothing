<script setup lang="ts">
// Any page in content/<locale>/, including the landing (index.md): its blocks are the page
const route = useRoute()
const { locale } = useI18n()
const contentPath = useContentPath()

const rest = computed(() => {
  const slug = route.params.slug
  const parts = Array.isArray(slug) ? slug : slug ? [slug] : []
  return parts.length ? `/${parts.join('/')}` : '/'
})

const { data: page } = await useAsyncData(
  () => `page-${locale.value}-${rest.value}`,
  () => queryCollection('pages').path(contentPath(rest.value)).first(),
)
if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

useHead(() => ({
  title: page.value?.title,
  // The landing carries the full site title itself
  titleTemplate: page.value?.head ? undefined : '%s',
}))
useSeoMeta({ description: () => page.value?.description })
</script>

<template>
  <Sheet
    v-if="page"
    :line="page.line"
  >
    <PageHead
      v-if="page.head"
      :kicker="page.kicker"
      :title="page.title"
      :lede="page.description"
    />
    <ContentRenderer
      :value="page"
      class="l-page l-md"
    />
  </Sheet>
</template>
