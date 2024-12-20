
const getquote = require('./manualquote')

let route = async (req, res) => {
    try{
        let resp = await getquote(req.query.i, req.query.sendNotification)
        return res.status(200).json(resp)
    }
    catch(e){
        console.log('err in user profile', e)
        return res.status(500).json({
            message: "Could not get quote for instrument"
        })
    }
}
module.exports = route

//{"status":"success","data":{"user_type":"individual/ind_with_nom","email":"sachet_1999@yahoo.com","user_name":"Sachet Singh","user_shortname":"Sachet","broker":"ZERODHA","exchanges":["BFO","NFO","NSE","BSE","MF"],"products":["CNC","NRML","MIS","BO","CO"],"order_types":["MARKET","LIMIT","SL","SL-M"],"avatar_url":null,"user_id":"DS8262","api_key":"kji5cp71pkds249r","access_token":"m7BokqFKHBfuKj9vDUPHQttdmndyx19L","public_token":"P0CaA5Waku4HIGTGc6ms3lWLLAzQS7vD","refresh_token":"","enctoken":"xqKsypzSu4CFkx7YzTsUv+6JUnHJL61gbyG1bsWtw2p/+Tiy+Kb5qUlfn4+NhAuuvTn6VY7eNRMvY9KJRXowAmTdan8+zt8QuYpVUAXc6ZjN2i4j7KhJ3kWMH/c5UbE=","login_time":"2024-10-12 11:13:17","meta":{"demat_consent":"physical"}}}