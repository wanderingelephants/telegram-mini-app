<template>
  <v-card>
    <v-card-title>Investment Comparison</v-card-title>
    <v-card-text>
      <div class="d-flex flex-wrap gap-4 mb-4">
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Year"
          style="max-width: 120px"
          density="compact"
        ></v-select>
        <v-select
          v-model="selectedMonth"
          :items="months"
          label="Month"
          style="max-width: 120px"
          density="compact"
        ></v-select>
      </div>
      <canvas ref="chartRef"></canvas>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  priceData: {
    type: Array,
    required: true,
    default: () => []
  },
  strategy1Data: {
    type: Array,
    required: true,
    default: () => []
  },
  strategy2Data: {
    type: Array,
    required: true,
    default: () => []
  }
})

const chartRef = ref(null)
let chart = null
const selectedYear = ref(2024)
const selectedMonth = ref(1) // January
const years = [2024, 2023, 2022, 2021, 2020, 2019]
const months = [
  { title: 'Jan', value: 1 },
  { title: 'Feb', value: 2 },
  { title: 'Mar', value: 3 },
  { title: 'Apr', value: 4 },
  { title: 'May', value: 5 },
  { title: 'Jun', value: 6 },
  { title: 'Jul', value: 7 },
  { title: 'Aug', value: 8 },
  { title: 'Sep', value: 9 },
  { title: 'Oct', value: 10 },
  { title: 'Nov', value: 11 },
  { title: 'Dec', value: 12 }
]

// Filter data by selected year and month
const filterDataByPeriod = (data, dateField) => {
  return data.filter(item => {
    const itemDate = new Date(dateField === 'date' ? item.date : item.investmentDate)
    return itemDate.getFullYear() === selectedYear.value && 
           itemDate.getMonth() + 1 === selectedMonth.value
  })
}

const createChart = () => {
  const ctx = chartRef.value.getContext('2d')
  
  // Filter and sort data by selected year and month
  const filteredPriceData = filterDataByPeriod(props.priceData, 'date')
  const sortedPriceData = [...filteredPriceData].sort((a, b) => new Date(a.date) - new Date(b.date))
  const dates = sortedPriceData.map(item => item.date)
  const prices = sortedPriceData.map(item => item.price)

  // Filter strategy data by selected period
  const filteredStrategy1Data = filterDataByPeriod(props.strategy1Data, 'investmentDate')
  const filteredStrategy2Data = filterDataByPeriod(props.strategy2Data, 'investmentDate')
  
  // Process broker data
  const strategy1Investments = dates.map(date => {
    const investment = filteredStrategy1Data.find(item => 
    item.investmentDate === date
      //new Date(item.investmentDate).toISOString().split('T')[0] === date
    )
    return investment ? investment.investmentAmount : null
  })
  
  const strategy2Investments = dates.map(date => {
    const investment = filteredStrategy2Data.find(item => 
    item.investmentDate === date
      //new Date(item.investmentDate).toISOString().split('T')[0] === date
    )
    return investment ? investment.investmentAmount : null
  })
  
  // Process correction points
  const strategy1Corrections = filteredStrategy1Data.map(item => ({
    x: new Date(item.investmentDate).toISOString().split('T')[0],
    y: item.price,
    correction: item.correction
  }))
  
  const strategy2Corrections = filteredStrategy2Data.map(item => ({
    x: new Date(item.investmentDate).toISOString().split('T')[0],
    y: item.price,
    correction: item.correction
  }))

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dates.map(d => d.toLocaleDateString()),
      datasets: [
        {
          type: 'line',
          label: 'Price',
          data: prices,
          borderColor: '#8884d8',
          yAxisID: 'price',
          tension: 0.4,
          cubicInterpolationMode: 'monotone',
          fill: false
        },
        {
          type: 'bar',
          label: 'DipSIP Investments',
          data: strategy1Investments,
          backgroundColor: '#82ca9d',
          yAxisID: 'investment',
          order: 2
        },
        {
          type: 'bar',
          label: 'SIP Investments',
          data: strategy2Investments,
          backgroundColor: '#ffc658',
          yAxisID: 'investment',
          order: 2
        },
        /*{
          type: 'scatter',
          label: 'Strategy 1 Corrections',
          data: strategy1Corrections,
          backgroundColor: 'red',
          yAxisID: 'price',
          pointStyle: 'circle',
          radius: 6,
          order: 1
        },
        {
          type: 'scatter',
          label: 'Strategy 2 Corrections',
          data: strategy2Corrections,
          backgroundColor: 'red',
          yAxisID: 'price',
          pointStyle: 'circle',
          radius: 6,
          order: 1
        }*/
      ]
    },
    options: {
      responsive: true,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      scales: {
        price: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Price'
          }
        },
        investment: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Investment Amount'
          },
          grid: {
            drawOnChartArea: false
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          },
          ticks: {
            callback: function(value, index) {
              const date = new Date(this.getLabelForValue(value))
              return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: '2-digit'
              })
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              if (context.dataset.type === 'scatter') {
                const correction = context.raw.correction
                return `Correction: ${correction}%`
              }
              return context.dataset.label + ': ' + context.formattedValue
            }
          }
        }
      }
    }
  })
}

// Watch for data changes and period selection
watch([() => props.priceData, () => props.strategy1Data, () => props.strategy2Data, selectedYear, selectedMonth], () => {
  if (chart) {
    chart.destroy()
  }
  createChart()
}, { deep: true })

onMounted(() => {
  createChart()
})
</script>