<template>
  <!-- Remove max-width constraint and use fluid container -->
  <v-container fluid>
    <v-row justify="center">
      <!-- Responsive column that adjusts based on screen size -->
      <v-col cols="12" sm="12" md="10" lg="8" xl="6">
        <v-card class="elevation-2">
          <v-card-title class="text-h5 text-sm-h4 py-4">
            {{ showResults ? 'Your Investment Profile & Recommendations' : 'Investment Profile Assessment' }}
          </v-card-title>

          <v-card-text v-if="!showResults">
            <!-- Progress Section -->
            <v-row class="mb-6">
              <v-col cols="12">
                <v-progress-linear
                  :model-value="progressPercentage"
                  height="20"
                  color="primary"
                  rounded
                >
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
                
                <!-- Progress Info -->
                <div class="mt-2 d-flex flex-column flex-sm-row justify-space-between">
                  <span class="text-subtitle-2">Section: {{ currentSection.title }}</span>
                  <span class="text-subtitle-2">Question {{ currentQuestionNumber }} of {{ totalQuestions }}</span>
                </div>
              </v-col>
            </v-row>

            <!-- Question Section -->
            <v-row>
              <v-col cols="12">
                <h3 class="text-h6 mb-4">
                  {{ currentQuestion.text }}
                </h3>

                <!-- Options with improved responsive layout -->
                <div class="options-container">
                  <v-btn
                    v-for="option in currentQuestion.options"
                    :key="option.value"
                    variant="outlined"
                    class="option-button mb-3 text-start"
                    block
                    height="auto"
                    min-height="48"
                    @click="handleAnswer(option)"
                  >
                    <div class="pa-3 w-100">
                      <div>{{ option.text }}</div>
                      <div v-if="option.note" class="text-caption text-grey mt-1">
                        {{ option.note }}
                      </div>
                    </div>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-text v-else>
            <!-- Results Section -->
            <v-row>
              <v-col cols="12">
                <div class="mb-6">
                  <h3 class="text-h6 mb-2">Risk Profile: {{ riskProfile.title }}</h3>
                  <p class="mb-4">{{ riskProfile.description }}</p>
                  <v-progress-linear
                    :model-value="riskScore"
                    height="20"
                    color="primary"
                    rounded
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ Math.ceil(value) }}%</strong>
                    </template>
                  </v-progress-linear>
                </div>

                <!-- Recommendations Section -->
                <div class="mb-6">
                  <h3 class="text-h6 mb-4">Recommended ETF Allocation:</h3>
                  <v-expansion-panels>
                    <v-expansion-panel
                      v-for="(allocation, category) in recommendedAllocation"
                      :key="category"
                    >
                      <v-expansion-panel-title>
                        <div class="d-flex justify-space-between align-center w-100">
                          <span>{{ category }}</span>
                          <span class="text-primary">{{ allocation.percentage }}%</span>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-list>
                          <v-list-item
                            v-for="etf in allocation.etfs"
                            :key="etf.code"
                          >
                            <v-list-item-title>{{ etf.name }}</v-list-item-title>
                            <v-list-item-subtitle>
                              {{ etf.code }} - {{ etf.weight }}%
                            </v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>

                <!-- Reset Button -->
                <v-row class="mt-6">
                  <v-col cols="12" sm="8" md="6" class="mx-auto">
                    <v-btn
                      block
                      color="primary"
                      @click="resetQuiz"
                    >
                      Retake Assessment
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.options-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-button {
  white-space: normal !important;
  height: auto !important;
  text-transform: none !important;
}

/* Ensure text wraps properly on mobile */
.option-button :deep(.v-btn__content) {
  white-space: normal;
  height: auto;
  flex-wrap: wrap;
  width: 100%;
}

/* Responsive text sizes */
@media (max-width: 600px) {
  .text-h5 {
    font-size: 1.25rem !important;
  }
  
  .text-h6 {
    font-size: 1.125rem !important;
  }
}
</style>

<script setup>
import { ref, computed } from 'vue'

