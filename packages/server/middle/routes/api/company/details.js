const { postToGraphQL } = require("../../../lib/helper")

const route = async(req, res) => {
    try{
        const encId = req.params.companyEncId
        const toks = encId.split("-")
        const n1 = parseInt(toks[0], 8)
        const n2 = parseInt(toks[1], 16)
        console.log({encId, n1, n2})
        if (n1 !== n2) res.status(500).json("error")
        const entity = req.params.entity
        let table = ""
        let columns = []
        let financial_columns = ["key_category", "key", "value", "rowno", "month", "quarter", "year"]
        switch(entity){
            case "ratios":
                table = "company_trailing_twelvemonths_ratios"
                columns = ["Market_Cap: mcap", "Enterprise_Value: ev", "Price_To_Earnings: pe", "Price_To_BookValue: pbv"]
                break;
            case "balancesheet":
                table = "company_balance_sheet"
                columns = financial_columns
                break;   
            case "profitloss":
                table = "company_profit_and_loss"
                columns = financial_columns
                break;   
            case "cashflow":
                table = "company_cash_flow"
                columns = financial_columns
                break;    
        }
        const columnList = [...columns].join("\n ")
        console.log(columnList)
        const consolidatedFilter = entity === "balancesheet" || entity === "cashflow" || entity === "profitloss"   ? "isconsolidated: {_eq: true}," : ""
        const query = `query ${table}_get_all($co_code: Int!){
            ${table}(where: {${consolidatedFilter}co_code: {_eq: $co_code}}){
                ${columnList}
                company: company_master{
                    name: companyname,
                    id: co_code
                }
            }
        }`
        console.log(query)
        const resp = await postToGraphQL({query, variables:{"co_code": n1}})
        res.status(200).json(resp.data[table])
    }
    catch(e){
        console.error(e)
        res.status(500).json("error")
    }
    
} 
module.exports = route