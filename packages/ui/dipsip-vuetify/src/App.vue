<template>
  <v-app theme="light">
    <v-navigation-drawer 
      v-model="drawer" 
      temporary 
      location="left"
      mobile-breakpoint="md"
    >
      <v-list>
        <v-list-item 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          @click="drawer = false"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>DipSip ETFs</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)

const menuItems = [
  { title: 'Home', path: '/' },
  { title: 'DipSip', path: '/dipsip' },
  { title: 'Principles', path: '/principles' },
  { title: 'Risk  Profile', path: '/riskProfile' },
  { title: 'ETF List', path: '/etfList' }
]
</script>

<style>
/* Mobile-first responsive styles */
@media (max-width: 600px) {
  .v-container {
    padding: 8px !important;
  }
}
</style>