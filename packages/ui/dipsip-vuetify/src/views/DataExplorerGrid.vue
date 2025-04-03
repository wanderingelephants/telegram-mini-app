<template>
  <v-container fluid>
    <v-row>
      <v-col
        v-for="(item, index) in processedArrays"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        class="pa-2"
      >
        <v-card class="category-card" variant="outlined">
          <v-card-title class="d-flex align-center category-header py-2">
            <v-icon class="mr-2">
              {{ getCategoryIcon(index) }}
            </v-icon>
            {{ formatCategoryName(index) }}
          </v-card-title>
          <v-card-text class="pa-0">
            <data-explorer :arrayList="item" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DataExplorer from './DataExplorer.vue'

export default {
  name: 'DataExplorerGrid',
  components: {
    DataExplorer
  },
  props: {
    categorizedArrays: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    processedArrays() {
      // Ensure we're working with the passed categorizedArrays
      return this.categorizedArrays || {}
    }
  },
  methods: {
    formatCategoryName(categoryName) {
      return categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    },
    getCategoryColor(categoryName) {
      const categoryColors = {
        financials: 'blue',
        ratios: 'green',
        technicals: 'purple',
        subjective: 'orange'
      }
      return categoryColors[categoryName] || 'primary'
    },
    getCategoryIcon(categoryName) {
      const categoryIcons = {
        "Financial Signals": '$mdiBank',
        "Ratio Signals": '$mdiCalculator',
        "Price/Volume Signals": '$mdiChartLine',
        "Subjective Signals": '$mdiSignalCellularOutline',
        "Shareholding Signals": '$mdiChartPie'
      }
      return categoryIcons[categoryName] || '$mdiFolder'
    }
  }
}
</script>

<style scoped>
.data-explorer-grid-container {
  width: 100%;
  height: 100%;
}

.data-explorer-scroll-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 16px; /* Add some bottom padding for scroll bar */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

.category-card {
  min-width: 250px; /* Minimum width for cards */
  /*width: 250px;*/ /* Fixed width for consistency */
  margin-right: 16px; /* Space between cards */
  height: 100%;
  flex-shrink: 0; /* Prevent cards from shrinking */
}

.category-header {
  text-transform: capitalize;
  font-weight: bold;
}

/* Scrollbar styling for webkit browsers */
.data-explorer-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.data-explorer-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.data-explorer-scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
@media (max-width: 600px) {
  .category-card {
    width: 100%;
    margin-bottom: 16px;
  }
}
@media (max-width: 600px) {
  .data-explorer-grid-container {
    max-height: none; /* Remove max-height constraint */
  }

  .data-explorer-scroll-container {
    flex-direction: column; /* Stack vertically on mobile */
    overflow-x: hidden;
    overflow-y: auto;
  }

  .category-card {
    width: 100%; /* Full width on mobile */
    margin-right: 0;
    margin-bottom: 16px; /* Space between stacked cards */
  }
}
</style>