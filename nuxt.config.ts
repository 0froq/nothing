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
    '@fontsource-variable/space-grotesk/index.css',
    '@fontsource-variable/eb-garamond/index.css',
    '@fontsource-variable/eb-garamond/wght-italic.css',
    '@fontsource/dm-mono/400.css',
    '@fontsource/dm-mono/500.css',
    '~/assets/css/tokens.css',
    '~/assets/css/main.css',
  ],

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
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
      cookieKey: 'void-locale',
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
        '/blog/shipping-void',
        '/blog/void-as-a-service',
        '/changelog',
        '/zh',
        '/zh/blog',
        '/zh/blog/shipping-void',
        '/zh/blog/void-as-a-service',
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
