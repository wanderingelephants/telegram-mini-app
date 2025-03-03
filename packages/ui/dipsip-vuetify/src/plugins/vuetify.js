/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
//import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { mdiSend, mdiChatProcessing, mdiCompare, mdiChartPie, mdiChartLine, 
  mdiCurrencyRupee, mdiInformationOutline, mdiMinus, mdiPlus,
mdiClose, mdiCircle, mdiBrain } from '@mdi/js'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases:{
      ...aliases,
      mdiSend,
      mdiChatProcessing,
      mdiCompare,
      mdiChartPie,
      mdiChartLine,
      mdiCurrencyRupee,
      mdiInformationOutline,
      mdiMinus,
      mdiPlus,
      mdiClose,
      mdiCircle,
      mdiBrain
    },
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
  },
})
