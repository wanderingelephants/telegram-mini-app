const axios = require("axios");
const { postToGraphQL } = require("../../../lib/helper");
const BreezeConnect = require('breezeconnect').BreezeConnect;
const moment = require("moment")
const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const parsedDate = moment(dateStr, ["YYYY-MM-DD HH:mm:ss", "DD/MM/YYYY", "YYYY/MM/DD", "DD-MM-YYYY"]);
    return parsedDate.isValid() ? parsedDate.utcOffset(330).format("YYYY-MM-DD") : dateStr;
  };
const icicidirectsymbols = require("../../../cmots/json/icicidirectsymbols.json")  
const route = async (req, res) => {

    try{
        var apiKey = process.env.ICICI_DIRECT_API_KEY;
var appSecret = process.env.ICICI_DIRECT_SECRET;
var breeze = new BreezeConnect({"appKey":apiKey});

const {apisession} = req.query
console.log("icicid login success", apisession)

const sessionResp = await breeze.generateSession(appSecret, apisession)
console.log("sessionResp", sessionResp)
await apiCalls();
console.log("icici d loading done")

async function apiCalls(){
    /*if (true){
        for (const relStock of ["BRIIND", "RELIND", "STABAN", "HDFBAN", "ICIBAN", "ADAPOR", "ULTCEM" ]){
            let resp = await breeze.getHistoricalData({
                interval:"1day",   //'1minute', '5minute', '30minute','1day'
                fromDate: "2025-03-31T07:00:00.000Z",
                toDate: "2025-04-02T07:00:00.000Z",
                stockCode: relStock,
                exchangeCode:"NSE",   // 'NSE','BSE','NFO'
                productType:"cash"
            })
            console.log(relStock, resp)
        }
        
        return;
    }*/
    try {
        const query = `query get_nse_symbols{
          company_master{
            co_code
            nsesymbol
            isin
          }
        }`
        const insertMutation = `mutation insert_closing_prices($objects: [company_price_volume_insert_input!]!){
  insert_company_price_volume(objects: $objects, on_conflict:{
    constraint: u_company_price_volume,
    update_columns: [updated_at]
  }){
    affected_rows
  }
}`
        const gqlResp = await postToGraphQL({ query, variables: {} })
        const companies = gqlResp.data.company_master
        for (const company of companies){
            const iciciStockCode = icicidirectsymbols.filter(i => i.ISINCode === company.isin)[0].ShortName
        
            const resp = await breeze.getHistoricalData({
                interval:"1day",   //'1minute', '5minute', '30minute','1day'
                fromDate: "2024-03-31T07:00:00.000Z",
                toDate: "2025-04-02T07:00:00.000Z",
                stockCode: iciciStockCode,
                exchangeCode:"NSE",   // 'NSE','BSE','NFO'
                productType:"cash"
            })
            //console.log("oclh", resp)
            if (resp.Success){
                try {
                    const mutationArray = resp.Success.map(r => {
                        return {
                            created_at: new Date(),
                            updated_at: new Date(),
                            co_code: company.co_code,
                            open: parseFloat(r.open),
                            high: parseFloat(r.high),
                            low: parseFloat(r.low),
                            close: parseFloat(r.close),
                            volume: parseFloat(r.volume),
                            record_date: formatDate(r.datetime)
                        }
                    })
                    //console.log(insertMutation, mutationArray)
                    const mutationResp = await postToGraphQL({
                        query: insertMutation,
                        variables: {"objects": mutationArray}
                    })
                    
                }
                catch(e){
                    console.error(e)
                }
                
            }
            else  {
                console.log(company.nsesymbol, resp)
            }
        }
        
      }
      catch (e) {
        console.error(e)
      }
}

return res.status(200).json("ok")
    }
    catch(e){
        console.error(e)
        return res.status(500).json("error")
    }


}
module.exports = route