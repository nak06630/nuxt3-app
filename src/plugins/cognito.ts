import { Auth } from '@aws-amplify/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  console.log("[plugins/cognito] process.env:", process.env)
  // console.log("[plugins/cognito] config:", config)
  Auth.configure({
    userPoolId: config.userPoolId,
    userPoolWebClientId: config.userPoolWebClientId,
    region: config.region
  })
})

