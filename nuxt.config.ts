export default defineNuxtConfig({
  compatibilityDate: '2026-09-19',

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
  ],

  css: [
    '@fontsource-variable/instrument-sans/index.css',
    '@fontsource/dm-mono/400.css',
    '@fontsource/dm-mono/500.css',
    '~/assets/css/tokens.css',
    '~/assets/css/main.css',
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      script: [
        {
          src: '/color-scheme.js',
          tagPosition: 'head',
        },
      ],
      link: [
        {
          rel: 'icon',
          href: '/favicon.svg',
          type: 'image/svg+xml',
        },
      ],
      meta: [
        {
          name: 'theme-color',
          content: '#FBFBF9',
        },
        {
          name: 'color-scheme',
          content: 'light dark',
        },
      ],
    },
  },

  i18n: {
    locales: [
      {
        code: 'en',
        language: 'en',
        name: 'English',
        file: 'en.json',
      },
      {
        code: 'zh',
        language: 'zh-CN',
        name: '简体中文',
        file: 'zh.json',
      },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'nothing-locale',
      redirectOn: 'root',
    },
  },

  nitro: {
    preset: 'cloudflare-module',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/blog',
        '/blog/shipping-nothing',
        '/blog/zero-as-a-service',
        '/changelog',
        '/zh',
        '/zh/blog',
        '/zh/blog/shipping-nothing',
        '/zh/blog/zero-as-a-service',
        '/zh/changelog',
      ],
    },
  },

  typescript: {
    strict: true,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})
