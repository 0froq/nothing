<script setup lang="ts">
import type { LocaleCode } from '~/types'
import { posts } from '~/data/posts'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const localeKey = computed(() => (locale.value === 'zh' ? 'zh' : 'en') as LocaleCode)

const post = computed(() => posts.find(item => item.slug === String(route.params.slug)))

const minutes = computed(() => {
  const body = post.value?.body[localeKey.value].join(' ') ?? ''
  const units = localeKey.value === 'zh' ? body.replace(/\s/g, '').length / 400 : body.split(/\s+/).length / 220
  return Math.max(1, Math.ceil(units))
})

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not found',
  })
}

useSeoMeta({
  title: () => `${post.value?.title[localeKey.value] ?? 'void'}: void`,
  description: () => post.value?.excerpt[localeKey.value],
})

useReveal()
</script>

<template>
  <article
    v-if="post"
    class="prose-shell py-16 md:py-24"
  >
    <TerminalBar
      :command="`cat notes/${post.slug}.md`"
      status="READ-ONLY"
    />

    <AsciiDivider
      section="NOTE"
      :label="post.date"
      :meta="t('blog.minutes', { n: minutes })"
    />

    <h1 class="reveal display-1 mt-10">
      {{ post.title[localeKey] }}
    </h1>
    <p
      class="reveal lede mt-5"
      style="--reveal-delay: 80ms"
    >
      {{ post.excerpt[localeKey] }}
    </p>

    <div class="text-[17px] leading-[1.75] mt-12 pt-10 border-t border-line gap-6 grid max-w-[64ch]">
      <p
        v-for="(para, index) in post.body[localeKey]"
        :key="index"
        class="reveal text-ink/90 m-0"
        :style="{ '--reveal-delay': `${index * 60}ms` }"
      >
        {{ para }}
      </p>
    </div>

    <div class="reveal label mt-16 pt-6 border-t border-line flex items-center justify-between">
      <NuxtLink
        :to="localePath('/blog')"
        class="no-underline flex gap-2 items-center hover:text-ink"
      >
        <span class="text-signal">←</span>
        <span>{{ t('blog.back') }}</span>
      </NuxtLink>
      <span
        class="text-muted/60 select-none"
        aria-hidden="true"
      >EOF</span>
    </div>
  </article>
</template>
