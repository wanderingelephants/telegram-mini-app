let route = async (req, res) => {
    try{
        const db_path = process.env.SQLITE_DB + '/dipsip.db'
        const options =  {fileMustExist: true}
        const db = require('better-sqlite3')(db_path, options)
        db.pragma('journal_mode = WAL')
        console.log(req.body)
        let {expiry_days, expiry_date, last_notification, tg_id} = req.body
        console.log({expiry_date, last_notification})
        if (expiry_days){
            let tod = new Date()
            tod.setHours(0,0,0,0)
            let res =  db.prepare('select expiry_date from user_profile where tg_id=@tg_id').get({tg_id})
            console.log("res", res)
            expiry_date = db.prepare('select expiry_date from user_profile where tg_id=@tg_id').get({tg_id}).expiry_date
            if (!expiry_date) {
                expiry_date = tod.getTime()
            }
            else {
                if (expiry_date < tod.getTime()) expiry_date = tod.getTime()
            }
            expiry_date += expiry_days * 24 * 3600 * 1000
        }
        if (expiry_date) db.prepare('update user_profile set expiry_date=@expiry_date where tg_id=@tg_id').run({expiry_date, tg_id})
        if (last_notification) db.prepare('update user_profile set last_notification=@last_notification where tg_id=@tg_id').run({last_notification, tg_id})
        
        return res.status(200).json({
            message: 'update success'
        })
    }
    catch(e){
        console.log('err in db create', e)
        return res.status(500).json({
            message: "Could not update record"
        })
    }
}
module.exports = route
//curl -X POST -H "Content-Type: application/json"  -d "{\"expiry_date\":3,\"last_notification\": 2, \"tg_id\": \"123987\"}" http://localhost:3000/api/db/updateuser
//curl -X POST -H "Content-Type: application/json"  -d "{\"expiry_days\":30, \"tg_id\": \"123987\"}" http://localhost:3000/api/db/updateuser