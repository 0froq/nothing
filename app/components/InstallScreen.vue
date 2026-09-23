<script setup lang="ts">
const { t } = useI18n()
const { restore } = useVanish()
const button = ref<{ $el: HTMLElement } | null>(null)

const lines = [
  { text: '$ pnpm add void', typed: true },
  { text: 'Packages: +0', typed: false },
  { text: 'Done in 0ms', typed: false },
]

let focusTimer = 0

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  focusTimer = window.setTimeout(() => button.value?.$el.focus({ preventScroll: true }), reduced ? 0 : 2600)
})

onBeforeUnmount(() => window.clearTimeout(focusTimer))

onKeyStroke('Escape', () => restore())
</script>

<template>
  <div
    class="px-6 flex items-center inset-0 justify-center fixed z-80"
    role="status"
  >
    <span
      class="crt-line"
      aria-hidden="true"
    />

    <div class="max-w-[34rem] w-full">
      <div
        class="text-[13px] leading-[1.9] font-mono"
        aria-hidden="true"
      >
        <div
          v-for="(line, index) in lines"
          :key="line.text"
          class="install-line"
          :class="index === 0 ? 'text-ink' : 'text-muted'"
          :style="{ '--d': `${1000 + index * 520}ms`, '--n': line.text.length }"
        >
          <span :class="line.typed ? 'typed' : ''">{{ line.text }}</span>
        </div>
      </div>

      <h2
        class="install-line display-2 mt-10"
        style="--d: 2300ms"
      >
        {{ t('install.done') }}
      </h2>
      <p
        class="install-line lede mt-4"
        style="--d: 2450ms"
      >
        {{ t('install.lede') }}
      </p>
      <div
        class="install-line mt-10"
        style="--d: 2600ms"
      >
        <InkButton
          ref="button"
          tone="ghost"
          @click="restore"
        >
          {{ t('install.restore') }}
        </InkButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.crt-line {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: var(--signal);
  opacity: 0;
  pointer-events: none;
}

.typed {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
  width: calc(var(--n) * 1ch);
}

@media (prefers-reduced-motion: no-preference) {
  .crt-line {
    animation: crt-line 1.1s var(--ease) both;
  }

  .install-line {
    animation: fade-in 0.6s var(--ease) var(--d) both;
  }

  .typed {
    animation: type calc(var(--n) * 38ms) steps(var(--n)) calc(var(--d) + 120ms) both;
  }
}

@keyframes crt-line {
  0%,
  36% {
    opacity: 0;
    transform: scaleX(1);
  }

  40% {
    opacity: 1;
    transform: scaleX(1);
  }

  72% {
    opacity: 1;
    transform: scaleX(0.002);
  }

  82%,
  100% {
    opacity: 0;
    transform: scaleX(0);
  }
}

@keyframes type {
  from {
    width: 0;
  }
}
</style>
