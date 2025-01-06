const ProcessETFQuotes = require('./processETFQuotes')
const route = async(req, res) => {
    try{
        const etfFileName = req.query.etfFileName
        const processor = new ProcessETFQuotes("", "", etfFileName)
        await processor.process()
        res.status(200).json("OK")
    }
    catch(e){
        res.status(500).json(e)
    }
    
}
module.exports = route