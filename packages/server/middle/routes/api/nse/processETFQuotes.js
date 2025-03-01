const fs = require('fs')
const TelegramNotify = require('../telegram/notify')
const TG_ADMIN_ID = process.env.TG_ADMIN_ID
const etfList = require('./etfList.json')
const Puppet = require('./puppet.js')

const downloadPath = process.env.DATA_ROOT_FOLDER + '/etf_quotes'

class ProcessETFQuotes {
    constructor(baseUrl, urlSuffix, etfQuoteFileName) {
        this.baseUrl = baseUrl
        this.urlSuffix = urlSuffix
        this.etfQuoteFileName = etfQuoteFileName
    }
    getQueryString(instruments) {
        let querystring = ''
        let count = 0
        for (const instr of instruments) {
            console.log('delta', (instr.trigger * -1) - instr.change)
            const limit_price = (instr.prevClose * (100 - instr.trigger * 1) / 100)
            const amt = instr.base_amt * Math.pow(instr.buy_factor * 1, (instr.trigger * -1) - instr.change)
            console.log("amt", amt)
            const quantity = (amt / limit_price)
            console.log("quantity", quantity)

            querystring += count === 0 ? '?' : '&'
            querystring += 'i=' + instr.symbol + '&quantity=' + quantity.toFixed(0) + '&price=' + limit_price.toFixed(2) + '&reportedPrice=' + instr.price.toFixed(2)
            count++
        }
        return querystring
    }
    async process() {
        if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath)
        console.log('ETF Processor', this.baseUrl, this.urlSuffix, downloadPath, this.etfQuoteFileName)
        if (this.baseUrl && this.baseUrl != null && this.baseUrl != "") {
            const puppet = new Puppet(this.baseUrl, this.urlSuffix, downloadPath, this.etfQuoteFileName)
            await puppet.downloadFile()
        }

        const etfQuoteFile = downloadPath + '/' + this.etfQuoteFileName
        console.log('etfQuoteFile', etfQuoteFile)
        if (!fs.existsSync(etfQuoteFile)) {
            console.log('ETF Quotes not found')
            const tgNotify = new TelegramNotify()
            await tgNotify.sendTelegramMessage(TG_ADMIN_ID, 'ETF Quotes File Not Found')
            return;
        }
        const etf_quotes_raw = fs.readFileSync(etfQuoteFile)
        const raw_data = JSON.parse(etf_quotes_raw)
        const data = raw_data.data.filter(
            (record) =>
                etfList.map((_) => _.symbol).indexOf(record.symbol) > -1
        );
        console.log("Filtered Data", data.map(_ => _.symbol))
        
    }
}
module.exports = ProcessETFQuotes