const sections = [
  {
    id: 'demographics',
    title: 'Personal Demographics',
    questions: [
      {
        id: 'age_group',
        text: 'Which age group do you belong to?',
        type: 'demographics',
        options: [
          { 
            value: '18_25', 
            text: '18-25 years', 
            weight: 4, 
            risk_score: 4,
            note: 'Longer investment horizon allows for higher risk capacity'
          },
          { 
            value: '26_35', 
            text: '26-35 years', 
            weight: 4, 
            risk_score: 4,
            note: 'Prime earning years with good risk capacity'
          },
          { 
            value: '36_45', 
            text: '36-45 years', 
            weight: 3, 
            risk_score: 3,
            note: 'Balanced approach recommended'
          },
          { 
            value: '46_55', 
            text: '46-55 years', 
            weight: 2, 
            risk_score: 2,
            note: 'Consider reducing high-risk exposures'
          },
          { 
            value: '56_65', 
            text: '56-65 years', 
            weight: 1, 
            risk_score: 1,
            note: 'Focus on capital preservation'
          },
          { 
            value: 'above_65', 
            text: 'Above 65 years', 
            weight: 1, 
            risk_score: 1,
            note: 'Conservative approach recommended'
          }
        ]
      },
      {
        id: 'employment_status',
        text: 'What is your current employment status?',
        type: 'demographics',
        options: [
          { 
            value: 'salaried', 
            text: 'Salaried (Private Sector)', 
            weight: 3,
            income_stability: 'stable'
          },
          { 
            value: 'govt', 
            text: 'Government Employee', 
            weight: 4,
            income_stability: 'very_stable'
          },
          { 
            value: 'business', 
            text: 'Self-Employed/Business Owner', 
            weight: 2,
            income_stability: 'variable'
          },
          { 
            value: 'professional', 
            text: 'Independent Professional (Doctor/CA/Lawyer etc.)', 
            weight: 3,
            income_stability: 'stable'
          },
          { 
            value: 'retired', 
            text: 'Retired', 
            weight: 1,
            income_stability: 'fixed'
          },
          { 
            value: 'other', 
            text: 'Other/Not Currently Employed', 
            weight: 1,
            income_stability: 'uncertain'
          }
        ]
      },
      {
        id: 'income_source',
        text: 'How would you describe your income stream?',
        type: 'demographics',
        options: [
          { 
            value: 'very_stable', 
            text: 'Very stable with regular increments', 
            weight: 4,
            risk_score: 4
          },
          { 
            value: 'stable', 
            text: 'Stable but limited growth', 
            weight: 3,
            risk_score: 3
          },
          { 
            value: 'variable', 
            text: 'Variable but predictable', 
            weight: 2,
            risk_score: 2
          },
          { 
            value: 'uncertain', 
            text: 'Highly variable/uncertain', 
            weight: 1,
            risk_score: 1
          }
        ]
      }
    ]
  },
  {
    id: 'financial_health',
    title: 'Financial Health Assessment',
    questions: [
      {
        id: 'monthly_savings',
        text: 'What percentage of your monthly income do you save/invest?',
        type: 'savings_capacity',
        options: [
          { value: 1, text: 'Less than 10%', weight: 1, risk_score: 1 },
          { value: 2, text: '10% to 20%', weight: 2, risk_score: 2 },
          { value: 3, text: '20% to 30%', weight: 3, risk_score: 3 },
          { value: 4, text: 'More than 30%', weight: 4, risk_score: 4 }
        ]
      },
      {
        id: 'emergency_fund',
        text: 'Do you have an emergency fund covering your expenses?',
        type: 'financial_security',
        options: [
          { value: 1, text: 'No emergency fund', weight: 0, risk_score: 1 },
          { value: 2, text: '1-3 months of expenses', weight: 2, risk_score: 2 },
          { value: 3, text: '3-6 months of expenses', weight: 3, risk_score: 3 },
          { value: 4, text: 'More than 6 months of expenses', weight: 4, risk_score: 4 }
        ]
      },
      {
        id: 'debt_obligations',
        text: 'What percentage of your monthly income goes towards EMIs/debt payments?',
        type: 'financial_security',
        options: [
          { value: 1, text: 'More than 50%', weight: 1, risk_score: 1 },
          { value: 2, text: '30% to 50%', weight: 2, risk_score: 2 },
          { value: 3, text: '10% to 30%', weight: 3, risk_score: 3 },
          { value: 4, text: 'Less than 10%', weight: 4, risk_score: 4 }
        ]
      }
    ]
  },
  {
    id: 'market_understanding',
    title: 'Market Understanding',
    questions: [
      {
        id: 'market_experience',
        text: 'How long have you been investing in stock markets?',
        type: 'experience',
        options: [
          { value: 1, text: 'Never invested before', weight: 1, risk_score: 1 },
          { value: 2, text: 'Less than 2 years', weight: 2, risk_score: 2 },
          { value: 3, text: '2-5 years', weight: 3, risk_score: 3 },
          { value: 4, text: 'More than 5 years', weight: 4, risk_score: 4 }
        ]
      },
      {
        id: 'volatility_understanding',
        text: 'How well do you understand market volatility and its impact on different sized companies?',
        type: 'experience',
        options: [
          { value: 1, text: 'Limited understanding', weight: 1, risk_score: 1 },
          { value: 2, text: 'Basic understanding of large companies', weight: 2, risk_score: 2 },
          { value: 3, text: 'Good understanding of market dynamics', weight: 3, risk_score: 3 },
          { value: 4, text: 'Deep understanding of all market segments', weight: 4, risk_score: 4 }
        ]
      }
    ]
  },
  {
    id: 'market_cap_preferences',
    title: 'Market Capitalization Preferences',
    questions: [
      {
        id: 'cap_volatility',
        text: 'Different market caps have different volatility levels. Which statement best describes your comfort level?',
        type: 'preference',
        options: [
          { 
            value: 'large_cap', 
            text: 'I prefer stable, well-established companies even if returns are moderate', 
            weight: 1, 
            cap_preference: 'large' 
          },
          { 
            value: 'mid_cap', 
            text: 'I can accept moderate volatility for companies with good growth potential', 
            weight: 2, 
            cap_preference: 'mid' 
          },
          { 
            value: 'small_cap', 
            text: 'I am comfortable with high volatility for potentially higher returns', 
            weight: 3, 
            cap_preference: 'small' 
          },
          { 
            value: 'mixed', 
            text: 'I prefer a mix of different market caps for diversification', 
            weight: 2, 
            cap_preference: 'mixed' 
          }
        ]
      },
      {
        id: 'alternative_assets',
        text: 'Besides Stock Market, which investment asset interest you?',
        type: 'preference',
        options: [
          { value: 'gold', text: 'Gold/Silver', weight: 1, asset: 'precious_metals' },
          { value: 'real_estate', text: 'Real Estate (Commercial)', weight: 1, asset: 'reit' },
          { value: 'infra', text: 'Infrastructure', weight: 1, asset: 'invit' },
          { value: 'none', text: 'Prefer only Stocks', weight: 1, asset: 'equity' }
        ]
      }
    ]
  },
  {
    id: 'risk_assessment',
    title: 'Risk Assessment',
    questions: [
      {
        id: 'investment_horizon',
        text: 'What is your primary investment time horizon?',
        type: 'time_horizon',
        options: [
          { value: 1, text: 'Less than 1 year', weight: 1, risk_score: 1 },
          { value: 2, text: '1-3 years', weight: 2, risk_score: 2 },
          { value: 3, text: '3-5 years', weight: 3, risk_score: 3 },
          { value: 4, text: 'More than 5 years', weight: 4, risk_score: 4 }
        ]
      },
      {
        id: 'loss_tolerance',
        text: 'If your portfolio dropped 20% in a month, what would you do?',
        type: 'risk_tolerance',
        options: [
          { value: 1, text: 'Sell everything immediately', weight: 1, risk_score: 1 },
          { value: 2, text: 'Sell some investments', weight: 2, risk_score: 2 },
          { value: 3, text: 'Hold and wait for recovery', weight: 3, risk_score: 3 },
          { value: 4, text: 'Buy more at lower prices', weight: 4, risk_score: 4 }
        ]
      }
    ]
  }
]

