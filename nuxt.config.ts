// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: true,
  runtimeConfig: {
    // Private config that is only available on the server
    PRIVATE_KEY: 'secret',
    // Config within public will be also exposed to the client
    public: {
      API_BASE: 'https://api.nuxtjs.dev',
      NUXT_USER_POOL_ID: process.env.NUXT_USER_POOL_ID,
      NUXT_USER_POOL_WEB_CLIENT_ID: process.env.NUXT_USER_POOL_WEB_CLIENT_ID,
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
    //    preset: 'aws-lambda'
  },
  app: {
    head: {
      title: 'Nuxt3-app',
      link: [
        { rel: 'icon', href: '~/assets/favicon.ico' }
      ],
      htmlAttrs: {
        lang: 'ja',
      },
    }
  },
})
