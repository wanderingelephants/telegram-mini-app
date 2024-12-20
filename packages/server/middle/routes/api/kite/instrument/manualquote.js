const axios = require('axios')
const kiteHoldingsUrl = 'https://kite.zerodha.com/oms/portfolio/holdings'
const auth_headers = require('./auth_headers.json')
const static_headers =   {
    'accept':'application/json, text/plain, */*',
'accept-encoding':'gzip, deflate, br, zstd',
'accept-language':'en-US,en-IN;q=0.9,en-GB;q=0.8,en;q=0.7,hi;q=0.6',
'priority':'u=1, i',
'if-none-match':'W/"4seSHz0TJ1UE89W9"',
'referer':'https//kite.zerodha.com/dashboard',
'sec-ch-ua':'"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
'sec-ch-ua-mobile':'?0',
'sec-ch-ua-platform':'"macOS"',
'sec-fetch-dest':'empty',
'sec-fetch-mode':'cors',
'sec-fetch-site':'same-origin',
'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
'x-kite-app-uuid':'c26e28e5-71b7-4914-b94b-d7129a4dd502',
'x-kite-userid':'DS8262',
'x-kite-version':'3.0.0'
}
const headers = {...auth_headers, ...static_headers}
const BOT_TOKEN = process.env.TG_BOT_TOKEN
//https://dipsip.co.in/api/kite/instrument/quote?i=BANKNIFTY1&i=MID150CASE&i=ICICIB22&sendNotification=false
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(BOT_TOKEN, { polling: false })
async function sendTelegramMessage(userId, message, sendNotification) {
    if (sendNotification.toLowerCase() == 'false') {console.log('Notification flag not set'); return;}
    try {
        //await bot.sendMessage(userId, message)
        console.log('Message sent successfully', userId, message)
    } catch (error) {
        console.error('Error sending message:', error)
    }
}
const manualquote = async (instrumentList, sendNotification) => {
    if (Array.isArray(instrumentList) == false) instrumentList = [instrumentList]
    const resp = await axios.get(kiteHoldingsUrl, {headers})
    console.log(resp.data.data)
    const instrData = []
    for (instr of instrumentList){
        console.log(instr)
        const instrDataArr = resp.data.data.filter(d => d.tradingsymbol===instr)
        if (instrDataArr.length == 1){
            //const instrData = instrDataArr[0]
            console.log(instrData.last_price, instrData.close_price) 
            instrData.push({instr, last_price: instrDataArr[0].last_price, close_price: instrDataArr[0].close_price})
        }
    }
    let jsonResp = []
    const tod = new Date(); tod.setHours(0, 0, 0, 0);
    console.log("fetch users and notify them on TG")
    const db_path = process.env.SQLITE_DB + '/dipsip.db'
    const options = { fileMustExist: true }
    const db = require('better-sqlite3')(db_path, options)
    db.pragma('journal_mode = WAL')
    
    const users = db.prepare('select profile.tg_id, cfg.trigger, cfg.base_amt, cfg.buy_factor, cfg.instrument from user_config cfg, user_profile profile where cfg.user_id=profile.id').all()
    for (const user of users) {
        let querystring = ''
        let count = 0
        for (const instr of instrumentList) {
            const { last_price, close_price } = instrData.filter(i => i.instr == instr)[0]
            const percentageOverClose = (last_price - close_price) * 100 / close_price
            console.log({ instr, last_price, close_price, percentageOverClose, sendNotification })
            jsonResp.push({
                instr, last_price, close_price
            })
            if (percentageOverClose < -1 * user.trigger &&  user.instrument && user.instrument.indexOf(instr) > -1) {
                const limit_price = (close_price * (100 - user.trigger * 1) / 100)
                const amt = user.base_amt * Math.pow(user.buy_factor * 1, (user.trigger * -1) - percentageOverClose)
                const quantity = (amt / limit_price)
                
                querystring += count === 0 ? '?' : '&'
                querystring += 'i=' + instr + '&quantity=' + quantity.toFixed(0) + '&price=' + limit_price.toFixed(2)
                count++
            }
        }
        console.log(user.tg_id,"querystring", querystring)
        await sendTelegramMessage(user.tg_id, 'Alert : ' + process.env.WEB_APP_HOST + 'trade' + querystring, sendNotification)
    }
    return jsonResp
}
module.exports = manualquote