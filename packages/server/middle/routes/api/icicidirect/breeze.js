const fs = require("fs")
const moment = require("moment")
const BreezeConnect = require('breezeconnect').BreezeConnect;
const { postToGraphQL } = require("../../../lib/helper");


const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const parsedDate = moment(dateStr, ["YYYY-MM-DD HH:mm:ss", "DD/MM/YYYY", "YYYY/MM/DD", "DD-MM-YYYY"]);
    return parsedDate.isValid() ? parsedDate.utcOffset(330).format("YYYY-MM-DD") : dateStr;
};
const icicidirectsymbols = require("../../../cmots/csv/icicidirectsymbols.json")

class Breeze{
    constructor(apiKey, appSecret) {
		this.apiKey = apiKey;
		this.appSecret = appSecret;
		this.breeze = new BreezeConnect({ appKey: this.apiKey });
		this.breeze.onTicks = this.onTicks;
	}

	static async init() {
		const apiKey = process.env.ICICI_DIRECT_API_KEY;
		const appSecret = process.env.ICICI_DIRECT_SECRET;

		const instance = new Breeze(apiKey, appSecret);
		await instance.createSession(); // perform async session init here
		return instance;
	}
    createSession  = async () => {
        try{
            const apisession = fs.readFileSync(process.env.ACCESS_TOKEN_PATH_ICICID, "utf-8")
            const sessionResp = await this.breeze.generateSession(this.appSecret, apisession)
            console.log("session created", sessionResp)
            await this.breeze.wsConnect()
        }
        catch(e){
            console.error(e)
        }        
    }
    loadHistoricalData = async (interval, fromTime, toTime) => {
        let tableName = "company_historical_price_volume_by_date"
        
        let update_columns = "updated_at"
        if  (interval === "1minute"){
            tableName = "company_intraday_oclh_candles_by_minute"
            
            update_columns = "open, high, low, close"
        }
        const UniqueConstraintName = `u_${tableName}`
        try {
            const query = `query get_nse_symbols{
              company_master{
                co_code
                nsesymbol
                isin
              }
            }`
            const insertMutation = `mutation insert_oclh($objects: [${tableName}_insert_input!]!){
      insert_${tableName}(objects: $objects, on_conflict:{
        constraint: ${UniqueConstraintName},
        update_columns: [${update_columns}]
      }){
        affected_rows
      }
    }`
            const gqlResp = await postToGraphQL({ query, variables: {} })
            const companies = gqlResp.data.company_master
            for (const company of companies) {
                const iciciStockCode = icicidirectsymbols.filter(i => i.ISINCode === company.isin)[0].ShortName
    
                const resp = await this.breeze.getHistoricalData({
                    interval,   //'1minute', '5minute', '30minute','1day'
                    fromDate: fromTime,
                    toDate: toTime,
                    stockCode: iciciStockCode,
                    exchangeCode: "NSE",   // 'NSE','BSE','NFO'
                    productType: "cash"
                })
                //console.log("oclh", resp)
                if (resp.Success) {
                    try {
                        let mutationArray = resp.Success.map(r => {
                            const mutationFields = {
                                created_at: new Date(),
                                updated_at: new Date(),
                                co_code: company.co_code+"",
                                open: parseFloat(r.open),
                                high: parseFloat(r.high),
                                low: parseFloat(r.low),
                                close: parseFloat(r.close),
                                volume: parseFloat(r.volume),
                                //time: r.datetime
                                //record_date: formatDate(r.datetime)
                            }
                            interval === "1minute" ? mutationFields["datetime_minute"] = r.datetime : mutationFields["record_date"] = formatDate(r.datetime)
                            
                            return mutationFields
                        })
                        mutationArray = mutationArray.filter(r => r.volume > 0)
                        //console.log(insertMutation, mutationArray)
                        const mutationResp = await postToGraphQL({
                            query: insertMutation,
                            variables: { "objects": mutationArray }
                        })
    
                    }
                    catch (e) {
                        console.error(e)
                    }
    
                }
                else {
                    console.log(company.nsesymbol, resp)
                }
            }
    
        }
        catch (e) {
            console.error(e)
        }
    }
    
    onTicks = (ticks) => {
        console.log("onTicks", ticks)
    }
    subscribeFeed = async(symbol, interval) => {
        const subscriptionResp = await this.breeze.subscribeFeeds({ 
            stockToken: symbol, getMarketDepth:true, exchangeCode: "NSE",
            interval: interval })
            /*const subscriptionResp = await this.breeze.subscribeFeeds({ 
                stockCode: symbol, getMarketDepth:false, exchangeCode: "NSE",
                interval: interval })    */
        console.log(subscriptionResp)    
    }
}
module.exports = Breeze