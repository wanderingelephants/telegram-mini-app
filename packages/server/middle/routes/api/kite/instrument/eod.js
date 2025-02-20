const fs = require("fs")
const axios = require("axios")
const { postToGraphQL } = require("../../../../lib/helper");

//https://api.kite.trade/instruments/historical/136413956/day?from=2025-02-01+09:15:00&to=2025-02-12+15:30:00
const route = async (req, res) => {
    const dateStr = req.query.dateStr
    const fromTime = `${dateStr} 09:15:00`
    const toTime = `${dateStr} 15:30:00`
    console.log("Process EOD for ", dateStr, fromTime, toTime)
    let access_token_data;
    access_token_data = require(process.env.ACCESS_TOKEN_PATH)
    if (fs.existsSync(process.env.ACCESS_TOKEN_PATH)) access_token_data = require(process.env.ACCESS_TOKEN_PATH)
    else return ({ status: 'fail', message: 'no_access_token' })

    
    const queryResp = await postToGraphQL({
        query: `query GetEquitySymbols($symbol: String!){
  stock(where: {symbol: {_eq: $symbol}}){
  id
    symbol
    instrument_token
    exchange_token
  }
}`,
        variables: {"symbol": "VLINFRA"}
    })

    const stocks = queryResp.data.stock
    for (const [index, record] of stocks.entries()) {
        try{
            if (!record.instrument_token || record.instrument_token == null) {
                console.log("instrument_token not found for ", record)
                continue;
            }
            console.log("fetching", `https://api.kite.trade/instruments/historical/${record.instrument_token}/day?from=${fromTime}&to=${toTime}`)
            const kiteQuoteUrl = `https://api.kite.trade/instruments/historical/${record.instrument_token}/day?from=${fromTime}&to=${toTime}`
            const resp = await axios.get(kiteQuoteUrl, {
                headers: {
                    'X-Kite-Version': 3,
                    'Authorization': `token ${access_token_data.data.api_key}:${access_token_data.data.access_token}` // Overrides any defaults that are set
                }
            })
            console.log(resp.data)
            if (resp.data.data.candles.length == 0) {
                console.log("no candles found", record)
                continue;
            }
            console.log(JSON.stringify(resp.data.data.candles))
            const candle = resp.data.data.candles[0]
            console.log("candle", candle)
            const dt = new Date(candle[0])
            const toks = dt.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' }).split('/')

            const yyyyymmdd = toks[2] + "-" + toks[1] + "-" + toks[0] 
            console.log(dt, dt.toISOString(), dt.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' }).split('/').join('-'))
            const mutationVariables = {
                "object": {
                    "stock_id": record.id,
                    "price_date": yyyyymmdd,
                    "open": candle[1],
                    "high": candle[2],
                    "low": candle[3],
                    "close": candle[4],
                    "volume": candle[5]
                }
            }
            const insertMutation = `mutation insertStockPrice($object: stock_price_daily_insert_input!){
      insert_stock_price_daily_one(object: $object, on_conflict:{
        constraint: stock_price_daily_stock_id_price_date_key,
        update_columns: [open, high, low, close, volume]
      }){
        id
      }
    }`
         const insertResp =  await postToGraphQL({ query: insertMutation, variables: mutationVariables })
         console.log(insertResp)
        }
        catch(e){
            console.log(e.message, record)
        }
        
    }


    return res.status(200).json("ok")

}
module.exports = route