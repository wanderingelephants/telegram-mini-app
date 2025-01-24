const route = async (req, res) => {
    try{
        const db_path = process.env.SQLITE_DB + '/dipsip.db'
        const options =  {fileMustExist: true}
        const db = require('better-sqlite3')(db_path, options)
        
        let result = db.prepare('select * from user_config').all()
        
        //result = db.prepare('select user_profile.tg_id, user_profile.tg_firstname, user_profile.tg_lastname, user_profile.tg_username,  user_profile.expiry_date,  user_profile.last_notification, user_config.user_id, user_config.trigger, user_config.base_amt, user_config.buy_factor, user_config.instrument from user_profile left outer join user_config on user_profile.id=user_config.user_id').all()
        console.log(result)
        
        return res.status(200).json(result)
    }
    catch(e){
        console.log('err in get user', e)
        return res.status(500).json({
            message: "Could not get user"
        })
    }
}
module.exports = route