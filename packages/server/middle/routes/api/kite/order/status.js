
let route = async (req, res) => {
    try{
        console.log('order status endpoint')
        console.log(req.body)
        return res.status(200).json({
            message: "OK"
        })
    }
    catch(e){
        console.log('err in order status', e)
        return res.status(500).json({
            message: "Could not prcoess Order Status"
        })
    }
}
module.exports = route