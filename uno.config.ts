import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTagify,
  presetTypography,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    breakpoints: {
      sm: '600px',
      md: '900px',
      lg: '1180px',
    },
    colors: {
      paper: 'var(--paper)',
      ink: 'var(--ink)',
      muted: 'var(--muted)',
      line: 'var(--line)',
      accent: 'var(--accent)',
      wry: 'var(--wry)',
    },
  },
  rules: [
    ['font-sans', { 'font-family': 'var(--font-sans)' }],
    ['font-mono', { 'font-family': 'var(--font-mono)' }],
  ],
  shortcuts: {
    'page-shell': 'mx-auto w-full max-w-[1180px] px-6 md:px-8 min-w-0',
    'hairline': 'border-1 border-solid border-line',
    'hairline-dash': 'border-1 border-dashed border-line',
    'reach-hit': 'focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent focus-visible:outline-offset-[3px]',
  },
  presets: [
    presetWind4(),
    presetIcons({
      scale: 1.15,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': '-0.125em',
      },
      collections: {
        carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default as any),
      },
    }),
    presetAttributify({
      strict: true,
      prefixedOnly: true,
      prefix: 'un-',
    }),
    presetTagify({
      prefix: 'un-',
    }),
    presetTypography(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  layers: {
    default: 0,
    components: 1,
    utilities: 2,
  },
})
