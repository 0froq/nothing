(() => {
  const key = 'void-color-scheme'
  const legacyKey = 'nothing-color-scheme'
  const saved = localStorage.getItem(key) || localStorage.getItem(legacyKey)
  const pref = saved === 'light' || saved === 'dark' || saved === 'auto'
    ? saved
    : 'auto'
  const dark = pref === 'dark' || (pref !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)
  const root = document.documentElement
  root.classList.toggle('dark', dark)
  root.classList.toggle('light', !dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
})()
