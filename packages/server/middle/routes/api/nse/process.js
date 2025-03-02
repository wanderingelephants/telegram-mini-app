const route = async(req, res) => {
    try{
        
        res.status(200).json("OK")
    }
    catch(e){
        res.status(500).json(e)
    }
    
}
module.exports = route