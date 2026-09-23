export function useReveal() {
  if (!import.meta.client)
    return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !('IntersectionObserver' in window))
    return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting)
          continue
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
  )

  onMounted(() => {
    for (const el of document.querySelectorAll<HTMLElement>('.reveal'))
      observer.observe(el)
  })

  onBeforeUnmount(() => {
    observer.disconnect()
  })
}
