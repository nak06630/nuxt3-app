<script setup lang='ts'>
import { Auth } from '@aws-amplify/auth'

definePageMeta({
  layout: "login",
})

const state = reactive({
  loading: false,
  alert: false,
  error: '',
  username: '',
  password: '',
  passwordConfirm: '',
  username_valid: false,
  confirm: false,
  confirmationCode: '',
  code_valid: false,
})

const clickforgotPassword = async () => {
  state.loading = true
  state.alert = false
  try {
    await Auth.forgotPassword(state.username)
    state.confirm = true
  } catch (e) {
    state.alert = true
    state.error = getCognitoError(e)
  }
  state.loading = false
}

const clickconfirmPassword = async () => {
  state.loading = true
  state.alert = false
  try {
    await Auth.forgotPasswordSubmit(state.username, state.confirmationCode, state.password)
    navigateTo('/login/')
  } catch (e) {
    state.alert = true
    state.error = getCognitoError(e)
  }
  state.loading = false
}
</script>

<template>
  <v-container>
    <v-alert type="info" v-model="state.confirm" closable>検証コードを送信しました。</v-alert>
    <v-alert type="error" v-model="state.alert" closable> {{ state.error }}</v-alert>
    <v-row justify="center">
      <v-col cols="12">
        <v-card width="500" class="mx-auto my-8">
          <v-form v-model="state.username_valid" @submit.prevent="">
            <v-card-title class="headline font-weight-bold mb-4">パスワード初期化</v-card-title>
            <v-card-subtitle>
              パスワード初期化のため、検証コードを送信します。
            </v-card-subtitle>
            <v-card-text>
              <p class="font-weight-bold">ユーザー名:</p>
              <v-text-field v-model="state.username" variant="outlined" density="compact" :rules="Validation.email" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn class="mr-1" to="/login">キャンセル</v-btn>
              <v-btn class="mr-1" variant="elevated" :disabled="!state.username_valid" color="primary" :loading="state.loading"
                @click="clickforgotPassword">検証コードを送信</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
        <v-card width="500" class="mx-auto my-8">
          <v-form v-model="state.code_valid" @submit.prevent="">
            <v-card-subtitle class="mt-4">
              パスワードと、受信した6桁の検証コードを入力してください。
            </v-card-subtitle>
            <v-card-text>
              <p class="font-weight-bold">パスワード:</p>
              <v-text-field v-model="state.password" variant="outlined" density="compact" type="password"
                :rules="Validation.password" />
              <p class="font-weight-bold">検証コード:</p>
              <v-text-field v-model="state.confirmationCode" variant="outlined" density="compact"
                :rules="Validation.confirmationCode" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn class="mr-1" to="/login">キャンセル</v-btn>
              <v-btn class="mr-1" variant="elevated" :disabled="!state.username_valid || !state.code_valid" color="primary" :loading="state.loading"
                @click="clickconfirmPassword">変更</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
