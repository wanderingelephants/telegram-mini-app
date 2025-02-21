<template>
  <div class="analysis-container">
    <!-- Overlap Analysis Section -->
    <v-card class="mb-4">
      <v-card-title class="d-flex flex-wrap">
        <span class="text-h6">Stock Overlap Analysis</span>
        <v-spacer></v-spacer>
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
            <v-btn small text color="primary" @click="showOverlapDetails(item)">
              Details
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diversification Analysis Section -->
    <v-card class="mb-4">
      <v-card-title class="text-h6"
        >Portfolio Diversification Analysis</v-card-title
      >

      <v-card-text>
        <v-row dense>
          <!-- Unique Stocks Counter -->
          <v-col>
            <v-card outlined>
              <v-card-title class="text-subtitle-1">
                Unique Stocks:
                {{ analysisReport.diversification.unique_stocks.count }}
              </v-card-title>
              <v-card-text>
                <v-chip
                  :color="
                    getDiversificationColor(
                      analysisReport.diversification.unique_stocks.status
                    )
                  "
                  text-color="white"
                >
                  {{ analysisReport.diversification.unique_stocks.status }}
                </v-chip>
                <p class="mt-2">
                  {{
                    analysisReport.diversification.unique_stocks.recommendation
                  }}
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
        <v-card-title>
          Sector Analysis Details
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="sectorHeaders"
            :items="sectorTableData"
            :items-per-page="5"
            density="comfortable"
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
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
        <v-card-title>
          Performance Analysis (Returns)
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
         <v-data-table
            :headers="performanceHeaders"
            :items="performanceTableData"
            :items-per-page="5"
            density="comfortable"
            class="elevation-1"
          >
          
</v-data-table>
        </v-card-text> 
      </v-card>
          </v-col>
        </v-row>
        <v-row>
          <!-- Category Breakdown -->
          <v-col cols="12" sm="6" md="12" lg="12">
            <v-card outlined>
              <v-card-title class="text-subtitle-1"
                >Fund Category Distribution</v-card-title
              >
              <v-card-text>
                <v-progress-linear
                  v-for="(category, name) in analysisReport.diversification
                    .category_breakdown"
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
              {{ item.relative_cost > 0 ? "+" : "" }}{{ item.relative_cost }}%
            </v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-card class="mt-4">
  <v-card-title class="text-h6">Similar ETFs</v-card-title>
  <v-card-text>
    <v-data-table
      :headers="etfRecommendationHeaders"
      :items="formattedEtfRecommendations"
      :items-per-page="5"
      density="comfortable"
      :hover="true"
    >
      <template v-slot:item.overlap_percentage="{ item }">
        {{ item.overlap_percentage.toFixed(2) }}%
      </template>
      <template v-slot:item.etf_fee="{ item }">
        {{ item.etf_fee.toFixed(2) }}%
      </template>
      <template v-slot:item.fund_fee="{ item }">
        {{ item.fund_fee.toFixed(2) }}%
      </template>
      <template v-slot:item.potential_savings="{ item }">
        <v-chip
          :color="item.potential_savings > 0.3 ? 'green' : 'orange'"
          text-color="white">
          {{ item.potential_savings.toFixed(2) }}%
        </v-chip>
      </template>
    </v-data-table>
  </v-card-text>
