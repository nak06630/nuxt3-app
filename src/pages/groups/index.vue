<script setup lang='ts'>

interface planet {
  title: string,
  image: string,
  description: string,
  distanceFromSun: string
}

const config = useRuntimeConfig()
const { data: planets } = await useFetch<planet[]>(config.API_BASE + '/planets')
console.log(process.env.NODE_ENV)
console.log(JSON.stringify(config))
</script>

<template>
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
</template>
