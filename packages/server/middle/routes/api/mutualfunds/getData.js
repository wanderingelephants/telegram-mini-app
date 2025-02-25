const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', {  });
const {postToGraphQL} = require("../../../lib/helper")
const getMutualFundsFiltered = `query getMutualFundsFiltered($fundList: [String!], $categoryList: [String!]) {
    mutual_fund(where: {
      _or: [
        {
          _and: [
            { name: { _in: $fundList } },
            { category: { _in: $categoryList } }
          ]
        },
        {
          name: { _in: $fundList }
        },
        {
          category: { _in: $categoryList }
        }
      ]
    }) {
      mutual_fund_name: name
      mutual_fund_category: category
      mutual_fund_star_rating: star_rating
      mutual_fund_aum: aum
      mutual_fund_return_1Y: return_1Y
      mutual_fund_return_2Y: return_2Y
      mutual_fund_return_3Y: return_3Y
      mutual_fund_return_5Y: return_5Y
      mutual_fund_return_10Y: return_10Y
      mutual_fund_fee_percentage: expenses_ratio
      mutual_fund_category_fee_percentage: expenses_ratio_cat_avg
      mutual_fund_stock_holdings: mutual_fund_holdings(
        order_by: { reporting_date: desc }
      ) {
        stock_mf{
        company_name
        company_sector
        }
        stock_holding_percentage_in_fund: stock_holding_in_percentage
        stock_holding_reporting_date: reporting_date
      }
    }
  }`
  
 
  const getMutualFundsAll =`query getMutualFundsAll {
    mutual_fund (where: {mf_direct_variant_id:{_is_null:true}, aum: {_gt: 2000}}) {
      mutual_fund_name: name
      mutual_fund_category: category
      mutual_fund_star_rating: star_rating
      mutual_fund_aum: aum
      mutual_fund_return_1Y: return_1Y
      mutual_fund_return_2Y: return_2Y
      mutual_fund_return_3Y: return_3Y
      mutual_fund_return_5Y: return_5Y
      mutual_fund_return_10Y: return_10Y
      mutual_fund_fee_percentage: expenses_ratio
      mutual_fund_category_fee_percentage: expenses_ratio_cat_avg
      mutual_fund_stock_holdings: mutual_fund_holdings(
        order_by: { reporting_date: desc }
      ) {
        stock_mf{
        company_name
        company_sector
        }
        stock_holding_percentage_in_fund: stock_holding_in_percentage
        stock_holding_reporting_date: reporting_date
      }
    }
  }`
const removeRegularFunds = function(holding_data){
    const directFunds = new Set();  
    holding_data.forEach(holding => {
    if (holding.mutual_fund_name.includes('Direct Plan')) {
        directFunds.add(getBaseFundName(holding.mutual_fund_name));
    }
});

// Helper function to get base name
function getBaseFundName(fundName) {
    return fundName.replace(' - Direct Plan', '').replace(' - Regular Plan', '');
}

// Find holdings to remove (Regular Plans where Direct exists)
const holdingsToRemove = holding_data.filter(holding => {
    if (!holding.mutual_fund_name.includes('Regular Plan')) return false;
    const baseName = getBaseFundName(holding.mutual_fund_name);
    return directFunds.has(baseName);
});

// Create final filtered holdings
const filtered_holdings = holding_data.filter(holding => {
    if (!holding.mutual_fund_name.includes('Regular Plan')) return true;
    const baseName = getBaseFundName(holding.mutual_fund_name);
    return !directFunds.has(baseName);
});

return filtered_holdings    
}
const getData = async (fundList = [], categoryList = []) => {
    try {
      // Choose which query to use based on filter lists
      const queryToUse = (fundList.length > 0 || categoryList.length > 0) 
        ? getMutualFundsFiltered 
        : getMutualFundsAll;
      
      // Variables only needed for filtered query
      const variables = (fundList.length > 0 || categoryList.length > 0) 
        ? { fundList, categoryList }
        : {};
      
      const response = await postToGraphQL({
        query: queryToUse,
        variables
      });
      
      return response.data.mutual_fund;
    } catch (error) {
      console.error('Error in getData:', error);
      throw new Error('Failed to fetch mutual fund data');
    }
  };
