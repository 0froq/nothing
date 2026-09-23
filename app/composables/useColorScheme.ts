import type { ColorSchemePref } from '~/types'

const KEY = 'void-color-scheme'
const LEGACY_KEY = 'nothing-color-scheme'

export function useColorScheme() {
  const pref = useState<ColorSchemePref>('color-scheme-pref', () => 'auto')

  function resolvedDark(value: ColorSchemePref): boolean {
    if (value === 'dark')
      return true
    if (value === 'light')
      return false
    if (import.meta.client)
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    return false
  }

  const dark = computed(() => resolvedDark(pref.value))

  function apply(value: ColorSchemePref): void {
    pref.value = value
    if (!import.meta.client)
      return
    const isDark = resolvedDark(value)
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    root.classList.toggle('light', !isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'
    localStorage.setItem(KEY, value)
  }

  function cycle(): void {
    const order: ColorSchemePref[] = ['auto', 'light', 'dark']
    const next = order[(order.indexOf(pref.value) + 1) % order.length]!
    apply(next)
  }

  function toggle(): void {
    apply(resolvedDark(pref.value) ? 'light' : 'dark')
  }

  function syncFromStorage(): void {
    if (!import.meta.client)
      return
    const saved = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'auto')
      apply(saved)
  }

  return {
    pref,
    apply,
    cycle,
    toggle,
    syncFromStorage,
    dark,
    resolvedDark: dark,
  }
}
