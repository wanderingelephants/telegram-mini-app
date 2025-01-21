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
function persistUser(userTG, google_id) {
    const db_path = process.env.SQLITE_DB + '/dipsip.db'
    const options = { fileMustExist: true }
    const db = require('better-sqlite3')(db_path, options)
    db.pragma('journal_mode = WAL')
    const { id, first_name, last_name, username } = userTG
    let expiry_date = new Date(); expiry_date.setHours(0, 0, 0, 0);
    expiry_date = new Date(expiry_date.getTime() + 30 * 24 * 3600 * 1000)
    try {
        const insert_resp = db.prepare('insert into user_profile(tg_id, tg_firstname, tg_lastname, tg_username, expiry_date, google_id) values (@tg_id, @tg_firstname, @tg_lastname, @tg_username, @expiry_date,@google_id)').run({ tg_id: id+"", tg_firstname: first_name, tg_lastname: last_name, tg_username: username, expiry_date: expiry_date.getTime(), google_id })
        console.log("insert resp", insert_resp)
    }
    catch (e) {
        console.log('err in persist user', e.message)
    }
    const userRecord = db.prepare('select id, expiry_date from user_profile where tg_id=@tg_id').get({ tg_id: id+"" })
    return userRecord
}
let route = async (req, res) => {
    try {
        const {userTG, userGoogle} = req.body
        
        const { id, first_name, last_name, username, photo_url, auth_date, hash } = userTG
        //const gmail = userGoogle.email
        console.log("telegram auth")
        console.log("userGoogle", userGoogle)
        console.log("userTG", userTG)
        
        console.log({ id, first_name, last_name, username, photo_url, auth_date, hash })
        if (verifyTelegramAuth(userTG)) {
            console.log("TgAuth verified")
            const token = createSessionToken({ id, username, first_name, last_name })
            const userRecord = persistUser(userTG, userGoogle.uid)
            console.log("userRecord", userRecord)
            const db_path = process.env.SQLITE_DB + '/dipsip.db'
            const options = { fileMustExist: true }
            const db = require('better-sqlite3')(db_path, options)
            db.pragma('journal_mode = WAL')
            const configRecord = db.prepare('select base_amt, trigger, buy_factor, instrument from user_config where user_id=@user_id').get({ user_id: userTG.id+"" })
            console.log('tg auth returning res', { token, configRecord })
            res.status(200).json({ token, userRecord, configRecord })
        } else {
            console.log("TGAuth not verified")
            res.status(401).json({ error: 'Authentication failed' })
        }
    }
    catch (e) {
        console.log('err in auth telegram', e)
        return res.status(500).json({
            message: "err in auth telegram" + e
        })
    }
}
module.exports = route
