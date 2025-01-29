const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

const getData = (fundList) => {
    try {
        // Prepare the SQL query for mutual funds
        const placeholders = fundList.map(() => '?').join(',');
        
        // Get mutual fund basic data
        const fundQuery = `
            SELECT 
                id,
                name as mutual_fund_name,
                category as mutual_fund_category,
                star_rating as mutual_fund_star_rating,
                aum as mutual_fund_aum,
                expenses_ratio as mutual_fund_expenses_ratio,
                expenses_ratio_cat_avg as mutual_fund_category_expenses_ratio
            FROM mutual_fund
            WHERE name IN (${placeholders})
        `;
        // Execute the fund query
        const funds = db.prepare(fundQuery).all(fundList);
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
        console.log(enrichedFunds)
        return enrichedFunds;
        
    } catch (error) {
        console.error('Error in getData:', error);
        throw new Error('Failed to fetch mutual fund data');
    }
};

module.exports = getData;