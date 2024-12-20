const axios = require('axios')
const querystring = require('querystring');

let route = async (req, res) => {
  let access_token_data;
  if (fs.existsSync(process.env.ACCESS_TOKEN_PATH)) access_token_data = require(process.env.ACCESS_TOKEN_PATH)
    else res.status(200).json({message: 'no_access_token'})
  console.log(access_token_data)

    try{
        const formData = {
            "tradingsymbol" : "BANKNIFTY1",
            "exchange" : "NSE",
            "transaction_type" : "BUY",
            "order_type" : "MARKET",
            "quantity" : "1",
            "product" : "CNC",
            "validity" : "DAY"
          };
          
          const resp = await axios.post('https://api.kite.trade/orders/regular', querystring.stringify(formData), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Kite-Version': 3,
              'Authorization': `token ${access_token_data.data.api_key}:${access_token_data.data.access_token}` 
            
            }
          })
        console.log(resp)
        return res.status(200).json({
            message: "OK"
        })
    }
    catch(e){
        console.log('err in order create', e)
        return res.status(500).json({
            message: "Could not prcoess Create Order"
        })
    }
}
module.exports = route