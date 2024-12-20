let route = async (req, res) => {
    try{
        const db_path = process.env.SQLITE_DB + '/dipsip.db'
        const options =  {fileMustExist: true}
        const db = require('better-sqlite3')(db_path, options)
        db.pragma('journal_mode = WAL')

        const output = []
        let result = db.prepare('select * from user_profile').all()
        result =  result.map(r => ({...r, expiryDate : new Date(r.expiry_date)}))
        console.log(result[0].expiry_date, new Date(result[0].expiry_date))
        output.push(result)
        result = db.prepare('select * from user_config').all()
        output.push(result)

        return res.status(200).json({
            output
        })
    }
    catch(e){
        console.log('err in get user', e)
        return res.status(500).json({
            message: "Could not get user"
        })
    }
}
module.exports = route