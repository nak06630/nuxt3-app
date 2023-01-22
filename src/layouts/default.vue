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
