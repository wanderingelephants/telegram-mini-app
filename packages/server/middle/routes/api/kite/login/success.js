const sha256 = require('crypto-js/sha256')
const axios = require('axios')
const querystring = require('querystring')
const fs = require('fs')

let route = async (req, res) => {
    try{
        const { request_token } = req.query;
        const api_key = process.env.KITE_API_KEY
        const api_secret = process.env.KITE_API_SECRET
        const checksum = sha256(api_key + request_token + api_secret).toString();
        const formData = {
            "api_key" : api_key,
            "request_token" : request_token,
            "checksum" : checksum
          };
          
          const resp = await axios.post('https://api.kite.trade/session/token', querystring.stringify(formData), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Kite-Version': 3,
            }
          })
        const data = await resp.data
        fs.writeFileSync('access_token.json', JSON.stringify(data))
        return res.status(200).json({
            message: "OK"
        })
    }
    catch(e){
        console.log('err in order create', e)
        return res.status(500).json({
            message: "Could not prcoess login request"
        })
    }
}
module.exports = route