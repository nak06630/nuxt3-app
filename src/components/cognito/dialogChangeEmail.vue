
<script setup lang='ts'>
import { Auth } from '@aws-amplify/auth'

const emits = defineEmits<{
  (e: 'close'): void
}>()

const user = useLoginUser()
const state = reactive({
  alert: false,
  error: '',
  email: '',
  email_valid: false,
  confirm: false,
  confirmationCode: '',
  code_valid: false,
})

onMounted(async () => {
  state.email = user.value.email
})

const clickChangeEmail = async () => {
  state.alert = false
  try {
    const authUser = await Auth.currentAuthenticatedUser()
    await Auth.updateUserAttributes(authUser, { email: state.email })
    state.confirm = true
  } catch (e) {
    state.alert = true
    state.error = getCognitoError(e)
  }
}

const clickConfirmationCode = async () => {
  state.alert = false
  try {
    await Auth.verifyCurrentUserAttributeSubmit('email', state.confirmationCode)
    user.value.email = state.email
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
    <v-alert type="info" v-model="state.confirm" closable>検証コードを送信しました。</v-alert>
    <v-alert type="error" v-model="state.alert" closable> {{ state.error }}</v-alert>
    <v-card width="500" class="mx-auto my-8">
      <v-form v-model="state.email_valid" @submit.prevent="">
        <v-card-title class="headline font-weight-bold mb-4">
          <v-icon color="primary">mdi-mail</v-icon>
          メールアドレス変更
        </v-card-title>
        <v-card-subtitle>
          メールアドレスを変更します。<br />
          確認のため、検証コードを送信します。
        </v-card-subtitle>
        <v-card-text>
          <div class="font-weight-bold">メールアドレス:</div>
          <v-text-field v-model="state.email" variant="outlined" density="compact" :rules="Validation.email" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="mr-1" @click="closeDialog">キャンセル</v-btn>
          <v-btn class="mr-1" variant="elevated" :disabled="!state.email_valid" color="primary"
            @click="clickChangeEmail">検証コードを送信</v-btn>
        </v-card-actions>
      </v-form>

      <v-divider />

      <v-form v-model="state.code_valid" @submit.prevent="">
        <v-card-subtitle class="mt-4">
          受信した6桁の検証コードを入力してください。
        </v-card-subtitle>
        <v-card-text>
          <div class="font-weight-bold">検証コード:</div>
          <v-text-field v-model="state.confirmationCode" variant="outlined" density="compact"
            :rules="Validation.confirmationCode" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="mr-1" @click="closeDialog">キャンセル</v-btn>
          <v-btn class="mr-1" variant="elevated" :disabled="!state.code_valid" color="primary"
            @click="clickConfirmationCode">変更</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
