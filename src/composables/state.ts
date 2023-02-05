interface User {
  username: string
  name: string
  email: string
  phone_number: string
  token: string
  sub: string
  'cognito:username': string
  'cognito:groups': string[]
  mfa: string
  iat: number
  exp: number
  auth_time: number
}

export const useLoginUser = () =>
  useState<User>("login-user", () => {
    // console.log("retrieving user info...")
    return {
      username: '',
      name: '',
      email: '',
      phone_number: '',
      token: '',
      sub: '',
      'cognito:username': '',
      'cognito:groups': [],
      mfa: '',
      iat: 0,
      exp: 0,
      auth_time: 0,
    }
  })

//sample
export const useCounter = () => useState<number>('counter', () => 0)
export const useColor = () => useState<string>('color', () => 'pink')
