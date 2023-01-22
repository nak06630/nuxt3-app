// plugins/vuetify.js
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const myCustomTheme: ThemeDefinition = {
    dark: false,
    colors: {
      background: '#F5F5F5',
      primary: '#002b6c',
    }
  }
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'myCustomTheme',
      themes: {
        myCustomTheme
      }
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
