<template>
  <div class="analysis-container">
    <!-- Overlap Analysis Section -->
    <v-card class="mb-4">
      <v-card-title class="d-flex flex-wrap">
        <span class="text-h6">Stock Overlap Analysis</span>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="downloadOverlapData"
          :loading="downloading"
          density="comfortable"
          class="ml-2"
        >
          Download Report
        </v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-data-table
          :headers="overlapHeaders"
          :items="formattedOverlaps"
          :items-per-page="5"
          density="comfortable"
          class="elevation-1"
          :hover="true"
        >
          <template v-slot:item.overlap_percentage="{ item }">
            <v-chip
              :color="getOverlapColor(item.overlap_percentage)"
              text-color="white"
            >
              {{ item.overlap_percentage }}%
            </v-chip>
          </template>
          
          <template v-slot:item.actions="{ item }">
            <v-btn
              small
              text
              color="primary"
              @click="showOverlapDetails(item)"
            >
              Details
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diversification Analysis Section -->
    <v-card class="mb-4">
      <v-card-title class="text-h6">Portfolio Diversification Analysis</v-card-title>
      
      <v-card-text>
        <v-row dense>
          <!-- Unique Stocks Counter -->
          <v-col>
            <v-card outlined>
              <v-card-title class="text-subtitle-1">
                Unique Stocks: {{ analysisReport.diversification.unique_stocks.count }}
              </v-card-title>
              <v-card-text>
                <v-chip
                  :color="getDiversificationColor(analysisReport.diversification.unique_stocks.status)"
                  text-color="white"
                >
                  {{ analysisReport.diversification.unique_stocks.status }}
                </v-chip>
                <p class="mt-2">{{ analysisReport.diversification.unique_stocks.recommendation }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <!-- Sector Breakdown -->
          <v-col>
            <v-card outlined class="h-100">
              <v-card-title class="text-subtitle-1">
                Sector Breakdown
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  small
                  @click="showSectorDetails = true"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <div class="d-flex justify-center">
                  <apexchart
                    type="donut"
                    height="300"
                    :options="sectorChartOptions"
                    :series="sectorChartSeries"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <!-- Category Breakdown -->
          <v-col cols="12" sm="6" md="12" lg="4">
            <v-card outlined>
              <v-card-title class="text-subtitle-1">Fund Category Distribution</v-card-title>
              <v-card-text>
                <v-progress-linear
                  v-for="(category, name) in analysisReport.diversification.category_breakdown"
                  :key="name"
                  :value="category.percentage"
                  :color="getCategoryColor(name)"
                  height="25"
                  striped
                >
                  <template v-slot:default>
                    {{ name }}: {{ category.percentage }}%
                  </template>
                </v-progress-linear>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Expense Analysis Section -->
    <v-card>
      <v-card-title class="text-h6">Expense Ratio Analysis</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="expenseHeaders"
          :items="analysisReport.expenses"
          :items-per-page="5"
          density="comfortable"
          :hover="true"
        >
          <template v-slot:item.relative_cost="{ item }">
            <v-chip
              :color="getExpenseColor(item.relative_cost)"
              text-color="white"
            >
              {{ item.relative_cost > 0 ? '+' : '' }}{{ item.relative_cost }}%
            </v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Overlap Details Dialog -->
    <v-dialog
      v-model="showDialog"
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          Overlap Details
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="showDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text v-if="selectedOverlap">
          <v-tabs v-model="activeTab">
            <v-tab>Overlapping Stocks</v-tab>
            <v-tab>Unique Stocks</v-tab>
            <v-tab>Fund Comparison</v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item>
              <v-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Stock</th>
                      <th>{{ selectedOverlap.comparison_metadata.fund1.name }} (%)</th>
                      <th>{{ selectedOverlap.comparison_metadata.fund2.name }} (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="stock in selectedOverlap.overlapping_stocks" :key="stock.stock_name">
                      <td>{{ stock.stock_name }}</td>
                      <td>{{ stock.fund1_holding }}</td>
                      <td>{{ stock.fund2_holding }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-table>
            </v-window-item>

            <v-window-item>
              <v-row>
                <v-col cols="6">
                  <h3>{{ selectedOverlap.comparison_metadata.fund1.name }} Unique Stocks</h3>
                  <v-list dense>
                    <v-list-item v-for="stock in selectedOverlap.fund1_unique_stocks" :key="stock">
                      {{ stock }}
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="6">
                  <h3>{{ selectedOverlap.comparison_metadata.fund2.name }} Unique Stocks</h3>
                  <v-list dense>
                    <v-list-item v-for="stock in selectedOverlap.fund2_unique_stocks" :key="stock">
                      {{ stock }}
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item>
              <v-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th>{{ selectedOverlap.comparison_metadata.fund1.name }}</th>
                      <th>{{ selectedOverlap.comparison_metadata.fund2.name }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>AUM (millions)</td>
                      <td>{{ selectedOverlap.comparison_metadata.fund1.aum }}</td>
                      <td>{{ selectedOverlap.comparison_metadata.fund2.aum }}</td>
                    </tr>
                    <tr>
                      <td>Star Rating</td>
                      <td>
                        <v-rating
                          :value="selectedOverlap.comparison_metadata.fund1.star_rating"
                          readonly
                          small
                          dense
                        ></v-rating>
                      </td>
                      <td>
                        <v-rating
                          :value="selectedOverlap.comparison_metadata.fund2.star_rating"
                          readonly
                          small
                          dense
                        ></v-rating>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense Ratio</td>
                      <td>{{ selectedOverlap.comparison_metadata.fund1.expenses_ratio }}%</td>
                      <td>{{ selectedOverlap.comparison_metadata.fund2.expenses_ratio }}%</td>
                    </tr>
                  </tbody>
                </template>
              </v-table>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Sector Details Dialog -->
          <v-dialog
            v-model="showSectorDetails"
            max-width="800"
          >
            <v-card>
              <v-card-title>
                Sector Analysis Details
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  @click="showSectorDetails = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
  :headers="sectorHeaders"
  :items="sectorTableData"
  :items-per-page="10"
  class="elevation-1"
>
  <template v-slot:item="{ item }">
    <tr>
      <td>{{ item.name }}</td>
      <td>
        <v-progress-linear
          :value="item.percentage"
          height="20"
          color="primary"
        >
          <template v-slot:default>
            {{ item.percentage.toFixed(1) }}%
          </template>
        </v-progress-linear>
      </td>
    </tr>
  </template>
</v-data-table>
              </v-card-text>
            </v-card>
          </v-dialog>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  name: 'MFAnalysis',
  components: {
    apexchart: VueApexCharts
  },
  
  props: {
    analysisReport: {
      type: Object,
      required: true
    }
  },
  
  data: () => ({
    showDialog: false,
    showSectorDetails: false,
    selectedOverlap: null,
    activeTab: 0,
    downloading: false,
    overlapHeaders: [
      { text: 'Fund 1', value: 'fund1_name' },
      { text: 'Fund 2', value: 'fund2_name' },
      { text: 'Overlap %', value: 'overlap_percentage' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    expenseHeaders: [
      { title: 'Fund Name', key: 'fund_name' },
      { title: 'Expense Ratio', key: 'expense_ratio' },
      { title: 'Category Average', key: 'category_avg' },
      { title: 'Relative Cost', key: 'relative_cost' }
    ]
  }),
  
  computed: {
    sectorChartSeries() {
      return Object.values(this.analysisReport.diversification.sector_breakdown)
        .map(sector => sector.percentage);
    },

    sectorChartOptions() {
      return {
        chart: {
          type: 'donut',
          animations: {
            dynamicAnimation: {
              enabled: true
            }
          }
        },
        labels: Object.keys(this.analysisReport.diversification.sector_breakdown),
        plotOptions: {
          pie: {
            donut: {
              size: '65%'
            }
          }
        },
        tooltip: {
          y: {
            formatter: (value) => `${value.toFixed(1)}%`
          }
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          fontSize: '14px',
          markers: {
            width: 12,
            height: 12,
            radius: 12
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
        dataLabels: {
          enabled: false
        },
        colors: [
          '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0',
          '#3F51B5', '#546E7A', '#D4526E', '#8D5B4C', '#F86624',
          '#D7263D', '#1B998B', '#2E294E', '#F46036', '#E2C044'
        ]
      };
    },

    sectorTableData() {
      const sectors = this.analysisReport.diversification.sector_breakdown;
      return Object.entries(sectors).map(([name, data]) => ({
        name,
        "percentage": data.percentage
      }));
    },
    sectorHeaders() {
    return [
      { title: 'Sector', key: 'name' },
      { title: 'Allocation (%)', key: 'percentage' }
    ];
  },
    formattedOverlaps() {
      return this.analysisReport.overlaps.overlaps.map(overlap => ({
        fund1_name: overlap.comparison_metadata.fund1.name,
        fund2_name: overlap.comparison_metadata.fund2.name,
        overlap_percentage: overlap.overlap_percentage,
        ...overlap
      }));
    }
  },
  
  methods: {
    getOverlapColor(percentage) {
      if (percentage >= 25) return 'red';
      if (percentage >= 15) return 'orange';
      return 'green';
    },
    
    getDiversificationColor(status) {
      const colors = {
        'over-diversified': 'orange',
        'concentrated': 'red',
        'optimal': 'green'
      };
      return colors[status] || 'grey';
    },
    
    getCategoryColor(category) {
      const colors = {
        'large cap': 'blue',
        'mid cap': 'purple',
        'small cap': 'deep-purple',
        'multi cap': 'indigo'
      };
      return colors[category.toLowerCase()] || 'grey';
    },
    
    getExpenseColor(relativeCost) {
      if (relativeCost > 0.5) return 'red';
      if (relativeCost < -0.5) return 'green';
      return 'orange';
    },
    
    showOverlapDetails(item) {
      this.selectedOverlap = item;
      this.showDialog = true;
    },
    
    async downloadOverlapData() {
      this.downloading = true;
      try {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mutual_fund_analysis.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error downloading data:', error);
      } finally {
        this.downloading = false;
      }
    },
    
    generateCSV() {
      const headers = ['Fund 1', 'Fund 2', 'Overlap %', 'Overlapping Stocks', 'Fund 1 AUM', 'Fund 2 AUM', 'Fund 1 Star Rating', 'Fund 2 Star Rating'];
      const rows = this.formattedOverlaps.map(overlap => [
        overlap.fund1_name,
        overlap.fund2_name,
        overlap.overlap_percentage,
        overlap.overlapping_stocks.map(s => s.stock_name).join('; '),
        overlap.comparison_metadata.fund1.aum,
        overlap.comparison_metadata.fund2.aum,
        overlap.comparison_metadata.fund1.star_rating,
        overlap.comparison_metadata.fund2.star_rating
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  }
};
</script>

<style scoped>
.analysis-container {
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}

.v-card {
  border-radius: 8px;
}

/* Adjust spacing for mobile */
@media (max-width: 600px) {
  .analysis-container {
    padding: 8px;
  }
  
  .v-card {
    margin-bottom: 8px !important;
  }
}

/* Adjust for desktop side-by-side layout */
@media (min-width: 960px) {
  .analysis-container {
    max-height: calc(100vh - 120px); /* Adjust based on your header/footer */
  }
}

.v-card__title {
  font-weight: 500;
  padding: 12px 16px;
}

.v-card__text {
  padding: 12px 16px;
}

.v-chip {
  font-weight: 500;
}

.v-data-table {
  border-radius: 8px;
}

/* Ensure charts are responsive */
.apexcharts-canvas {
  max-width: 100%;
}

/* Custom scrollbar for better UX */
.analysis-container::-webkit-scrollbar {
  width: 8px;
}

.analysis-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.analysis-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.analysis-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>