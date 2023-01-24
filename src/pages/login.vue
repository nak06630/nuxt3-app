<script setup lang='ts'>
import { Auth } from '@aws-amplify/auth'
import { useLoginUser } from '@/composables/state'

definePageMeta({
  layout: "login",
});

const user = useLoginUser()
const state = reactive({
  id: '',
  password: '',
  valid: false,
  alert: false,
  error: '' as string,
  loading: false
})

const Rules = {
  id: [
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
  ]
}

const clickSignIn = async () => {
  try {
    state.loading = true
    const authUser = await Auth.signIn(state.id, state.password)
    state.loading = false

    const idToken = authUser.signInUserSession.idToken
    user.value.username = idToken.payload['cognito:username']
    user.value.name = idToken.payload.name
    user.value.email = idToken.payload.email
    user.value.token = idToken.jwtToken
    navigateTo('/groups/')
  } catch (err: any) {
    state.alert = true
    state.loading = false
    if (err && err.message) {
      if (err.message == 'Incorrect username or password.' || err.message == 'User does not exist.') {
        state.error = 'ユーザIDまたはパスワードが正しくありません。'
      } else if (err.message == 'Password attempts exceeded') {
        state.error = 'パスワード試行回数が上限を超えました。'
      } else {
        state.error = err.message
      }
    }
  }
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-card max-width="600" class="mx-auto my-8">
          <v-alert type="error" v-model="state.alert" closable>{{ state.error }}</v-alert>
          <v-card-title class="font-weight-bold mb-4">ログイン</v-card-title>
          <v-form v-model="state.valid">
            <v-card-text>
              <p class="font-weight-bold">ユーザー名:</p>
              <v-text-field v-model="state.id" variant="outlined" density="compact" :rules="Rules.id"
                autocomplete="off" />
              <p class="font-weight-bold">パスワード:</p>
              <v-text-field v-model="state.password" variant="outlined" density="compact" type="password"
                :rules="Rules.password" autocomplete="new-password" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn block variant="elevated" :disabled="!state.valid" :loading="state.loading" color="primary"
                @click="clickSignIn">ログイン</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
