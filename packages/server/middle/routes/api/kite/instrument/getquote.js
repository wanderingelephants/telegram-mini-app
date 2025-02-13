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
    console.log('kiteQuoteUrl', kiteQuoteUrl, access_token_data.data.api_key, access_token_data.data.access_token)
    const resp = await axios.get(kiteQuoteUrl, {
        headers: {
            'X-Kite-Version': 3,
            'Authorization': `token ${access_token_data.data.api_key}:${access_token_data.data.access_token}` // Overrides any defaults that are set
        }
    })
    console.log(resp.data)

    return resp.data
}
module.exports = getquote
