const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
const BOT_TOKEN = process.env.TG_BOT_TOKEN

console.log("BOT_TOKEN", BOT_TOKEN)

function verifyTelegramAuth(authData) {
    const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest()
    const checkString = Object.keys(authData)
        .filter(key => key !== 'hash')
        .sort()
        .map(key => `${key}=${authData[key]}`)
        .join('\n')
    const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex')
    return hmac === authData.hash
}

function createSessionToken(userData) {
    // Create a JWT that expires in 24 hours
    return jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' })
}

let route = async (req, res) => {
    try {
        
    }
    catch (e) {
        
    }
}
module.exports = route
