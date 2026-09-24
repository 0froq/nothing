<script setup lang="ts">
import type { Question } from '~/types'

withDefaults(defineProps<{ items?: Question[] }>(), { items: () => [] })
</script>

<template>
  <div class="l-qa">
    <details
      v-for="item in items"
      :key="item.q"
    >
      <summary>
        <span><RichText :text="item.q" /></span>
      </summary>
      <p><RichText :text="item.a" /></p>
    </details>
  </div>
</template>
