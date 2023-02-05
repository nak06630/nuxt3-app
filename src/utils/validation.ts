export const Validation = {
  email: [
    (v: boolean) => !!v || 'メールアドレスを入力してください',
    (v: string) => v.length <= 32 || '32文字以下で入力してください',
    (v: string) => /.+@.+\..+/.test(v) || 'メールアドレスを入力してください',
  ],
  password: [
    (v: boolean) => !!v || 'パスワードを入力してください',
    (v: string) => /^(?=.*[A-Z])/.test(v) || '8～32文字で大文字、小文字、数字、記号を含む必要があります',
    (v: string) => /^(?=.*[a-z])/.test(v) || '8～32文字で大文字、小文字、数字、記号を含む必要があります',
    (v: string) => /^(?=.*[0-9])/.test(v) || '8～32文字で大文字、小文字、数字、記号を含む必要があります',
    (v: string) => /^(?=.*[ ^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+-])/.test(v) || '8～32文字で大文字、小文字、数字、記号を含む必要があります',
    (v: string) => v.length >= 8 || '8～32文字で大文字、小文字、数字、記号を含む必要があります',
    (v: string) => v.length <= 32 || '8～32文字で大文字、小文字、数字、記号を含む必要があります',
  ],
  name: [
    (v: boolean) => !!v || '名前を入力してください',
    (v: string) => v.length <= 32 || '32文字以下で入力してください',
  ],
  //https://github.com/googlei18n/libphonenumber
  phone_number: [
    (v: boolean) => !!v || '電話番号を入力してください',
    (v: string) => v.length <= 32 || '電話番号を入力してください',
  ],
  confirmationCode: [
    (v: string) => /^[0-9]{6}$/.test(v) || '検証コードを入力してください',
  ],
  any: [
    (v: boolean) => !!v || '入力してください',
  ]
}
