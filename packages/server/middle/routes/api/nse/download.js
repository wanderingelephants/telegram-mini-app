const Puppet = require('./puppet.js')
//const path = require('path');
const downloadPath = process.env.DOWNLOADS
const route = async (req, res) => {

    try {
        console.log('recd download req')
        const baseUrl = 'https://www.nseindia.com';
        const csvUrlSuffix = '/api/etf'
        //const downloadPath = path.join(__dirname, 'downloads');

        const puppet = new Puppet()
        const resp = await puppet.downloadCSV(baseUrl, csvUrlSuffix, downloadPath)
        console.log('downloaded', resp)

    }
    catch(e){
        console.log('err in  download', e)
    }
    res.status(200).json("Download processed")
}
module.exports = route