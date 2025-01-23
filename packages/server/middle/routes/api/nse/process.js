const ProcessETFQuotes = require('./processETFQuotes')
const route = async(req, res) => {
    try{
        const {baseUrl, urlSuffix, etfFileName} = req.body
        const processor = new ProcessETFQuotes(baseUrl, urlSuffix, etfFileName)
        await processor.process()
        res.status(200).json("OK")
    }
    catch(e){
        res.status(500).json(e)
    }
    
}
module.exports = route