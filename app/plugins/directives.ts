import type { Directive } from 'vue'

type ScrambleMode = 'hover' | 'reveal'

const GLYPHS = '/\\|+=-:*#%&?!01x<>~$'
const CJK_GLYPHS = '零空无虚寂默静'

interface ScrambleState {
  final: string
  written: string
  raf: number
  cleanup: () => void
}

const scrambleStates = new WeakMap<HTMLElement, ScrambleState>()
const spotlightCleanups = new WeakMap<HTMLElement, () => void>()

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function randomGlyph(ch: string): string {
  if (!ch.trim())
    return ch
  const pool = ch.charCodeAt(0) > 0x2E7F ? CJK_GLYPHS : GLYPHS
  return pool[Math.floor(Math.random() * pool.length)] ?? ch
}

/** Vue may patch either the element text or a text node inside a slot fragment, so write to the node it owns. */
function textNode(el: HTMLElement): Text | null {
  const nodes = [...el.childNodes].filter((node): node is Text => node instanceof Text && Boolean(node.data.trim()))
  return nodes.length === 1 ? nodes[0]! : null
}

function write(el: HTMLElement, state: ScrambleState, value: string): void {
  const node = textNode(el)
  if (!node)
    return
  node.data = value
  state.written = value
}

function syncFinal(el: HTMLElement, state: ScrambleState): void {
  const current = textNode(el)?.data ?? ''
  if (current !== state.written)
    state.final = current
}

/**
 * hover: a short cipher band sweeps left to right over readable text.
 * reveal: the whole label starts as cipher and resolves left to right.
 */
function play(el: HTMLElement, state: ScrambleState, mode: ScrambleMode): void {
  syncFinal(el, state)
  cancelAnimationFrame(state.raf)
  const final = state.final
  const len = final.length
  if (!len)
    return

  const band = mode === 'hover' ? 3 : 0
  const duration = Math.min(900, Math.max(320, len * 42 + 180))
  const start = performance.now()
  let lastStep = -1

  const tick = (now: number): void => {
    const t = Math.min(1, (now - start) / duration)
    const step = Math.floor((now - start) / 40)
    if (step !== lastStep || t === 1) {
      lastStep = step
      const front = t * (len + band)
      let out = ''
      for (let i = 0; i < len; i++) {
        const ch = final[i] ?? ''
        const scrambled = mode === 'hover' ? i >= front - band && i < front : i >= front
        out += scrambled ? randomGlyph(ch) : ch
      }
      write(el, state, t === 1 ? final : out)
    }
    if (t < 1)
      state.raf = requestAnimationFrame(tick)
  }

  state.raf = requestAnimationFrame(tick)
}

const scramble: Directive<HTMLElement, ScrambleMode | undefined> = {
  getSSRProps: () => ({}),
  mounted(el, binding) {
    if (prefersReducedMotion())
      return

    const mode = binding.value ?? 'hover'
    const state: ScrambleState = { final: textNode(el)?.data ?? '', written: '', raf: 0, cleanup: () => {} }
    state.written = state.final
    scrambleStates.set(el, state)

    if (mode === 'hover') {
      const host = el.closest<HTMLElement>('a, button, [data-scramble-host]') ?? el
      const onEnter = (): void => play(el, state, 'hover')
      host.addEventListener('pointerenter', onEnter)
      host.addEventListener('focus', onEnter)
      state.cleanup = () => {
        host.removeEventListener('pointerenter', onEnter)
        host.removeEventListener('focus', onEnter)
      }
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting))
        return
      observer.disconnect()
      play(el, state, 'reveal')
    }, { threshold: 0.6 })
    observer.observe(el)
    state.cleanup = () => observer.disconnect()
  },
  updated(el) {
    const state = scrambleStates.get(el)
    if (state)
      syncFinal(el, state)
  },
  beforeUnmount(el) {
    const state = scrambleStates.get(el)
    if (!state)
      return
    cancelAnimationFrame(state.raf)
    state.cleanup()
    scrambleStates.delete(el)
  },
}

/** Tracks the pointer inside a hairline grid so the 1px gaps can glow around it. */
const spotlight: Directive<HTMLElement> = {
  getSSRProps: () => ({}),
  mounted(el) {
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches)
      return

    const onMove = (event: PointerEvent): void => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
      el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
    }
    const onEnter = (event: PointerEvent): void => {
      onMove(event)
      el.classList.add('is-lit')
    }
    const onLeave = (): void => el.classList.remove('is-lit')

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    spotlightCleanups.set(el, () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
    })
  },
  beforeUnmount(el) {
    spotlightCleanups.get(el)?.()
    spotlightCleanups.delete(el)
  },
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('scramble', scramble)
  nuxtApp.vueApp.directive('spotlight', spotlight)
})

declare module 'vue' {
  interface GlobalDirectives {
    vScramble: typeof scramble
    vSpotlight: typeof spotlight
  }
}
