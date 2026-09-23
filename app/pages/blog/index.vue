<script setup lang="ts">
import type { LocaleCode } from '~/types'
import { posts } from '~/data/posts'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const localeKey = computed(() => (locale.value === 'zh' ? 'zh' : 'en') as LocaleCode)

useSeoMeta({
  title: () => `${t('blog.title')}: void`,
  description: () => t('blog.lede'),
})

useReveal()
</script>

<template>
  <article class="prose-shell py-16 md:py-24">
    <TerminalBar
      command="ls notes/"
      :status="`${posts.length} FILES`"
    />

    <AsciiDivider
      section="INDEX"
      :label="t('blog.title')"
    />

    <h1 class="reveal display-1 mt-10">
      {{ t('blog.title') }}
    </h1>
    <p
      class="reveal lede mt-5"
      style="--reveal-delay: 80ms"
    >
      {{ t('blog.lede') }}
    </p>

    <ul class="m-0 mt-14 p-0 list-none border-t border-line">
      <li
        v-if="posts.length === 0"
        class="reveal label py-8"
      >
        {{ t('blog.empty') }}
      </li>
      <li
        v-for="(post, index) in posts"
        :key="post.slug"
        class="reveal border-b border-line"
        :style="{ '--reveal-delay': `${index * 80}ms` }"
      >
        <NuxtLink
          :to="localePath(`/blog/${post.slug}`)"
          class="group py-8 no-underline block"
        >
          <div class="label-xs mb-4 flex justify-between">
            <span><span class="text-signal">0{{ index + 1 }}</span> · {{ post.date }}</span>
            <span class="normal-case">{{ post.slug }}.md</span>
          </div>
          <h2 class="text-ink title-lg transition-colors duration-300 group-hover:text-signal">
            {{ post.title[localeKey] }}
          </h2>
          <p class="copy-sm mt-3 max-w-[60ch]">
            {{ post.excerpt[localeKey] }}
          </p>
          <span class="label-xs text-ink mt-5 inline-flex gap-2">
            {{ t('blog.read') }} <span class="post-arrow">→</span>
          </span>
        </NuxtLink>
      </li>
    </ul>
  </article>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .post-arrow {
    display: inline-block;
    transition: transform 0.3s var(--ease);
  }

  .group:hover .post-arrow {
    transform: translateX(4px);
  }
}
</style>
