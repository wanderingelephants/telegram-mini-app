const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET 
const BOT_TOKEN = process.env.TG_BOT_TOKEN 

const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(BOT_TOKEN, { polling: false })

async function sendTelegramMessage(userId, message) {
    try {
      await bot.sendMessage(userId, message)
      console.log('Message sent successfully')
    } catch (error) {
      console.error('Error sending message:', error)
    }
}
let route = async (req, res) => {
    try{
        const {tg_user_id} = req.query
        await sendTelegramMessage(tg_user_id, 'Buy Alert Notification')
        return res.status(200).json({success: true})
    }
    catch(e){
        console.log('err in tg notify', e)
        return res.status(500).json({
            message: "Could not send notification"
        })
    }
}
module.exports = route