
const getquote = require('./getquote')

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