const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

function persistConfig(req){
    try{
        const db_path = process.env.SQLITE_DB + '/dipsip.db'
        const options =  {fileMustExist: true}
        const db = require('better-sqlite3')(db_path, options)
        db.pragma('journal_mode = WAL')

        const {tg_id, trigger, base_amt, buy_factor, instrument, unsubscribe} = req.body
        const user_pk_records = db.prepare('select id from user_profile where tg_id=' + tg_id).all()
        const user_id = user_pk_records[0].id
        if (true == unsubscribe){
            db.prepare('delete from user_config where user_id=@user_id').run({user_id})
            return
        }
        const config_count = db.prepare('select count(*) as cnt from user_config where user_id=@user_id').get({user_id}).cnt
        let resp;
        if (config_count == 0)
        resp = db.prepare('insert into user_config(user_id, base_amt, trigger, buy_factor, instrument) values(@user_id, @base_amt, @trigger, @buy_factor, @instrument)').run({user_id, base_amt, trigger, buy_factor, instrument})
        else
        resp = db.prepare('update user_config set base_amt=@base_amt, trigger=@trigger, buy_factor=@buy_factor, instrument=@instrument where user_id=@user_id').run({user_id, base_amt, trigger, buy_factor, instrument})
        
    }
    catch(e){
        console.log('err in persistConfig', e.message)
    }
    
}
const route = async (req, res) => {
    try {
        /*const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 
       console.log('saveconfig token', token)
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403); 
            req.user = user;
            console.log("token verified")
            persistConfig(req)
            return res.status(200).json({success: true});
        });*/
        persistConfig(req)
        return res.status(200).json({success: true});
        
    } catch (e) {
        console.error('Error in route handler:', e);
        return res.status(500).json({
            message: "An error occurred while processing your request"
        });
    }
};
module.exports = route