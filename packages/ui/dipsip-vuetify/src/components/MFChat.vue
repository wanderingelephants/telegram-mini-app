<template>
      <v-container>
        <v-card class="mb-4">
          <v-card-title>Portfolio Analysis</v-card-title>
          <v-card-text>
            <!-- Fund Selector -->
            <v-autocomplete
              v-model="selectedFunds"
              :items="fundList"
              item-title="name"
              item-value="schemeCode"
              multiple
              chips
              closable-chips
              label="Select Mutual Funds"
              @update:model-value="handleFundSelection"
            ></v-autocomplete>

            <!-- Portfolio Table -->
            <v-table v-if="portfolio.length > 0">
              <thead>
                <tr>
                  <th>Fund Name</th>
                  <th>Current Value</th>
                  <th>Invested Date</th>
                  <th>Invested Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="fund in portfolio" :key="fund.schemeCode">
                  <td>{{ fund.name }}</td>
                  <td>
                    <v-text-field
                      v-model="fund.currentValue"
                      density="compact"
                      type="number"
                      variant="outlined"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="fund.investedDate"
                      density="compact"
                      type="date"
                      variant="outlined"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="fund.investedAmount"
                      density="compact"
                      type="number"
                      variant="outlined"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      color="error"
                      variant="text"
                      @click="removeFund(fund.schemeCode)"
                    ></v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Analysis Results Section -->
        <v-card v-if="analysisResults" class="mb-4">
          <v-card-title>Analysis Results</v-card-title>
          <v-card-text>
            <v-table v-if="analysisResults.type === 'holdings'">
              <thead>
                <tr>
                  <th>Stock Name</th>
                  <th>Total Weight (%)</th>
                  <th>Present in Funds</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="holding in analysisResults.data" :key="holding.stockName">
                  <td>{{ holding.stockName }}</td>
                  <td>{{ holding.weight.toFixed(2) }}%</td>
                  <td>{{ holding.funds.join(', ') }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <!-- Chat Interface -->
        <v-card>
          <v-card-title>Chat Interface</v-card-title>
          <v-card-text>
            <div class="chat-messages" ref="chatContainer">
              <div v-for="(message, index) in chatMessages" :key="index" 
                   :class="['message', message.role]">
                {{ message.content }}
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-text-field
              v-model="currentMessage"
              label="Type your question"
              @keyup.enter="sendMessage"
              append-inner-icon="mdi-send"
              @click:append-inner="sendMessage"
            ></v-text-field>
          </v-card-actions>
        </v-card>
      </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// State
const fundList = ref([])
const selectedFunds = ref([])
const portfolio = ref([])
const chatMessages = ref([])
const currentMessage = ref('')
const analysisResults = ref(null)

// Fetch fund list
onMounted(async () => {
  try {
    const response = await axios.get('/api/mutualfunds/list')
    fundList.value = response.data
  } catch (error) {
    console.error('Error fetching fund list:', error)
  }
})

// Handle fund selection
const handleFundSelection = () => {
  portfolio.value = selectedFunds.value.map(schemeCode => {
    const fund = fundList.value.find(f => f.schemeCode === schemeCode)
    return {
      ...fund,
      currentValue: '',
      investedDate: '',
      investedAmount: ''
    }
  })
}

// Remove fund from portfolio
const removeFund = (schemeCode) => {
  selectedFunds.value = selectedFunds.value.filter(code => code !== schemeCode)
  portfolio.value = portfolio.value.filter(fund => fund.schemeCode !== schemeCode)
}

// Send message to chat
const sendMessage = async () => {
  if (!currentMessage.value.trim()) return

  // Add user message to chat
  chatMessages.value.push({
    role: 'user',
    content: currentMessage.value
  })

  // Prepare portfolio data
  const portfolioData = portfolio.value.map(fund => ({
    schemeCode: fund.schemeCode,
    name: fund.name,
    currentValue: parseFloat(fund.currentValue),
    investedDate: fund.investedDate,
    investedAmount: parseFloat(fund.investedAmount)
  }))

  try {
    // Send message to backend
    const response = await axios.post('http://localhost:3000/api/chat', {
      message: currentMessage.value,
      portfolio: portfolioData
    })

    // Handle response
    chatMessages.value.push({
      role: 'assistant',
      content: response.data.message
    })

    // If the response includes analysis data, update the analysis results
    if (response.data.analysisData) {
      analysisResults.value = response.data.analysisData
    }

  } catch (error) {
    console.error('Error sending message:', error)
    chatMessages.value.push({
      role: 'assistant',
      content: 'Sorry, there was an error processing your request.'
    })
  }

  // Clear input
  currentMessage.value = ''
}
</script>

<style scoped>
.chat-messages {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  padding: 16px;
  margin-bottom: 16px;
}

.message {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
}

.message.user {
  background-color: #e3f2fd;
  margin-left: 20%;
}

.message.assistant {
  background-color: #f5f5f5;
  margin-right: 20%;
}
</style>