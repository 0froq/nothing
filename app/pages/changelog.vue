<script setup lang="ts">
import type { LocaleCode } from '~/types'
import { changelog } from '~/data/changelog'

const { t, locale } = useI18n()
const localeKey = computed(() => (locale.value === 'zh' ? 'zh' : 'en') as LocaleCode)

useSeoMeta({
  title: () => `${t('changelog.title')}: void`,
  description: () => t('changelog.lede'),
})

useReveal()
</script>

<template>
  <article class="prose-shell py-16 md:py-24">
    <TerminalBar
      command="git log --oneline"
      status="HEAD → MAIN"
    />

    <AsciiDivider
      section="HISTORY"
      :label="t('changelog.title')"
      :meta="t('changelog.count', { n: changelog.length })"
    />

    <h1 class="reveal display-1 mt-10">
      {{ t('changelog.title') }}
    </h1>
    <p
      class="reveal lede mt-5"
      style="--reveal-delay: 80ms"
    >
      {{ t('changelog.lede') }}
    </p>

    <ol class="m-0 mt-14 p-0 list-none border-t border-line">
      <li
        v-for="(entry, index) in changelog"
        :key="entry.version"
        class="reveal py-8 border-b border-line gap-4 grid sm:gap-8 sm:grid-cols-[8rem_minmax(0,1fr)]"
        :style="{ '--reveal-delay': `${index * 80}ms` }"
      >
        <div class="label-xs flex gap-3 sm:flex-col sm:gap-1.5">
          <span class="text-[12px] text-ink tracking-[0.08em] normal-case">{{ entry.version }}</span>
          <span>{{ entry.date }}</span>
          <span
            v-if="index === 0"
            class="text-signal"
          >{{ t('changelog.latest') }}</span>
        </div>
        <div>
          <h2 class="title">
            {{ entry.title[localeKey] }}
          </h2>
          <ul class="text-[13px] text-muted leading-[1.6] m-0 mt-4 p-0 list-none space-y-2 font-mono">
            <li
              v-for="(note, noteIndex) in entry.notes[localeKey]"
              :key="noteIndex"
              class="flex gap-3 items-baseline"
            >
              <span
                class="text-signal shrink-0 select-none"
                aria-hidden="true"
              >+</span>
              <span>{{ note }}</span>
            </li>
          </ul>
        </div>
      </li>
    </ol>
  </article>
</template>
