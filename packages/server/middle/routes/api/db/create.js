let route = async (req, res) => {
    try{
        const db_path = process.env.SQLITE_DB + '/dipsip.db'
        const options =  {}
        const db = require('better-sqlite3')(db_path, options)
    
        //db.prepare('create table users(id INTEGER PRIMARY KEY AUTOINCREMENT, google_id text, email text, display_name text, photo_url text, last_login timestamp)').run()
        
        db.prepare('create table user_profile(id INTEGER PRIMARY KEY AUTOINCREMENT, tg_id text, tg_firstname text, tg_lastname text,tg_username text, google_id text, expiry_date date, last_notification date)').run()
        db.prepare('create table user_config(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id integer, base_amt integer, trigger integer, buy_factor integer, instrument text)').run()
        db.prepare('create table user_deposit(id INTEGER PRIMARY KEY AUTOINCREMENT, depositDate date, user_id integer, depositAmt number)').run()
        
        db.prepare('create unique index user_profile_tg_id on user_profile(tg_id)').run()
        db.prepare('create unique index user_profile_tg_google_id on user_profile(tg_id, google_id)').run()
        db.prepare('create index user_profile_tg_usernmae on user_profile(tg_username)').run()
        db.prepare('create unique index user_config_user_id on user_config(user_id)').run()
        db.prepare('create unique index user_config_instrument on user_config(instrument)').run()
        db.prepare('create index user_deposit_user_id on user_deposit(user_id)').run()
        db.prepare('create index user_deposit_date on user_deposit(depositDate)').run()

        /*let tg_id = '123987'
        let tg_username = 'thirdweb'
        let expiry_date = new Date(); expiry_date.setHours(0,0,0,0); 
        let last_notification  = new Date(); last_notification.setHours(0,0,0,0); 
        db.prepare('insert into user_profile(tg_id, tg_username, expiry_date, last_notification) values(@tg_id, @tg_username, @expiry_date, @last_notification)').run({tg_id, tg_username, expiry_date: expiry_date.getTime(), last_notification: last_notification.getTime()})

        tg_id = '123456'
        tg_username = 'fourthweb'
        expiry_date = new Date(); expiry_date.setHours(0,0,0,0); 
        last_notification  = new Date(); last_notification.setHours(0,0,0,0); 
        db.prepare('insert into user_profile(tg_id, tg_username, expiry_date, last_notification) values(@tg_id, @tg_username, @expiry_date, @last_notification)').run({tg_id, tg_username, expiry_date: expiry_date.getTime(), last_notification: last_notification.getTime()})

        tg_id = '456789'
        tg_username = 'fifthweb'
        expiry_date = new Date(); expiry_date.setHours(0,0,0,0); 
        last_notification  = new Date(); last_notification.setHours(0,0,0,0); 
        db.prepare('insert into user_profile(tg_id, tg_username, expiry_date, last_notification) values(@tg_id, @tg_username, @expiry_date, @last_notification)').run({tg_id, tg_username, expiry_date: expiry_date.getTime(), last_notification: last_notification.getTime()})
        
        tg_id = '356789'
        tg_username = 'sixthweb'
        expiry_date = new Date(); expiry_date.setHours(0,0,0,0); 
        last_notification  = new Date(); last_notification.setHours(0,0,0,0); 
        db.prepare('insert into user_profile(tg_id, tg_username, expiry_date, last_notification) values(@tg_id, @tg_username, @expiry_date, @last_notification)').run({tg_id, tg_username, expiry_date: expiry_date.getTime(), last_notification: last_notification.getTime()})

        
        db.prepare('insert into user_config(user_id, baseAmt, trigger, factor) values(@user_id, @baseAmt, @trigger, @factor)').run({user_id:1, baseAmt:1000, trigger:1, factor:1.1})
        db.prepare('insert into user_config(user_id, baseAmt, trigger, factor) values(@user_id, @baseAmt, @trigger, @factor)').run({user_id:2, baseAmt:2000, trigger:2, factor:1.2})
        db.prepare('insert into user_config(user_id, baseAmt, trigger, factor) values(@user_id, @baseAmt, @trigger, @factor)').run({user_id:3, baseAmt:3000, trigger:3, factor:1.3})
        db.prepare('insert into user_config(user_id, baseAmt, trigger, factor) values(@user_id, @baseAmt, @trigger, @factor)').run({user_id:4, baseAmt:3000, trigger:4, factor:1.4})
        */
        let indexes = db.prepare("PRAGMA index_list('user_profile')").all()
        console.log(indexes)
        indexes = db.prepare("PRAGMA index_list('user_config')").all()
        console.log(indexes)
        indexes = db.prepare("PRAGMA index_list('user_deposit')").all()
        console.log(indexes)

        return res.status(200).json({
            message: "OK"
        })
    }
    catch(e){
        console.log('err in db create', e)
        return res.status(500).json({
            message: "Could not create DB"
        })
    }
}
module.exports = route