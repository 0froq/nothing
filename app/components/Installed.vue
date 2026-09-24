<script setup lang="ts">
const { t } = useI18n()
const installed = useInstalled()
const back = ref<HTMLButtonElement>()

watch(installed, (on) => {
  if (on)
    setTimeout(() => back.value?.focus({ preventScroll: true }), 900)
})
</script>

<template>
  <div
    class="l-installed"
    aria-live="polite"
  >
    <p class="l-installed-title">
      {{ t('install.done') }}
    </p>
    <button
      ref="back"
      class="l-back"
      type="button"
      @click="installed = false"
    >
      {{ t('install.back') }}
    </button>
  </div>
</template>
