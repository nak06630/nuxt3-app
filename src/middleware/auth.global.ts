import { Auth } from '@aws-amplify/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path == '/logout') {
    await Auth.signOut()
    return navigateTo('/login')
  } else {
    try {
      const currentAuthUser = await Auth.currentAuthenticatedUser()
      console.log("middleware", currentAuthUser)
    } catch (error) {
      if (to.path != '/login') {
        return navigateTo('/login')
      }
    }
  }
})
