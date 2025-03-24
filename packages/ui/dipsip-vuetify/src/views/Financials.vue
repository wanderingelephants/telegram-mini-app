<template>
  <div>
    <v-card  class="mt-4">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="formattedBalanceSheetData"
          item-key="id"
          hide-default-footer
          disable-sort
          class="balance-sheet-table"
          :items-per-page="-1"
        >
        <template v-slot:headers="{ columns }">
    <tr>
      <th
        v-for="column in columns"
        :key="column.text"
        :style="{ width: column.width, textAlign: column.align }"
      >
        {{ column.text }}
      </th>
    </tr>
  </template>
          <!-- Using the item slot correctly for Vuetify 2.x -->
          <template v-slot:item="props">
            <tr>
              <!-- Category or item name column -->
              <td 
                :class="{ 
                  'font-weight-bold': props.item.isCategory, 
                  'pl-6': !props.item.isCategory && !props.item.isSummary,
                  'blue--text': props.item.isSummary,
                  'grey lighten-4': props.item.isCategory
                }"
              >
                <div class="d-flex align-center">
                  <span
                    v-if="props.item.isCategory"
                    icon
                    small
                    @click="toggleCategory(props.item.category)"
                    class="mr-2"
                  >
                    <v-icon>{{ expandedCategories[props.item.category] ? '$mdiMinus' : '$mdiPlus' }}</v-icon>
                  </span>
                  {{ props.item.name }}
                </div>
              </td>
              
              <!-- Value columns for each year -->
              <td 
                v-for="year in years" 
                :key="year"
                class="text-right"
                :class="{ 
                  'font-weight-bold': props.item.isCategory || props.item.isSummary,
                  'grey lighten-4': props.item.isCategory
                }"
              >
                {{ formatCurrency(props.item.values[year]) }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    
    <!--<v-skeleton-loader
      v-else
      type="card"
      class="mt-4"
    ></v-skeleton-loader> -->
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
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
  async mounted() {
    //alert("BalanceSheet mounted")
    //if (this.symbol) await this.getCompanyData();
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
      company_data: null,
      company_balance_sheet: [],
      company_balance_sheet_display: [],
      expandedCategories: {},
      years: [],
      headers: [],
      snackbar: {
        show: false,
        message: "",
        color: "",
      }
    };
  },
  methods: {
    
    async addToPortfolio(){
         try {
          const resp = await this.$apollo.query({
            query: INSERT_PORTLFOLIO_STOCK,
            variables: {
              object: {
                stock_id: this.company_data.company.id,
                user: {
                  data: {
                    email: this.userGoogle.email,
                    google_id: this.userGoogle.uid,
                  },
                  on_conflict: {
                    constraint: "users_email_key",
                    update_columns: ["email"],
                  },
                },
              },
            },
            fetchPolicy: "no-cache",
          });
          this.snack.message =  "Added to Watch List"
          this.snack.show = true
        } catch (e) {
          console.error(e);
        }
    },
    /*formatBalanceSheetData() {
     
    this.formattedBalanceSheetData = this.company_balance_sheet_display.filter(item => {
      if (item.isCategory) return true;
      if (item.isSummary) return true;
      return this.expandedCategories[item.category];
    });
  },*/
    formatNumber(value) {
      // Format large numbers in crores/lakhs (Indian numbering system)
      if (!value) return '0';
      
      const crore = 10000000;
      const lakh = 100000;
      
      if (value >= crore) {
        return (value / crore).toFixed(2) + ' Cr';
      } else if (value >= lakh) {
        return (value / lakh).toFixed(2) + ' L';
      } else {
        return value.toLocaleString('en-IN');
      }
    },
    processBalanceSheetData() {
      if (!this.company_balance_sheet.length) return;
      
      // Extract unique years and sort them
      this.years = [...new Set(this.company_balance_sheet.map(item => item.year))].sort();
      // Create headers
      this.headers = [
        { text: 'Particulars', value: 'name', align: 'left', sortable: false, width: '40%' },
        ...this.years.map(year => ({
          text: year.toString(),
          value: `values.${year}`,
          align: 'right',
          sortable: false
        }))
      ];
      // Group items by category and key
      const categoriesMap = {};
      
      this.company_balance_sheet.forEach(item => {
        const { key_category, key, value, year, rowno } = item;
        
        if (!categoriesMap[key_category]) {
          categoriesMap[key_category] = {
            items: {},
            rowno: Math.min(...this.company_balance_sheet.filter(i => i.key_category === key_category).map(i => i.rowno))
          };
          this.expandedCategories[key_category] = false;
        }
        
        if (!categoriesMap[key_category].items[key]) {
          categoriesMap[key_category].items[key] = {
            values: {},
            rowno
          };
        }
        
        categoriesMap[key_category].items[key].values[year] = value;
      });
      // Format data for display
      const displayData = [];
      
      // Sort categories by rowno
      const sortedCategories = Object.entries(categoriesMap)
        .sort((a, b) => a[1].rowno - b[1].rowno);
      
      sortedCategories.forEach(([category, categoryData]) => {
        // Add category header
        displayData.push({
          id: `category-${category}`,
          name: category,
          category,
          isCategory: true,
          values: this.calculateCategoryTotals(categoryData.items),
          rowno: categoryData.rowno
        });
        
        // Add items
        const sortedItems = Object.entries(categoryData.items)
          .sort((a, b) => a[1].rowno - b[1].rowno);
        
        sortedItems.forEach(([key, itemData]) => {
          displayData.push({
            id: `item-${category}-${key}`,
            name: key,
            category,
            isCategory: false,
            isSummary: key.includes('Total'),
            values: itemData.values,
            rowno: itemData.rowno
          });
        });
      });
      this.company_balance_sheet_display = displayData;
    },
    
    calculateCategoryTotals(items) {
      const totals = {};
      
      this.years.forEach(year => {
        totals[year] = Object.values(items).reduce((sum, item) => {
          return sum + (item.values[year] || 0);
        }, 0);
      });
      
      return totals;
    },
    
    toggleCategory(category) {
  // Direct assignment works in Vue 3
  this.expandedCategories[category] = !this.expandedCategories[category];
  
  // If you're using the method approach instead of computed
  if (typeof this.updateFormattedData === 'function') {
    this.updateFormattedData();
  }
},
    
  formatCurrency(value) {
    return new Intl.NumberFormat('en-IN').format(Math.round(value));
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
        this.processBalanceSheetData();
        
      } catch (e) {
        console.error(e);
        this.snackbar.color = "error";
        this.snackbar.message = "Error fetching data";
        this.snackbar.show = true;
      }
    }
  },
  watch: {
    symbol: async function (newSymbol) {
      await this.getCompanyData();
    },
  }
};
</script>
<style scoped>
.balance-sheet-table >>> tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.balance-sheet-table >>> thead th {
  font-weight: bold;
  white-space: nowrap;
}
</style>