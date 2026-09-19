<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const proofPath = computed(() => {
  const home = localePath('/')
  return home.includes('#') ? home : `${home}#proof`
})
</script>

<template>
  <header class="border-b border-line bg-paper/92 top-0 sticky z-40 backdrop-blur-md">
    <div class="mx-auto px-5 flex gap-4 h-14 max-w-[72rem] items-center justify-between md:px-8">
      <NuxtLink
        :to="localePath('/')"
        class="text-[17px] text-ink tracking-[-0.04em] font-medium no-underline hover:text-wry"
      >
        nothing.
      </NuxtLink>
      <nav
        class="flex gap-4 items-center md:gap-6"
        aria-label="Primary"
      >
        <NuxtLink
          :to="proofPath"
          class="text-[13px] text-muted no-underline hidden hover:text-ink sm:inline"
        >
          {{ t('nav.proof') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/blog')"
          class="text-[13px] text-muted no-underline hover:text-ink"
        >
          {{ t('nav.blog') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/changelog')"
          class="text-[13px] text-muted no-underline hover:text-ink"
        >
          {{ t('nav.changelog') }}
        </NuxtLink>
        <LocaleToggle />
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>
