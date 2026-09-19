export function useVanish() {
  const vanished = useState('vanished', () => false)

  function vanish(): void {
    vanished.value = true
    if (!import.meta.client)
      return
    document.documentElement.classList.add('vanish')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    }, reduced ? 0 : 180)
  }

  return {
    vanished,
    vanish,
  }
}
