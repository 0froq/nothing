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
      signal: 'var(--signal)',
    },
  },
  rules: [
    ['font-sans', { 'font-family': 'var(--font-sans)' }],
    ['font-serif', { 'font-family': 'var(--font-serif)' }],
    ['font-mono', { 'font-family': 'var(--font-mono)' }],
  ],
  shortcuts: {
    // Layout
    'page-shell': 'mx-auto w-full max-w-[1180px] px-6 md:px-8 min-w-0',
    'prose-shell': 'mx-auto w-full max-w-[46rem] px-6 md:px-8 min-w-0',
    'section-shell': 'page-shell py-24 md:py-32 border-t border-line',

    // Type scale: serif for voice, sans for reading, mono for chrome and data
    'display-xl': 'font-serif font-normal m-0 text-[clamp(52px,9.5vw,136px)] leading-[0.9] tracking-[-0.055em]',
    'display-1': 'font-serif font-normal m-0 text-[clamp(40px,5.6vw,68px)] leading-[1] tracking-[-0.045em]',
    'display-2': 'font-serif font-normal m-0 text-[clamp(34px,4.6vw,56px)] leading-[1.02] tracking-[-0.04em]',
    'title-lg': 'font-serif font-normal m-0 text-[clamp(24px,2.6vw,30px)] leading-[1.12] tracking-[-0.03em]',
    'title': 'font-serif font-normal m-0 text-[22px] leading-[1.18] tracking-[-0.025em]',
    'lede': 'm-0 text-[17px] leading-[1.6] text-muted max-w-[36rem]',
    'copy-sm': 'm-0 text-[14px] leading-[1.55] text-muted',
    'label': 'font-mono text-[11px] leading-[1.4] tracking-[0.14em] uppercase text-muted',
    'label-xs': 'font-mono text-[10px] leading-[1.4] tracking-[0.14em] uppercase text-muted',

    // Surfaces
    'panel-grid': 'grid gap-px p-px bg-line',
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
