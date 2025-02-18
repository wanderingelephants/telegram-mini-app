<template>
  <v-card>
    <v-card-title>Stock Price Chart</v-card-title>
    <v-card-text>
      <apexchart type="candlestick" :options="chartOptions" :series="series"></apexchart>
    </v-card-text>
  </v-card>
</template>

<script>
import ApexCharts from "apexcharts";

export default {
  components: {
    apexchart: ApexCharts,
  },
  props: {
    candles: Array, // Expecting an array of stock price candles
  },
  computed: {
    series() {
      return [
        {
          data: this.candles.map((candle) => ({
            x: new Date(candle.timestamp),
            y: [candle.open, candle.high, candle.low, candle.close],
          })),
        },
      ];
    },
    chartOptions() {
      return {
        chart: {
          type: "candlestick",
          height: 350,
        },
        xaxis: {
          type: "datetime",
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
        },
      };
    },
  },
};
</script>

<style scoped>
.v-card {
  padding: 16px;
}
</style>
