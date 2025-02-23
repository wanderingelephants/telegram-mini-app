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
    <v-btn
      class="chat-fab"
      color="secondary"
      icon
      @click="goToChat"
      size="large"
      elevation="4"
      fixed
    >
      <v-icon>$mdiChatProcessing</v-icon>
    </v-btn>
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
import { useRouter } from 'vue-router'

const drawer = ref(false)
const router = useRouter()

const menuItems = [
  { title: 'Home', path: '/' },
  { title: 'Assistant', path: '/assistant' },
  { title: 'Index Funds', path: '/etfList' },
  { title: 'Mutual Funds', path: '/mutualfunds' },
  { title: 'Stocks', path: '/stocks' },
  { title: 'DipSip', path: '/dipsip' },
  { title: 'Principles', path: '/principles' },
  { title: 'Risk  Profile', path: '/riskProfile' },
  { title: 'Tools', path: '/tools' },
  { title: 'Offering', path: '/pricing' },
  { title: 'About Us', path: '/about' }
]

const goToChat = () => {
  router.push('/assistant')
}

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
.chat-fab {
  position: fixed !important;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}
</style>