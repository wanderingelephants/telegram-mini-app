const { postToGraphQL } = require("../../../lib/helper")
const { getMutualFundHoldingsJSONArray, normalizeMutualFundsData } = require('../mutualfunds/getData')
const moment = require("moment")
const fs = require("fs")
const path = require("path")

const { reverse_mapping_category_of_insider, reverse_mapping_regulation,
  reverse_mapping_type_of_security, reverse_mapping_mode_of_transaction,
  reverse_mapping_transaction_type, reverse_mapping_exchange,
  mapping_announcement_sentiment, reverse_mapping_announcement_sentiment } = require("../nse/mappings");
const transformStockData = function (stockPriceDaily) {
  const stockMap = new Map();

  stockPriceDaily.forEach(({ stock, price_date, close }) => {
    const { company_name } = stock;

    if (!stockMap.has(company_name)) {
      stockMap.set(company_name, {
        company_name,
        stock_prices: []
      });
    }

    stockMap.get(company_name).stock_prices.push({
      price_date, close
    });
  });

  return Array.from(stockMap.values());
}
class DatabaseManager {
  constructor() {
    // This check prevents multiple instances if someone calls 'new DatabaseManager()'
    if (DatabaseManager.instance) {
      return DatabaseManager.instance;
    }

    this.pre_populated_arrays = {};
    this.isInitialized = false;
    DatabaseManager.instance = this;
  }

  async getData() {
    // If data hasn't been initialized yet, initialize it
    if (!this.isInitialized) {
      await this.initData();
    }
    return this.pre_populated_arrays;
  }

  async getUserStockPortfolio(email) {
    const user_stock_portfolio_query = `query userStocks($email: String!){
            portfolio_stocks(where: {user: {email: {_eq: $email}}}){
              stock{
                company_name
                company_sector
              }
            }
          }`
    const stock_portfolio_resp = await postToGraphQL({
      query: user_stock_portfolio_query,
      variables: { "email": email }
    })
    return stock_portfolio_resp.data.portfolio_stocks.map(s => s.stock.company_name)
  }

