<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
       
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="company_balance_sheet_display"
          :items-per-page="-1"
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.key }}</td>
              <template v-for="year in years" :key="year">
                <td class="text-right">
                  {{ formatCurrency(item[year]) }}
                </td>
              </template>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'BalanceSheetComponent',
    props: {
    symbol: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    }
  },
  computed: {
  ...mapState([
      "loggedInGoogle",
      "userGoogle",
    ]),
    formattedBalanceSheetData() {
    return this.company_balance_sheet_display.filter(item => {
      if (item.isCategory) return true;
      if (item.isSummary) return true;
      return this.expandedCategories[item.category];
    });
  }
  },
  
  data() {
    return {
      company_balance_sheet: [
        
      ],
      company_balance_sheet_display: []
    }
  },
  
  computed: {
    companyName() {
      return this.company_balance_sheet[0]?.company?.name || 'Company'
    },
    
    years() {
      return [...new Set(this.company_balance_sheet.map(item => item.year))].sort()
    },
    
    headers() {
      // Create headers with 'Line Item' and years
      return [
        { title: 'Line Item', value: 'key', sortable: false },
        ...this.years.map(year => ({
          title: year.toString(),
          value: year.toString(),
          align: 'end'
        }))
      ]
    }
  },
  
  methods: {
    transformBalanceSheetData() {
      // Sort the original data by rowno
      const sortedData = [...this.company_balance_sheet].sort((a, b) => a.rowno - b.rowno)
      
      // Group by key and transform data
      const groupedData = {}
      
      sortedData.forEach(item => {
        if (!groupedData[item.key]) {
          groupedData[item.key] = { key: item.key }
        }
        groupedData[item.key][item.year] = item.value
      })
      
      // Convert to array and sort
      this.company_balance_sheet_display = Object.values(groupedData)
    },
     async getCompanyData() {
      try {
        const response = await fetch(`/api/company/details/${this.symbol}/${this.entity}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtGoogle")}`,
          }
        });
        
        if (response.status !== 200) {
          this.snackbar.color = "error";
          this.snackbar.message = "Not authorized";
          this.snackbar.show = true;
          return;
        }
        
        const jsonData = await response.json();
        this.company_data = jsonData[0].company;
        this.company_balance_sheet = jsonData || [];
        this.company_balance_sheet = this.company_balance_sheet.filter(r => r.key !== "")
        this.transformBalanceSheetData()
        
      } catch (e) {
        console.error(e);
        this.snackbar.color = "error";
        this.snackbar.message = "Error fetching data";
        this.snackbar.show = true;
      }
    },
    formatCurrency(value) {
      // Check if value is a number
      if (typeof value !== 'number') return '-'
      
      return new Intl.NumberFormat('en-IN', {
        //style: 'currency',
        //currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    }
  },
  watch: {
    symbol: async function (newSymbol) {
      await this.getCompanyData();
    },
  },
  created() {
    // Transform data when component is created
    
  }
}
</script>

<style scoped>
/* Optional: Add some styling to improve readability */
.v-data-table td {
  padding: 8px !important;
}
</style>