<script setup lang="ts">
import type { LocaleCode } from '~/types'
import { posts } from '~/data/posts'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const localeKey = computed(() => (locale.value === 'zh' ? 'zh' : 'en') as LocaleCode)

useSeoMeta({
  title: () => `${t('blog.title')}: nothing`,
  description: () => t('blog.empty'),
})
</script>

<template>
  <article class="mx-auto page-shell py-20 max-w-[42rem]">
    <h1 class="text-[clamp(36px,5vw,56px)] tracking-[-0.04em] font-normal m-0 mb-12">
      {{ t('blog.title') }}
    </h1>
    <ul class="m-0 p-0 list-none">
      <li
        v-if="posts.length === 0"
        class="text-muted py-8 border-t border-line"
      >
        {{ t('blog.empty') }}
      </li>
      <li
        v-for="post in posts"
        :key="post.slug"
        class="py-8 border-t border-line"
      >
        <p class="text-[11px] text-muted tracking-[0.1em] m-0 mb-2 font-mono">
          {{ post.date }}
        </p>
        <NuxtLink
          :to="localePath(`/blog/${post.slug}`)"
          class="text-[28px] tracking-[-0.03em] hover:text-muted"
        >
          {{ post.title[localeKey] }}
        </NuxtLink>
        <p class="text-muted m-0 mt-3 max-w-[68ch]">
          {{ post.excerpt[localeKey] }}
        </p>
      </li>
    </ul>
  </article>
</template>
