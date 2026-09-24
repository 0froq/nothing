<script setup lang="ts">
import type { Fact } from '~/types'

// The pen circles the amount
withDefaults(defineProps<{
  price?: string | null
  period?: string
  lede?: string
  facts?: Fact[]
}>(), { price: null, period: undefined, lede: undefined, facts: () => [] })
</script>

<template>
  <div class="l-price">
    <p class="l-amount">
      <span data-anchor="price"><Fill
        :value="price"
        :size="2"
      /></span><small v-if="period">/{{ period }}</small>
    </p>
    <div>
      <p
        v-if="lede"
        class="l-copy"
      >
        <RichText :text="lede" />
      </p>
      <dl
        v-if="facts.length"
        class="l-facts"
      >
        <div
          v-for="fact in facts"
          :key="fact.label"
        >
          <dt>{{ fact.label }}</dt>
          <dd>{{ fact.value }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
