<script setup lang='ts'>
import { Auth } from '@aws-amplify/auth'
import { useLoginUser } from '@/composables/state'

definePageMeta({
  layout: "login",
});

const authUser = ref<any>()
const user = useLoginUser()
const state = reactive({
  loading: false,
  alert: false,
  error: '',
  valid: false,
  valid2: false,
  email: '',
  password: '',
  name: '',
  phone_number: '',
  code: '',
  SOFTWARE_TOKEN_MFA: false,
})

const clickSignIn = async () => {
  state.loading = true
  try {
    authUser.value = await Auth.signIn(state.email, state.password)
    if (authUser.value.challengeName === 'SOFTWARE_TOKEN_MFA') {
      // mfa (1/2)
      state.alert = false
      state.SOFTWARE_TOKEN_MFA = true
    } else if (authUser.value.signInUserSession) {
      // login
      const idToken = authUser.value.signInUserSession.idToken
      user.value = idToken.payload
      user.value.token = idToken.jwtToken
      navigateTo('/groups/')
    } else {
      console.log("NEW_PASSWORD_REQUIRED not Supported.", authUser)
    }
  } catch (e) {
    state.alert = true
    state.error = getCognitoError(e)
  }
  state.loading = false
}

// mfa (2/2)
const confirmSignIn = async () => {
  state.loading = true
  try {
    await Auth.confirmSignIn(authUser.value, state.code, 'SOFTWARE_TOKEN_MFA')
    navigateTo('/groups/')
  } catch (e) {
    state.alert = true
    state.error = getCognitoError(e)
  }
  state.loading = false
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
              <v-text-field v-model="state.email" variant="outlined" density="compact" :rules="Validation.email"
                autocomplete="off" />
              <p class="font-weight-bold">パスワード:</p>
              <v-text-field v-model="state.password" variant="outlined" density="compact" type="password"
                :rules="Validation.password" autocomplete="new-password" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn block variant="elevated" :disabled="!state.valid" :loading="state.loading" color="primary"
                @click="clickSignIn">ログイン</v-btn>
            </v-card-actions>
            <v-card-text>
              <NuxtLink to='/login/signup'>新規アカウント作成</NuxtLink>
              <NuxtLink to='/login/forgotpassword'>パスワード忘れ</NuxtLink>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="state.SOFTWARE_TOKEN_MFA" justify="center">
      <v-col>
        <v-card max-width="500" class="mx-auto my-8">
          <v-alert type="error" v-model="state.alert" closable>{{ state.error }}</v-alert>
          <v-card-title class="font-weight-bold mb-4">MFA</v-card-title>
          <v-form v-model="state.valid2">
            <v-card-text>
              <p class="font-weight-bold">検証コード:</p>
              <v-text-field v-model="state.code" variant="outlined" density="compact" type="password"
                :rules="Validation.confirmationCode" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn variant="elevated" :disabled="!state.valid2" color="primary" @click="confirmSignIn">ログイン</v-btn>
              <v-btn @click="state.SOFTWARE_TOKEN_MFA = false">キャンセル</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-dialog>
  </v-container>
</template>
