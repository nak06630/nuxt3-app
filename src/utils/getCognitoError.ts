export const getCognitoError = (error: any) => {
  const messages: { [key: string]: string } = {
    // signIn
    'User does not exist.': 'ユーザIDまたはパスワードが正しくありません。',
    'Incorrect username or password.': 'ユーザIDまたはパスワードが正しくありません。',
    'Password attempts exceeded': 'パスワード試行回数が上限を超えました。',
    'User is not confirmed.': 'メールアドレスが検証できていません。',
    // signIn(MFA)
    'Invalid code received for user': '検証コードが不正です。',
    // signUp
    'User already exists': '既に登録されています。',
    //   'Incorrect username or password.': 'ユーザIDまたはパスワードが正しくありません。',
    'Invalid verification code provided, please try again.': '認証コードが正しくありません。',
    // PhoneNumber
    'Invalid phone number format.': '電話番号の形式が不正です。',
    // ChangePassword
    //   'Incorrect username or password.': '現在のパスワードが一致しません。',
    'User is not authenticated': 'ユーザが認証されていません。',
    'Attempt limit exceeded, please try after some time.': '試行回数が制限を超えました。しばらくしてから再度実施してください。',
    //
    'Code mismatch': 'コードが不正です。',
  }

  if (messages[error.message]) {
    return messages[error.message]
  } else {
    return error.code + ': ' + error.message
  }
}
