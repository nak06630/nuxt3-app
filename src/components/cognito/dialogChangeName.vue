
<script setup lang='ts'>
import { Auth } from '@aws-amplify/auth'

const emits = defineEmits<{
  (e: 'close'): void
}>()

const user = useLoginUser()
const state = reactive({
  valid: false,
  alert: false,
  error: '',
  name: ''
})

onMounted(async () => {
  state.name = user.value.name
})

const clickChangeName = async () => {
  try {
    const authUser = await Auth.currentAuthenticatedUser()
    await Auth.updateUserAttributes(authUser, { name: state.name })
    state.alert = false
    user.value.name = state.name
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
    <v-card min-width="500">
      <v-form v-model="state.valid" @submit.prevent="">
        <v-card-title class="headline font-weight-bold mb-4">
          <v-icon color="primary">mdi-account-cog</v-icon>
          名前変更
        </v-card-title>
        <v-card-subtitle>
          名前を変更します。
        </v-card-subtitle>
        <v-card-text>
          <div class="font-weight-bold">名前:</div>
          <v-text-field v-model="state.name" variant="outlined" density="compact" :rules="Validation.name" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="mr-1" @click="closeDialog">キャンセル</v-btn>
          <v-btn class="mr-1" :disabled="!state.valid" color="success" @click="clickChangeName">変更</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
