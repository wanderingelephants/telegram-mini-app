const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', {  });

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
const getData = (fundList = [], categoryList = []) => {
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
};

module.exports = getData;