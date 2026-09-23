<script setup lang="ts">
defineProps<{
  index: string
  label: string
  meta?: string
  title: string
}>()
</script>

<template>
  <div>
    <AsciiDivider
      :section="index"
      :label="label"
      :meta="meta"
    />
    <h2 class="reveal display-2 mt-10 max-w-[18ch]">
      {{ title }}
    </h2>
  </div>
</template>
