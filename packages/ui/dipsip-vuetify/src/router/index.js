import { createRouter, createWebHistory } from 'vue-router'
import Carousel from '@/views/Carousel.vue'
import ETFPage from '@/views/ETFPage.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'
import ContactUs from '@/views/ContactUs.vue'
import AboutUs from '@/views/AboutUs.vue'

import RiskProfile from '@/views/RiskProfile.vue'
import Principles from '../components/Principles'
import MutualFund from '@/views/MutualFund.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import WebScraper from '@/views/WebScraper.vue'
import DipSip from '@/views/DipSipChat.vue'
import Utils from '@/views/Utils.vue'
import Stocks from '@/views/Stocks.vue'
import PromptInstruct from '@/views/PromptInstruct.vue'
import PromptChat from '@/views/PromptChat.vue'
import Pricing from '@/views/Pricing.vue'
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
    component: Principles
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage
  },
  {
    path: '/scraper',
    name: 'Scraper',
    component: WebScraper
  },
  {
    path: '/promptChat',
    name: 'PromptChat',
    component: PromptChat
  },
  {
    path: '/promptInstruct',
    name: 'PromptInstruct',
    component: PromptInstruct
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
    path: '/mutualfunds',
    name: 'MutualFunds',
    component: MutualFund
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing
  },
  {
    path: '/riskProfile',
    name: 'RiskProfile',
    component: RiskProfile
  },
  {
    path: '/utils',
    name: 'Utils',
    component: Utils
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
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyPolicy
  },
  {
    path: '/about',
    name: 'About',
    component: AboutUs
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactUs
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


export default router