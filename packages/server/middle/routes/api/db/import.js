const route = async (req, res) => {
    try{
        const db_path = process.env.SQLITE_DB + '/dipsip.db'
        const options =  {fileMustExist: true}
        const db = require('better-sqlite3')(db_path, options)
       
        const data = req.body
        console.log('import', data)
        for (user of data){
            try{
                const {tg_id, tg_username,tg_firstname,tg_lastname,expiry_date, last_notification} = user
                //console.log("insert", {tg_id, tg_username})
                const resp = db.prepare('insert into user_profile(tg_id, tg_username,tg_firstname,tg_lastname,expiry_date, last_notification) values(@tg_id, @tg_username,@tg_firstname,@tg_lastname,@expiry_date, @last_notification)').run({tg_id, tg_username,tg_firstname,tg_lastname,expiry_date, last_notification})
                const user_id = resp.lastInsertRowid
                console.log("lastResp", user_id, resp)
                const {base_amt, trigger, buy_factor} = user
                db.prepare('insert into user_config(user_id, base_amt, trigger, buy_factor) values(@user_id, @base_amt, @trigger, @buy_factor)').run({user_id, base_amt, trigger, buy_factor})
        
            }
            catch(e){
                console.log(e)
                console.log('import failed for record', user)
            }
        }
        
        res.status(200).json("Imported")
    }
    catch(e){
        console.log('err in import', e)
        return res.status(500).json({
            message: "Could not import"
        })
    }
}
module.exports = route