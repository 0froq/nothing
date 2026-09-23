<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localeCookie = useCookie('void-locale')

const isZh = computed(() => locale.value === 'zh')
const target = computed(() => (isZh.value ? 'en' : 'zh'))
const to = computed(() => switchLocalePath(target.value))
const ariaLabel = computed(() => (isZh.value ? 'Switch language to English' : '切换语言为中文'))

function persistLocale(): void {
  localeCookie.value = target.value
}
</script>

<template>
  <div class="pointer-events-none left-0 right-0 top-0 fixed z-50">
    <div class="page-shell flex h-14 items-center justify-end">
      <NuxtLink
        :to="to"
        class="locale-toggle text-[12px] leading-none tracking-[0.14em] px-1 no-underline flex h-9 pointer-events-auto select-none whitespace-pre uppercase items-center font-mono"
        data-ascii-locale
        data-ascii-interactive="true"
        :aria-label="ariaLabel"
        :title="ariaLabel"
        @click="persistLocale"
      >
        <span
          class="text-muted/60"
          aria-hidden="true"
        >[ </span>
        <span
          class="locale-option"
          :class="isZh ? 'is-idle' : 'text-ink'"
          aria-hidden="true"
        >EN</span>
        <span
          class="text-muted/60"
          aria-hidden="true"
        > | </span>
        <span
          class="locale-option"
          :class="isZh ? 'text-ink' : 'is-idle'"
          aria-hidden="true"
        >ZH</span>
        <span
          class="text-muted/60"
          aria-hidden="true"
        > ]</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.locale-toggle {
  cursor: pointer;
  touch-action: manipulation;
}

.locale-option.is-idle {
  color: var(--muted);
}

.locale-toggle:hover .locale-option.is-idle {
  color: var(--signal);
}

.locale-toggle:focus-visible {
  outline: 1px solid var(--signal);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: no-preference) {
  .locale-option {
    transition: color 0.25s var(--ease);
  }
}
</style>
