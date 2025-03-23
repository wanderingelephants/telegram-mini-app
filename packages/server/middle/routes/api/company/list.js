const { postToGraphQL } = require("../../../lib/helper")

const route = async(req,res) => {
    try{
        const query = `query getCompaniesMaster{company_master{co_code, companyname}}`
        const variables = {}
        const resp = await postToGraphQL({query, variables})
        const transformed = resp.data.company_master.map(r => {
            return {
                symbol: r.co_code.toString(8) + "-" + r.co_code.toString(16),
                name: r.companyname
            }
        })
        console.log(transformed)
        res.status(200).json(transformed)
    }
    catch(e){
        console.error(e)
        res.status(500).json("error")
    }
}
module.exports = route