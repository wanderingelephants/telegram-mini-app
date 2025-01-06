import { createRouter, createWebHistory } from 'vue-router'
import Carousel from '@/views/Carousel.vue'
import ETFPage from '@/views/ETFPage.vue'
import RiskProfile from '@/views/RiskProfile.vue'
import TheWelcome from '../components/TheWelcome'
import SettingsPage from '@/views/SettingsPage.vue'
import DipSip from '@/views/DipSip.vue'
import Postman from '@/views/Postman.vue'
import Stocks from '@/views/Stocks.vue'
import KiteConnectApp from '../components/KiteConnectApp'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Carousel
  },
  {
    path: '/principles',
    name: 'Principles',
    component: TheWelcome
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
    path: '/etfList',
    name: 'ETFPage',
    component: ETFPage
  },
  {
    path: '/riskProfile',
    name: 'RiskProfile',
    component: RiskProfile
  },
  {
    path: '/postman',
    name: 'Postman',
    component: Postman
  },
  {
    path: '/stocks',
    name: 'Stocks',
    component: Stocks
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
router.beforeEach((to, from) => {
  // Send page view event to Google Analytics
  gtag('event', 'page_view', {
    page_title: to.name,
    page_path: to.path,
    page_location: window.location.href
  })
})


export default router