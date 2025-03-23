<template>
  <div>Ratios {{ symbol }}</div>
</template>
<script>
export default {
  props: {
    symbol: {
      type: String,
      required: true,
    },
  },
  mounted() {
    
  },
  data() {
    return {
    };
  },
  "$route.params.symbol": function (newSymbol) {
    console.log("newsymbol", newSymbol);
    this.symbol = newSymbol;
  },
};
</script>
