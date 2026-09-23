<script setup lang="ts">
withDefaults(
  defineProps<{
    section?: string
    label: string
    meta?: string
  }>(),
  {
    section: '',
    meta: '',
  },
)
</script>

<template>
  <div
    class="label py-3 flex gap-3 min-w-0 w-full select-none items-center overflow-hidden"
    aria-hidden="true"
  >
    <span
      v-if="section"
      class="text-signal shrink-0"
    >[{{ section }}]</span>
    <span
      v-scramble="'reveal'"
      class="text-ink shrink-0"
    >{{ label }}</span>
    <span class="ascii-line shrink grow min-w-0" />
    <span
      v-if="meta"
      class="text-[10px] text-muted/70 tracking-[0.08em] shrink-0 hidden normal-case sm:inline"
    >// {{ meta }}</span>
  </div>
</template>

<style scoped>
.ascii-line {
  flex: 1 1 0%;
  height: 1px;
  background-image: repeating-linear-gradient(to right, var(--line) 0 6px, transparent 6px 12px);
}
</style>
