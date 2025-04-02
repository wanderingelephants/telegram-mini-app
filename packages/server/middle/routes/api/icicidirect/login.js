const axios = require("axios")
const BreezeConnect = require('breezeconnect').BreezeConnect;

const route = async (req, res) => {

    try{
        var apiKey = process.env.ICICI_DIRECT_API_KEY;
var appSecret = process.env.ICICI_DIRECT_SECRET;
var breeze = new BreezeConnect({"appKey":apiKey});

const {apisession} = req.query
console.log("icicid login success", apisession)

const sessionResp = await breeze.generateSession(appSecret, apisession)
console.log("sessionResp", sessionResp)
apiCalls();

function apiCalls(){
    breeze.getHistoricalData(
        {
            interval:"1day",   //'1minute', '5minute', '30minute','1day'
            fromDate: "2025-03-15T07:00:00.000Z",
            toDate: "2025-03-27T07:00:00.000Z",
            stockCode:"ITC",
            exchangeCode:"NSE",   // 'NSE','BSE','NFO'
            productType:"cash"
        }
    )
    .then(function(resp){
        console.log(resp);
    });
}

return res.status(200).json("ok")
    }
    catch(e){
        console.error(e)
        return res.status(500).json("error")
    }


}
module.exports = route