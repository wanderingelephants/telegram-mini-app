const etf_list = require('./etfList.json')

const route = async(req, res) => {
    try{
        res.status(200).json(etf_list)
    }
    catch(e){
        console.log(e)
        res.status(500).json(e)
    }
    
}
module.exports = route