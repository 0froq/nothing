<script setup lang="ts">
withDefaults(
  defineProps<{
    dashed?: boolean
  }>(),
  {
    dashed: false,
  },
)
</script>

<template>
  <div :class="dashed ? 'hairline-dash' : 'hairline'">
    <slot />
  </div>
</template>
