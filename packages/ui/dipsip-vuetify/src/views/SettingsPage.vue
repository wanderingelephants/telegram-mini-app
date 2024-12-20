<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>App Settings</v-card-title>
          <v-card-text>
            <v-switch
              v-model="notifications"
              label="Enable Notifications"
            ></v-switch>
            
            <v-select
              v-model="theme"
              :items="['Light', 'Dark', 'System']"
              label="Theme"
              outlined
            ></v-select>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const notifications = ref(true)
const theme = ref('System')
</script>