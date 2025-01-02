const Puppet = require('./puppet.js')
const downloadPath = process.env.DOWNLOADS
const ProcessETFQuotes = require('./processETFQuotes')

const route = async (req, res) => {

    try {
        const {baseUrl, urlSuffix, downloadFileName} = req.body
        console.log('recd download req', {baseUrl, urlSuffix, downloadFileName})
        
        const puppet = new Puppet(baseUrl, urlSuffix, downloadPath, downloadFileName)
        await puppet.downloadFile()
        const processor = new ProcessETFQuotes(downloadFileName)
        await processor.process()
        res.status(200).json("OK")
    }
    catch(e){
        console.log('err in  processing', e)
        res.status(500).json("ETF did not process")
    }
    
}
module.exports = route