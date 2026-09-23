<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string
    delay?: number
  }>(),
  {
    delay: 500,
  },
)

const root = ref<HTMLElement | null>(null)
const count = ref(Number.POSITIVE_INFINITY)
const chars = computed(() => [...props.text])
const shown = computed(() => chars.value.slice(0, count.value).join(''))

let timer = 0
let observer: IntersectionObserver | undefined

function type(): void {
  if (count.value >= chars.value.length)
    return
  count.value += 1
  timer = window.setTimeout(type, 55 + Math.random() * 70)
}

onMounted(() => {
  if (!root.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return
  count.value = 0
  observer = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting))
      return
    observer?.disconnect()
    timer = window.setTimeout(type, props.delay)
  }, { threshold: 0.7 })
  observer.observe(root.value)
})

watch(() => props.text, () => {
  window.clearTimeout(timer)
  count.value = Number.POSITIVE_INFINITY
})

onBeforeUnmount(() => {
  window.clearTimeout(timer)
  observer?.disconnect()
})
</script>

<template>
  <span
    ref="root"
    class="inline-block relative"
  >
    <span class="sr-only">{{ text }}</span>
    <span
      class="invisible"
      aria-hidden="true"
    >{{ text }}<span class="terminal-cursor type-caret" /></span>
    <span
      class="text-left inset-0 absolute"
      aria-hidden="true"
    >{{ shown }}<span class="terminal-cursor type-caret" /></span>
  </span>
</template>

<style scoped>
.type-caret {
  width: 0.06em;
  height: 0.74em;
  margin-left: 0.12em;
  vertical-align: 0;
}
</style>