</v-card>
    <!-- Overlap Details Dialog -->
    <v-dialog v-model="showDialog" max-width="800px">
      <v-card>
        <v-card-title>
          Overlap Details
          <v-spacer></v-spacer>
          <v-btn icon @click="showDialog = false">
            <v-icon>$mdiClose</v-icon>
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
                      <th>
                        {{ selectedOverlap.comparison_metadata.fund1.name }} (%)
                      </th>
                      <th>
                        {{ selectedOverlap.comparison_metadata.fund2.name }} (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="stock in selectedOverlap.overlapping_stocks"
                      :key="stock.stock_name"
                    >
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
                  <h3>
                    {{ selectedOverlap.comparison_metadata.fund1.name }} Unique
                    Stocks
                  </h3>
                  <v-list dense>
                    <v-list-item
                      v-for="stock in selectedOverlap.fund1_unique_stocks"
                      :key="stock"
                    >
                      {{ stock }}
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="6">
                  <h3>
                    {{ selectedOverlap.comparison_metadata.fund2.name }} Unique
                    Stocks
                  </h3>
                  <v-list dense>
                    <v-list-item
                      v-for="stock in selectedOverlap.fund2_unique_stocks"
                      :key="stock"
                    >
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
                      <th>
                        {{ selectedOverlap.comparison_metadata.fund1.name }}
                      </th>
                      <th>
                        {{ selectedOverlap.comparison_metadata.fund2.name }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>AUM (millions)</td>
                      <td>
                        {{ selectedOverlap.comparison_metadata.fund1.aum }}
                      </td>
                      <td>
                        {{ selectedOverlap.comparison_metadata.fund2.aum }}
                      </td>
                    </tr>
                    <tr>
                      <td>Star Rating</td>
                      <td>
                        <v-rating
                          :value="
                            selectedOverlap.comparison_metadata.fund1
                              .star_rating
                          "
                          readonly
                          small
                          dense
                        ></v-rating>
                      </td>
                      <td>
                        <v-rating
                          :value="
                            selectedOverlap.comparison_metadata.fund2
                              .star_rating
                          "
                          readonly
                          small
                          dense
                        ></v-rating>
                      </td>
                    </tr>
                    <tr>
                      <td>Expense Ratio</td>
                      <td>
                        {{
                          selectedOverlap.comparison_metadata.fund1
                            .expenses_ratio
                        }}%
                      </td>
                      <td>
                        {{
                          selectedOverlap.comparison_metadata.fund2
                            .expenses_ratio
                        }}%
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-table>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: "MFAnalysis",
  components: {
  //  apexchart: VueApexCharts,
  },

  props: {
    analysisReport: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    showDialog: false,
    showSectorDetails: false,
    selectedOverlap: null,
    activeTab: 0,
    downloading: false,
    overlapHeaders: [
      { title: "Fund 1", key: "fund1_name" },
      { title: "Fund 2", key: "fund2_name" },
      { title: "Overlap %", key: "overlap_percentage" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    expenseHeaders: [
      { title: "Fund Name", key: "fund_name" },
      { title: "Expense Ratio", key: "expense_ratio" },
      { title: "Category Average", key: "category_avg" },
      { title: "Relative Cost", key: "relative_cost" },
    ],
    etfRecommendationHeaders: [
      { title: "Fund Name", key: "fund_name" },
      { title: "ETF Name", key: "etf" },
      { title: "Overlap %", key: "overlap_percentage" },
      { title: "ETF Fee %", key: "etf_fee" },
      { title: "Fund Fee %", key: "fund_fee" },
      { title: "Potential Savings %", key: "potential_savings" },
    ],
  }),

  computed: {
    sectorChartSeries() {
      return Object.values(
        this.analysisReport.diversification.sector_breakdown
      ).map((sector) => sector.percentage);
    },
    formattedEtfRecommendations() {
      const recommendations = [];
      console.log(this.analysisReport.recommendedETFs)
      Object.entries(this.analysisReport.recommendedETFs).forEach(
        ([fundName, etfs]) => {
          console.log([fundName, etfs])
          if (etfs.length > 0) {
            etfs.forEach((etf) => {
              recommendations.push({
                fund_name: fundName,
                etf: etf.etf,
                overlap_percentage: etf["overlap%"],
                etf_fee: etf.etf_fee,
                fund_fee: etf.fund_fee,
                potential_savings: etf.potential_savings,
              });
            });
          }
        }
      );
      console.log("computed formattedEtfRecom", recommendations)
      return recommendations;
    },
    sectorChartOptions() {
      return {
        chart: {
          type: "donut",
          animations: {
            dynamicAnimation: {
              enabled: true,
            },
          },
        },
        labels: Object.keys(
          this.analysisReport.diversification.sector_breakdown
        ),
        plotOptions: {
          pie: {
            donut: {
              size: "65%",
            },
          },
        },
        tooltip: {
          y: {
            formatter: (value) => `${value.toFixed(1)}%`,
          },
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontSize: "14px",
          markers: {
            width: 12,
            height: 12,
            radius: 12,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        dataLabels: {
          enabled: false,
        },
        colors: [
          "#008FFB",
          "#00E396",
          "#FEB019",
          "#FF4560",
          "#775DD0",
          "#3F51B5",
          "#546E7A",
          "#D4526E",
          "#8D5B4C",
          "#F86624",
          "#D7263D",
          "#1B998B",
          "#2E294E",
          "#F46036",
          "#E2C044",
        ],
      };
    },

    sectorTableData() {
      const sectors = this.analysisReport.diversification.sector_breakdown;
      return Object.entries(sectors).map(([name, data]) => ({
        name,
        percentage: data.percentage,
      })).sort((a, b) => b.percentage - a.percentage);
    },
    sectorHeaders() {
      return [
        { title: "Sector", key: "name" },
        { title: "Allocation (%)", key: "percentage" },
      ];
    },
    performanceHeaders() {
    return [
      {
        title: 'Fund Name',
        key: 'mutual_fund_name',
        align: 'start',
        sortable: true
      },
      {
        title: '5 Year',
        key: 'mutual_fund_return_5Y',
        align: 'end',
        sortable: true,
        format: value => `${value}%`
      },
      {
        title: '3 Year',
        key: 'mutual_fund_return_3Y',
        align: 'end',
        sortable: true,
        format: value => `${value}%`
      },
      {
        title: '1 Year',
        key: 'mutual_fund_return_1Y',
        align: 'end',
        sortable: true,
        format: value => `${value}%`
      },
    ]
  },

  performanceTableData() {
    const flattened_row_data = this.analysisReport.performanceAnalysis
    console.log("flattened", flattened_row_data.map(fund => ({
      mutual_fund_name: fund.mutual_fund_name,
      mutual_fund_return_1Y: fund.mutual_fund_return_1Y || '-',
      mutual_fund_return_3Y: fund.mutual_fund_return_3Y || '-',
      mutual_fund_return_5Y: fund.mutual_fund_return_5Y || '-'
    })))
    return flattened_row_data.map(fund => ({
      mutual_fund_name: fund.mutual_fund_name,
      mutual_fund_return_1Y: fund.mutual_fund_return_1Y || '-',
      mutual_fund_return_3Y: fund.mutual_fund_return_3Y || '-',
      mutual_fund_return_5Y: fund.mutual_fund_return_5Y || '-'
    }))
  },
    formattedOverlaps() {
      return this.analysisReport.overlaps.overlaps.map((overlap) => ({
        fund1_name: overlap.comparison_metadata.fund1.name,
        fund2_name: overlap.comparison_metadata.fund2.name,
        overlap_percentage: overlap.overlap_percentage,
        ...overlap,
      })).sort((a, b) => b.overlap_percentage - a.overlap_percentage);
    },
  },

  methods: {
    getOverlapColor(percentage) {
      if (percentage >= 25) return "red";
      if (percentage >= 15) return "orange";
      return "green";
    },

    getDiversificationColor(status) {
      const colors = {
        "over-diversified": "orange",
        concentrated: "red",
        optimal: "green",
      };
      return colors[status] || "grey";
    },

    getCategoryColor(category) {
      const colors = {
        "large cap": "blue",
        "mid cap": "purple",
        "small cap": "deep-purple",
        "multi cap": "indigo",
      };
      return colors[category.toLowerCase()] || "grey";
    },

    getExpenseColor(relativeCost) {
      if (relativeCost > 0.5) return "red";
      if (relativeCost < -0.5) return "green";
      return "orange";
    },

    showOverlapDetails(item) {
      this.selectedOverlap = item;
      this.showDialog = true;
    },

    async downloadCompleteReport() {
      this.downloading = true;
      try {
        const pdf = new jsPDF("p", "mm", "a4");
        let yOffset = 10;

        // Title
        pdf.setFontSize(18);
        pdf.text("Mutual Fund Analysis Report", 105, yOffset, {
          align: "center",
        });
        yOffset += 15;

        // 1. Portfolio Overview - Unique Stocks Analysis
        pdf.setFontSize(14);
        pdf.text("1. Portfolio Overview", 10, yOffset);
        yOffset += 10;
        pdf.setFontSize(10);
        const uniqueStocksText = `Total Unique Stocks: ${this.analysisReport.diversification.unique_stocks.count}`;
        pdf.text(uniqueStocksText, 15, yOffset);
        yOffset += 5;
        pdf.text(
          `Status: ${this.analysisReport.diversification.unique_stocks.status}`,
          15,
          yOffset
        );
        yOffset += 5;
        pdf.text(
          `Recommendation: ${this.analysisReport.diversification.unique_stocks.recommendation}`,
          15,
          yOffset
        );
        yOffset += 15;

        // 2. Sector Breakdown
        pdf.setFontSize(14);
        pdf.text("2. Sector Allocation", 10, yOffset);
        yOffset += 10;

        // Prepare sector data for table
        const sectorData = Object.entries(
          this.analysisReport.diversification.sector_breakdown
        )
          .map(([sector, data]) => [sector, `${data.percentage.toFixed(1)}%`])
          .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])); // Sort by percentage descending

        pdf.autoTable({
          startY: yOffset,
          head: [["Sector", "Allocation"]],
          body: sectorData,
          theme: "striped",
          headStyles: { fillColor: [71, 85, 119] },
          columnStyles: {
            0: { cellWidth: 100 }, // Sector name column
            1: { cellWidth: 40, halign: "right" }, // Percentage column
          },
          margin: { left: 15 },
        });

        yOffset = pdf.lastAutoTable.finalY + 10;

        // 3. Fund Category Distribution
        pdf.setFontSize(14);
        pdf.text("3. Fund Category Distribution", 10, yOffset);
        yOffset += 10;

        // Prepare category data for table
        const categoryData = Object.entries(
          this.analysisReport.diversification.category_breakdown
        )
          .map(([category, data]) => [
            category,
            `${data.percentage.toFixed(1)}%`,
          ])
          .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

        pdf.autoTable({
          startY: yOffset,
          head: [["Category", "Allocation"]],
          body: categoryData,
          theme: "striped",
          headStyles: { fillColor: [71, 85, 119] },
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 40, halign: "right" },
          },
          margin: { left: 15 },
        });

        yOffset = pdf.lastAutoTable.finalY + 10;

        // 4. Stock Overlaps
        pdf.setFontSize(14);
        pdf.text("4. Stock Overlaps Analysis", 10, yOffset);
        yOffset += 10;

        // Get the significant overlaps from the formatted data
        const significantOverlaps = this.formattedOverlaps
          .filter((overlap) => overlap.overlap_percentage >= 25)
          .sort((a, b) => b.overlap_percentage - a.overlap_percentage);

        const overlapData = this.formattedOverlaps
          .map((overlap) => [
            overlap.fund1_name,
            overlap.fund2_name,
            `${overlap.overlap_percentage.toFixed(1)}%`,
          ])
          .sort((a, b) => parseFloat(b[2]) - parseFloat(a[2]));

        pdf.autoTable({
          startY: yOffset,
          head: [["Fund 1", "Fund 2", "Overlap"]],
          body: overlapData,
          theme: "striped",
          headStyles: { fillColor: [71, 85, 119] },
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 70 },
            2: { cellWidth: 30, halign: "right" },
          },
          margin: { left: 15 },
        });

        yOffset = pdf.lastAutoTable.finalY + 10;

        if (significantOverlaps.length > 0) {
          pdf.setFontSize(10);
          pdf.text("High Overlap Warning:", 15, yOffset, { style: "bold" });
          yOffset += 5;
          pdf.text(
            "The following fund pairs have significant overlap (>25%):",
            15,
            yOffset
          );
          yOffset += 5;

          significantOverlaps.forEach((overlap) => {
            const warningText = `• ${overlap.fund1_name} - ${
              overlap.fund2_name
            }: ${overlap.overlap_percentage.toFixed(1)}%`;
            pdf.text(warningText, 20, yOffset);
            yOffset += 5;
          });
        }
        yOffset += 5;

        // 5. Expense Analysis
        pdf.setFontSize(14);
        pdf.text("5. Expense Ratio Analysis", 10, yOffset);
        yOffset += 10;
        console.log(this.analysisReport.expenses);
        const expenseData = this.analysisReport.expenses.map((fund) => [
          fund.fund_name,
          `${fund.expense_ratio.toFixed(2)}%`,
          `${fund.category_avg.toFixed(2)}%`,
          `${fund.relative_cost > 0 ? "+" : ""}${fund.relative_cost.toFixed(
            2
          )}%`,
        ]);

        pdf.autoTable({
          startY: yOffset,
          head: [
            ["Fund Name", "Expense Ratio", "Category Avg", "Relative Cost"],
          ],
          body: expenseData,
          theme: "striped",
          headStyles: { fillColor: [71, 85, 119] },
          columnStyles: {
            0: { cellWidth: 70 },
            1: { cellWidth: 40, halign: "right" },
            2: { cellWidth: 40, halign: "right" },
            3: { cellWidth: 40, halign: "right" },
          },
          margin: { left: 15 },
        });

        yOffset = pdf.lastAutoTable.finalY + 10;

        // 6. Key Recommendations
        pdf.setFontSize(14);
        pdf.text("6. Key Recommendations", 10, yOffset);
        yOffset += 10;

        pdf.setFontSize(10);
        const recommendations = this.generateRecommendations();
        recommendations.forEach((rec) => {
          pdf.text(`• ${rec}`, 15, yOffset);
          yOffset += 5;
        });

        pdf.save("mutual_fund_analysis_report.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        this.downloading = false;
      }
    },

    generateRecommendations() {
      const recommendations = [];

      // Overlap recommendations
      if (this.analysisReport.overlaps.maxOverlap > 25) {
        recommendations.push(
          `Consider consolidating funds with high overlap (${this.analysisReport.overlaps.maxOverlapPair?.fund1_name} and ${this.analysisReport.overlaps.maxOverlapPair?.fund2_name})`
        );
      }

      // Diversification recommendations
      const { unique_stocks } = this.analysisReport.diversification;
      if (unique_stocks.count > 100) {
        recommendations.push(
          "Portfolio may be over-diversified. Consider streamlining holdings."
        );
      } else if (unique_stocks.count < 30) {
        recommendations.push(
          "Portfolio concentration is high. Consider adding more diversity."
        );
      }

      // Expense recommendations
      const highExpenseFunds = this.analysisReport.expenses.filter(
        (fund) => fund.relative_cost > 0.5
      );
      if (highExpenseFunds.length > 0) {
        recommendations.push(
          `Consider reviewing high expense funds: ${highExpenseFunds
            .map((f) => f.fund_name)
            .join(", ")}`
        );
      }

      return recommendations;
    },
  },
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
.v-data-table__mobile-table-row {
  margin: 8px 0;
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.v-data-table__mobile-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.v-data-table__mobile-row__header {
  font-weight: bold;
  padding-right: 16px;
  width: 40%;
}

.v-data-table__mobile-row__cell {
  text-align: right;
  width: 60%;
}
.hide-headers-mobile .v-data-table__header {
  display: none !important;
}
</style>