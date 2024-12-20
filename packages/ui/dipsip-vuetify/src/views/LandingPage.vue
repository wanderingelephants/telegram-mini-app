<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="8">
        <v-card elevation="12" class="pa-6 text-center">
          <v-card-title class="text-h4 mb-4">
            Dip Sip ETFs
          </v-card-title>
          
          <v-card-text>
            <p class="text-body-1">
              This is a responsive Telegram Mini App built with Vue3 and Vuetify.
            </p>
          </v-card-text>
          
          <v-card-actions class="justify-center">
            <v-btn 
              color="primary" 
              variant="elevated" 
              to="/profile"
            >
              Go to Profile
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Any landing page logic can be added here
</script>

<style scoped>
.v-card {
  max-width: 500px;
  margin: 0 auto;
}
</style>