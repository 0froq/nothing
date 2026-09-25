import type { ProductConfig } from './types'

export default defineAppConfig({
  product: {
    name: 'void',
    mark: '.',
    accent: { light: '#e8431f', dark: '#ff6242' },
    signature: { paper: true, line: true, hand: true, bloom: true, pointer: { dwell: 'wash', click: 'wash', dwellAfter: 1.2 } },
    install: { href: null },
    nav: [
      { label: 'nav.docs', to: '/docs' },
      { label: 'nav.notes', to: '/notes' },
      { label: 'nav.changelog', to: '/changelog' },
    ],
    footer: [
      { label: 'nav.install', to: '/install' },
      { label: 'nav.docs', to: '/docs' },
      { label: 'nav.notes', to: '/notes' },
      { label: 'nav.changelog', to: '/changelog' },
    ],
  } satisfies ProductConfig,
})
