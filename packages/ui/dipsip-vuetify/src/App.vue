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

    <v-app-bar color="#FFA000">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Menu</v-toolbar-title>
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

    <v-footer class="bg-grey-darken-4" v-if="false">
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" class="text-center mt-4 text-white">
            <div class="text-caption">
              © {{ new Date().getFullYear() }} Aidea Solutions Private Limited. All rights reserved.
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
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
  { title: 'Mutual Funds', path: '/mutualfunds' },
  { title: 'ETFs', path: '/etfList' },
  { title: 'Stocks', path: '/stocks' },
  { title: 'Tools', path: '/tools' },
  { title: 'Pricing', path: '/pricing' },
  { title: 'About Us', path: '/about' }
]

const socialIcons = [
  { icon: 'mdi-facebook', link: 'https://facebook.com' },
  { icon: 'mdi-twitter', link: 'https://twitter.com' },
  { icon: 'mdi-linkedin', link: 'https://linkedin.com' },
  { icon: 'mdi-instagram', link: 'https://instagram.com' }
]
</script>

<style>
/* Mobile-first responsive styles */
@media (max-width: 600px) {
  .v-container {
    padding: 8px !important;
  }
}

.disclaimer-section {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.v-footer a:hover {
  opacity: 0.8;
}
</style>