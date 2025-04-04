const BreezeConnect = require('breezeconnect').BreezeConnect;
const fs = require("fs")
let breeze;

const route = async (req, res) => {

    try {
        var apiKey = process.env.ICICI_DIRECT_API_KEY;
        var appSecret = process.env.ICICI_DIRECT_SECRET;
        breeze = new BreezeConnect({ "appKey": apiKey });

        const { apisession } = req.query
        console.log("icicid apisession", apisession)

        const sessionResp = await breeze.generateSession(appSecret, apisession)
        console.log("sessionResp", sessionResp)
        fs.writeFileSync(process.env.ACCESS_TOKEN_PATH_ICICID, apisession)
        
        //await streaming();
        return res.status(200).json("ok")
    }
    catch (e) {
        console.error("error in generate session", e)
        return res.status(500).json("error")
    }


}
module.exports = route