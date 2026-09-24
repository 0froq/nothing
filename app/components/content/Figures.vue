<script setup lang="ts">
import type { Figure } from '~/types'

const props = withDefaults(defineProps<{ items?: Figure[] }>(), { items: () => [] })
const cols = computed(() => Math.min(4, Math.max(1, props.items.length)))
</script>

<template>
  <dl
    class="l-specs"
    :style="{ '--cols': cols }"
  >
    <div
      v-for="item in items"
      :key="item.label ?? item.value"
      class="l-spec"
    >
      <dt>
        <Fill
          :value="item.label"
          :size="6"
        />
      </dt>
      <dd
        class="l-figure"
        data-anchor="figure"
      >
        <Fill
          :value="item.value"
          :size="1"
        /><small v-if="item.unit">{{ item.unit }}</small>
      </dd>
      <dd
        v-if="item.copy"
        class="l-copy"
      >
        <RichText :text="item.copy" />
      </dd>
    </div>
  </dl>
</template>
