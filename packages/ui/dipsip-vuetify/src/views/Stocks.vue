<template>
    <div>
        <v-card-title>Coming Soon !! AI Agents for stock discovery</v-card-title>
        <v-card-title>Tools and Frameworks for Stock Pickers</v-card-title>
        <frozen-table 
        title="Valuation Framework"
  subtitle="Importance of Entry Valuation"
  description="This matrix shows how even Good Businesses can be Bad Investments. Value in each cell is CAGR Returns."
  :row-count="8"
  :col-count="8"
  max-height="620px"
  max-width="1000px"
/>
    </div>
</template>
<script>
import FrozenTable from '../components/FrozenTable.vue'
export default {

}
</script>
