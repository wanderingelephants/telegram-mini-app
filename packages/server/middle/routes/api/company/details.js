const { postToGraphQL } = require("../../../lib/helper")

const route = async(req, res) => {
    try{
        const symbol = req.params.symbol
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
        const consolidatedFilter = entity === "balancesheet" || entity === "cashflow" || entity === "profitloss"   ? "isconsolidated: {_eq: true}," : ""
        let query = `query ${table}_get_all($symbol: String!){
            ${table}(where: {${consolidatedFilter}company_master: {nsesymbol: {_eq: $symbol}}}){
                ${columnList}
                company: company_master{
                    name: companyname,
                    symbol: nsesymbol,
                    id: co_code,
                }
            }
        }`
        if (entity === "documents"){
            query = `query company_documents($symbol: String!) {  
  company_master(where: {nsesymbol: {_eq: $symbol}}){
    companyname
    company_director_s_report{
      year
      report: directorrep
    }
    company_auditor_s_report{
      year: yr
      report: memo
    }
    company_chairman_s_report{
      year: yr
      report: chairreport
    }
  }
}`
        }
        const resp = await postToGraphQL({query, variables:{"symbol": symbol}})
        res.status(200).json(resp.data)
    }
    catch(e){
        console.error(e)
        res.status(500).json("error")
    }
    
} 
module.exports = route