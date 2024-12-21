import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import DipSip from '@/views/DipSip.vue'
import Postman from '@/views/Postman.vue'
import KiteConnectApp from '../components/KiteConnectApp'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage
  },
  {
    path: '/dipsip',
    name: 'DipSip',
    component: DipSip
  },
  {
    path: '/postman',
    name: 'Postman',
    component: Postman
  },
  {
    path: '/trade',
    name: 'Trade',
    component: KiteConnectApp
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router