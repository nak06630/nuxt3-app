interface User { id: string; password: string }
export const useLoginUser = () =>
  useState<User>("login-user", () => {
    console.log("retrieving user info...")
    return {
      id: "",
      password: "",
    }
  })

//sample
export const useCounter = () => useState<number>('counter', () => 0)
export const useColor = () => useState<string>('color', () => 'pink')
