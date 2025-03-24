const { postToGraphQL } = require("../../../lib/helper")

const route = async(req,res) => {
    try{
        const query = `query getCompaniesMaster{company_master{co_code, nsesymbol, companyname}}`
        const variables = {}
        const resp = await postToGraphQL({query, variables})
        const transformed = resp.data.company_master.map(r => {
            return {
                symbol: r.nsesymbol,
                name: r.companyname
            }
        })
        res.status(200).json(transformed)
    }
    catch(e){
        console.error(e)
        res.status(500).json("error")
    }
}
module.exports = route