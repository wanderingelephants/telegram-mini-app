<template>
  <div>
    <h2>Stock Watchlist</h2>
    
    <h3>Announcements</h3>
    <v-data-table :headers="announcementHeaders"
    :items="announcements">
    <template v-slot:header.company_name>Company</template>
    <template v-slot:header.announcement_text_summary>Summary</template>
    <template v-slot:header.announcement_impact>Impact</template>
    <template v-slot:header.announcement_sentiment>Signal</template>
    <template v-slot:header.announcement_date>Date</template>
    </v-data-table>
    
    <h3>Insider Trades</h3>
    <v-data-table :headers="insiderTradeHeaders" :items="insiderTrades" class="mb-4" >
        <template v-slot:header.company_name>Company</template>
        <template v-slot:header.name_of_insider>Insider</template>
        <template v-slot:header.category_of_insider>Category</template>
        <template v-slot:header.transaction_type>Type</template>
        <template v-slot:header.mode_of_transaction>Mode</template>
        <template v-slot:header.shareholding_before_transaction>%Pre</template>
        <template v-slot:header.shareholding_after_transaction>%Post</template>
        <template v-slot:header.intimation_date>Intimation</template>
    
    </v-data-table>

  </div>
</template>

<script>
import StockPriceChart from "@/components/StockPriceChart.vue";

export default {
  props: {
    announcements: Array,
    insiderTrades: Array,
    candles: Array
  },
  components: {
    StockPriceChart
  },
  data(){
    return {
        announcementHeaders:[
            { text: "Company", value: "company_name" },
        { text: "Summary", value: "announcement_text_summary" },
        { text: "Impact", value: "announcement_impact" },  // Fixed typo in 'announcement'
        { text: "Signal", value: "announcement_sentiment" },
        { text: "Date", value: "announcement_date" }
        ]
    }
  },
  computed: {
    
    insiderTradeHeaders() {
      return [
        { text: "Company", value: "company_name" },
        { text: "Insider", value: "name_of_insider" },
        { text: "Category", value: "category_of_insider" },
        { text: "Type", value: "transaction_type"},
        { text: "Mode", value: "mode_of_transaction"},
        { text: "% Pre", value: "shareholding_before_transaction" },
        { text: "% Post", value: "shareholding_after_transaction" },
        { text: "Date", value: "intimation_date" }
      ];
    }
  }
};
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
</style>
