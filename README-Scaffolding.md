# Installation

## Nuxt3 + Vuetify3 (1/2)

### init

- Nuxt3 + Vuetify3 インストール

  ```bash
  cd nuxt3-app
  npx nuxi init .
  npm install vuetify@next @vuetify/vite-plugin @mdi/font
  ```

### nuxt.config.ts

- 差し替え

  - src のディレクトリを src/ に変更
  - vutify の設定を追加

  ```typescript
  // https://nuxt.com/docs/api/configuration/nuxt-config
  export default defineNuxtConfig({
    srcDir: "src/",
    build: {
      transpile: ["vuetify"],
    },
    vite: {
      define: {
        "process.env.DEBUG": false,
      },
    },
  });
  ```

### src/plugins/vuetify.ts

- 新規作成

  ```typescript
  // plugins/vuetify.js
  // https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html
  import "@mdi/font/css/materialdesignicons.css";
  import "vuetify/styles";
  import { createVuetify } from "vuetify";
  import * as components from "vuetify/components";
  import * as directives from "vuetify/directives";

  export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
      components,
      directives,
    });

    nuxtApp.vueApp.use(vuetify);
  });
  ```

  - ssr の場合は、追加設定？

    ```typescript
    import "@mdi/font/css/materialdesignicons.css";
    import "vuetify/styles";

    const vuetify = createVuetify({
      ssr: true,
    });
    ```

### test

- ここまででいったん起動。起動すればよい。

  ```bash
  npm run dev
  ```

## Nuxt3 + Vuetify3 (2/2)

### src ディレクトリ追加

- Nuxt で予約されているディレクトリを追加
- あわせて app.vue を削除。削除した場合、pages を自動参照する。

  ```
  rm app.vue

  mkdir src
  cd src
  mkdir components
  mkdir composables
  mkdir layouts
  mkdir pages
  ```

### src/pages/index.vue

```vue
<script setup lang="ts">
const count = ref(0);
</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-card>
              <v-card-title> Sample </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="count"
                  variant="outlined"
                  density="compact"
                  label="Count"
                />
                <v-btn color="primary" @click="count++">
                  button {{ count }}
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
```

### test

- 作成した画面を表示
  - Vuetify が適用されている。
  - icon が表示されている。

```bash
npm run dev
```

## 開発環境

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

### VSCode

VSCode の推奨設定を追加

- .vscode/extension.json を作成、以下を記載

  ```json
  {
    "recommendations": [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "Vue.volar"
    ],
    "unwantedRecommendations": []
  }
  ```

## Storybook

T.B.D.

## Vitest

T.B.D.

## Utils
