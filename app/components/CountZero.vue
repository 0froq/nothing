<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    from: number
    unit?: string
    duration?: number
  }>(),
  {
    unit: '',
    duration: 1800,
  },
)

const root = ref<HTMLElement | null>(null)
const value = ref(0)
const formatted = computed(() => value.value.toLocaleString('en-US'))

let raf = 0
let observer: IntersectionObserver | undefined

function run(): void {
  const start = performance.now()
  const tick = (now: number): void => {
    const t = Math.min(1, (now - start) / props.duration)
    const eased = 1 - (1 - t) ** 4
    value.value = Math.round(props.from * (1 - eased))
    if (t < 1)
      raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  if (!root.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return
  value.value = props.from
  observer = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting))
      return
    observer?.disconnect()
    window.setTimeout(run, 450)
  }, { threshold: 0.8 })
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
})
</script>

<template>
  <span
    ref="root"
    class="tabular-nums"
  >{{ formatted }}<template v-if="unit"> {{ unit }}</template></span>
</template>
