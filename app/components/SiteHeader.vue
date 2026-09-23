<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const isHome = computed(() => {
  const p = route.path.replace(/\/+$/, '')
  return p === '' || p === '/zh'
})

const scrolled = ref(false)

function checkScroll(): void {
  scrolled.value = window.scrollY > 180
}

onMounted(() => {
  checkScroll()
  window.addEventListener('scroll', checkScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkScroll)
})

const isHidden = computed(() => isHome.value && !scrolled.value)

const links = computed(() => [
  { to: `${localePath('/')}#proof`, label: t('nav.proof'), key: 'proof', desktopOnly: true },
  { to: localePath('/blog'), label: t('nav.blog'), key: 'blog', desktopOnly: false },
  { to: localePath('/changelog'), label: t('nav.changelog'), key: 'changelog', desktopOnly: false },
])

function isActive(key: string): boolean {
  if (key === 'proof')
    return false
  return route.path.replace(/^\/zh/, '').startsWith(`/${key}`)
}
</script>

<template>
  <header
    class="site-header border-b border-line bg-paper/90 top-0 sticky z-40 backdrop-blur-md"
    :class="{ 'header-hidden': isHidden }"
  >
    <div class="page-shell flex gap-6 h-14 items-center justify-between">
      <NuxtLink
        :to="localePath('/')"
        class="text-[24px] text-ink leading-none tracking-[-0.03em] no-underline italic font-serif hover:text-signal"
      >
        void.
      </NuxtLink>
      <nav
        class="pr-28 flex gap-5 items-center md:gap-7"
        aria-label="Primary"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.key"
          :to="link.to"
          class="nav-link label no-underline hover:text-ink"
          :class="[
            link.desktopOnly ? 'hidden sm:inline' : '',
            isActive(link.key) ? 'is-active' : '',
          ]"
          :aria-current="isActive(link.key) ? 'page' : undefined"
        >
          <span v-scramble>{{ link.label }}</span>
        </NuxtLink>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  transition:
    transform 0.4s var(--ease),
    opacity 0.4s var(--ease);
}

.site-header.header-hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

.nav-link.is-active {
  color: var(--ink);
}

.nav-link.is-active::before {
  content: '> ';
  color: var(--signal);
}

@media (prefers-reduced-motion: no-preference) {
  .nav-link,
  .site-header a {
    transition: color 0.3s var(--ease);
  }
}
</style>
