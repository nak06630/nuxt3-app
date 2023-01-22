# Installation

## Nuxt3

### インストール

- Nuxt3 インストール

  ```bash
  cd nuxt3-app
  npx nuxi init .
  ```

### 環境準備

- .editorconfig を新規作成

  ```
  # https://editorconfig.org

  root = true

  [*]
  charset = utf-8
  indent_style = space
  indent_size = 2
  end_of_line = lf
  insert_final_newline = true
  trim_trailing_whitespace = true

  [*.md]
  insert_final_newline = false
  trim_trailing_whitespace = false
  ```

- .vscode/extension.json を新規作成

  - ないものがあればインストール

  ```json
  {
    "recommendations": [
      "vue.volar",
      "vue.vscode-typescript-vue-plugin",
      "editorconfig.editorconfig"
    ],
    "unwantedRecommendations": []
  }
  ```

### Lint

- install

  ```bash
  npm install -D @nuxt/eslint-config eslint @nuxtjs/eslint-config-typescript
  ```

- .eslintrc.yml を新規作成

  ```
  root: true
  extends:
  - "@nuxtjs/eslint-config-typescript"
  rules:
  no-console:
      - off
  ```

### src ディレクトリ作成

- Nuxt で予約されているディレクトリの一部を src/ に追加

  ```bash
  mkdir src
  mkdir src/assets
  mkdir src/components
  mkdir src/composables
  mkdir src/layouts
  mkdir src/pages
  mkdir src/plugins
  mkdir src/public
  ```

- src のディレクトリを src/ に変更
  - nuxt.config.ts 差し替え
  - typescript の strict を trueに
  
    ```typescript
    // https://nuxt.com/docs/api/configuration/nuxt-config
    export default defineNuxtConfig({
      srcDir: "src/"
    })
    ```

## Vuetify3追加

### インストール 

- Vuetify3 インストール

  ```bash
  npm install vuetify@next vite-plugin-vuetify @mdi/font
  ```

- nuxt.config.ts

  - vuetify の設定を追加

    ```typescript
    // https://nuxt.com/docs/api/configuration/nuxt-config
    export default defineNuxtConfig({
      srcDir: "src/",
      build: {
        transpile: ["vuetify"]
      },
      vite: {
        define: {
          "process.env.DEBUG": false
        }
      }
    })
    ```

- src/plugins/vuetify.ts

  - プラグイン追加

    ```typescript
    // plugins/vuetify.js
    import '@mdi/font/css/materialdesignicons.css'
    import 'vuetify/styles'
    import { createVuetify, ThemeDefinition } from 'vuetify'
    import * as components from 'vuetify/components'
    import * as directives from 'vuetify/directives'

    export default defineNuxtPlugin((nuxtApp) => {
      const myCustomTheme: ThemeDefinition = {
        dark: false,
        colors: {
          background: '#F5F5F5',
          primary: '#002b6c',
        }
      }
      const vuetify = createVuetify({
        ssr: true,
        components,
        directives,
        theme: {
          defaultTheme: 'myCustomTheme',
          themes: {
            myCustomTheme
          }
        },
      })
      nuxtApp.vueApp.use(vuetify)
    })
    ```

### サンプルページ作成

- app.vue 削除 （デフォルトページ削除）

  ```bash
  rm app.vue
  ```

- src/pages/index.vue (ルートページ作成)

  ```vue
  <script setup lang='ts'>

  interface planet {
    title: string,
    image: string,
    description: string,
    distanceFromSun: string
  }

  const { data: planets } = await useFetch<planet[]>('https://api.nuxtjs.dev/planets')

  onMounted(() => {
    console.log(process.env.NODE_ENV)
  })
  </script>

  <template>
    <v-app>
      <v-main>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4" lg="3" v-for="item in planets">
              <v-card height='100%'>
                <v-img :src="item.image" height="250px" />
                <v-card-title>
                  {{ item.title }}
                </v-card-title>
                <v-card-text>
                  {{ item.description }}
                  <div class="my-4">
                    {{ item.distanceFromSun }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  ```

### 起動確認

- 作成した画面を表示
  - Vuetify が適用されている。
  - icon が表示されている。

```bash
npm run dev
```

- ここまでの package.json

```
{
  "private": true,
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "devDependencies": {
    "@nuxt/eslint-config": "^0.1.1",
    "@nuxtjs/eslint-config-typescript": "^12.0.0",
    "eslint": "^8.32.0",
    "nuxt": "^3.0.0",
    "serverless": "^3.26.0"
  },
  "dependencies": {
    "@mdi/font": "^7.1.96",
    "vite-plugin-vuetify": "^1.0.1",
    "vuetify": "^3.1.2"
  }
}
```

## Cognito

- ログイン認証機能
  - /login ログインページ
  - /logout ログアウト
  - /groups/～ groups配下は認証されていないと遷移させない。
  - 認証情報がない場合は、/loginに遷移

### Cognito を用意する。

