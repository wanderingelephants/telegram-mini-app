import { createRouter, createWebHistory } from 'vue-router'
import Carousel from '@/views/Carousel.vue'
import PrivacyPolicy from '@/views/PrivacyPolicy.vue'
import ContactUs from '@/views/ContactUs.vue'
import AboutUs from '@/views/AboutUs.vue'
import Fields from '@/utils/Fields'
import SettingsPage from '@/views/SettingsPage.vue'
import WebScraper from '@/views/WebScraper.vue'
import Utils from '@/views/Utils.vue'
//import Stocks from '@/views/Stocks.vue'
import Tools from '@/views/Tools.vue'
import ArrayView from '@/views/ArrayView.vue'

import PromptInstruct from '@/views/PromptInstruct.vue'
import Assistant from '@/views/Assistant.vue'
import cmots from '@/views/cmots.vue'
import ChatView from '@/views/ChatView.vue'
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
    component: () => import('../components/Principles')
  },
  {
    path: '/fields',
    name: 'Fields',
    component: () => import('../utils/Fields')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsPage
  },
  {
    path: '/info',
    name: 'Scraper',
    component: WebScraper
  },
  {
    path: '/cmots',
    name: 'cmots',
    component: cmots
  },
  {
    path: '/assistant',
    name: 'Assistant',
    component: Assistant
  },
  {
    path: '/share/:uuid',
    name: 'ChatView',
    component: ChatView
  },
  {
    path: '/promptInstruct',
    name: 'PromptInstruct',
    component: PromptInstruct
  },
  {
    path: '/dipsip',
    name: 'DipSip',
    component: () => import('@/views/DipSipChat.vue')
  },
  {
    path: '/etfList',
    name: 'ETFPage',
    component: () => import('@/views/ETFPage.vue')
  },
  {
    path: '/mutualfunds',
    name: 'MutualFunds',
    component: () => import('@/views/MutualFund.vue')
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing
  },
  {
    path: '/riskProfile',
    name: 'RiskProfile',
    component: () => import('@/views/RiskProfile.vue') 
  },
  {
    path: '/utils',
    name: 'Utils',
    component: Utils
  },
  {
    path: '/tools',
    name: 'Tools',
    component: Tools
  },
  {
    path: '/arrayview',
    name: 'ArrayView',
    component: ArrayView
  },
  {
    path: '/company/:symbol',
    name: 'CompanyDetails',
    component: () => import('@/views/Company.vue'),
    props: true
  },
  {
    path: '/watchlist',
    name: 'WatchList',
    component: () => import('@/views/WatchList.vue'),
    props: true
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