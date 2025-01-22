const db_path = process.env.SQLITE_DB + '/dipsip.db'
const options = {}
const db = require('better-sqlite3')(db_path, options)
db.pragma('journal_mode = WAL')

db.pragma('journal_mode = WAL')

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

        let indexes = db.prepare("PRAGMA index_list('user_profile')").all()
        console.log(indexes)
        indexes = db.prepare("PRAGMA index_list('user_config')").all()
        console.log(indexes)
        indexes = db.prepare("PRAGMA index_list('user_deposit')").all()
        console.log(indexes)