const ProcessETFQuotes = require('./processETFQuotes')
const route = async(req, res) => {
    try{
        const processor = new ProcessETFQuotes()
        await processor.process()
        res.status(200).json("OK")
    }
    catch(e){
        res.status(500).json(e)
    }
    
}
module.exports = route