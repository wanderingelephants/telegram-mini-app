const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', {});
const { postToGraphQL } = require("../../../lib/helper")

const route = async(req, res) => {
    const mf_mutation_query = `
        mutation insertMutualFund($object: mutual_fund_insert_input!){
  insert_mutual_fund_one(object: $object, on_conflict:{
    constraint: mutual_fund_scheme_code_key,
    update_columns: [scheme_code]
  }){
    id
    
  }
}
        `
    // Execute the fund query with combined parameters
    const funds = db.prepare("select *  from mutual_fund").all();
    /*for (const fund of funds) {
        console.log("migrating fund", fund.name)
        await postToGraphQL({
            query: mf_mutation_query,
            variables: {
                object: {
                    "name": fund.name,
                    "url": fund.url,
                    "scheme_code": fund.scheme_code,
                    "url_category": fund.url_category,
                    "plan": fund.plan,
                    "category_key": fund.category_key,
                    "category": fund.category,
                    "star_rating": fund.star_rating ? fund.star_rating : -1,
                    "aum": Math.round(fund.aum),
                    "expenses_ratio": fund.expenses_ratio,
                    "expenses_ratio_cat_avg": fund.expenses_ratio_cat_avg,
                    "return_1w": fund.return_1w,
                    "return_1m": fund.return_1m,
                    "return_3m": fund.return_3m,
                    "return_6m": fund.return_6m,
                    "return_ytd": fund.return_ytd,
                    "return_1Y": fund.return_1Y,
                    "return_2Y": fund.return_2Y,
                    "return_3Y": fund.return_3Y,
                    "return_5Y": fund.return_5Y,
                    "return_10Y": fund.return_10Y
                }
            }
        })
    }*/
    const holdingMutation = `
        mutation insertMutualFundHolding($object: mutual_fund_holdings_insert_input!){
  insert_mutual_fund_holdings_one(object: $object, on_conflict:{
    constraint: mutual_fund_holdings_mutual_fund_id_stock_id_reporting_date_key,
    update_columns: [stock_holding_in_percentage]
  }){
    id
    
  }
}
        `
    const holdings = db.prepare("select mfh.*, mf.name  as scheme_name, mf.category_key, mf.category from mutual_fund_holdings mfh, mutual_fund mf where mfh.scheme_code=mf.scheme_code").all()
    for (const holding of holdings) {
        console.log("migrating holding", holding.scheme_code, holding.stock_name, holding.stock_sector)
        
        await postToGraphQL({
            query: holdingMutation,
            variables: {
                object: {
                    
                        "stock_mf": {
                            "data": {
                                "company_name": holding.stock_name.replace("Ltd.", "Limited"),
                                "symbol": holding.stock_name.replace("Ltd.", "Limited"),
                                "company_sector": holding.stock_sector
                            }, "on_conflict": {
                                "constraint": "stock_mf_company_name_key",
                                "update_columns": ["company_name"]
                            }
                        },
                        "mutual_fund": {
                            "data": {
                                "scheme_code": holding.scheme_code,
                                "name": holding.scheme_name,
                                "category_key": holding.category_key,
                                "category": holding.category
                            },
                            "on_conflict": {
                                "constraint": "mutual_fund_scheme_code_key",
                                "update_columns": ["scheme_code", "name"]
                            }
                        },
                        "stock_value_in_millions": Math.round(holding.stock_market_value_in_millions),
                        "stock_holding_in_percentage": holding.stock_holding_in_percentage,
                        "change_1m_percent": holding.change_1m_percent,
                        "highest_holding_1y_percent": holding.highest_holding_1y_percent,
                        "highest_holding_1y_date": holding.highest_holding_1y_date,
                        "lowest_holding_1y_percent": holding.lowest_holding_1y_percent,
                        "lowest_holding_1y_date": holding.lowest_holding_1y_date,
                        "quantity": holding.quantity,
                        "quantity_change_1m": holding.quantity_change_1m,
                        "reporting_date": holding.reporting_date,
                    }
                }
        })
    }
}
module.exports = route