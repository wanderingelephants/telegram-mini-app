const axios = require('axios')
const { json } = require('express')
const fs = require('fs')
const BOT_TOKEN = process.env.TG_BOT_TOKEN
//https://dipsip.co.in/api/kite/instrument/quote?i=BANKNIFTY1&i=MID150CASE&i=ICICIB22&sendNotification=false
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(BOT_TOKEN, { polling: false })

async function sendTelegramMessage(userId, message, sendNotification) {
    if (sendNotification.toLowerCase() == 'false') {console.log('Notification flag not set'); return;}
    try {
        await bot.sendMessage(userId, message)
        console.log('Message sent successfully', userId, message)
    } catch (error) {
        console.error('Error sending message:', error)
    }
}
let getquote = async (instrumentList, sendNotification) => {
    if (Array.isArray(instrumentList) == false) instrumentList = [instrumentList]
    let kiteQuoteUrl = 'https://api.kite.trade/quote?'
    for (let i = 0; i < instrumentList.length; i++) {
        kiteQuoteUrl += (i == 0) ? 'i=' + 'NSE:' + instrumentList[i] : '&i=' + 'NSE:' + instrumentList[i]
    }
    console.log({ kiteQuoteUrl })
    let access_token_data;
    access_token_data = require(process.env.ACCESS_TOKEN_PATH)
    if (fs.existsSync(process.env.ACCESS_TOKEN_PATH)) access_token_data = require(process.env.ACCESS_TOKEN_PATH)
    else return ({ status: 'fail', message: 'no_access_token' })
    console.log('kiteQuoteUrl', kiteQuoteUrl)
    const resp = await axios.get(kiteQuoteUrl, {
        headers: {
            'X-Kite-Version': 3,
            'Authorization': `token ${access_token_data.data.api_key}:${access_token_data.data.access_token}` // Overrides any defaults that are set
        }
    })
    //console.log(resp.data)
    //const tod = new Date(); tod.setHours(0, 0, 0, 0);
    let jsonResp = []
    const tod = new Date(); tod.setHours(0, 0, 0, 0);
    console.log("fetch users and notify them on TG")
    const db_path = process.env.SQLITE_DB + '/dipsip.db'
    const options = { fileMustExist: true }
    const db = require('better-sqlite3')(db_path, options)
    db.pragma('journal_mode = WAL')
    const users = db.prepare('select profile.tg_id, cfg.trigger, cfg.base_amt, cfg.buy_factor, cfg.instrument from user_config cfg, user_profile profile where cfg.user_id=profile.id').all()
    console.log("users ", users)
    console.log(resp.data)
    for (const user of users) {
        /*if (user.expiry_date < tod) {
            console.log("user status expired", user.tg_username, user.expiry_date, new Date(user.expiry_date))
            continue;
        }*/
        let querystring = ''
        let count = 0
        for (const instr of instrumentList) {
            const { last_price, ohlc } = resp.data.data['NSE:' + instr]
            const close = ohlc.close
            //sendNotification = Boolean(sendNotification)
            const percentageOverClose = (last_price - close) * 100 / close
            console.log({ instr, last_price, close, percentageOverClose, sendNotification })
            jsonResp.push({
                instr, last_price, close
            })
            if (percentageOverClose < -1 * user.trigger &&  user.instrument && user.instrument.indexOf(instr) > -1) {
                const limit_price = (close * (100 - user.trigger * 1) / 100)
                console.log(close, user.trigger, limit_price)
                const amt = user.base_amt * Math.pow(user.buy_factor * 1, (user.trigger * -1) - percentageOverClose)
                console.log("amt", amt)
                const quantity = (amt / limit_price)
                console.log("quantity", quantity)

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
module.exports = getquote
