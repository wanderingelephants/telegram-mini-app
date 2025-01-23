const {getAllMutualFunds} = require('../../../mf/moneycontrolscraper')
const route = async(req, res) => {
    try{
        const categoryList = req.query.categoryList
        const categories = categoryList.split(",")
        const result = await getAllMutualFunds(categories)
        res.status(200).json(result)
    }
    catch(e){
        console.log(e)
        res.status(500).json(e)
    }

}
module.exports = route