- テンプレートファイルを作成

  - cognito_template.yml参照

- cfnでデプロイ

  ```bash
  aws cloudformation deploy --template-file cognito_template.yml --stack-name ************
  ```

### ユーザー情報の保存先を用意する。

- composables/state.ts

  - Nuxt3は、useStateが整備されているので、それを使ってログインユーザ情報をグローバル管理する。
  - ユーザー情報を持ちまわれるようになる（vuex/pinia相当）
  
  ```typescript
  interface User { id: string; password: string }
  export const useLoginUser = () =>
    useState<User>("login-user", () => {
      console.log("retrieving user info...")
      return {
        id: "",
        password: "",
      }
    })
  ```

### Cognitoの設定値を登録する。

- /aws-exports.ts

  - congitoの設定を入れる。

  ```
  export default {
    userPoolId: '************************',
    userPoolWebClientId: '**************************',
    region: '**************'
  }
  ```

- src/middleware/auth.global.ts

  - ファイル名に.globalを付けると、すべてのページで最初に読み込まれる。
  - 認証されているかチェックして、loginページに飛ばす。

  ```typescript
  import { Auth } from '@aws-amplify/auth'

  export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.path == '/logout') {
      await Auth.signOut()
      return navigateTo('/login')
    } else {
      try {
        const currentAuthUser = await Auth.currentAuthenticatedUser()
        console.log("middleware", currentAuthUser)
      } catch (error) {
        if (to.path != '/login') {
          return navigateTo('/login')
        }
      }
    }
  })
  ```

- /src/Layouts/default.vue

  - ログインページ以外のレイアウト

  ```vue
  <script setup lang='ts'>
  import { useLoginUser } from '@/composables/state'
  const user = useLoginUser()
  const title = "Nuxt3-app"
  const drawer = ref(true)

  const items = computed(() => {
    return [
      { title: 'ダッシュボード', icon: 'mdi-view-dashboard', to: '/groups/' },
    ]
  })

  </script>

  <template>
    <v-app>
      <v-app-bar dark color="primary" app>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>
        {{ user.id }}
        <v-btn href="./"><v-icon>mdi-logout</v-icon></v-btn>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" permanent app>
        <v-list>
          <v-list-item v-for="(item, i) in items" :key="i" :value="item.title" :to="item.to">
            <v-list-item-title>
              <v-icon color="primary" :icon="item.icon" class="pb-2" />
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <slot />
      </v-main>
    </v-app>
  </template>
  ```

- /src/Layouts/login.vue

  - ログインページのレイアウト

  ```
  <template>
    <v-app>
      <slot />
    </v-app>
  </template>
  ```

- src/pages/login.vue

  - ログインページ

  ```vue
  <script setup lang='ts'>
  import { Auth } from '@aws-amplify/auth'
  import awsconfig from '@/../aws-exports'
  import { useLoginUser } from '@/composables/state'

  definePageMeta({
    layout: "login",
  })

  Auth.configure(awsconfig)

  const user = useLoginUser()
  const valid = ref(false)
  const alert = ref(false)
  const error = ref('')
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
      await Auth.signIn(user.value.id, user.value.password)
      navigateTo('/groups/')
    } catch (err: any) {
      alert.value = true
      if (err && err.message) {
        if (err.message == 'Incorrect username or password.' || err.message == 'User does not exist.') {
          error.value = 'ユーザIDまたはパスワードが正しくありません。'
        } else if (err.message == 'Password attempts exceeded') {
          error.value = 'パスワード試行回数が上限を超えました。'
        } else {
          error.value = err.message
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
            <v-alert type="error" v-model="alert" closable>{{ error }}</v-alert>
            <v-card-title class="font-weight-bold mb-4">ログイン</v-card-title>
            <v-form v-model="valid">
              <v-card-text>
                <p class="font-weight-bold">ユーザー名:</p>
                <v-text-field v-model="user.id" variant="outlined" density="compact" :rules="Rules.id"
                  autocomplete="off" />
                <p class="font-weight-bold">パスワード:</p>
                <v-text-field v-model="user.password" variant="outlined" density="compact" type="password"
                  :rules="Rules.password" autocomplete="new-password" />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn block variant="elevated" :disabled="!valid" color="primary" @click="clickSignIn">ログイン</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  ```

- src/pages/groups/index.vue

  - 適当に作成
  - src/pages/index.vue を移動

### Nuxt3（Vite）とAmplifyの併用時の問題対応

- nuxt.config.ts

  ```typescript
  vite: {
    define: {
      'process.env.DEBUG': false,
      'window.global': {},
    },
    resolve: {
      alias: {
        './runtimeConfig': './runtimeConfig.browser'
      }
    }
  },
  ```

  - npm run dev
    - 'window.global': {}, を追加
  - npm run build
    - './runtimeConfig': './runtimeConfig.browser' を追加

## Storybook

T.B.D.

## Vitest?

T.B.D.

## Cypress?

T.B.D.
