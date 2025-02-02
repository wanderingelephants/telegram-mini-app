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
          
              <!--<google-sign-in/> -->
       <prompt-chat :systemPrompt="systemPrompt" :title="title" :subTitles="subTitles" :userInputLabel="userInputLabel" :debug="debug"></prompt-chat>
      
              
      </v-col>
      <v-col cols="12" md="6" order="last" order-md="last" class="right-panel">
        <v-card-text v-if="loggedInGoogle === true">Welcome {{userGoogle.displayName}}</v-card-text>
            <v-card>
              <v-card-title>Select 2 or More Funds</v-card-title>
              <v-card-subtitle class="subtitle-wrap ">
                Reduce Overlap
              </v-card-subtitle>
              <v-card-subtitle class="subtitle-wrap ">
                Fee of ETFs can be 10X lower than Mutual Funds. 
                <a href="/etfList">See ETFs</a>
              </v-card-subtitle>
              <v-card-text class="pb-0">
                <v-chip
                  v-for="type in analysisTypes"
                  :key="type.name"
                  class="me-2 mb-2"
                  :color="type.color"
                  variant="outlined"
                >
                  <v-icon start>{{ type.icon }}</v-icon>
                  {{ type.name }}
                </v-chip>
              </v-card-text>
              <v-card-text>
                <v-btn :disabled="selectedFunds.length <= 1" @click="sendCompare(selectedFunds)" color="amber">Compare</v-btn>
              
                <v-autocomplete
                  v-model="selectedFunds"
                  :items="fundList"
                  item-title="displayName"
                  :custom-filter="customFilter"
                  item-value="name"
                  :label="'Select Mutual Funds ' + (selectedFunds.length ? `(${selectedFunds.length} selected)` : '')"
                  multiple
                  chips
                  closable-chips
                  persistent-hint
                  hint="Partial match works while typing e.g. 'Motilal Small'"
                  @update:model-value="handleFundSelection"
                  :search="searchText"
                  @update:search="handleSearch"
                >
                  <template v-slot:chip="{ props, item }">
                    <v-chip
                      v-bind="props"
                      :text="item.raw.name"
                      variant="elevated"
                    >
                      <v-icon start>mdi-chart-line</v-icon>
                      {{ item.raw.name }}
                    </v-chip>
                  </template>
                </v-autocomplete>
                </v-card-text>
              <mutual-fund-analysis :analysisReport="compareData" v-if="compareData.overlaps"></mutual-fund-analysis>
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
      title: 'Mutual Fund Helper Agent',
      subTitles: ['Ask what Google/ChatGPT cant answer. E.g.', '-किन म्यूचुअल फंडों में रिटर्न 20% से अधिक है, शुल्क 0.5% से कम है', '-help me understand REITs and InvITs','-Which stocks are present in only 2 small cap funds', '** Trained on Indian data, can make mistakes'],
      userInputLabel: "This is an AI tool. Double Check",
      debug: false,
      systemPrompt: "mf_reasoning",
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
    getSelectionHint(count){
      /*if (count === 0) return 'Select funds to compare or analyze'
      if (count === 1) return 'Select more funds for comparison'
      return 'Ask questions about the selected funds'*/
      return ''
    },
    async sendMessage() {
      if (!this.userInput.trim()) return;

      const userMessage = {
        role: 'user',
        content: this.userInput.trim()
      };

      // Add user message to chat
      this.messages.push(userMessage);
      this.userInput = '';
      this.isLoading = true;

      try {
	      //For non-streaming
	      /*
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [...this.messages],
            model: this.model
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        // Add assistant's response to chat
        this.messages.push({
          role: 'assistant',
          content: data.response
        }); */
	      // For streaming version:

	      const response = await fetch('/api/mutualfunds/chatStream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        messages: [...this.messages]
      })
    });

    // Create reader from response body
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let currentResponse = '';

    // Read the stream
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      // Decode the chunk and split into lines
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(5));
            if (data.error) {
              this.showError = true;
              this.errorMessage = data.error;
              break;
            }


            currentResponse += data.response;
            // Update the UI with the streaming response
            if (this.messages[this.messages.length - 1]?.role === 'assistant') {
              this.messages[this.messages.length - 1].content = currentResponse;
            } else {
              this.messages.push({
                role: 'assistant',
                content: currentResponse
              });
            }

            if (data.done) {
              break;
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    }


      } catch (error) {
        console.error('Error:', error);
        this.errorMessage = 'Failed to get response from the assistant';
        this.showError = true;
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  },

  /*watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    },
    '$store.state.loggedInGoogle': {
    async handler(newValue) {
      if (newValue === true) {
        await this.fetchFundList();
      }
    },
    immediate: true  
  }
  },*/

  async mounted() {
	  //if  (this.loggedInGoogle == true)
    console.log("mounted mutual fund")
    if (this.fundList.length == 0)
    await this.fetchFundList()
    // Initial scroll to bottom
    //this.scrollToBottom();
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