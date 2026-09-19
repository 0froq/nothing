<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    tag?: 'button' | 'a'
    tone?: 'solid' | 'ghost'
  }>(),
  {
    tag: 'button',
    tone: 'solid',
  },
)

const tag = computed(() => props.tag)

const toneClass = computed(() => {
  switch (props.tone) {
    case 'ghost':
      return 'bg-transparent text-ink border border-line hover:border-ink/40 hover:bg-paper/40 active:translate-y-px'
    case 'solid':
      return 'bg-ink text-paper border border-ink hover:bg-wry hover:border-wry active:translate-y-px'
    default: {
      const _exhaustive: never = props.tone
      return _exhaustive
    }
  }
})
</script>

<template>
  <component
    :is="tag"
    class="ink-button text-[14px] tracking-[-0.02em] px-5 py-2.5 rounded-full no-underline inline-flex min-h-11 cursor-pointer select-none items-center justify-center touch-manipulation"
    :class="toneClass"
    :type="tag === 'button' ? 'button' : undefined"
  >
    <slot />
  </component>
</template>
