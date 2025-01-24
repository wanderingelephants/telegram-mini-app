const db_path = process.env.SQLITE_DB + '/dipsip.db'
const options = {}
const db = require('better-sqlite3')(db_path, options)


db.prepare('create table users(id INTEGER PRIMARY KEY AUTOINCREMENT, google_id text, email text, display_name text, photo_url text, last_login timestamp)').run()
db.prepare('create unique index users_gmail on users(email)').run()
db.prepare('create unique index users_google_id on users(google_id)').run()
        