const filteredList = require('./etfList.json')
const fs = require('fs')
const route = async (req, res) => {
    let mesg = ''
    try{
        const etfData = req.body//JSON.parse(req.body.data)
       
        const filteredStocks = etfData.filter(record => filteredList.map(_ => _.symbol).indexOf(record.symbol) > -1);
        console.log(filteredStocks)
        fs.writeFileSync('./etf_quotes.json', JSON.stringify(filteredStocks))
        console.log('file written')
    }
    catch(e){
        console.log('err in receive',  e)
        mesg = 'Err in receive'
    }
    res.status(200).json(mesg)
}
module.exports = route