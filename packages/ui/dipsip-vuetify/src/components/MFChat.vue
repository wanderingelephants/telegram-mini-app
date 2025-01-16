<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height pa-0">
        <!-- Responsive row - will stack on mobile -->
        <v-row no-gutters class="fill-height">
          <!-- Portfolio Panel - Full width on mobile (order="first"), half width on larger screens -->
          <v-col
            cols="12"
            md="6"
            order="last"
            order-md="first"
            class="fill-height"
          >
            <v-card class="ma-2">
              <v-card-title>Mutual Fund Analysis</v-card-title>
              <v-card-subtitle class="text-subtitle-2">
                Compare funds, analyze portfolio, or get fund details. Select multiple funds below.
              </v-card-subtitle>
              <!-- Analysis Type Chips -->
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
                <!-- Fund Selector -->
                <v-autocomplete
                  v-model="selectedFunds"
                  :items="fundList"
                  item-title="displayName"
                  item-value="schemeCode"
                  :label="'Select Mutual Funds ' + (selectedFunds.length ? `(${selectedFunds.length} selected)` : '')"
                  multiple
                  chips
                  closable-chips
                  persistent-hint
                  :hint="getSelectionHint(selectedFunds.length)"
                  @update:model-value="handleFundSelection"
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

                <!-- Portfolio Table with horizontal scroll on small screens -->
                <div class="overflow-x-auto">
                  <v-table v-if="portfolio.length > 0">
                    <thead>
                      <tr>
                        <th>Fund Name</th>
                        <th>Current Value</th>
                        <th>Invested Date</th>
                        <th>Invested Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="fund in portfolio" :key="fund.schemeCode">
                        <td>{{ fund.name }}</td>
                        <td>
                          <v-text-field
                            v-model="fund.currentValue"
                            type="number"
                            variant="outlined"
                            density="compact"
                            hide-details
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="fund.investedDate"
                            type="date"
                            variant="outlined"
                            density="compact"
                            hide-details
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="fund.investedAmount"
                            type="number"
                            variant="outlined"
                            density="compact"
                            hide-details
                          ></v-text-field>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card-text>
            </v-card>

            <!-- Analysis Results -->
            <v-card v-if="analysisResults" class="ma-2 mt-4">
              <v-card-title>Analysis Results</v-card-title>
              <v-card-text>
                <div class="overflow-x-auto">
                  <v-table v-if="analysisResults.type === 'holdings'">
                    <thead>
                      <tr>
                        <th>Stock Name</th>
                        <th class="text-right">Weight (%)</th>
                        <th>Present in Funds</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(holding, index) in analysisResults.data" :key="index">
                        <td>{{ holding.stockName }}</td>
                        <td class="text-right">{{ holding.weight.toFixed(2) }}%</td>
                        <td>{{ holding.funds.join(', ') }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Chat Panel - Full width on mobile (order="last"), half width on larger screens -->
          <v-col
            cols="12"
            md="6"
            order="first"
            order-md="last"
            class="fill-height"
          >
            <v-card class="fill-height d-flex flex-column ma-2">
              <v-card-title>Portfolio Assistant</v-card-title>
              
              <!-- Chat Messages -->
              <v-card-text 
                class="flex-grow-1 overflow-y-auto" 
                ref="chatContainer"
		style="height: calc(100vh - 300px);">

                <div v-for="(message, index) in chatMessages" :key="index" 
                     :class="['d-flex', message.role === 'user' ? 'justify-end' : 'justify-start']">
                  <v-card
                    :color="message.role === 'user' ? 'primary' : 'grey-lighten-3'"
                    :class="['ma-2', 'pa-3', 'rounded-lg', { 'white--text': message.role === 'user' }]"
                    max-width="80%"
                  >
                    {{ message.content }}
                  </v-card>
                </div>
              </v-card-text>

              <!-- Message Input -->
              <v-card-actions class="pa-4">
                <v-text-field
                  v-model="currentMessage"
                  label="Type your message..."
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  @keyup.enter="sendMessage"
                  append-inner-icon="mdi-send"
                  @click:append-inner="sendMessage"
                ></v-text-field>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<script>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
//import mflist from './mflist.json'

export default {
  name: 'App',
  setup() {
    const fundList = ref([])
    const selectedFunds = ref([])
    const portfolio = ref([])
    const chatMessages = ref([])
    const currentMessage = ref('')
    const analysisResults = ref(null)
    const chatContainer = ref(null)

    const analysisTypes = ref([
      {
        name: 'Fund Comparison',
        color: 'primary',
        icon: 'mdi-compare',
        description: 'Compare multiple funds for overlap, performance, and more'
      },
      {
        name: 'Portfolio Analysis',
        color: 'success',
        icon: 'mdi-chart-box',
        description: 'Analyze your invested funds with amounts and dates'
      },
      {
        name: 'Fund Details',
        color: 'info',
        icon: 'mdi-information',
        description: 'Get detailed information about specific funds'
      }
    ])

    onMounted(async () => {
      await fetchFundList()
    })

    const fetchFundList = async () => {
      try {
        const response = await axios.get('/api/mutualfunds/list')
        fundList.value = response.data.map(m => {
          const returnsLabel = m.Returns_3Y ? " (3 Y Returns " +m.Returns_3Y + " %)" : ""
          return {
            "name": m.name,
            "schemeCode":  m.schemeCode,
            "displayName": m.name +  returnsLabel

          }
        })
        console.log(fundList.value)
	      //fundList.value = mflist
      } catch (error) {
        console.error('Error fetching fund list:', error)
      }
    }

    const handleFundSelection = (value) => {
      console.log('handleFuncSelection', value)
      portfolio.value = value.map(schemeCode => {
        const fund = fundList.value.find(f => f.schemeCode === schemeCode)
        return {
          ...fund,
          currentValue: '',
          investedDate: '',
          investedAmount: ''
        }
      })
      console.log(portfolio.value)
    }

    const getSelectionHint = (count) => {
      if (count === 0) return 'Select funds to compare or analyze'
      if (count === 1) return 'Select more funds for comparison'
      return 'Ask questions about the selected funds'
    }

    const sendMessage = async () => {
      if (!currentMessage.value.trim()) return

      // Create context message if funds are selected
      let displayMessage = currentMessage.value
      if (selectedFunds.value.length > 0) {
        const fundNames = portfolio.value.map(f => f.name).join(', ')
        displayMessage += `\n\nAnalyzing funds: ${fundNames}`
      }

      chatMessages.value.push({
        role: 'user',
        content: displayMessage
      })

      try {
        const selectedFundDetails = portfolio.value.map(fund => ({
          ...fund,
          hasInvestmentDetails: !!(fund.currentValue && fund.investedDate && fund.investedAmount)
        }))

        const response = await axios.post('/api/mutualfunds/chat', {
          message: currentMessage.value,
          mutual_funds: selectedFundDetails
        })

        chatMessages.value.push({
          role: 'assistant',
          content: response.data.message
        })

        if (response.data.analysisData) {
          analysisResults.value = response.data.analysisData
        }

        currentMessage.value = ''

        // Scroll to bottom after message is added
        await nextTick()
        if (chatContainer.value) {
          chatContainer.value.$el.scrollTop = chatContainer.value.$el.scrollHeight
        }
      } catch (error) {
        console.error('Error sending message:', error)
        chatMessages.value.push({
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.'
        })
      }
    }

    return {
      fundList,
      selectedFunds,
      portfolio,
      chatMessages,
      currentMessage,
      analysisResults,
      chatContainer,
      analysisTypes,
      handleFundSelection,
      sendMessage,
      getSelectionHint
    }
  }
}
</script>
<style>
/* Global styles for responsiveness */
.fill-height {
  height: 100%;
}

.v-table {
  width: 100%;
}

/* Make tables responsive */
.overflow-x-auto {
  overflow-x: auto;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
}

/* Adjust spacing on mobile */
@media (max-width: 600px) {
  .v-card-text {
    padding: 8px !important;
  }
  
  .v-table {
    font-size: 0.875rem;
  }
}
</style>
