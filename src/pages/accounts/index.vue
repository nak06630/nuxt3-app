<script setup lang='ts'>
import { Auth } from '@aws-amplify/auth'
import dialogChangeName from '@/components/cognito/dialogChangeName.vue'
import dialogChangeEmail from '@/components/cognito/dialogChangeEmail.vue'
import dialogChangePhoneNumber from '@/components/cognito/dialogChangePhoneNumber.vue'
import dialogSetupMFA from '@/components/cognito/dialogSetupMFA.vue'
import dialogChangePassword from '@/components/cognito/dialogChangePassword.vue'
import { format } from 'date-fns'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

const user = useLoginUser()

interface Flag {
  [key: string]: boolean
}
const flag: Flag = reactive({
  dialogChangeName: false,
  dialogChangeEmail: false,
  dialogChangePhoneNumber: false,
  dialogSetupMFA: false,
  dialogChangePassword: false,
})

const getPhoneNumberJP = (phone_number: string) => {
  const util = PhoneNumberUtil.getInstance()
  const number = util.parseAndKeepRawInput(phone_number, 'JP')
  return util.format(number, PhoneNumberFormat.NATIONAL)
}

const phone_number = computed(() => getPhoneNumberJP(user.value.phone_number))
const exp = computed(() => format(new Date(user.value.exp * 1000), 'yyyy/MM/dd HH:mm:ss'))
const auth_time = computed(() => format(new Date(user.value.auth_time * 1000), 'yyyy/MM/dd HH:mm:ss'))
const iat = computed(() => format(new Date(user.value.iat * 1000), 'yyyy/MM/dd HH:mm:ss'))
const groups = computed(() => {
  const groups = user.value['cognito:groups']
  if (groups) {
    return groups.join(',')
  } else {
    return '(なし)'
  }
})

const headers = [
  { title: 'key', key: 'key' },
  { title: 'value', key: 'value' },
  { title: '', key: 'action' }
]

const userinfo = [
  { key: 'ユーザー名', value: user.value['cognito:username'], action: '' },
  { key: 'メールアドレス', value: user.value.email, action: 'dialogChangeEmail' },
  { key: '名前', value: user.value.name, action: 'dialogChangeName' },
  { key: '電話番号', value: phone_number.value, action: 'dialogChangePhoneNumber' },
  { key: '識別子', value: user.value.sub, action: '' },
  { key: 'MFA', value: user.value.mfa, action: 'dialogSetupMFA' },
  { key: 'パスワード', value: '********', action: 'dialogChangePassword' },
  { key: 'cognito:groups', value: groups.value, action: '' },
  { key: '認証時刻（auth_time）', value: auth_time.value, action: '' },
  { key: 'JWT有効期限（exp）', value: exp.value, action: '' },
  { key: 'JWT発行日時（iat）', value: iat.value, action: '' },
]

onMounted(async () => {
  const authUser = await Auth.currentAuthenticatedUser()
  user.value.mfa = await Auth.getPreferredMFA(authUser, { bypassCache: true }) // false推奨ページもあるけどtrueでないとダメ。
})

const action = (param: string) => {
  if (flag[param] !== undefined) {
    flag[param] = true
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar density="compact" color="white">
            <v-toolbar-title>
              <v-icon color="primary">mdi-account</v-icon>
              ユーザー情報
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-subtitle>
            idTokenから取得
          </v-card-subtitle>
          <v-card-text>
            <v-data-table density="compact" :headers="headers" :items="userinfo" items-per-page="-1" @close="action">
              <template v-slot:item.action="{ item }">
                <v-icon v-show="item.value.action != ''" color="primary"
                  @click="action(item.value.action)">mdi-pencil</v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <dialogSetupMFA v-model="flag.dialogSetupMFA" @close="flag.dialogSetupMFA = false" />
    <dialogChangeName v-model="flag.dialogChangeName" @close="flag.dialogChangeName = false" />
    <dialogChangeEmail v-model="flag.dialogChangeEmail" @close="flag.dialogChangeEmail = false" />
    <dialogChangePhoneNumber v-model="flag.dialogChangePhoneNumber" @close="flag.dialogChangePhoneNumber = false" />
    <dialogChangePassword v-model="flag.dialogChangePassword" @close="flag.dialogChangePassword = false" />
  </v-container>
</template>
