<template>
<v-card class="ma-2">
  <v-card-title class="text-h6">
    <v-icon start>$mdiCompare</v-icon>
    Overlap Analysis
  </v-card-title>
  
  <!-- Summary Cards -->
  <v-card-text v-if="compareData">
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="1" color="primary" class="px-4 py-2">
          <div class="text-subtitle-1">Highest Overlap</div>
          <div class="text-h5">{{ compareData.maxOverlap }}%</div>
          <div class="text-caption">
            {{ compareData.maxOverlapPair?.fund1 }} & {{ compareData.maxOverlapPair?.fund2 }}
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="1" color="secondary" class="px-4 py-2">
          <div class="text-subtitle-1">Lowest Overlap</div>
          <div class="text-h5">{{ compareData.minOverlap }}%</div>
          <div class="text-caption">
            {{ compareData.minOverlapPair?.fund1 }} & {{ compareData.minOverlapPair?.fund2 }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Overlap Heatmap -->
    <v-row class="mt-4">
      <v-col cols="12">
        <div class="text-h6 mb-2">Overlap Matrix</div>
        <div class="overlap-heatmap">
          <table class="heatmap-table">
            <thead>
              <tr>
                <th></th>
                <th v-for="fund in getFundList" :key="fund">
                  {{ getFundShortName(fund) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fund1 in getFundList" :key="fund1">
                <td class="fund-name">{{ getFundShortName(fund1) }}</td>
                <td v-for="fund2 in getFundList" :key="fund2">
                  <div 
                    v-if="getOverlapScore(fund1, fund2) !== null"
                    class="overlap-cell"
                    :style="getHeatmapColor(getOverlapScore(fund1, fund2))"
                    @click="showOverlapDetails(fund1, fund2)"
                  >
                    {{ getOverlapScore(fund1, fund2) }}%
                  </div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-col>
    </v-row>

    <!-- Detailed Overlap Table -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-data-table
          :headers="[
            { title: 'Fund Pair', key: 'fundPair', sortable: false },
            { title: 'Overlap Score', key: 'overlapScore', sortable: true },
            { title: 'Common Holdings', key: 'commonHoldings', sortable: true }
          ]"
          :items="getOverlapTableData"
          :sort-by="[{ key: 'overlapScore', order: 'desc' }]"
          class="elevation-1"
        >
          <template v-slot:item.fundPair="{ item }">
            {{ item.fund1 }} & {{ item.fund2 }}
          </template>
          <template v-slot:item.overlapScore="{ item }">
            <v-chip
              :color="getOverlapColor(item.overlapScore)"
              :text="item.overlapScore + '%'"
            ></v-chip>
          </template>
          <template v-slot:item.commonHoldings="{ item }">
            <v-btn
              variant="text"
              density="compact"
              @click="showHoldingsDialog(item)"
            >
              View {{ item.overlapHoldings.length }} stocks
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card-text>

  <!-- Holdings Dialog -->
  <v-dialog v-model="holdingsDialog.show" max-width="800px">
  <v-card>
    <v-card-title class="d-flex align-center">Common Holdings
      <v-btn
        icon="$mdiClose"
        variant="text"
        size="small"
        @click="holdingsDialog.show = false"
      ></v-btn>
      </v-card-title>
      <v-card-subtitle>
      <span class="flex-grow-1">
        
        <div class="text-subtitle-1">
          {{ holdingsDialog.fund1 }} & {{ holdingsDialog.fund2 }}
        </div>
      </span>
      </v-card-subtitle>
    
    <v-card-text>
      <v-data-table
        :headers="[
          { title: 'Stock', key: 'stock_name' },
          { title: `${getFundShortName(holdingsDialog.fund1)} %`, key: 'percentHoldingInFund1' },
          { title: `${getFundShortName(holdingsDialog.fund2)} %`, key: 'percentHoldingInFund2' },
          { title: 'Overlap Weight', key: 'overlapWeight' }
        ]"
        :items="holdingsDialog.holdings || []"
        :sort-by="[{ key: 'overlapWeight', order: 'desc' }]"
      ></v-data-table>
    </v-card-text>
  </v-card>
</v-dialog>
</v-card>
</template>

<style scoped>
.overlap-heatmap {
  overflow-x: auto;
}

.heatmap-table {
  width: 100%;
  border-collapse: collapse;
}

.heatmap-table th, .heatmap-table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}

.fund-name {
  font-weight: bold;
  text-align: left;
}

.overlap-cell {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: transform 0.2s;
}

.overlap-cell:hover {
  transform: scale(1.1);
}
</style>

<script>
export default {
  name: 'OverlapAnalysis',
  props: {
    compareData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      holdingsDialog: {
        show: false,
        fund1: '',
        fund2: '',
        holdings: []
      }
    }
  },
  computed: {
    getFundList() {
      if (!this.compareData?.overlaps) return []
      return [...new Set(this.compareData.overlaps.flatMap(o => [o.fund1, o.fund2]))]
    },
    getOverlapTableData() {
      return this.compareData?.overlaps || []
    }
  },
  methods: {
    getFundShortName(name) {
      // Extract the first part of the fund name before hyphen
      return name.split('-')[0].trim()
    },
    getOverlapScore(fund1, fund2) {
      if (fund1 === fund2) return null
      const overlap = this.compareData?.overlaps.find(
        o => (o.fund1 === fund1 && o.fund2 === fund2) || 
             (o.fund1 === fund2 && o.fund2 === fund1)
      )
      return overlap ? overlap.overlapScore : null
    },
    getHeatmapColor(score) {
  if (score === null) return {}
  
  // Start from green (120) and move towards red (0)
  const hue = Math.max(0, 120 - (score * 3.5)); // Adjust multiplier for faster color change
  
  // Increase saturation and brightness for higher scores to make reds more prominent
  const saturation = 65 + (score / 100 * 25); // Varies from 65% to 90%
  const brightness = 75 - (score / 100 * 15);  // Varies from 75% to 60%
  
  return {
    backgroundColor: `hsl(${hue}, ${saturation}%, ${brightness}%)`,
    color: score > 35 ? 'white' : 'black'  // White text for darker backgrounds
  }
},
    getOverlapColor(score) {
      if (score >= 35) return 'error'
      if (score >= 25) return 'warning'
      return 'success'
    },
    showHoldingsDialog(item) {
      this.holdingsDialog = {
        show: true,
        fund1: item.fund1,
        fund2: item.fund2,
        holdings: item.overlapHoldings
      }
    },
    showOverlapDetails(fund1, fund2) {
      const overlap = this.compareData?.overlaps.find(
        o => (o.fund1 === fund1 && o.fund2 === fund2) || 
             (o.fund1 === fund2 && o.fund2 === fund1)
      )
      if (overlap) {
        this.showHoldingsDialog(overlap)
      }
    }
  }
}
</script>