// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  runtimeConfig: {
    // Private config that is only available on the server
    PRIVATE_KEY: 'secret',
    HOGE: process.env.HOGE,
    // Config within public will be also exposed to the client
    public: {
      API_BASE: 'https://api.nuxtjs.dev',
      FUGA: process.env.FUGA,
      PUBLIC_KEY: 'public'
    }
  },
  build: {
    transpile: ['vuetify']
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
      'window.global': {},
    },
    resolve: {
      alias: {
        './runtimeConfig': './runtimeConfig.browser'
      }
    }
  },
  nitro: {
    preset: 'aws-lambda'
  },
  app: {
    head: {
      title: 'Nuxt3-app',
      link: [
        { rel: 'icon', href: './favicon.ico' }
      ],
      htmlAttrs: {
        lang: 'ja',
      },
    }
  },
})
