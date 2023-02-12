import { Auth } from '@aws-amplify/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  // console.log("[plugins/cognito] process.env:", process.env)
  // console.log("[plugins/cognito] config:", config)
  Auth.configure({
    userPoolId: config.NUXT_USER_POOL_ID,
    userPoolWebClientId: config.NUXT_USER_POOL_WEB_CLIENT_ID,
    region: 'ap-northeast-1'

  })
})

