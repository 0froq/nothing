<script setup lang="ts">
import type { LocaleCode } from '~/types'
import { posts } from '~/data/posts'

const { t, locale } = useI18n()
const route = useRoute()
const localeKey = computed(() => (locale.value === 'zh' ? 'zh' : 'en') as LocaleCode)

const post = computed(() => posts.find(item => item.slug === String(route.params.slug)))

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

useSeoMeta({
  title: () => `${post.value?.title[localeKey.value] ?? 'nothing'}: nothing`,
  description: () => post.value?.excerpt[localeKey.value],
})
</script>

<template>
  <article
    v-if="post"
    class="mx-auto page-shell py-20 max-w-[42rem]"
  >
    <p class="text-[11px] text-muted tracking-[0.1em] m-0 mb-4 font-mono">
      {{ post.date }}
    </p>
    <h1 class="text-[clamp(36px,5vw,52px)] tracking-[-0.04em] font-normal m-0 mb-10">
      {{ post.title[localeKey] }}
    </h1>
    <div class="text-[17px] leading-[1.6] gap-5 grid max-w-[68ch]">
      <p
        v-for="(para, index) in post.body[localeKey]"
        :key="index"
        class="m-0"
      >
        {{ para }}
      </p>
    </div>
    <p class="m-0 mt-14 pt-6 border-t border-line">
      <NuxtLinkLocale
        to="/blog"
        class="text-[11px] text-muted tracking-[0.1em] uppercase font-mono hover:text-ink"
      >
        {{ t('blog.back') }}
      </NuxtLinkLocale>
    </p>
  </article>
</template>
