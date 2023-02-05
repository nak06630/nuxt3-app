<script setup lang='ts'>
import { Auth } from '@aws-amplify/auth'

const emits = defineEmits<{
  (e: 'close'): void
}>()

const state = reactive({
  alert: false,
  success: false,
  error: '',
  oldpassword: '',
  password: '',
  passwordConfirm: '',
  valid: false,
})

const clickChangePassword = async () => {
  state.alert = false
  if (state.password != state.passwordConfirm) {
    state.alert = true
    state.error = '確認用のパスワードが一致しません。'
    return
  }
  try {
    const user = await Auth.currentAuthenticatedUser()
    await Auth.changePassword(user, state.oldpassword, state.password)
    state.success = true
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
    <v-alert type="success" v-model="state.success" closable>パスワードを変更しました。</v-alert>
    <v-alert type="error" v-model="state.alert" closable> {{ state.error }}</v-alert>
    <v-card width="500" class="mx-auto my-8">
      <v-form v-model="state.valid" @submit.prevent="">
        <v-card-title class="headline font-weight-bold mb-4">パスワード変更</v-card-title>
        <v-card-subtitle>
          パスワードを変更します。
        </v-card-subtitle>
        <v-card-text>
          <div class="font-weight-bold">現在のパスワード:</div>
          <v-text-field v-model="state.oldpassword" variant="outlined" density="compact" type="password"
            :rules="Validation.password" />
          <div class="font-weight-bold">新しいパスワード:</div>
          <v-text-field v-model="state.password" variant="outlined" density="compact" type="password"
            :rules="Validation.password" />
          <div class="font-weight-bold">新しいパスワード（確認）:</div>
          <v-text-field v-model="state.passwordConfirm" variant="outlined" density="compact" type="password"
            :rules="Validation.password" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="mr-1" @click="closeDialog">キャンセル</v-btn>
          <v-btn class="mr-1" variant="elevated" :disabled="!state.valid && !state.success" color="primary"
            @click="clickChangePassword">変更</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
