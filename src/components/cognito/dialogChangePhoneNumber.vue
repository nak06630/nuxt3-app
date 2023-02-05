
<script setup lang='ts'>
import { Auth } from '@aws-amplify/auth'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

const emits = defineEmits<{
  (e: 'close'): void
}>()

const user = useLoginUser()
const state = reactive({
  alert: false,
  error: '',
  phone_number: '',
  valid: false
})

const getPhoneNumberJP = (phone_number: string) => {
  const util = PhoneNumberUtil.getInstance()
  const number = util.parseAndKeepRawInput(phone_number, 'JP')
  return util.format(number, PhoneNumberFormat.NATIONAL)
}
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

onMounted(async () => {
  state.phone_number = getPhoneNumberJP(user.value.phone_number)
})

const clickChangePhoneNumber = async () => {
  state.alert = false
  if (!isValidPhoneNumber(state.phone_number)) {
    state.alert = true
    state.error = '電話番号の形式が不正です。'
    return
  }
  try {
    const authUser = await Auth.currentAuthenticatedUser()
    await Auth.updateUserAttributes(authUser, { phone_number: getPhoneNumberE164(state.phone_number) })
    user.value.phone_number = getPhoneNumberJP(state.phone_number)
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
          <v-icon color="primary">mdi-phone</v-icon>
          電話番号変更</v-card-title>
        <v-card-subtitle>
          電話番号を変更します。
        </v-card-subtitle>
        <v-card-text>
          <div class="font-weight-bold">電話番号:</div>
          <v-text-field v-model="state.phone_number" variant="outlined" density="compact"
            :rules="Validation.phone_number" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="mr-1" @click="closeDialog">キャンセル</v-btn>
          <v-btn class="mr-1" variant="elevated" :disabled="!state.valid" color="primary"
            @click="clickChangePhoneNumber">変更</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
