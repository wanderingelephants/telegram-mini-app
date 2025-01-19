/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createStore } from 'vuex'
const store = createStore({
    state: {
        userTG: {},
        loggedInTG: false,
        userGoogle: {},
        loggedInGoogle: false
    },
    mutations: {
      setUserTG (state, userTG) {
        state.userTG = userTG
      },
      setloggedInTG(state, loggedInTG){
        state.loggedInTG = loggedInTG
      },
      setUserGoogle (state, userGoogle) {
        state.userGoogle = userGoogle
      },
      setloggedInGoogle(state, loggedInGoogle){
        console.log("vuexStore set userGoogle", loggedInGoogle)
        state.loggedInGoogle = loggedInGoogle
      }
    },
    getters:{
        userTG: function(state){
            return state.userTG
        },
        loggedInTG: function(state){
            return state.loggedInTG
        },
        userGoogle: function(state){
          console.log("vuexStore get userGoogle", state.userGoogle)
          return state.userGoogle
        },
        loggedInGoogle: function(state){
          return state.loggedInGoogle
        }
    }
})


const app = createApp(App)
app.use(store)

registerPlugins(app)

app.mount('#app')
