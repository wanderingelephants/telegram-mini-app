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
    //const equities = records.filter(r => r.instrument_type === "EQ")
    const equities = require(process.env.DOWNLOADS + "/equities.json")
    //console.log(JSON.stringify(equities))
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

    for (const [index, dbRecord] of equities_symbols.entries()) {
        const mutationQuery = `
        mutation updateStock($symbol: String!, $instrument_token: Int!, $exchange_token: Int!){
  update_stock(_set: {instrument_token: $instrument_token, exchange_token: $exchange_token},where: {symbol: {_eq: $symbol}}){
    returning{
      id
    }
  }
}`

const csvRecord = equities.find(r => r.tradingsymbol === dbRecord.symbol || r.tradingsymbol === dbRecord.symbol + "-BE")
//console.log("update tokens for ", r.tradingsymbol, csvRecord)
if (csvRecord === undefined){
    console.log("csv record not found for", dbRecord.symbol)    
    continue;
}
        await postToGraphQL({query: mutationQuery, variables: {
            
    "symbol": dbRecord.symbol,
    "exchange_token": csvRecord.exchange_token,
    "instrument_token": csvRecord.instrument_token
  }
        })
    }
    // Find specific record
    //const record = processor.getRecordByInstrumentToken(270018310);
    //console.log(record);
}
module.exports = processInstruments
//main().catch(console.error);