  async runMutationForTable(graphql_fields, table_name, company_master_prefix, mutual_fund_master_prefix) {
    const fieldsForTable = graphql_fields.filter(t => t["array_name"] === table_name)[0].fields
    const consolidatedFilter = fieldsForTable.filter(f => f === "isConsolidated:isconsolidated").length > 0 ? "(where: {isconsolidated: {_eq: true}})" : ""
    let mutation = `query ${table_name}_all{
        ${table_name}${consolidatedFilter}{`
    //first dump the company_master fields if  present
    for (const  _prefix of [company_master_prefix, mutual_fund_master_prefix]) {
      let master_fields = fieldsForTable.filter(f => f.startsWith(_prefix) === true)
      if (master_fields.length > 0) {
        master_fields = master_fields.map(f => f.substring(_prefix.length, f.length))
        mutation += `${_prefix.substring(0, _prefix.length - 1)} { 
            ${master_fields.join(" ")}
          }`
      }

      mutation += `${fieldsForTable.filter(f => (f.startsWith(company_master_prefix) === false && f.startsWith(mutual_fund_master_prefix) === false)).join(" ")}\n`
    }

    mutation += `}
        }`
    try {
      const resp = await postToGraphQL({ query: mutation, variables: {} })
      let newResp = {data: {table_name: []}}
      newResp.data[table_name] = resp.data[table_name].map(({ company_master, ...rest }) => ({
        ...company_master,
        ...rest,
      }));//JSON.parse(JSON.stringify(resp));
      console.log(table_name, newResp.data[table_name].length)
      // Iterate through the array and trim the `key` field
      newResp.data[table_name].forEach(entry => {
        if (entry.key && typeof entry.key === "string") {
          entry.key = entry.key.trim();
        }
      });

      return newResp.data[table_name]
    }
    catch (e) {
      console.error(e)
      console.log("error in running mutation", mutation)
      return []
    }

  }
  async getGraphQLFieldsForNonFinancials(onlyKeys, tableNameFilter) {
    const fieldsForTable = []
    const all_tables_json = fs.readFileSync(path.join(process.env.DATA_ROOT_FOLDER, "all_tables.json"), "utf-8")
    const all_tables = JSON.parse(all_tables_json)
    const promptables = all_tables.filter(c => c["Table Name"].toLowerCase().indexOf(tableNameFilter) > -1)

    for (const table of promptables) {
      const columns = table.Columns.filter(c => c.GQL_Alias !== null)
      const graphql_fields = []
      for (const col of columns) {
        if (col.GQL_Alias) {
          if (col.GQL_Alias === "co_code") {
            if (table["Table Name"] !== "company_master") {
              const prefix = onlyKeys === true ? "" : "company_master:"
              graphql_fields.push(`${prefix}company_name${(onlyKeys === true) ? "" : ": companyname"}`)
              graphql_fields.push(`${prefix}company_nse_symbol${(onlyKeys === true) ? "" : ": nsesymbol"}`)
              graphql_fields.push(`${prefix}company_sector${(onlyKeys === true) ? "" : ": sectorname"}`)
              graphql_fields.push(`${prefix}company_market_cap_in_crores${(onlyKeys === true) ? "" : ": mcap"}`)
              graphql_fields.push(`${prefix}company_market_cap_category${(onlyKeys === true) ? "" : ": mcaptype"}`)
              
            }
          }
          else {
            if (col.Column_Name === "yrc") {
              graphql_fields.push("year")
              graphql_fields.push("month")
            }
            else {
              if (onlyKeys === true){
                if (col.Column_Name.toLowerCase() !== "isconsolidated") graphql_fields.push(`${col.GQL_Alias}`)
              }else {
                graphql_fields.push(`${col.GQL_Alias}:${col.Column_Name}`)
              }
            }
          }
        }
      }
      table["notes"] !== "" ? fieldsForTable.push({ "array_name": table["Table Name"], fields: graphql_fields, notes: table["notes"] }) : fieldsForTable.push({ "array_name": table["Table Name"], fields: graphql_fields })
      
    }
    return fieldsForTable
  }
  async getGraphQLFieldsForMutualFunds(onlyKeys) {

    let promptables = [
      {
        "array_name": "mutual_fund",
        "fields": ["mutual_fund_name", "mutual_fund_category", "mutual_fund_star_rating", "mutual_fund_fee_percentage", "mutual_fund_aum", "returns_1Y", "returns_3Y", "returns_5Y"],
        "notes": "mutual_fund_category - String Enum ('small cap fund', 'mid cap fund', 'large cap fund', 'multi cap fund', elss', 'tax advantage fund'). mutual_fund_star_rating - Integer Enum (1,2,3,4,5)",
        "PromptQL": "Retail"
      },
      {
        "array_name": "mutual_fund_holdings",
        "fields": ["mutual_fund_name", "mutual_fund_category", "mutual_fund_star_rating", "mutual_fund_fee_percentage", "mutual_fund_aum", "company_name", "company_nse_symbol", "company_sector", "company_market_cap_in_crores", "company_market_cap_category", "stock_holding_percentage_in_fund", "stock_holding_reporting_date"],
        "notes": "each object reprsents a stock's percentage holding in the mutual fund",
        "PromptQL": "Retail"
      },
      {
        "array_name": "mutual_fund_stock_holding_reporting_dates",
        "fields": "",
        "notes": "An Array of Date , each of which represents mutual funds stock holding reporting date."
      }
    ]
    if (onlyKeys === false) {
      promptables = [
        {
          "array_name": "mutual_fund",
          "fields": ["mutual_fund_name:name", "mutual_fund_category:category", "mutual_fund_star_rating:star_rating", "mutual_fund_fee_percentage:expenses_ratio", "mutual_fund_aum:aum", "returns_1Y:return_1Y", "returns_3Y:return_3Y", "returns_5Y:return_5Y"],
          "notes": "mutual_fund_category - String Enum ('small cap fund', 'mid cap fund', 'large cap fund', 'multi cap fund', elss', 'tax advantage fund'). mutual_fund_star_rating - Integer Enum (1,2,3,4,5)",
          "PromptQL": "Retail"
        },
        {
          "array_name": "mutual_fund_holdings",
          "fields": ["mutual_fund:mutual_fund_name:name", "mutual_fund:mutual_fund_category:category", "mutual_fund:mutual_fund_star_rating:star_rating", "mutual_fund:mutual_fund_fee_percentage:expenses_ratio", "mutual_fund:mutual_fund_aum:aum", "company_master:company_name: companyname", "company_master:company_nse_symbol: nsesymbol", "company_master:company_sector: sectorname", "company_master:company_market_cap_in_crores: mcap", "company_master:company_market_cap_category: mcaptype", "stock_holding_percentage_in_fund:stock_holding_in_percentage", "stock_holding_reporting_date:reporting_date"],
          "notes": "each object reprsents a stock's percentage holding in the mutual fund",
          "PromptQL": "Retail"
        }
      ]
    }

    return promptables

  }
  async getDisplayFieldsFor52WeekHighLow(isHigh){
    const suffix = isHigh === true ? "high" : "low"
    return  [{
      "array_name":  `companies_hitting_new_fifty_two_week_${suffix}s` ,
      fields: [
        "company_name", "company_nse_symbol", "company_sector", "company_market_cap_in_crores", "company_market_cap_category",
        `new_fifty_two_week_${suffix}`,"change_percent",`previous_fifty_two_week_${suffix}`,"last_traded_price",`new_fifty_two_week_${suffix}_date`,`previous_fifty_two_week_${suffix}_date`
      ]
    }  
    ]
  }
  async getDisplayFieldsForIndexWiseCompanies(){
    return [
      {
        "array_name": "index_wise_companies", 
        "fields": [{"index_name":"<index_name>", "companies_in_index": ["company_name", "company_nse_symbol", "company_sector", "company_market_cap_in_crores", "company_market_cap_category"]}],
        "notes": `Indexes or Indices are widely tracked, and offer rich source of stock analysis. A company may belong  to multiple indices, therefore array companies_in_index for each index_name. e.g. 
        {'index_name': 'Nifty 100','companies_in_index': [{'company_name': 'HDFC Bank Ltd',
              'company_nse_symbol': 'HDFCBANK',
              'company_sector': 'Banks',
              'company_market_cap_in_crores': 1378225.62,
              'company_market_cap_category': 'Large Cap'}]}". 
          index_name will always be from this list     `
      },
      {
        "array_name": "sector_wise_companies", 
        "fields": [{"sector_name":"<sector_name>", "companies_in_sector": ["company_name", "company_nse_symbol", "company_sector", "company_market_cap_in_crores", "company_market_cap_category"]}],
        "notes": `Sectors are widely tracked, and offer rich source of apple-to-apple stocks analysis. e.g. 
        {'sector_name': 'Cement','companies_in_sector': [{'company_name': 'ACC Ltd',
              'company_nse_symbol': 'ACC',
              'company_sector': 'Cement',
              'company_market_cap_in_crores': 36225.62,
              'company_market_cap_category': 'Mid Cap'}]}"`
      }
    ]
  }
  async getGraphQLFieldsForFinancials(onlyKeys) {
    const promptables = []

    for (const fin of ["balance_sheet", "cash_flow", "profit_and_loss"]) {
      let company_master_fields = []
      if (onlyKeys === true) {
        company_master_fields.push("company_name")
        company_master_fields.push("company_nse_symbol")
        company_master_fields.push("company_sector")
        company_master_fields.push("company_market_cap_in_crores")
        company_master_fields.push("company_market_cap_category")

        const distinctKeysQuery = `query {company_${fin}(distinct_on: key) {key}}`
        const resp = await postToGraphQL({ query: distinctKeysQuery, variables: {} })
        const fields = resp.data[`company_${fin}`].filter(r => r.key !== "" && r.key.toLowerCase() !== "isconsolidated").map(r => r.key.trim())
        company_master_fields = company_master_fields.concat(fields)
      }
      else {
        company_master_fields.push("company_master:company_name: companyname")
        company_master_fields.push("company_master:company_nse_symbol: nsesymbol")
        company_master_fields.push("company_master:company_sector: sectorname")
        company_master_fields.push("company_master:company_market_cap_in_crores: mcap")
        company_master_fields.push("company_master:company_market_cap_category: mcaptype")

        company_master_fields.push("key")
        company_master_fields.push("value")
        company_master_fields.push("isConsolidated:isconsolidated")
      }
      company_master_fields.push("year")
      company_master_fields.push("month")

      promptables.push({ "array_name": `company_${fin}`, "fields": company_master_fields })
    }
    return promptables
  }
  //onlyKeys means return distinct column values only, no need to run query mutation to fetch all values
  //this is relevant for financial tables which have key:value format, as opposed to fixed columns
  async getGraphQLFields(onlyKeys = true) {
    let promptables = []
    const graphql_fields_for_mutual_funds = await this.getGraphQLFieldsForMutualFunds(onlyKeys)
    promptables = promptables.concat(graphql_fields_for_mutual_funds)

    for (const nonFin of ["_ratio", "_shareholding_pattern_", "company_bulk_deals", "company_block_deals", "insider_trading", "substantial_acquisition_of_shares"]){
      const graphql_fields_for_bulk_tables = await this.getGraphQLFieldsForNonFinancials(onlyKeys, nonFin)
      promptables = promptables.concat(graphql_fields_for_bulk_tables)
    }
    /*const graphql_fields_for_ratio_tables = await this.getGraphQLFieldsForNonFinancials(onlyKeys, "_ratio")
    promptables = promptables.concat(graphql_fields_for_ratio_tables)

    const graphql_fields_for_shp = await this.getGraphQLFieldsForNonFinancials(onlyKeys, "_shareholding_pattern_")
    promptables = promptables.concat(graphql_fields_for_shp)
    
    const graphql_fields_for_bulk_tables = await this.getGraphQLFieldsForNonFinancials(onlyKeys, "company_bulk_deals")
    promptables = promptables.concat(graphql_fields_for_bulk_tables)
    
    const graphql_fields_for_block_tables = await this.getGraphQLFieldsForNonFinancials(onlyKeys, "company_block_deals")
    promptables = promptables.concat(graphql_fields_for_block_tables)*/
    
    const graphql_fields_for_financials = await this.getGraphQLFieldsForFinancials(onlyKeys)
    promptables = promptables.concat(graphql_fields_for_financials)
    

    if (onlyKeys === true){
      const graphql_fields_for_index_wise_companies = await  this.getDisplayFieldsForIndexWiseCompanies()
      promptables = promptables.concat(graphql_fields_for_index_wise_companies)

      const graphql_fields_for_fifty_two_week_high_companies = await  this.getDisplayFieldsFor52WeekHighLow(true)
      promptables = promptables.concat(graphql_fields_for_fifty_two_week_high_companies)

      const graphql_fields_for_fifty_two_week_low_companies = await  this.getDisplayFieldsFor52WeekHighLow(false)
      promptables = promptables.concat(graphql_fields_for_fifty_two_week_low_companies)
    }
    return promptables
  }
  async initData() {
    if (this.isInitialized === true) {
      console.log("Database already initialized")
      return
    }
    const graphql_fields = await this.getGraphQLFields(false)
    for (const table of graphql_fields) {
      try {
        const table_name = table["array_name"]
        const tableData = await this.runMutationForTable(graphql_fields, table_name, "company_master:", "mutual_fund:")
        this.pre_populated_arrays[table_name] = tableData
      }
      catch (e) {
        console.log("Error in mutation processing for table", table["array_name"], e)
      }
    }
    for (const bulk of ["company_bulk_deals", "company_block_deals"]){
      const data = this.pre_populated_arrays[bulk]
      const transformedData = data.map(deal => ({
        ...deal,
        buy_or_sell: deal.buy_or_sell ? "Buy" : "Sell"
    }));
      this.pre_populated_arrays[bulk] = transformedData
    }
    try{
      const index_wise_query = `query companies_in_index {  
  company_index_master{
        index_name
    company_index_wise_company{
      company_master{
        company_name: companyname
        company_nse_symbol: nsesymbol
        company_sector: sectorname
        company_market_cap_in_crores: mcap
        company_market_cap_category: mcaptype
      }
    }
  }
}`
      const resp = await postToGraphQL({query: index_wise_query, variables: {}})
      const indexWiseCompanies = resp.data.company_index_master.map(index => ({
        index_name: index.index_name,
        companies_in_index: index.company_index_wise_company.map(company => ({
          company_name: company.company_master.company_name,
          company_nse_symbol: company.company_master.company_nse_symbol,
          company_sector: company.company_master.company_sector,
          company_market_cap_in_crores: company.company_master.company_market_cap_in_crores,
          company_market_cap_category: company.company_master.company_market_cap_category
        }))
      }));
      this.pre_populated_arrays["index_wise_companies"] = indexWiseCompanies
    }
    catch(e){
      console.error(e)
    }
    try{
      const sector_wise_query = `query companies_in_sector {  
  company_sector_master{
        sector_name: sect_name
    company_sector_wise_company{
      company_master{
        company_name: companyname
        company_nse_symbol: nsesymbol
        company_sector: sectorname
        company_market_cap_in_crores: mcap
        company_market_cap_category: mcaptype
      }
    }
  }
}`
      const resp = await postToGraphQL({query: sector_wise_query, variables: {}})
      const sectorWiseCompanies = resp.data.company_sector_master.map(sector => ({
        sector_name: sector.sector_name,
        companies_in_sector: sector.company_sector_wise_company.map(company => ({
          company_name: company.company_master.company_name,
          company_nse_symbol: company.company_master.company_nse_symbol,
          company_sector: company.company_master.company_sector,
          company_market_cap_in_crores: company.company_master.company_market_cap_in_crores,
          company_market_cap_category: company.company_master.company_market_cap_category
        }))
      }));
      this.pre_populated_arrays["sector_wise_companies"] = sectorWiseCompanies
    }
    catch(e){
      console.error(e)
    }
    try{
      const fifty_two_week_high_low_query = `query company_new_fifty_two_week{
  company_new_fiftytwo_week_highlow{
    company_master{
        company_name: companyname
        company_nse_symbol: nsesymbol
        company_sector: sectorname
        company_market_cap_in_crores: mcap
        company_market_cap_category: mcaptype
    }
    is_high    
    new_high_low
    change_percent
    prev_high_low
    last_traded_price
    record_date
    prev_high_low_record_date
  }
}`
      const resp = await postToGraphQL({query: fifty_two_week_high_low_query, variables: {}})
      const new_highs = resp.data.company_new_fiftytwo_week_highlow.filter(r => r.is_high === true).map(r => ({
        company_name: r.company_master.company_name,
          company_nse_symbol: r.company_master.company_nse_symbol,
          company_sector: r.company_master.company_sector,
          company_market_cap_in_crores: r.company_master.company_market_cap_in_crores,
          company_market_cap_category: r.company_master.company_market_cap_category,
          new_fifty_two_week_high: r.new_high_low,
          change_percent: r.change_percent,
          previous_fifty_two_week_high: r.prev_high_low,
          last_traded_price: r.last_traded_price,
          new_fifty_two_week_high_date: r.record_date,
          previous_fifty_two_week_high_date: r.prev_high_low_record_date

      }))
      this.pre_populated_arrays["companies_hitting_new_fifty_two_week_highs"] = new_highs
      const new_lows = resp.data.company_new_fiftytwo_week_highlow.filter(r => r.is_high === false).map(r => ({
        company_name: r.company_master.company_name,
          company_nse_symbol: r.company_master.company_nse_symbol,
          company_sector: r.company_master.company_sector,
          company_market_cap_in_crores: r.company_master.company_market_cap_in_crores,
          company_market_cap_category: r.company_master.company_market_cap_category,
          new_fifty_two_week_low: r.new_high_low,
          change_percent: r.change_percent,
          previous_fifty_two_week_low: r.prev_high_low,
          last_traded_price: r.last_traded_price,
          new_fifty_two_week_low_date: r.record_date,
          previous_fifty_two_week_low_date: r.prev_high_low_record_date
      }))
      this.pre_populated_arrays["companies_hitting_new_fifty_two_week_lows"] = new_lows
      
    }
    catch(e){
      console.error(e)
    }
    this.isInitialized = true
    console.log("Database Manager initialized", (this.pre_populated_arrays.length))
    return this.pre_populated_arrays
  }

}
module.exports = new DatabaseManager()