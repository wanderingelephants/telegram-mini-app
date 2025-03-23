<template>
<div>
    Cash Flow {{symbol}}
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
    this.symbol = newSymbol;
  },
};
</script>

