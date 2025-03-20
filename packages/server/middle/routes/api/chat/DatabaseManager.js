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
    
    async getUserStockPortfolio(email){
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
    async runMutationForTable(table){
      const tableName = table["Table Name"]
      let mutation = `query ${tableName}_all{
        ${tableName}{
      `
      //console.log(tableName)
      const columns = table.Columns.filter(c => c.GQL_Alias !== null)
      for (const col  of columns){
        //console.log(col.GQL_Alias)
        //mutation += (col.GQL_Alias === "co_code") ? table["Table Name"]==="company_master_table"  :  `` 
        if (col.GQL_Alias){
          if (col.GQL_Alias === "co_code"){
            if (table["Table Name"]!=="company_master"){
               mutation += `\ncompany_master {
                company_short_name: companyshortname
                company_name: companyname
                company_nse_symbol: nsesymbol
                company_sector_name: sectorname
              }`
            }
          }
          else {
              mutation += `${col.GQL_Alias}:${col.Column_Name}\n`
          }
        } 
      }
      mutation += `}
      }`
      console.log(mutation)
      try{
        const resp = await postToGraphQL({query: mutation, variables: {}})
        return resp.data[tableName]
      }
      catch(e){
        console.log("error in running mutation", mutation)
        return []
      }
    }
    async  initData(){
      if (this.isInitialized === true){
        console.log("Database already initialized")
        return
      }
      const all_tables_json = fs.readFileSync(path.join(process.env.DATA_ROOT_FOLDER, "all_tables.json"), "utf-8")
      const all_tables = JSON.parse(all_tables_json)
      const promptable = all_tables.filter(c => (c.PromptQL === "Retail" || c.PromptQL === "Enterprise"))
      //const promptable = all_tables.filter(c => c["Table Name"] === "company_cash_flow_ratios")
      
      for (const table of promptable){
        try{
          const tableData = await this.runMutationForTable(table)
          this.pre_populated_arrays[table["Table Name"]] = tableData
        }
        catch(e){
          console.log("Error in mutation processing for table", table["Table Name"], e)
        }
        
      }
      this.isInitialized = true
      console.log("Database Manager initialized", (this.pre_populated_arrays))
      return this.pre_populated_arrays
    }
    /*async initData() {
        if (this.isInitialized === true){
            console.log("Database already initialized")
            return
        }
        console.log("Initializing Data....")
        let mutual_funds = []
        let mutual_fund_stock_holdings = []
        let mutual_fund_data = []
        let holding_reporting_dates = []
        let corporate_announcements = []
        let insider_trades = []

        let daily_closing_stock_prices_by_company_name = []
        let market_nse_nifty_closing_prices = []
        

        const t1 = Date.now()
        const mutualFundsAndReportingDates = await getMutualFundHoldingsJSONArray()
        mutual_fund_data = mutualFundsAndReportingDates.mutual_fund_data
        holding_reporting_dates = mutualFundsAndReportingDates.reporting_dates
        const normalizedMutualFundsData = normalizeMutualFundsData(mutual_fund_data)
        mutual_funds = normalizedMutualFundsData.mutualFunds
        mutual_fund_stock_holdings = normalizedMutualFundsData.stockHoldings
        const today = new Date();
        const toDate = today.toISOString().split("T")[0]
        const fromDate = (new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))).toISOString().split("T")[0]
        console.log("DatabaseManager fromDate, toDate", fromDate, toDate)
        const announcementQuery = `query stock_announcements($fromDate: date!, $toDate: date!){
        stock_announcements(where: {announcement_date: {_gte: $fromDate, _lte: $toDate}}){
          stock{
            company_name
            company_sector
          }
          announcement_date
          announcement_text_summary
          announcement_impact
          announcement_sentiment
          announcement_document_link
        }
      }`
        let resp = await postToGraphQL({
            "query": announcementQuery, "variables": {
                fromDate, toDate
            }
        })
        corporate_announcements = resp.data.stock_announcements.map(a => {
            return {
                company_name: a.stock.company_name,
                company_sector: a.stock.company_sector,
                announcement_date: a.announcement_date,
                announcement_summary: a.announcement_text_summary,
                announcement_impact: a.announcement_impact,
                announcement_sentiment: reverse_mapping_announcement_sentiment[a.announcement_sentiment],
                announcement_link: a.announcement_document_link
            }
        })

       

        const insiderTradesQuery = `
            query insiderTrades($fromDate: date!, $toDate: date!) {
              insider_trades(where: {transaction_date: {_gte: $fromDate, _lte: $toDate}}){
                name_of_insider
                category_of_insider
                mode_of_transaction
                transaction_type
                shareholding_before_transaction
                shareholding_after_transaction
                transaction_date
                intimation_date
                stock{
                    company_name
                    company_sector
                }
              }
            }
        `
        resp = await postToGraphQL({
            "query": insiderTradesQuery, "variables": {
                fromDate, toDate
            }
        })
        insider_trades = resp.data.insider_trades.map(a => {
            return {
                company_name: a.stock.company_name,
                company_sector: a.stock.company_sector,
                name_of_insider: a.name_of_insider,
                type_of_insider: reverse_mapping_category_of_insider[a.category_of_insider],
                exchange: a.exchange,
                transaction_date: a.transaction_date,
                intimation_date: a.intimation_date,
                shareholding_before_transaction: a.shareholding_before_transaction,
                shareholding_after_transaction: a.shareholding_after_transaction,
                insider_trades_transaction_mode: reverse_mapping_mode_of_transaction[a.mode_of_transaction],
                insider_trades_transaction_type: reverse_mapping_transaction_type[a.transaction_type]
            }
        })

        const closingPriceQuery = `query getStockPriceDaily($start_date: date!) {
        stock_price_daily(where: { price_date: { _gte: $start_date } }) {
          stock{
            symbol
            company_name
            company_sector
          }
          price_date
          open
          high
          low
          close
        }
         
        nse_nifty_prices(where: {price_date: {_gte: $start_date}}){
          close
          price_date
        }
      
      }`
        const date = new Date();
        date.setDate(date.getDate() - 5);
        const startDate = date.toISOString().split("T")[0]; // Formats to YYYY-MM-DD


        const closingPriceVariables = {
            "start_date": startDate
        }

        const closingPriceResp = await postToGraphQL({
            query: closingPriceQuery,
            variables: closingPriceVariables
        })
        daily_closing_stock_prices_by_company_name = transformStockData(closingPriceResp.data.stock_price_daily)
        market_nse_nifty_closing_prices = closingPriceResp.data.nse_nifty_prices
        const t2 = Date.now()
        console.log("DatabaseManager :: Time Take to initData ", (t2 - t1))

        resp = await postToGraphQL({
            query: `query GetFiftyTwoWeekHighLow($fromDate: date!, $toDate: date!){
  fifty_two_week_high_low(where: {reporting_date: {_gte: $fromDate, _lte: $toDate}}){
    stock{
      company_name
      company_sector
    }
    reporting_date
    new_high_low
    prev_high_low
    prev_high_low_date
    change_percent
    is_high
  }
}`,
      variables: {
        fromDate, toDate
      }
        })
        const { fifty_two_week_high_low } = resp.data;

        const fifty_two_week_highs = fifty_two_week_high_low
        .filter(entry => entry.is_high)
        .map(({ stock, new_high_low, prev_high_low, prev_high_low_date, reporting_date, ...rest }) => ({
          company_name: stock.company_name,
          company_sector: stock.company_sector,
          new_high: new_high_low,
          prev_high: prev_high_low,
          prev_high_date: prev_high_low_date,
          fifty_two_week_high_date: reporting_date,
          ...rest
        }));
      
      const fifty_two_week_lows = fifty_two_week_high_low
        .filter(entry => !entry.is_high)
        .map(({ stock, new_high_low, prev_high_low, prev_high_low_date, reporting_date, ...rest }) => ({
          company_name: stock.company_name,
          company_sector: stock.company_sector,
          new_low: new_high_low,
          prev_low: prev_high_low,
          prev_low_date: prev_high_low_date,
          fifty_two_week_low_date: reporting_date,
          ...rest
        }));

        resp = await postToGraphQL({
          query: `query TTMRatios{
  company_trailing_todate_ratios{
    company_master{
      company_name :  companyname 
    }
    ratios_date: ttmason
    pe
    netsales
    netprofit
    netdebt_ebitda_ttm
    netdebt_ebitda_ttm
    netincomemargin_ttm
    industry_pe
    ev_sales_ttm
    pbv
    assetturnover_ttm
    ev_sales_ttm
  }
}`,
          variables: {}
        })
        const company_trailing_twelve_months_ratios = resp.data.company_trailing_todate_ratios.map(item => {
          const formattedDate = moment(item.ratios_date.toString(), 'YYYYMM')
            .add(1, 'month')
            .subtract(1, 'day')
            .format('YYYY-MM-DD');
        
          return {
            company_name: item.company_master.company_name,
            ratios_date: formattedDate,
            pe: item.pe,
            netsales: item.netsales,
            netprofit: item.netprofit,
            netdebt_ebitda_ttm: item.netdebt_ebitda_ttm,
            netincomemargin_ttm: item.netincomemargin_ttm,
            industry_pe: item.industry_pe,
            ev_sales_ttm: item.ev_sales_ttm,
            pbv: item.pbv,
            assetturnover_ttm: item.assetturnover_ttm
          };
        });
        resp = await postToGraphQL({
          query: `query company_master{
  company_master{
    company_name: companyname
    company_sector_name: sectorname
    company_market_cap_label: mcaptype
    company_market_cap_value_INR_crores: mcap
  }
}`, variables: {}
        })
        const company_master = resp.data.company_master
        this.pre_populated_arrays = {
            mutual_funds,
            mutual_fund_stock_holdings,
            mutual_fund_data,
            holding_reporting_dates,
            corporate_announcements,
            insider_trades,
            daily_closing_stock_prices_by_company_name,
            market_nse_nifty_closing_prices,
            fifty_two_week_highs, fifty_two_week_lows,
            company_master,
            company_trailing_twelve_months_ratios
        }
        this.isInitialized = true
        console.log("Database Manager initialized")
        return this.pre_populated_arrays
    }*/
}
module.exports = new DatabaseManager()