<script setup lang="ts">
withDefaults(defineProps<{ lines?: string[] }>(), { lines: () => [] })
</script>

<template>
  <p
    class="l-statement"
    data-anchor="statement"
  >
    <template v-if="lines.length">
      <template
        v-for="(line, index) in lines"
        :key="index"
      >
        <br v-if="index"><RichText :text="line" />
      </template>
    </template>
    <slot
      v-else
      mdc-unwrap="p"
    />
  </p>
</template>
