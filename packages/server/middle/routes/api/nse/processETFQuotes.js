const fs = require('fs')
const TelegramNotify = require('../telegram/notify')
const TG_ADMIN_ID = process.env.TG_ADMIN_ID
const etfList = require('./etfList.json')
const Puppet = require('./puppet.js')

const downloadPath = process.env.DOWNLOADS + '/etf_quotes'
    
class ProcessETFQuotes{
    constructor(baseUrl, urlSuffix, etfQuoteFileName){
        this.baseUrl = baseUrl
        this.urlSuffix = urlSuffix
        this.etfQuoteFileName = etfQuoteFileName
    }
    getQueryString(instruments){
        let querystring  = ''
        let count = 0
        for (const instr of instruments){
            console.log('delta', (instr.trigger * -1) - instr.change)
            const limit_price = (instr.prevClose * (100 - instr.trigger * 1) / 100)
            const amt = instr.base_amt * Math.pow(instr.buy_factor * 1, (instr.trigger * -1) - instr.change)
            console.log("amt", amt)
                const quantity = (amt / limit_price)
                console.log("quantity", quantity)

                querystring += count === 0 ? '?' : '&'
                querystring += 'i=' + instr.symbol + '&quantity=' + quantity.toFixed(0) + '&price=' + limit_price.toFixed(2)
                count++
        }
        return querystring
    }
    async process(){
        if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath)
        console.log('ETF Processor', this.baseUrl, this.urlSuffix, downloadPath, this.etfQuoteFileName)
        if (this.baseUrl && this.baseUrl != null && this.baseUrl != ""){
            const puppet = new Puppet(this.baseUrl, this.urlSuffix, downloadPath, this.etfQuoteFileName)
            await puppet.downloadFile()
        }
        
        const etfQuoteFile = downloadPath + '/' +  this.etfQuoteFileName
        console.log('etfQuoteFile', etfQuoteFile)
        if (!fs.existsSync(etfQuoteFile)){
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
         
        const db_path = process.env.SQLITE_DB + '/dipsip.db'
        const options = { fileMustExist: true }
        const db = require('better-sqlite3')(db_path, options)
        db.pragma('journal_mode = WAL')
        const users = db.prepare('select profile.tg_id, cfg.trigger, cfg.base_amt, cfg.buy_factor, cfg.instrument from user_config cfg, user_profile profile where cfg.user_id=profile.id').all()
        const tgNotify = new TelegramNotify()
            
        for (const user of users) {
            console.log('user', user)
            const instrumentsToAlertForUser = []
            for (const instrument of data){
                console.log('checking', instrument.symbol, user.instrument, user.instrument.indexOf(instrument.symbol))
                if (user.instrument && (user.instrument.indexOf(instrument.symbol)  > -1)){
                    console.log("Instrument MATCH", instrument.symbol)
                    const userTrigger = parseFloat(user.trigger)
                    const instrumentChangePercent  = parseFloat(instrument.per)
                    console.log('user subscribed to ', instrument.symbol, user.trigger, instrumentChangePercent)
                    if (instrumentChangePercent < userTrigger*-1){
                        instrumentsToAlertForUser.push({
                            symbol: instrument.symbol,
                            base_amt: user.base_amt,
                            buy_factor: user.buy_factor,
                            trigger: user.trigger,
                            price: instrument.ltP,
                            change: instrumentChangePercent,
                            prevClose: instrument.prevClose
                        })
                    }
                }
                //else continue;
            }
            console.log("instrumentsToAlertForUser", instrumentsToAlertForUser)
            const querystring = this.getQueryString(instrumentsToAlertForUser)
            //console.log('Send TG Alert', user.tg_id, 'Alert : ' + process.env.WEB_APP_HOST + 'trade' + querystring)
            if (instrumentsToAlertForUser.length > 0)
            await tgNotify.sendTelegramMessage(user.tg_id,  'DipSip Opporunities : ' + process.env.WEB_APP_HOST + 'trade' + querystring)    
        console.log("done loop")
        }
        console.log("processing done")
    }
}
module.exports = ProcessETFQuotes