const currentSectionIndex = ref(0)
const currentQuestionIndex = ref(0)
const answers = ref({})
const showResults = ref(false)

const currentSection = computed(() => sections[currentSectionIndex.value])
const currentQuestion = computed(() => currentSection.value.questions[currentQuestionIndex.value])
const currentQuestionNumber = computed(() => {
  let number = 1
  for (let i = 0; i < currentSectionIndex.value; i++) {
    number += sections[i].questions.length
  }
  return number + currentQuestionIndex.value
})

const totalQuestions = computed(() => {
  return sections.reduce((total, section) => total + section.questions.length, 0)
})
const progressPercentage = computed(() => {
  return ((currentQuestionNumber.value - 1) / totalQuestions.value) * 100
})
const riskScore = computed(() => {
  let totalRiskScore = 0
  let totalQuestions = 0

  Object.values(answers.value).forEach(answer => {
    if (answer.risk_score) {
      totalRiskScore += answer.risk_score
      totalQuestions++
    }
  })

  return totalQuestions ? (totalRiskScore / (totalQuestions * 4)) * 100 : 0
})

const riskProfile = computed(() => {
  const score = riskScore.value
  if (score < 25) {
    return {
      title: 'Conservative',
      description: 'You prefer stability and capital preservation. Focus on low-volatility investments with steady returns.'
    }
  } else if (score < 50) {
    return {
      title: 'Moderate',
      description: 'You seek a balance between growth and stability, comfortable with moderate market fluctuations.'
    }
  } else if (score < 75) {
    return {
      title: 'Growth',
      description: 'You prioritize long-term growth and can tolerate significant market volatility.'
    }
  } else {
    return {
      title: 'Aggressive',
      description: 'You seek maximum growth potential and are comfortable with high market volatility.'
    }
  }
})
const calculateRiskProfile = computed(() => {
  const age = answers.value.age_group?.value || ''
  const employmentStatus = answers.value.employment_status?.value || ''
  const incomeStability = answers.value.income_source?.value || ''
  
  let baseRiskScore = riskScore.value

  // Age-based adjustments
  if (age.startsWith('18') || age.startsWith('26')) {
    baseRiskScore *= 1.2 // Increase risk capacity for younger investors
  } else if (age.startsWith('56') || age.startsWith('above')) {
    baseRiskScore *= 0.8 // Reduce risk capacity for older investors
  }

  // Employment stability adjustments
  if (employmentStatus === 'govt') {
    baseRiskScore *= 1.2 // Slightly increase for very stable employment
  } else if (employmentStatus === 'retired' || employmentStatus === 'other') {
    baseRiskScore *= 0.8 // Reduce for uncertain employment
  }

  // Income stability adjustments
  if (incomeStability === 'very_stable') {
    baseRiskScore *= 1.1
  } else if (incomeStability === 'uncertain') {
    baseRiskScore *= 0.8
  }

  // Cap the final score at 100
  const finalScore = Math.min(baseRiskScore, 100)

  if (finalScore < 25) {
    return {
      title: 'Conservative',
      description: 'Based on your age, employment status, and other factors, a conservative approach is recommended. Focus on capital preservation with stable, low-volatility investments.'
    }
  } else if (finalScore < 50) {
    return {
      title: 'Moderate',
      description: 'Your profile suggests a balanced approach. While you have some risk capacity, maintaining stability is important given your circumstances.'
    }
  } else if (finalScore < 75) {
    return {
      title: 'Growth',
      description: 'Your age and income stability support a growth-oriented approach. You can consider a good mix of different market caps while maintaining some safety.'
    }
  } else {
    return {
      title: 'Aggressive',
      description: 'Your young age and stable income support an aggressive growth approach. You can consider higher exposure to mid and small caps.'
    }
  }
})

