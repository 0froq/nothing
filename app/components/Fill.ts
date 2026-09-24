import type { PropType, VNode } from 'vue'
import { defineComponent, h } from 'vue'

export function placeholder(size: number): VNode {
  return h('span', { 'class': 'l-fill', 'style': { '--fill': size }, 'aria-hidden': 'true' })
}

// Missing copy shows as a block the size of what should be there, so an unfinished
// template reads as a layout rather than a broken page.
export default defineComponent({
  name: 'Fill',
  props: {
    value: { type: String as PropType<string | null>, default: null },
    /** Placeholder width in characters of the surrounding type. */
    size: { type: Number, default: 8 },
  },
  setup(props) {
    return (): VNode | string => isFilled(props.value) ? props.value : placeholder(props.size)
  },
})
