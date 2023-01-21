<script setup lang='ts'>
const count = ref(0)

onMounted(() => {
  console.log(process.env.NODE_ENV)
})

</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-card>
              <v-card-title>
                Sample
              </v-card-title>
              <v-card-text>
                <v-text-field v-model="count" variant="outlined" density="compact" label="Count" />
              </v-card-text>
              <v-card-action>
                <v-btn class="ma-2" color="primary" @click="count++">
                  <v-icon dark right>
                    mdi-checkbox-marked-circle
                  </v-icon>
                  Accept
                </v-btn>
                <v-btn class="ma-2" dark @click="count = 0">
                  <v-icon dark left>
                    mdi-minus-circle
                  </v-icon>Cancel
                </v-btn>
              </v-card-action>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
