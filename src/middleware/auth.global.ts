import { Auth } from '@aws-amplify/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path == '/logout') {
    await Auth.signOut()
    return navigateTo('/login')
  }

  try {
    const currentAuthUser = await Auth.currentAuthenticatedUser()
    const session = await Auth.userSession(currentAuthUser)
    // console.log("[auth]", currentAuthUser)
    if (!session?.isValid()) {
      console.log("[auth] Session is invalid")
      return navigateTo('/login')
    }
  } catch (error) {
    if (to.path != '/login') {
      console.log("[auth] Forbidden")
      return navigateTo('/login')
    }
  }
})
