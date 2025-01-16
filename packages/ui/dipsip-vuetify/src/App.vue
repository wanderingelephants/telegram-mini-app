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
          @click="drawer = false; handleMenuNavigation(item.path)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="#FFA000" >
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

      <!-- Disclaimer Section -->
      <v-container fluid class="disclaimer-section py-4 bg-grey-lighten-4">
        
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer class="bg-grey-darken-4">
      <v-container fluid>
        <v-row justify="center">
          <!-- Footer Links -->
          <v-col cols="12" sm="9" md="6">
            <v-row justify="center" class="text-center">
              <v-col cols="6" sm="3">
                <router-link to="/privacy" class="text-white text-decoration-none">Privacy Policy</router-link>
              </v-col>
              <v-col cols="6" sm="3">
                <router-link to="/about" class="text-white text-decoration-none">About Us</router-link>
              </v-col>
              <v-col cols="6" sm="3">
                <router-link to="/contact" class="text-white text-decoration-none">Contact Us</router-link>
              </v-col>
            </v-row>
          </v-col>

          <!-- Social Media Links -->
          <v-col cols="12" class="text-center mt-4">
            <v-btn
              v-for="icon in socialIcons"
              :key="icon.icon"
              :href="icon.link"
              target="_blank"
              icon
              variant="text"
              class="mx-2"
              color="white"
            >
              <v-icon>{{ icon.icon }}</v-icon>
            </v-btn>
          </v-col>

          <!-- Copyright -->
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
import { useAnalytics } from '../src/components/useAnalytics'

const { trackButtonClick, trackMenuClick } = useAnalytics()

const handleButtonClick = () => {
  trackButtonClick('submit-form', 'RegisterForm')
  // your existing button logic
}

const handleMenuNavigation = (menuItem) => {
  trackMenuClick(menuItem)
  // your existing navigation logic
}
import { ref } from 'vue'

const drawer = ref(false)

const menuItems = [
  { title: 'Home', path: '/' },
  { title: 'DipSip', path: '/dipsip' },
  { title: 'Principles', path: '/principles' },
  { title: 'Risk  Profile', path: '/riskProfile' },
  { title: 'Mutual Funds', path: '/mutualfunds' },
  { title: 'ETFs', path: '/etfList' },
  { title: 'Stocks', path: '/stocks' }
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