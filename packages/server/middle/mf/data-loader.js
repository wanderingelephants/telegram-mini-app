const fs = require('fs').promises;
const path = require('path');
const Database = require('better-sqlite3');

const DATA_ROOT_FOLDER = process.env.DATA_ROOT_FOLDER || './data';
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

// Helper to parse percentage returns
const parseReturns = (returns) => {
    const parsed = {};
    for (const [period, value] of Object.entries(returns)) {
        parsed[period] = value === '-' ? null : parseFloat(value.replace('%', ''));
    }
    return parsed;
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
// Load a single mutual fund
const loadMutualFund = db.prepare(`
    INSERT OR REPLACE INTO mutual_fund (
        mutual_fund_name, url, scheme_code, url_category, plan, mutual_fund_category, mutual_fund_star_rating, mutual_fund_assets_under_management,
    return_1w, return_1m, return_3m, return_6m, return_ytd,
    percentage_annualized_returns_for_1_year_period, percentage_annualized_returns_for_2_year_period, percentage_annualized_returns_for_3_year_period, percentage_annualized_returns_for_5_year_period, percentage_annualized_returns_for_10_year_period,
    created_at, updated_at
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
`);

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

// Transaction to insert or update holdings
const upsertHoldings = db.transaction((schemeCode, holdings, reportingDate) => {
    const mutualFundRow = getMutualFundId.get(schemeCode);
    if (!mutualFundRow) {
        throw new Error(`Mutual fund with scheme code ${schemeCode} not found`);
    }
    const mutualFundId = mutualFundRow.id;

    holdings.forEach(holding => {
        console.log("insert holding", holding)
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
// Main function to load mutual funds data
async function loadMutualFundsData() {
    try {
        // Get all category directories
        const categories = await fs.readdir(DATA_ROOT_FOLDER);

        for (const category of categories) {
            const categoryPath = path.join(DATA_ROOT_FOLDER, category);
            const stat = await fs.stat(categoryPath);

            if (!stat.isDirectory()) continue;

            // Read mutual_funds_data.json for each category
            const dataFilePath = path.join(categoryPath, 'mutual_funds_data.json');
            try {
                const data = await fs.readFile(dataFilePath, 'utf8');
                const mutualFunds = JSON.parse(data);

                // Process each mutual fund in the category
                for (const fund of mutualFunds) {
                    const returns = parseReturns(fund.returns);
                    
                    loadMutualFund.run(
                        fund.name,
                        fund.url,
                        fund.schemeCode,
                        fund.urlCategory,
                        fund.plan,
                        fund.category,
                        parseInt(fund.rating),
                        parseFloat(fund.aum.replaceAll(",", "")),
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

                    // After loading mutual fund, load its holdings
                    await loadMutualFundHoldings(category, fund.schemeCode);
                }
            } catch (error) {
                console.error(`Error processing category ${category}:`, error);
            }
        }
    } catch (error) {
        console.error('Error loading mutual funds data:', error);
    }
}

// Function to load holdings for a specific mutual fund
async function loadMutualFundHoldings(category, schemeCode) {
    try {
        const holdingsPath = path.join(DATA_ROOT_FOLDER, category, schemeCode, 'holdings');
        
        const reportingDates = await fs.readdir(holdingsPath);

        for (const reportingDate of reportingDates) {
            const holdingsFilePath = path.join(holdingsPath, reportingDate, 'holdings.json');
            
            try {
                const data = await fs.readFile(holdingsFilePath, 'utf8');
                const holdingsData = JSON.parse(data);

                if (holdingsData.holdings && Array.isArray(holdingsData.holdings)) {
                    // Filter out empty or invalid holdings
                    const validHoldings = holdingsData.holdings.filter(isValidHolding);

                    if (validHoldings.length === 0) {
                        console.warn(`No valid holdings found for ${schemeCode} on ${reportingDate}`);
                        continue;
                    }

                    // Log if we filtered out any invalid holdings
                    if (validHoldings.length !== holdingsData.holdings.length) {
                        console.warn(`Filtered out ${holdingsData.holdings.length - validHoldings.length} invalid holdings for ${schemeCode} on ${reportingDate}`);
                    }

                    upsertHoldings(schemeCode, validHoldings, reportingDate);
                }
            } catch (error) {
                console.error(`Error processing holdings for ${schemeCode} on ${reportingDate}:`, error);
            }
        }
    } catch (error) {
        console.error(`Error loading holdings for ${schemeCode}:`, error);
    }
}

// Function to run the data loader
async function runDataLoader() {
    console.log('Starting data load...');
    const startTime = Date.now();

    try {
        await loadMutualFundsData();
        console.log(`Data load completed in ${(Date.now() - startTime) / 1000} seconds`);
    } catch (error) {
        console.error('Data load failed:', error);
    }
}

// Execute if run directly
if (require.main === module) {
    runDataLoader().then(() => {
        console.log('Data loader finished');
        db.close();
    }).catch(error => {
        console.error('Fatal error:', error);
        db.close();
        process.exit(1);
    });
}

module.exports = {
    loadMutualFundsData,
    loadMutualFundHoldings,
    runDataLoader,
    upsertHoldings,
    isValidHolding
};