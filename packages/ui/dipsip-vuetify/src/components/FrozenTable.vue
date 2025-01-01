<template>
  <div class="table-wrapper">
    <!-- Table Header Information -->
    <div v-if="title || subtitle || description" class="table-info">
      <h2 v-if="title" class="table-title">{{ title }}</h2>
      <h3 v-if="subtitle" class="table-subtitle">{{ subtitle }}</h3>
      <p v-if="description" class="table-description">{{ description }}</p>
    </div>
    
    <!-- Controls Section -->
    <div class="controls-section">
      <div class="control-group">
        <label for="epsGrowth">EPS Growth %</label>
        <select 
          id="epsGrowth" 
          v-model="epsGrowthPercent" 
          class="control-select"
        >
          <option v-for="n in 41" :key="n" :value="n + 9">
            {{ n + 9 }}%
          </option>
        </select>
      </div>
      
      <div class="control-group">
        <label for="timeYears">Time In Years</label>
        <select 
          id="timeYears" 
          v-model="timeInYears" 
          class="control-select"
        >
          <option v-for="n in 20" :key="n" :value="n">
            {{ n }} {{ n === 1 ? 'Year' : 'Years' }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="frozen-table-container">
      <v-table class="frozen-table">
        <thead>
          <tr>
            <!-- Top-left corner cell (frozen) -->
            <th class="corner-header">
              <div class="corner-content">
                <div class="exit-label">
                  Entry P/E →
                </div>
                <div class="entry-label">
                  Exit P/E ↓
                </div>
              </div>
            </th>
            
            <!-- Column headers (frozen horizontally) -->
            <th v-for="header in columnHeaders" 
                :key="header" 
                class="column-header">
              {{ header }}
            </th>
          </tr>
        </thead>
        
        <tbody>
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
            <!-- Row headers (frozen vertically) -->
            <th class="row-header">{{ rowHeaders[rowIndex] }}</th>
            
            <!-- Table data cells -->
            <td v-for="(cell, colIndex) in row" 
                :key="colIndex"
                class="data-cell">
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

// Props definition
const props = defineProps({
  maxHeight: {
    type: String,
    default: '400px'
  },
  maxWidth: {
    type: String,
    default: '800px'
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  rowCount: {
    type: Number,
    default: 8
  },
  colCount: {
    type: Number,
    default: 8
  },
  data: {
    type: Array,
    default: () => []
  }
})

// Reactive references
const columnHeaders = ref([15, 20, 25, 30, 40, 50, 60, 70])
const rowHeaders = ref([15, 20, 25, 30, 40, 50, 60, 70])
const tableData = ref([])
const epsGrowthPercent = ref(10)
const timeInYears = ref(1)
const earningsAtStart = 100

// Computed values
const earningsAtEnd = computed(() => {
  return earningsAtStart * Math.pow(1 + epsGrowthPercent.value / 100, timeInYears.value)
})

// Calculate CAGR for a given entry and exit PE
const calculateCAGR = (entryPE, exitPE) => {
  const entryValuePaid = entryPE * earningsAtStart
  const exitValueRealized = exitPE * earningsAtEnd.value
  const cagr = (Math.pow(exitValueRealized / entryValuePaid, 1 / timeInYears.value) - 1) * 100
  return Math.round(cagr * 100) / 100 // Round to 2 decimal places
}

// Initialize headers and data based on props
const initializeData = () => {
  tableData.value  = rowHeaders.value.map(exitPE => {
    return columnHeaders.value.map(entryPE => {
      const cagr = calculateCAGR(entryPE, exitPE)
      console.log(`Entry PE: ${entryPE}, Exit PE: ${exitPE}, CAGR: ${cagr}%`)
      return cagr
    })
  })
}

// Watch for changes in EPS growth or time period
watch(
  [() => epsGrowthPercent.value, () => timeInYears.value],
  () => {
    initializeData()
  }
)

// Initialize on mount
onMounted(() => {
  initializeData()
})

// Expose methods to update data if needed
const updateTableData = (newData) => {
  tableData.value = newData
}
</script>

<style scoped>
.table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.table-info {
  padding: 0 1rem;
}

.table-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.table-subtitle {
  font-size: 1.1rem;
  font-weight: 500;
  color: #34495e;
  margin: 0 0 0.75rem 0;
}

.table-description {
  font-size: 1rem;
  line-height: 1.5;
  color: #546e7a;
  margin: 0;
  max-width: 800px;
}

.frozen-table-container {
  position: relative;
  max-height: v-bind(maxHeight);
  max-width: v-bind(maxWidth);
  overflow: auto;
  border: 1px solid #e0e0e0;
}

.frozen-table {
  border-collapse: separate;
  border-spacing: 0;
}

/* Corner header cell (frozen in both directions) */
.corner-header {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 3;
  background-color: #f5f5f5;
  padding: 0;  /* Remove default padding for custom layout */
}

.corner-content {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 80px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 8px;
  align-items: flex-start;  /* This ensures children are left-aligned */
}

.entry-label {
  font-size: 0.9em;
  color: #555;
  /* remove align-self as it's handled by parent's align-items */
  margin-left: 0;  /* Ensure no left margin */
  padding-left: 0; /* Ensure no left padding */
}

.exit-label {
  font-size: 0.9em;
  color: #555;
  /* remove align-self as it's handled by parent's align-items */
  margin-left: 0;  /* Ensure no left margin */
  padding-left: 0; /* Ensure no left padding */
}

/* Column headers (frozen horizontally) */
.column-header {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #f5f5f5;
  min-width: 100px;
}

/* Row headers (frozen vertically) */
.row-header {
  position: sticky;
  left: 0;
  z-index: 2;
  background-color: #f5f5f5;
}

/* Regular data cells */
.data-cell {
  min-width: 100px;
  background-color: #ffffff;
}

/* Common styles for all cells */
th, td {
  padding: 12px;
  border: 1px solid #e0e0e0;
  white-space: nowrap;
}

.controls-section {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.control-select {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  min-width: 120px;
  font-size: 0.9rem;
}

.control-select:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

/* Add shadow effects for better visual separation */
.corner-header::after,
.column-header::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  height: 2px;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%);
}

.corner-header::before,
.row-header::before {
  content: '';
  position: absolute;
  top: 0;
  right: -1px;
  height: 100%;
  width: 2px;
  background: linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%);
}
</style>