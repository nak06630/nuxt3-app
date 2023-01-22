# Installation

## Cognito

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


## Storybook

T.B.D.

## Vitest

T.B.D.

## Utils
