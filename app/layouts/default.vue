<template>
  <div class="erasable text-ink bg-paper flex flex-col min-h-dvh">
    <SiteHeader />
    <main
      id="main"
      class="flex-1"
      tabindex="-1"
    >
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
