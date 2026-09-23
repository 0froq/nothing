const COLLAPSE_MS = 820

export function useVanish() {
  const vanished = useState('vanished', () => false)

  function vanish(): void {
    if (vanished.value)
      return
    vanished.value = true
    if (!import.meta.client)
      return

    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    root.style.setProperty('--vanish-origin', `${window.scrollY + window.innerHeight / 2}px`)
    root.classList.add('is-vanishing')
    window.setTimeout(() => {
      root.classList.remove('is-vanishing')
      root.classList.add('is-vanished')
      window.scrollTo({ top: 0, behavior: 'auto' })
    }, reduced ? 0 : COLLAPSE_MS)
  }

  function restore(): void {
    if (!vanished.value)
      return
    vanished.value = false
    if (!import.meta.client)
      return
    const root = document.documentElement
    root.classList.remove('is-vanishing', 'is-vanished')
    root.classList.add('is-restored')
    window.setTimeout(() => root.classList.remove('is-restored'), 900)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return {
    vanished,
    vanish,
    restore,
  }
}
