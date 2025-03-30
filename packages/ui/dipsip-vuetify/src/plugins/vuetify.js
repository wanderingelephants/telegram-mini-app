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
import { mdiBank, mdiBrain, mdiCalculator, mdiChatProcessing, mdiChartLine, 
  mdiChartPie, mdiChevronDoubleLeft, mdiChevronDoubleRight, mdiCircle, mdiClose, 
  mdiCommentText, mdiCompare, mdiCurrencyRupee, mdiDelete, mdiDotsHorizontal, 
  mdiFolder, mdiInformationOutline, mdiMagnify, mdiMenu, mdiMicrophone, mdiMinus, mdiPlus, 
  mdiSend, mdiSignalCellularOutline, mdiSquareEditOutline, mdiTrashCan } from '@mdi/js'


// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases:{
      ...aliases,
      mdiBank, mdiBrain, mdiCalculator, mdiChatProcessing, mdiChartLine, 
  mdiChartPie, mdiChevronDoubleLeft, mdiChevronDoubleRight, mdiCircle, mdiClose, 
  mdiCommentText, mdiCompare, mdiCurrencyRupee, mdiDelete, mdiDotsHorizontal, 
  mdiFolder, mdiInformationOutline, mdiMagnify, mdiMenu, mdiMicrophone, mdiMinus, mdiPlus, 
  mdiSend, mdiSignalCellularOutline, mdiSquareEditOutline, mdiTrashCan
    },
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
  },
})
