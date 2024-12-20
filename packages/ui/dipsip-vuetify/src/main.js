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
        user: {},
        loggedIn: false
    },
    mutations: {
      setUser (state, user) {
        state.user = user
      },
      setLoggedIn(state, loggedIn){
        state.loggedIn = loggedIn
      }
    },
    getters:{
        user: function(state){
            return state.user
        },
        loggedIn: function(state){
            return state.loggedIn
        }
    }
})


const app = createApp(App)
app.use(store)

registerPlugins(app)

app.mount('#app')
