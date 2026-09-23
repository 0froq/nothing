<template>
  <AsciiField />
  <div class="erasable text-ink flex flex-col relative z-[1] min-h-dvh">
    <AsciiLocaleToggle />
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
