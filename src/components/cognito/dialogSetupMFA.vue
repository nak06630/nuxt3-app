
<script setup lang='ts'>
import { Auth } from '@aws-amplify/auth'
import VueQrcode from '@chenfengyuan/vue-qrcode'

const emits = defineEmits<{
  (e: 'close'): void
}>()

const state = reactive({
  alert: false,
  error: '',
  qrcode: 'dummy',
  token: '',
  mfaEnable: true,
  valid: false
})

const options = {
  errorCorrectionLevel: "H",
  maskPattern: 0,
  margin: 10,
  scale: 2,
  width: 300,
  color: {
    dark: "#000000FF",
    light: "#FFFFFFFF"
  }
}

onMounted(async () => {
  const user = await Auth.currentAuthenticatedUser()
  const data = await Auth.setupTOTP(user)
  // https://github.com/google/google-authenticator/wiki/Key-Uri-Format
  // https://www1.auth.iij.jp/smartkey/uri_v2.html
  state.qrcode = 'otpauth://totp/nuxt3-app:' + user.username + '?secret=' + data + '&issuer=nuxt3-app'
  console.log(state.qrcode)
})

const submit = async () => {
  state.alert = false
  try {
    const authUser = await Auth.currentAuthenticatedUser()
    await Auth.verifyTotpToken(authUser, state.token)
    if (state.mfaEnable) {
      await Auth.setPreferredMFA(authUser, 'TOTP')
    } else {
      await Auth.setPreferredMFA(authUser, 'NOMFA')
    }
    emits('close')
  } catch (e) {
    state.alert = true
    state.error = getCognitoError(e)
  }
}

const closeDialog = () => {
  emits('close')
}
</script>

<template>
  <v-dialog>
    <v-alert type="error" v-model="state.alert" closable> {{ state.error }}</v-alert>
    <v-card width="500" class="mx-auto my-8">
      <v-form v-model="state.valid" @submit.prevent="">
        <v-card-title class="headline font-weight-bold mb-4">
          <v-icon color="primary">mdi-lock</v-icon>
          MFA設定
        </v-card-title>
        <v-card-subtitle>
          MFAを設定します。<br /><br />
          Google Authenticator等で、QRコードをスキャンしてください。<br />
          そのあと表示されているトークンを入力してください。
        </v-card-subtitle>
        <v-card-text>
          <vue-qrcode :value="state.qrcode" :options="options" />
        </v-card-text>
        <v-card-text>
          <div class="font-weight-bold">トークン:</div>
          <v-text-field v-model="state.token" variant="outlined" density="compact"
            :rules="Validation.confirmationCode" />
          <v-checkbox v-model="state.mfaEnable" color="primary" density="compact" label="MFAを有効にする" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="mr-1" @click="closeDialog">キャンセル</v-btn>
          <v-btn class="mr-1" variant="elevated" :disabled="!state.valid" color="primary" @click="submit">設定</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
