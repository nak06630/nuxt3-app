<script setup lang='ts'>
import { Auth } from '@aws-amplify/auth'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

definePageMeta({
  layout: "login",
})

const state = reactive({
  loading: false,
  valid: false,
  confirm: false,
  //username: '',
  email: '',
  name: '',
  phone_number: '',
  password: '',
  passwordConfirm: '',
  confirmationCode: '',
  alert: false,
  error: ''
})

const getPhoneNumberE164 = (phone_number: string) => {
  const util = PhoneNumberUtil.getInstance()
  const number = util.parseAndKeepRawInput(phone_number, 'JP')
  return util.format(number, PhoneNumberFormat.E164)
}
const isValidPhoneNumber = (phone_number: string) => {
  const util = PhoneNumberUtil.getInstance()
  const number = util.parseAndKeepRawInput(phone_number, 'JP')
  return util.isValidNumberForRegion(number, 'JP')
}

const clickSignUp = async () => {
  if (!isValidPhoneNumber(state.phone_number)) {
    state.alert = true
    state.error = '電話番号の形式が不正です。'
    return
  }
  state.loading = true
  state.alert = false
  try {
    await Auth.signUp({
      username: state.email, password: state.password, attributes: {
        email: state.email, phone_number: getPhoneNumberE164(state.phone_number), name: state.name
      }
    })
    state.confirm = true
  } catch (e) {
    state.alert = true
    state.error = getCognitoError(e)
  }
  state.loading = false
}

async function confirmSignUp() {
  state.loading = true
  state.alert = false
  try {
    await Auth.confirmSignUp(state.email, state.confirmationCode)
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
    <v-row justify="center">
      <v-col>
        <v-card width="500" class="mx-auto my-8">
          <v-alert type="info" v-model="state.confirm" closable>検証コードを送信しました。</v-alert>
          <v-alert type="error" v-model="state.alert" closable> {{ state.error }}</v-alert>
          <v-card-title class="headline font-weight-bold mb-4">ユーザー登録</v-card-title>
          <v-form v-model="state.valid">
            <v-card-text>
              <div class="font-weight-bold">ユーザー名（メールアドレス）:</div>
              <v-text-field v-model="state.email" variant="outlined" density="compact" :rules="Validation.email"
                autocomplete="off" />
              <div class="font-weight-bold">パスワード:</div>
              <v-text-field v-model="state.password" variant="outlined" density="compact" :rules="Validation.password"
                type="password" autocomplete="new-password" />
              <div class="font-weight-bold">名前:</div>
              <v-text-field v-model="state.name" variant="outlined" density="compact" :rules="Validation.name"
                autocomplete="name" />
              <div class="font-weight-bold">電話番号:</div>
              <v-text-field v-model="state.phone_number" variant="outlined" density="compact"
                :rules="Validation.phone_number" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn class="mr-1" to="/login">キャンセル</v-btn>
              <v-btn class="mr-1" variant="elevated" :disabled="!state.valid" color="primary" :loading="state.loading"
                @click="clickSignUp">検証コードを送信</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>

        <v-card width="500" class="mx-auto my-8">
          <v-card-subtitle class="mt-4">
            メールで受信した6桁の検証コードを入力してください。
          </v-card-subtitle>
          <v-card-text>
            <div class="font-weight-bold">検証コード:</div>
            <v-text-field v-model="state.confirmationCode" variant="outlined" density="compact"
              :rules="Validation.confirmationCode" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn class="mr-1" to="/login">キャンセル</v-btn>
            <v-btn class="mr-1" variant="elevated" color="primary" :loading="state.loading"
              @click="confirmSignUp">登録</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
