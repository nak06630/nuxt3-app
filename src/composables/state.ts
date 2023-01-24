interface User { username: string; name: string, email: string, token: string }
export const useLoginUser = () =>
  useState<User>("login-user", () => {
    // console.log("retrieving user info...")
    return {
      username: '',
      name: '',
      email: '',
      token: ''
    }
  })

//sample
export const useCounter = () => useState<number>('counter', () => 0)
export const useColor = () => useState<string>('color', () => 'pink')
