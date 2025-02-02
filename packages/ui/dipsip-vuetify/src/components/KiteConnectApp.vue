<template>
 <div>
<v-row class="mt-4 ml-4">
  <v-col cols="12">
    <h1><v-alert
    :text="instrument"
    title="Zerodha Users can directly place after reviewing. Other Brokerage users, please login to your respective client and place these Orders"
    type="warning"
  ></v-alert></h1>
  </v-col>
  </v-row>
  <div>
  <v-row v-for="b of basket" :key="b.instrument">
    <v-col cols="3"><h3>{{instrumentDisplay(b)}}</h3></v-col>
    <v-col cols="4"><v-text-field type="number" label="Trigger Price" v-model="b.price" @update:modelValue="showConfirm=true; showKiteBtn=false"></v-text-field></v-col>
    <v-col cols="3"><v-text-field type="number"  label="Quantity" v-model="b.quantity"  @update:modelValue="showConfirm=true; showKiteBtn=false"></v-text-field></v-col>
    <v-col cols="2" label="Amt"><v-card-text>{{(Math.round(b.price * b.quantity)).toLocaleString()}}</v-card-text></v-col>
  </v-row>
  <v-row>
    <v-col cols="4">
        <h2>Rs. {{totalInvestment.toLocaleString()}}</h2>
    </v-col>
    <v-col cols="8">
  <v-btn v-if="showConfirm" theme="light" color="primary" @click="confirm">Confirm</v-btn>
  <KiteConnectButton v-if="showKiteBtn" :apiKey="yourApiKey" :basket="basket"/>
  </v-col>
</v-row>
  </div>
 </div>
</template>

<script>
import KiteConnectButton from './KiteConnectButton.vue'

export default {
  components: {
    KiteConnectButton
  },
  mounted(){
    this.basket = []
    const exchange = 'NSE'
    let instrument, price, quantity, reportedPrice; 
    instrument = this.$route.query.i
    price = this.$route.query.price
    quantity = this.$route.query.quantity
    reportedPrice = this.$route.query.reportedPrice
    if (!Array.isArray(instrument)){
        this.basket.push({exchange, instrument, price, quantity, reportedPrice})
    }
    else {
        for (let i=0; i<instrument.length; i++){
            this.basket.push({exchange, 'instrument': instrument[i], 'price': price[i], 'quantity' : quantity[i], 'reportedPrice': reportedPrice[i]})
        }
    }
    console.log('kite basket', this.basket)
  },
  methods:{
    confirm(){
        this.showKiteBtn = true
        this.showConfirm = false
    },
    instrumentDisplay(b){
      const instr = b.instrument
      let display = ''
        console.log('instrDisplay', instr)
        if (instr.indexOf(':') > -1){
            display = instr.split(':')[1]
        }
        else display = instr
        display += ' Current Price:' + b.reportedPrice
        return display
    }
  },
  computed:{
    totalInvestment(){
        const total = this.basket.reduce((acc, item) => {return acc += item.price*item.quantity*1}, 0)
        return Math.round(total)
    },
    
  },
  data() {
    return {
      yourApiKey: 'dzvr7itl7213gjnp',
      basket: [],
      exchange: '',
      instrument: '',
      price: 0,
      quantity: 0,
      showKiteBtn: false,
      showConfirm: true
    }
  }
}
</script>