<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Principles</v-card-title>
          <v-card-text>
            <v-text-field 
              v-model="username" 
              label="Username" 
              outlined
            ></v-text-field>
            
            <v-text-field 
              v-model="email" 
              label="Email" 
              outlined
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const email = ref('')
</script>