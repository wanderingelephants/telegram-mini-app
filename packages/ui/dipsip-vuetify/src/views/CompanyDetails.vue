<template>
  <div>
    <v-card v-if="company_data && company_data.company" class="mt-4">
      <v-card-title class="text-h5 primary--text">
        {{ company_data.company.name }}
        <v-btn color="primary" class="ml-2" @click="addToPortfolio">FOLLOW</v-btn>
      </v-card-title>
      <v-card-subtitle>Company Financial Ratios</v-card-subtitle>
      
      <v-card-text>
        <v-row>
          <!-- Responsive grid - 12 columns on mobile (full width), 6 columns on desktop (2 per row) -->
          <v-col cols="12" md="6">
            <v-card elevation="2" class="pa-4 mb-4">
              <div class="text-h6 mb-2">Market Cap</div>
              <div class="text-body-1">₹{{ (company_data.Market_Cap) }} Cr</div>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-card elevation="2" class="pa-4 mb-4">
              <div class="text-h6 mb-2">Enterprise Value</div>
              <div class="text-body-1">₹{{ (company_data.Enterprise_Value) }} Cr</div>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-card elevation="2" class="pa-4 mb-4">
              <div class="text-h6 mb-2">Price to Earnings</div>
              <div class="text-body-1">{{ company_data.Price_To_Earnings.toFixed(2) }}</div>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-card elevation="2" class="pa-4 mb-4">
              <div class="text-h6 mb-2">Price to Book Value</div>
              <div class="text-body-1">{{ company_data.Price_To_BookValue.toFixed(2) }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <v-skeleton-loader
      v-else
      type="card"
      class="mt-4"
    ></v-skeleton-loader>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  INSERT_PORTLFOLIO_STOCK
} from "../lib/helper/queries";

export default {
  props: {
    symbol: {
      type: String,
      required: true,
    }
  },
  async mounted() {
    if (this.symbol) await this.getCompanyData();
  },
  computed: {
  ...mapState([
      "loggedInGoogle",
      "userGoogle",
    ]),
  },
  
  data() {
    return {
      company_data: null,
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
    async getCompanyData() {
      try {
        const response = await fetch(`/api/company/details/${this.symbol}/ratios`, {
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
        this.company_data = jsonData[0];
        
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