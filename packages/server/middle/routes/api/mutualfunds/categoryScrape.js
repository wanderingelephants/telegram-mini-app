const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const helpers = {
    // Convert percentage string to float
    percentToFloat(percentStr) {
        if (!percentStr || percentStr === '-') return null;
        return parseFloat(percentStr.replace('%', ''));
    },

    // Parse holding with date (e.g., "3.39% (Sep 2024)")
    parseHoldingWithDate(str) {
        if (!str) return { percent: null, date: null };
        const match = str.match(/(\d+\.?\d*)%\s*\((\w+)\s+(\d{4})\)/);
        if (!match) return { percent: null, date: null };

        const percent = parseFloat(match[1]);
        const monthStr = match[2];
        const year = match[3];

        // Map month abbreviations to month numbers
        const monthMap = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
            'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
            'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };

        // Create date in YYYY-MM-DD format (using 01 as day)
        const dateStr = `${year}-${monthMap[monthStr]}-01`;

        return {
            percent: percent,
            date: dateStr  // SQLite understands YYYY-MM-DD format for DATE type
        };
    },

    // Convert Indian notation (Cr/L) to number
    parseIndianQuantity(str) {
        if (!str) return null;
        const match = str.match(/([\d.]+)\s*(Cr|L)/);
        if (!match) return null;
        const number = parseFloat(match[1]);
        const multiplier = match[2] === 'Cr' ? 10000000 : 100000;
        return number * multiplier;
    }
};

const isValidHolding = (holding) => {
    // Check if object is empty
    if (Object.keys(holding).length === 0) return false;

    // Check for required fields
    const requiredFields = [
        'Stock Invested in',
        '% of Total Holdings'
    ];

    return requiredFields.every(field => {
        const value = holding[field];
        return value !== undefined && value !== null && value !== '';
    });
};
const parseReturns = (returns) => {
    const parsed = {};
    for (const [period, value] of Object.entries(returns)) {
        parsed[period] = value === '-' ? null : parseFloat(value.replace('%', ''));
    }
    return parsed;
};
const loadMutualFund = db.prepare(`
    INSERT INTO mutual_fund (
    name, url, scheme_code, url_category, plan, 
    category_key, category, star_rating, aum, expenses_ratio, 
    expenses_ratio_cat_avg, return_1w, return_1m, return_3m, return_6m, 
    return_ytd, return_1Y, return_2Y, return_3Y, return_5Y, 
    return_10Y, created_at, updated_at
) VALUES (
    ?, ?, ?, ?, ?, 
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
`);
const getMutualFundId = db.prepare('SELECT id FROM mutual_fund WHERE scheme_code = ?');
const insertHolding = db.prepare(`
    INSERT INTO mutual_fund_holdings (
        mutual_fund_id,
        scheme_code,
        stock_name,
        stock_sector,
        stock_market_value_in_millions,
        stock_holding_in_percentage,
        change_1m_percent,
        highest_holding_1y_percent,
        highest_holding_1y_date,
        lowest_holding_1y_percent,
        lowest_holding_1y_date,
        quantity,
        quantity_change_1m,
        reporting_date,
        created_at,
        updated_at
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    )`);
    
    const updateHolding = db.prepare(`
    UPDATE mutual_fund_holdings SET
        stock_name = ?,
        stock_sector = ?,
        stock_market_value_in_millions = ?,
        stock_holding_in_percentage = ?,
        change_1m_percent = ?,
        highest_holding_1y_percent = ?,
        highest_holding_1y_date = ?,
        lowest_holding_1y_percent = ?,
        lowest_holding_1y_date = ?,
        quantity = ?,
        quantity_change_1m = ?,
        reporting_date = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE mutual_fund_id = ? AND stock_name = ?
    `);

const upsertHoldings = db.transaction(async (schemeCode, holdings, reportingDate) => {
    const mutualFundRow = getMutualFundId.get(schemeCode);
    if (!mutualFundRow) {
        throw new Error(`Mutual fund with scheme code ${schemeCode} not found`);
    }
    const mutualFundId = mutualFundRow.id;

    holdings.forEach(holding => {
        console.log("insert holding", holding)
        if (!isValidHolding(holding)){
            console.log("Invalid Holding", holding)
            this.continue;
        }
        // Parse composite fields
        const highestHolding = helpers.parseHoldingWithDate(holding['1Y Highest Holding']);
        const lowestHolding = helpers.parseHoldingWithDate(holding['1Y Lowest Holding']);
        
        try {
            insertHolding.run(
                mutualFundId,
                schemeCode,
                holding['Stock Invested in'],
                holding['Sector'],
                parseFloat(holding['Value(Mn)']),
                helpers.percentToFloat(holding['% of Total Holdings']),
                helpers.percentToFloat(holding['1M Change']),
                highestHolding.percent,
                highestHolding.date,
                lowestHolding.percent,
                lowestHolding.date,
                helpers.parseIndianQuantity(holding['Quantity']),
                helpers.parseIndianQuantity(holding['1M Change in Qty']),
                reportingDate
            );
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                // Update existing record
                updateHolding.run(
                    holding['Stock Invested in'],
                    holding['Sector'],
                    parseFloat(holding['Value(Mn)']),
                    helpers.percentToFloat(holding['% of Total Holdings']),
                    helpers.percentToFloat(holding['1M Change']),
                    highestHolding.percent,
                    highestHolding.date,
                    lowestHolding.percent,
                    lowestHolding.date,
                    helpers.parseIndianQuantity(holding['Quantity']),
                    helpers.parseIndianQuantity(holding['1M Change in Qty']),
                    reportingDate,
                    mutualFundId,
                    holding['Stock Invested in']
                );
            } else {
                throw error;
            }
        }
    });
});
const route = async(req, res) => {
    try{
        const {categoryKey, funds} = req.body
        //console.log(categoryKey, funds)
        for (const fund of funds) {
            console.log('processing fund', fund)
            if  (null == fund){
                console.log("NULL FUND")
                continue;
            }
            try{
                fund.categoryKey = categoryKey
                const returns = parseReturns(fund.returns);
                loadMutualFund.run(
                    fund.name,
                    fund.url,
                    fund.schemeCode,
                    fund.urlCategory,
                    fund.plan,
                    fund.categoryKey,
                    fund.category,
                    parseInt(fund.rating),
                    parseFloat(fund.aum.replaceAll(",", "")),
                    parseFloat(fund.expensesRatio.trim().replaceAll("%", "")),
                    parseFloat(fund.expensesRatioCategoryAverage.trim().replace(/[^0-9.]/g, '')),
                    returns['1W'],
                    returns['1M'],
                    returns['3M'],
                    returns['6M'],
                    returns['YTD'],
                    returns['1Y'],
                    returns['2Y'],
                    returns['3Y'],
                    returns['5Y'],
                    returns['10Y']
                );
            }
            catch(err){
                console.log("Err in loading", fund.schemeCode, err)
            }
            try{
                await upsertHoldings(fund.schemeCode, fund.holdings, fund.reportingDate)
                await delay(3000)
            }
            catch(holingErr){
                console.log("Holindg Err", holingErr)
            }

            
        }
        res.status(200).json("Loaded")
    }
    catch(e){
        console.log(e)
        res.status(500).json(e)
    }

}
module.exports = route