/*const getData = (fundList = [], categoryList = []) => {
    try {
        const conditions = [];
        const params = [];

        if (fundList.length > 0) {
            const namePlaceholders = fundList.map(() => '?').join(',');
            conditions.push(`name IN (${namePlaceholders})`);
            params.push(...fundList);
        }

        if (categoryList.length > 0) {
            const categoryPlaceholders = categoryList.map(() => '?').join(',');
            conditions.push(`category IN (${categoryPlaceholders})`);
            params.push(...categoryList);
        }

        // Construct the final WHERE clause
        const whereClause = conditions.length > 0 
            ? `WHERE ${conditions.join(' AND ')}` 
            : '';

        // Get mutual fund basic data
        const fundQuery = `
            SELECT 
                id,
                name as mutual_fund_name,
                category as mutual_fund_category,
                star_rating as mutual_fund_star_rating,
                aum as mutual_fund_aum,
                return_1Y as mutual_fund_return_1Y,
                return_2Y as mutual_fund_return_2Y,
                return_3Y as mutual_fund_return_3Y,
                return_5Y as mutual_fund_return_5Y,
                return_10Y as mutual_fund_return_10Y,
                expenses_ratio as mutual_fund_fee_percentage,
                expenses_ratio_cat_avg as mutual_fund_category_fee_percentage
            FROM mutual_fund
            ${whereClause}
        `;
        // Execute the fund query with combined parameters
        const funds = db.prepare(fundQuery).all(params);
        // For each fund, get its holdings
        const holdingsQuery = db.prepare(`
            SELECT 
                stock_name,
                stock_sector,
                stock_holding_in_percentage as stock_holding_percentage_in_fund,
                reporting_date as stock_holding_reporting_date
            FROM mutual_fund_holdings
            WHERE mutual_fund_id = ?
            ORDER BY reporting_date DESC
        `);
        
        // Map over funds to add holdings data
        const enrichedFunds = funds.map(fund => {
            const holdings = holdingsQuery.all(fund.id);
            // Remove the id field as it's not needed in the output
            const { id, ...fundWithoutId } = fund;
            
            return {
                ...fundWithoutId,
                mutual_fund_stock_holdings: holdings
            };
        });
        return enrichedFunds;
        
    } catch (error) {
        console.error('Error in getData:', error);
        throw new Error('Failed to fetch mutual fund data');
    }
};*/
const getMutualFundHoldingsJSONArray = async  function () {
    let mutual_fund_data = await getData([], [])
    // Create a Set of unique date strings
    const unique_dates = new Set();
    mutual_fund_data.forEach(mf => {
      mf.mutual_fund_stock_holdings = mf.mutual_fund_stock_holdings.map(holding => {
        unique_dates.add(holding.stock_holding_reporting_date);
        return {
          ...holding,
          stock_holding_reporting_date: new Date(holding.stock_holding_reporting_date)
        }
      })
    });
  
    
    // Convert Set to array of Date objects and sort in descending order
    reporting_dates = Array.from(unique_dates)
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => b - a);
    return {mutual_fund_data, reporting_dates}
}
const normalizeMutualFundsData = function(inputData) {
    // Extract mutual funds data without stock holdings
    const mutualFunds = inputData.map(({ 
      mutual_fund_name,
      mutual_fund_category,
      mutual_fund_star_rating,
      mutual_fund_aum,
      mutual_fund_fee_percentage,
      mutual_fund_category_fee_percentage,
      mutual_fund_return_1Y,
      mutual_fund_return_2Y,
      mutual_fund_return_3Y,
      mutual_fund_return_5Y,
      mutual_fund_return_10Y
            
    }) => ({
      mutual_fund_fee_percentage,
      mutual_fund_category_fee_percentage,
      mutual_fund_name,
      mutual_fund_category,
      mutual_fund_star_rating,
      mutual_fund_aum,
      mutual_fund_return_1Y,
      mutual_fund_return_2Y,
      mutual_fund_return_3Y,
      mutual_fund_return_5Y,
      mutual_fund_return_10Y
    }));
    
    // Create denormalized stock holdings with mutual fund data
    const stockHoldings = inputData.flatMap(fund => {
        return fund.mutual_fund_stock_holdings.map(holding => ({
            ...holding,
            company_name: holding.stock_mf.company_name,
            company_sector: holding.stock_mf.company_sector,
            mutual_fund_name: fund.mutual_fund_name,
            mutual_fund_category: fund.mutual_fund_category,
            mutual_fund_star_rating: fund.mutual_fund_star_rating,
            mutual_fund_aum: fund.mutual_fund_aum,
            mutual_fund_fee_percentage: fund.mutual_fund_fee_percentage,
            mutual_fund_category_fee_percentage: fund.mutual_fund_category_fee_percentage,
            mutual_fund_return_1Y: fund.mutual_fund_return_1Y,
      mutual_fund_return_2Y: fund.mutual_fund_return_2Y,
      mutual_fund_return_3Y: fund.mutual_fund_return_3Y,
      mutual_fund_return_5Y: fund.mutual_fund_return_5Y,
      mutual_fund_return_10Y: fund.mutual_fund_return_10Y
        }));
    });
    
    return {
        mutualFunds,
        stockHoldings
    };
  }
module.exports = {getData, getMutualFundHoldingsJSONArray, normalizeMutualFundsData};