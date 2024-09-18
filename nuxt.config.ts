import { localesConfig } from './i18n'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL
    }
  },
  css: [
    '@/assets/styles/main.scss'
  ],

  experimental: {
    typedPages: true
  },

  modules: [
    '@vueuse/nuxt',
    ['@nuxtjs/tailwindcss', { viewer: false }],
    ['@element-plus/nuxt', { importStyle: false }],
    ['@nuxtjs/i18n', {
      ...localesConfig,
      vueI18n: './i18n/i18n.config.ts'
    }],
    'unplugin-icons/nuxt'
  ]
})
