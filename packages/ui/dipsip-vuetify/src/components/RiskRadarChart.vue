<template>
  <div class="risk-radar-chart">
    <apexcharts
      id="risk-radar"
      ref="chartRef"
      :key="componentKey"
      width="100%"
      height="600"
      type="radar"
      :options="chartOptions"
      :series="series"
    ></apexcharts>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'RiskRadarChart',
  components: {
    apexcharts: VueApexCharts
  },
  props: {
    categoryScores: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      componentKey: 0
    }
  },
  computed: {
    series() {
      return [{
        name: 'Category Score',
        data: this.categoryScores.map(item => item.score)
      }]
    },
    chartOptions() {
      return {
        chart: {
          type: 'radar',
          toolbar: {
            show: false
          },
          fontFamily: 'inherit'
        },
        xaxis: {
          categories: this.categoryScores.map(item => item.category),
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          show: true,
          min: 0,
          max: 100,
          labels: {
            formatter: (val) => `${Math.round(val)}%`
          }
        },
        fill: {
          opacity: 0.6,
          colors: ['#FFA000']
        },
        stroke: {
          width: 2,
          colors: ['#FFA000']
        },
        markers: {
          size: 4,
          colors: ['#FFA000'],
          hover: {
            size: 6
          }
        },
        tooltip: {
          y: {
            formatter: (val) => `${Math.round(val)}%`
          }
        },
        theme: {
          palette: 'palette1'
        },
        plotOptions: {
          radar: {
            polygons: {
              strokeColors: '#e9e9e9',
              fill: {
                colors: ['#f8f8f8', '#fff']
              }
            }
          }
        }
      }
    }
  },
  watch: {
    categoryScores: {
      handler(newVal) {
        console.log('categoryScores changed:', newVal)
        // Instead of incrementing key, try updating the chart
        this.$nextTick(() => {
          if (this.$refs.chartRef) {
            this.$refs.chartRef.updateOptions(this.chartOptions)
            this.$refs.chartRef.updateSeries(this.series)
          }
        })
      },
      deep: true
    },
    series: {
      handler(newVal) {
        console.log('series changed:', newVal)
      },
      deep: true
    },
    chartOptions: {
      handler(newVal) {
        console.log('options changed:', newVal)
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log("Mounting chart...")
      if (this.$refs.chartRef) {
        console.log("Chart ref found")
      }
    })
  },
  beforeUnmount() {
    // Cleanup
    if (this.chart) {
      this.chart.destroy()
    }
  },
  errorCaptured(err, component, info) {
    console.error('Chart Error:', err)
    console.error('Component:', component)
    console.error('Info:', info)
    return false
  }
}
</script>

<style scoped>
.risk-radar-chart {
  width: 100%;
  margin: 0 auto;
}
</style>