const { query } = require('express');
const { postToGraphQL } = require('../lib/helper');
const CSVProcessor = require('./CSVProcessor');

const processInstruments = async () => {
    const processor = new CSVProcessor();
    
    // Process from file
    //await processor.processFile(process.env.DOWNLOADS + '/instruments.csv');
    
    // Or process from string
    
    // Get all records
    //const records = processor.getRecords();
    //console.log(records.length);
    const records = require(process.env.DOWNLOADS + "/equities.json")
    const equities = records.filter(r => r.instrument_type === "EQ" &&  r.segment === "NSE")
    //const equities = require(process.env.DOWNLOADS + "/equities.json")
    //console.log(equities.length)
    function groupStockCategories(stockData) {
      return Object.entries(stockData.map(stock => {
          let [symbol, category] = stock.tradingsymbol.split('-');
          return { category: category || "Regular" };
      }).reduce((acc, { category }) => {
          acc[category] = (acc[category] || 0) + 1;
          return acc;
      }, {})).sort((a, b) => b[1] - a[1]).reduce((acc, [category, count]) => {
          acc[category] = count;
          return acc;
      }, {});
  }
  function filterStockCategories(stockData) {
    return stockData.filter(stock => {
        let [symbol, category] = stock.tradingsymbol.split('-');
        return !category || ["SM", "BE", "ST"].includes(category);
    });
}
let filtered = filterStockCategories(equities)
  console.log(filtered.length)
  //console.log(groupStockCategories(equities));
    //console.log(JSON.stringify(filtered))
    //if  (true) return
    const stockResp = await postToGraphQL({
        query: `query GetEquitySymbols{
  stock{
    symbol
  }
}`,
        variables: {}
    })
    const equities_symbols = stockResp.data.stock

    for (const [index, csvRecord] of filtered.entries()) {
        await postToGraphQL({
          query: `mutation insertStock($object: stock_insert_input!){
  insert_stock_one(object: $object,
    on_conflict: {constraint: stock_symbol_key, 
  update_columns: [instrument_token, exchange_token]}){
    id
  }
}`,
variables: {
  "object": {
    "symbol": csvRecord.tradingsymbol,
    "company_name": csvRecord.name,
    "instrument_token": csvRecord.instrument_token,
    "exchange_token": csvRecord.exchange_token
    
  }
}
        })
    }
}
processInstruments()
module.exports = processInstruments
//main().catch(console.error);