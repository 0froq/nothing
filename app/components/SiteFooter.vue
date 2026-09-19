<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto px-5 py-8 flex flex-col gap-3 max-w-[72rem] md:px-8 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-[12px] text-muted m-0">
        {{ t('footer.left') }}
      </p>
      <p class="text-[12px] text-muted m-0">
        {{ t('footer.right') }}
      </p>
    </div>
  </footer>
</template>
