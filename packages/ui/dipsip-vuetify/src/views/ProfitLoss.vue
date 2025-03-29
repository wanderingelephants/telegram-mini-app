<template>
  <div class="profit-loss-container">
    <!-- Main content -->
    <div class="pl-content">
      <h2 class="text-h5 mb-4">Profit & Loss for {{ symbol }}</h2>
      
      <!-- Period selector -->
      <v-chip-group v-model="selectedPeriod" class="mb-6">
        <v-chip v-for="period in periods" :key="period" filter>{{ period }}</v-chip>
      </v-chip-group>
      
      <!-- Financial data table -->
      <v-table class="mb-8">
        <thead>
          <tr>
            <th class="text-left">Particulars</th>
            <th class="text-right">FY 2022</th>
            <th class="text-right">FY 2023</th>
            <th class="text-right">FY 2024</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in plItems" :key="index" :class="{ 'font-weight-bold': item.isTotal }">
            <td :class="{ 'ps-4': item.level === 1, 'ps-8': item.level === 2 }">{{ item.name }}</td>
            <td class="text-right">{{ formatNumber(item.fy2022) }}</td>
            <td class="text-right">{{ formatNumber(item.fy2023) }}</td>
            <td class="text-right">{{ formatNumber(item.fy2024) }}</td>
          </tr>
        </tbody>
      </v-table>
      
      <!-- Growth visualization -->
      <h3 class="text-h6 mb-4">Revenue Growth</h3>
      <div class="growth-chart">
        <div class="year-bar" v-for="(value, year) in growthData" :key="year">
          <div class="bar-label">{{ year }}</div>
          <div class="bar-container">
            <div class="bar" :style="{ width: `${value}%` }"></div>
            <span class="bar-value">{{ value }}%</span>
          </div>
        </div>
      </div>
      
      <!-- Extra content to ensure full height -->
      <div class="spacer mt-10">
        <h3 class="text-h6 mb-4">Financial Analysis</h3>
        <p v-for="n in 5" :key="n" class="text-body-1 mb-4">
          This is sample text for the profit and loss component to demonstrate scrolling behavior.
          The financial data shown is representative and meant to test the full screen height functionality.
          You can scroll through this content to test how the sticky tabs work with lengthy content.
        </p>
        
        <v-divider class="my-6"></v-divider>
        
        <h3 class="text-h6 mb-4">Notes to Financial Statements</h3>
        <p v-for="n in 5" :key="n" class="text-body-1 mb-4">
          Additional placeholder text to ensure the component takes up more than a full screen height.
          This allows for proper testing of the sticky tabs navigation when scrolling through the page.
          The tabs should remain fixed at the top of the viewport while the user scrolls through this content.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {  
  async mounted() {
    this.symbol = this.$route.params.symbol
    
  },data() {
    return {
        symbol: ""
    };
  },
  "$route.params.symbol": function (newSymbol) {
    console.log("newsymbol", newSymbol);
    //this.symbol = newSymbol;
  },
};
</script>
<style scoped>
.profit-loss-container {
  min-height: calc(100vh - 112px); /* Full viewport height minus app bar and tabs */
  padding-bottom: 40px;
}

.pl-content {
  padding: 16px 0;
}

/* Styling for the growth chart */
.growth-chart {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
}

.year-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.bar-label {
  width: 80px;
  font-weight: bold;
}

.bar-container {
  flex: 1;
  height: 24px;
  background-color: #e0e0e0;
  border-radius: 4px;
  position: relative;
}

.bar {
  height: 100%;
  background-color: #1976d2;
  border-radius: 4px;
}

.bar-value {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(0,0,0,0.5);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .pl-content {
    padding: 12px;
  }
  
  .bar-label {
    width: 60px;
    font-size: 0.9rem;
  }
  
  .bar-value {
    font-size: 0.9rem;
  }
}

/* Ensure full height with spacer */
.spacer {
  min-height: 80vh;
}
</style>