const recommendedAllocation = computed(() => {
  const profile = riskProfile.value.title
  const age = answers.value.age_group?.value || ''
  const capPreference = answers.value.cap_volatility?.cap_preference || 'mixed'
  const alternativeChoice = answers.value.alternative_assets?.value || 'none'
  
  // Base allocations that will be modified based on preferences
  let baseAllocation = {
    Conservative: {
      equityTotal: 40,
      alternativesTotal: 30,
      debtTotal: 30,
      largeCap: 35,
      midCap: 5,
      smallCap: 0
    },
    Moderate: {
      equityTotal: 60,
      alternativesTotal: 20,
      debtTotal: 20,
      largeCap: 40,
      midCap: 15,
      smallCap: 5
    },
    Growth: {
      equityTotal: 75,
      alternativesTotal: 15,
      debtTotal: 10,
      largeCap: 40,
      midCap: 25,
      smallCap: 10
    },
    Aggressive: {
      equityTotal: 85,
      alternativesTotal: 10,
      debtTotal: 5,
      largeCap: 35,
      midCap: 30,
      smallCap: 20
    }
  }

  // Get base allocation for the risk profile
  let allocation = baseAllocation[profile]

  // Final allocation object to return
  let finalAllocation = {}

  // Handle Equity allocation based on cap preference
  if (allocation.equityTotal > 0) {
    // Adjust cap distribution based on user preference
    let equityAllocation = {}
    switch(capPreference) {
      case 'large':
        equityAllocation = {
          'Large Cap Equity': {
            percentage: allocation.equityTotal * 0.8,
            etfs: [
              { name: 'Nifty 50 ETF', code: 'NIFTYBEES', weight: allocation.equityTotal * 0.5 },
              { name: 'Nifty Next 50 ETF', code: 'NIFTYNXT50', weight: allocation.equityTotal * 0.3 }
            ]
          },
          'Mid Cap Equity': {
            percentage: allocation.equityTotal * 0.2,
            etfs: [
              { name: 'Nifty Midcap 150 ETF', code: 'MIDCAPETF', weight: allocation.equityTotal * 0.2 }
            ]
          }
        }
        break
      case 'mid':
        equityAllocation = {
          'Mid Cap Equity': {
            percentage: allocation.equityTotal * 0.6,
            etfs: [
              { name: 'Nifty Midcap 150 ETF', code: 'MIDCAPETF', weight: allocation.equityTotal * 0.6 }
            ]
          },
          'Large Cap Equity': {
            percentage: allocation.equityTotal * 0.4,
            etfs: [
              { name: 'Nifty 50 ETF', code: 'NIFTYBEES', weight: allocation.equityTotal * 0.4 }
            ]
          }
        }
        break
      case 'small':
        equityAllocation = {
          'Small Cap Equity': {
            percentage: allocation.equityTotal * 0.5,
            etfs: [
              { name: 'Nifty Smallcap 250 ETF', code: 'SMALLCAP', weight: allocation.equityTotal * 0.5 }
            ]
          },
          'Mid Cap Equity': {
            percentage: allocation.equityTotal * 0.3,
            etfs: [
              { name: 'Nifty Midcap 150 ETF', code: 'MIDCAPETF', weight: allocation.equityTotal * 0.3 }
            ]
          },
          'Large Cap Equity': {
            percentage: allocation.equityTotal * 0.2,
            etfs: [
              { name: 'Nifty 50 ETF', code: 'NIFTYBEES', weight: allocation.equityTotal * 0.2 }
            ]
          }
        }
        break
      default: // mixed
        equityAllocation = {
          'Large Cap Equity': {
            percentage: allocation.largeCap,
            etfs: [
              { name: 'Nifty 50 ETF', code: 'NIFTYBEES', weight: allocation.largeCap }
            ]
          },
          'Mid Cap Equity': {
            percentage: allocation.midCap,
            etfs: [
              { name: 'Nifty Midcap 150 ETF', code: 'MIDCAPETF', weight: allocation.midCap }
            ]
          },
          'Small Cap Equity': {
            percentage: allocation.smallCap,
            etfs: [
              { name: 'Nifty Smallcap 250 ETF', code: 'SMALLCAP', weight: allocation.smallCap }
            ]
          }
        }
    }
    finalAllocation = { ...finalAllocation, ...equityAllocation }
  }

  // Handle Alternative allocation based on user choice
  if (allocation.alternativesTotal > 0) {
    switch(alternativeChoice) {
      case 'gold':
        finalAllocation['Precious Metals'] = {
          percentage: allocation.alternativesTotal,
          etfs: [
            { name: 'Gold BeES', code: 'GOLDBEES', weight: allocation.alternativesTotal * 0.7 },
            { name: 'Silver ETF', code: 'SILVERBEES', weight: allocation.alternativesTotal * 0.3 }
          ]
        }
        break
      case 'real_estate':
        finalAllocation['Real Estate'] = {
          percentage: allocation.alternativesTotal,
          etfs: [
            { name: 'Embassy REIT', code: 'EMBASSY', weight: allocation.alternativesTotal }
          ]
        }
        break
      case 'infra':
        finalAllocation['Infrastructure'] = {
          percentage: allocation.alternativesTotal,
          etfs: [
            { name: 'PowerGrid InvIT', code: 'PGINVIT', weight: allocation.alternativesTotal }
          ]
        }
        break
      case 'none':
        // If no alternative preference, redistribute to equity and debt
        const extraAllocation = allocation.alternativesTotal / 2
        allocation.equityTotal += extraAllocation
        allocation.debtTotal += extraAllocation
        break
    }
  }

  // Add Debt allocation
  if (allocation.debtTotal > 0) {
    finalAllocation['Debt'] = {
      percentage: allocation.debtTotal,
      etfs: [
        { name: 'Liquid BeES', code: 'LIQUIDBEES', weight: allocation.debtTotal }
      ]
    }
  }

  return finalAllocation
})

// Helper functions for allocation adjustments
function adjustAllocationForLargeCap(allocation) {
  // Implement logic to increase large cap allocation
  return allocation
}

function adjustAllocationForMidCap(allocation) {
  // Implement logic to increase mid cap allocation
  return allocation
}

function adjustAllocationForSmallCap(allocation) {
  // Implement logic to increase small cap allocation
  return allocation
}

const handleAnswer = (option) => {
  answers.value = {
    ...answers.value,
    [currentQuestion.value.id]: option
  }
  
  if (currentQuestionIndex.value < currentSection.value.questions.length - 1) {
    currentQuestionIndex.value++
  } else if (currentSectionIndex.value < sections.length - 1) {
    currentSectionIndex.value++
    currentQuestionIndex.value = 0
  } else {
    showResults.value = true
  }
}

const resetQuiz = () => {
  currentSectionIndex.value = 0
  currentQuestionIndex.value = 0
  answers.value = {}
  showResults.value = false
}

defineExpose({
  resetQuiz,
  answers,
  riskProfile,
  recommendedAllocation
})
</script>

