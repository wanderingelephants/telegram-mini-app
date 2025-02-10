<template>
<v-responsive>
  <v-container fluid class="fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <v-col
            cols="12"
            md="6"
            order="first"
            order-md="first"
            class="left-panel"
            
          >
          
              <!--<google-sign-in/>  -->
       <prompt-chat :distilledModel="distilledModel" :title="title" :subTitles="subTitles" :userInputLabel="userInputLabel" :debug="debug"></prompt-chat>
      
              
      </v-col>
      <v-col cols="12" md="6" order="last" order-md="last" class="right-panel">
        <v-card-text v-if="loggedInGoogle === true">Welcome {{userGoogle.displayName}}</v-card-text>
            <v-card>
              <v-card-title>We are NOT registered with SEBI.</v-card-title>
              <v-card-title class="subtitle-wrap">No Investment advice. Only providing DIY query tools.</v-card-title>
            </v-card>
        </v-col> 
    </v-row>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
    >
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="showError = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</v-responsive>
</template>

<script>
import { mapState } from "vuex";

//import GoogleSignIn from '../components/GoogleSignIn'
import api from './api'
import MutualFundAnalysis from '../components/MutualFundAnalysis.vue'
import PromptChat from "./PromptChat.vue"

export default {
  name: 'ChatApp',
  components: {
    MutualFundAnalysis, PromptChat
  },  
  data() {
    return {
      messages: [],
      userInput: '',
      isLoading: false,
      showError: false,
      errorMessage: '',
      fundList: [],
      selectedFunds: [],
      portfolio: [],
      compareData: {},
      searchText: '',
      title: 'Stocks Helper Agent',
      subTitles: ['Ask what Google/ChatGPT cannot answer. E.g.', 'In which companies, employees or management bought shares in the open market, in the last 3 months', 'Last one month, which companies made preferential offer announcements', '** Trained on Indian data, can make mistakes'],
      userInputLabel: "This is an AI tool. Double Check",
      debug: false,
      distilledModel: "stocks_reasoning",
      analysisTypes: [
      {
        name: 'Overlap',
        color: 'primary',
        icon: 'mdi-compare'
      },
      {
        name: 'Diversification',
        color: 'success',
        icon: 'mdi-chart-pie'
      },
      {
        name: 'Performance',
        color: 'info',
        icon: 'mdi-chart-line'
      },
      {
        name: 'Fees',
        color: 'warning',
        icon: 'mdi-alert-circle-outline'
      }
    ]
    
    }
  },
  computed: mapState([
    // map this.count to store.state.count
    "loggedInGoogle",
    "userGoogle",
  ]),
  methods: {
    customFilter(item, queryText) {
      const itemText = item.toLowerCase()
      const searchText = queryText.toLowerCase()
      const searchWords = searchText.split(/\s+/)
      return searchWords.every(word => itemText.includes(word))
  },
    async fetchFundList(){
      try {
        const response = await api.get('/api/mutualfunds/list')
        this.fundList = response.data.map(m => {
          let returnsLabel = m.return_3Y ? " (3 Y Returns " +m.return_3Y + " %)" : ""
          for (let i=1; i<=m.star_rating; i++) returnsLabel += "⭐";
          return {
            "name": m.name,
            "displayName": m.name +  returnsLabel
          }
        })
      } catch (error) {
        console.error('Error fetching fund list:', error)
      }
    },
    
    async sendCompare(){
      try {
        const response = await api.post('/api/mutualfunds/compare', {
         "fundList": this.selectedFunds
        })
        this.compareData = response.data
      
      } catch (error) {
        console.error('Error in sendCompare:', error)
      }
    },
    handleSearch(val) {
      // The search text will be available in 'val'
      this.searchText = val;
    },
    handleFundSelection(value){
      //this.searchText = ""
      this.portfolio.value = value.map(name => {
        const fund = this.fundList.find(f => f.name === name)
        return {
          ...fund,
          currentValue: '',
          investedDate: '',
          investedAmount: ''
        }
      })
      
    },
    
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  },

  async mounted() {   
	  if (this.fundList.length == 0)
    await this.fetchFundList()
  }
}
</script>
<style scoped>
.message-content {
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.5;
  max-width: 100%;
}
.subtitle-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}
.max-width-75 {
  max-width: 75%;
}

/* Add these styles if you want to preserve specific formatting */
.v-list-item-content {
  width: 100%;
}

.v-list-item {
  align-items: flex-start;
}
.max-width-75 {
  max-width: 75%;
}

.text-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}

/* Custom scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
.left-panel {
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.right-panel {
  height: 100vh;
  overflow-y: auto;
}

@media (max-width: 960px) {
  .left-panel {
    height: auto;
    position: relative;
  }
}
</style>