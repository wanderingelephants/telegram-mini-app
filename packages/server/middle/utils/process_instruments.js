const { postToGraphQL } = require('../lib/helper');
const CSVProcessor = require('./CSVProcessor');

async function main() {
    const processor = new CSVProcessor();
    
    // Process from file
    await processor.processFile(process.env.DOWNLOADS + '/instruments.csv');
    
    // Or process from string
    
    // Get all records
    const records = processor.getRecords();
    //console.log(records);
    const equities = records.filter(r => r.instrument_type === "EQ")
    console.log(equities.length)
    for (const [index, record] of equities.entries()) {
        const mutationQuery = `
            mutation insertStocks($object: stock_insert_input!) {
  insert_stock_one(object: $object, on_conflict:{
    constraint: stock_symbol_key, 
    update_columns: [exchange_token, instrument_token, ticker_exchange]
  }){
    id
    symbol
  }
}`
        await postToGraphQL({query: mutationQuery, variables: {
            "object": {
    "symbol": record.tradingsymbol,
    "exchange_token": record.exchange_token,
    "instrument_token": record.instrument_token,
    "ticker_exchange": record.exchange,
    "company_name": record.name
  }
        }})
    }
    // Find specific record
    //const record = processor.getRecordByInstrumentToken(270018310);
    //console.log(record);
}

main().catch(console.error);