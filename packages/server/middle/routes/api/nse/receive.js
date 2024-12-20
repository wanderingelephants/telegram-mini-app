const filteredList = require('./etfList.json')

const route = async (req, res) => {
    let mesg = ''
    try{
        const data = req.body.data
        const highValueStocks = data.filter(record => filteredList.map(_ => _.symbol).indexOf(record.symbol) > -1);
        console.log(highValueStocks.map(_ => _.symbol))
    }
    catch(e){
        console.log('err in receive',  e)
        mesg = 'Err in receive'
    }
    res.status(200).json(mesg)
}
module.exports = route