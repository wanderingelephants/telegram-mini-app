const dbManager = require("./DatabaseManager");

const route = async(req, res) => {
    try{
        const data = await dbManager.getData()
        return res.status(200).json(data)
    }
    catch(e){
        console.error(e)
        res.status(500).json(e)
    }
}
module.exports = route