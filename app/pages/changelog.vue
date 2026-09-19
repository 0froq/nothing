<script setup lang="ts">
import type { LocaleCode } from '~/types'
import { changelog } from '~/data/changelog'

const { t, locale } = useI18n()
const localeKey = computed(() => (locale.value === 'zh' ? 'zh' : 'en') as LocaleCode)

useSeoMeta({
  title: () => `${t('changelog.title')}: nothing`,
  description: () => t('changelog.lede'),
})
</script>

<template>
  <article class="mx-auto page-shell py-20 max-w-[42rem]">
    <h1 class="text-[clamp(36px,5vw,56px)] tracking-[-0.04em] font-normal m-0 mb-4">
      {{ t('changelog.title') }}
    </h1>
    <p class="text-muted m-0 mb-12 max-w-[68ch]">
      {{ t('changelog.lede') }}
    </p>
    <ol class="m-0 p-0 list-none">
      <li
        v-for="entry in changelog"
        :key="entry.version"
        class="py-8 border-t border-line"
      >
        <p class="text-[11px] text-muted tracking-[0.1em] m-0 mb-2 font-mono">
          {{ entry.version }} · {{ entry.date }}
        </p>
        <h2 class="text-[24px] tracking-[-0.03em] font-normal m-0 mb-4">
          {{ entry.title[localeKey] }}
        </h2>
        <ul class="text-muted m-0 p-0 list-none">
          <li
            v-for="(note, index) in entry.notes[localeKey]"
            :key="index"
            class="py-1.5 pl-0"
          >
            <span class="text-wry mr-2">*</span>{{ note }}
          </li>
        </ul>
      </li>
    </ol>
  </article>
</template>
