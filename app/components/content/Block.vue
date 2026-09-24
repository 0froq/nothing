<script setup lang="ts">
// One section: a label in the margin (where the pen runs) and a body. Anything can go in the body.
withDefaults(defineProps<{
  id?: string
  label?: string | null
  /** Omit for no heading; an empty string shows a placeholder. */
  title?: string | null
  /** Tighter spacing with a rule, for lists of entries. */
  entry?: boolean
}>(), { id: undefined, label: null, title: undefined })
</script>

<template>
  <section
    :id="id"
    class="l-section"
    :class="{ 'is-entry': entry }"
  >
    <p
      class="l-label"
      data-anchor="label"
    >
      <Fill
        :value="label"
        :size="6"
      />
    </p>
    <div class="l-body">
      <h2
        v-if="title !== undefined"
        class="l-title"
      >
        <Fill
          :value="title"
          :size="14"
        />
      </h2>
      <slot />
    </div>
  </section>
</template>
