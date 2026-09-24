<script setup lang="ts">
import type { Quote } from '~/types'

const props = withDefaults(defineProps<{ items?: Quote[] }>(), { items: () => [] })
const cols = computed(() => Math.min(3, Math.max(1, props.items.length)))
</script>

<template>
  <div
    class="l-quotes"
    :style="{ '--cols': cols }"
  >
    <figure
      v-for="item in items"
      :key="item.quote"
      class="l-quote"
    >
      <blockquote>
        <Fill
          :value="item.quote"
          :size="24"
        />
      </blockquote>
      <figcaption v-if="item.by">
        {{ item.by }}
      </figcaption>
    </figure>
  </div>
</template>
