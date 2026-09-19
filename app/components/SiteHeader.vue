<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <header class="bg-canvas/92 border-b border-line top-0 sticky z-40 backdrop-blur-md">
    <div class="mx-auto px-5 flex gap-4 h-14 max-w-[72rem] items-center justify-between md:px-8">
      <NuxtLinkLocale
        to="/"
        class="text-[17px] text-ink tracking-[-0.04em] font-medium no-underline hover:text-wry"
      >
        nothing.
      </NuxtLinkLocale>
      <nav
        class="flex gap-4 items-center md:gap-6"
        aria-label="Primary"
      >
        <NuxtLink
          :to="localePath('/#proof')"
          class="text-[13px] text-muted no-underline hidden hover:text-ink sm:inline"
        >
          {{ t('nav.proof') }}
        </NuxtLink>
        <NuxtLinkLocale
          to="/blog"
          class="text-[13px] text-muted no-underline hover:text-ink"
        >
          {{ t('nav.blog') }}
        </NuxtLinkLocale>
        <NuxtLinkLocale
          to="/changelog"
          class="text-[13px] text-muted no-underline hover:text-ink"
        >
          {{ t('nav.changelog') }}
        </NuxtLinkLocale>
        <LocaleToggle />
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>
