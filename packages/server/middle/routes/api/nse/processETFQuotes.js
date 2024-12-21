const fs = require('fs')
const TelegramNotify = require('../telegram/notify')
const TG_ADMIN_ID = process.env.TG_ADMIN_ID
const db_path = process.env.SQLITE_DB + '/dipsip.db'
const options = { fileMustExist: true }
const db = require('better-sqlite3')(db_path, options)
db.pragma('journal_mode = WAL')
    
class ProcessETFQuotes{
    constructor(){

    }
    getQueryString(instruments){
        console.log(instruments)
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
        const etfQuoteFile = './etf_quotes.json'
        if (!fs.existsSync(etfQuoteFile)){
            console.log('ETF Quotes not found')
            const tgNotify = new TelegramNotify()
            await tgNotify.sendTelegramMessage(TG_ADMIN_ID, 'ETF Quotes File Not Found')
            return;
        } 
        const etf_quotes_raw = fs.readFileSync('./etf_quotes.json')
        const data = JSON.parse(etf_quotes_raw)
        const users = db.prepare('select profile.tg_id, cfg.trigger, cfg.base_amt, cfg.buy_factor, cfg.instrument from user_config cfg, user_profile profile where cfg.user_id=profile.id').all()
        const tgNotify = new TelegramNotify()
            
        console.log("users ", users)
        for (const user of users) {
            console.log('user', user)
            const instrumentsToAlertForUser = []
            for (const instrument of data){
                if (user.instrument.indexOf(instrument.symbol)  > -1){
                    console.log('user subscribed to ', instrument.symbol, user.trigger)
                    const userTrigger = parseFloat(user.trigger)
                    const instrumentChangePercent  = parseFloat(instrument.per)
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
                else continue;
            }
            const querystring = this.getQueryString(instrumentsToAlertForUser)
            console.log('Send TG Alert', user.tg_id, 'Alert : ' + process.env.WEB_APP_HOST + 'trade' + querystring)
            await tgNotify.sendTelegramMessage(user.tg_id,  'Alert : ' + process.env.WEB_APP_HOST + 'trade' + querystring)
            
        }
        //fs.unlinkSync(etfQuoteFile)
    }
}
module.exports = ProcessETFQuotes
