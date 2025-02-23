<template>
  <v-container class="pricing-container">
    <v-card class="mx-auto my-8 text-center" max-width="800">
      <v-card-title class="text-h4 font-weight-bold justify-center py-4">
        Offerings
      </v-card-title>
    </v-card>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-table class="pricing-table">
          <thead>
            <tr>
              <th class="text-left">Product</th>
              <th class="text-left nowrap">Fee (pm)</th>
              <th class="text-left">Who is it for?</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in pricingData" :key="index">
              <td class="text-h6 font-weight-bold">{{ item.product_name }}</td>
              <td class="text-subtitle-1 nowrap">
                <span class="strikeout">{{ item.strikeoutpricing }}</span>
                <span class="discounted">{{ item.pricing }}</span>
              </td>
              <td>{{ item.suitability }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      pricingData: [
        {
          product_name: "Index Funds",
          pricing: "Rs. 99",
          strikeoutpricing: "Rs. 199",
          suitability: "New investors, with 0-3 years exposure in the Stock Markets. Keep it simple, passive index investing with 3-5 years plus horizon"
        },
        {
          product_name: "Mutual Funds",
          pricing: "Rs. 199",
          strikeoutpricing: "Rs. 299",
          suitability: "Investors, with 3-5 years plus exposure in the Stock Markets. Get some exposure to good quality mutual funds with 3-5 years plus horizon"
        },
        {
          product_name: "Stocks",
          pricing: "Rs. 499",
          strikeoutpricing: "Rs. 999",
          suitability: "You understand volatility, risk, business/market cycles. Have read and re-read Nassim Taleb multiple times 😎"
        },
        {
          product_name: "Enterprise",
          pricing: "Rs. 9999",
          strikeoutpricing: "Rs. 19999",
          suitability: "Your Data, Our Software. Your AI."
        }
      ]
    };
  }
};
</script>

<style scoped>
.pricing-container {
  text-align: center;
}

.pricing-table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f5f5f5;
  padding: 12px;
  font-size: 1.2em;
}

td {
  padding: 12px;
  font-size: 1em;
  border-bottom: 1px solid #ddd;
}

.nowrap {
  white-space: nowrap;
}

.strikeout {
  text-decoration: line-through;
  color: grey;
  margin-right: 8px;
}

.discounted {
  font-weight: bold;
  color: #388e3c;
  font-size: 1.1em;
}
</style>