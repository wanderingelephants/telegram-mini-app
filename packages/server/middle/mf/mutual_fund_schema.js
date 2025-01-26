const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

const createTableSchema = `
CREATE TABLE IF NOT EXISTS mutual_fund (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT,
    scheme_code TEXT UNIQUE NOT NULL,
    url_category TEXT,
    plan TEXT,
    category_key TEXT,
    category TEXT,
    star_rating INTEGER,
    aum REAL,
    expenses_ratio REAL,
    expenses_ratio_cat_avg REAL,
    return_1w REAL,
    return_1m REAL,
    return_3m REAL,
    return_6m REAL,
    return_ytd REAL,
    return_1Y REAL,
    return_2Y REAL,
    return_3Y REAL,
    return_5Y REAL,
    return_10Y REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;
db.exec("DROP TABLE IF EXISTS mutual_fund_holdings");
db.exec("DROP TABLE IF EXISTS mutual_fund");

// Create the table
db.exec(createTableSchema);
db.prepare('create unique index mutual_fund_scheme_code on mutual_fund(scheme_code)').run()

// Optional: Create an index on scheme_code for faster lookups
//db.exec('CREATE INDEX IF NOT EXISTS idx_scheme_code ON mutual_fund(scheme_code)');

// Helper function to convert percentage string to float
function percentToFloat(percentStr) {
    if (!percentStr || percentStr === '-') return null;
    return parseFloat(percentStr.replace('%', ''));
}
const parseReturns = (returns) => {
    const parsed = {};
    for (const [period, value] of Object.entries(returns)) {
        parsed[period] = value === '-' ? null : parseFloat(value.replace('%', ''));
    }
    return parsed;
};

// Example insert statement preparation
const insertMutualFund = db.prepare(`
INSERT INTO mutual_fund (
    name, url, scheme_code, url_category, plan, category_key, category, star_rating, aum, expenses_ratio, expenses_ratio_cat_avg,
    return_1w, return_1m, return_3m, return_6m, return_ytd,
    return_1Y, return_2Y, return_3Y, return_5Y, return_10Y,
    created_at, updated_at
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)`);

// Example update statement preparation
const updateMutualFund = db.prepare(`
UPDATE mutual_fund SET
    name = ?,
    url = ?,
    url_category = ?,
    plan = ?,
    category_key = ?,
    category = ?,
    star_rating = ?,
    aum = ?,
    expenses_ratio = ?,
    expenses_ratio_cat_avg = ?,
    return_1w = ?,
    return_1m = ?,
    return_3m = ?,
    return_6m = ?,
    return_ytd = ?,
    return_1Y = ?,
    return_2Y = ?,
    return_3Y = ?,
    return_5Y = ?,
    return_10Y = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE scheme_code = ?
`);

// Example usage with your JSON data:
let fundData = {
    "name": "SBI Contra Fund - Direct Plan - Growth",
    "url": "https://www.moneycontrol.com/mutual-funds/nav/sbi-contra-fund-direct-plan-growth/MSB530",
    "schemeCode": "MSB530",
    "urlCategory": "nav",
    "plan": "Direct Plan",
    "categoryKey": "contra-fund",
    "category": "Contra Fund",
    "rating": "4",
    "aum": "41,906.90",
    "expensesRatio": "1.45",
    "expensesRatioCategoryAverage": "1.23",
    "returns": {
        "1W": "-2.39%",
        "1M": "-",
        "3M": "-5.46%",
        "6M": "-2.68%",
        "YTD": "-1.34%",
        "1Y": "17.25%",
        "2Y": "28.72%",
        "3Y": "22.22%",
        "5Y": "29.68%",
        "10Y": "16.51%"
    }
};

const domainToRemove = "https://www.moneycontrol.com"
if (fundData.url.startsWith(domainToRemove)) fundData.url = fundData.url.substring(domainToRemove.length)
// Example insert transaction
const insertFund = db.transaction((fund) => {
    insertMutualFund.run(
        fund.name,
        fund.url,
        fund.schemeCode,
        fund.urlCategory,
        fund.plan,
        fund.categoryKey,
        fund.category,
        parseInt(fund.rating),
        parseFloat(fund.aum.replaceAll(",", "")),
        parseFloat(fund.expensesRatio.replaceAll(",", "")),
        parseFloat(fund.expensesRatioCategoryAverage.replaceAll(",", "")),
        percentToFloat(fund.returns['1W']),
        percentToFloat(fund.returns['1M']),
        percentToFloat(fund.returns['3M']),
        percentToFloat(fund.returns['6M']),
        percentToFloat(fund.returns['YTD']),
        percentToFloat(fund.returns['1Y']),
        percentToFloat(fund.returns['2Y']),
        percentToFloat(fund.returns['3Y']),
        percentToFloat(fund.returns['5Y']),
        percentToFloat(fund.returns['10Y'])
    );
});

// Example update transaction
const updateFund = db.transaction((fund) => {
    updateMutualFund.run(
        fund.name,
        fund.url,
        fund.urlCategory,
        fund.plan,
        fund.category,
        parseInt(fund.rating),
        parseFloat(fund.aum.replaceAll(",", "")),
        parseFloat(fund.expensesRatio.replaceAll(",", "")),
        parseFloat(fund.expensesRatioCategoryAverage.replaceAll(",", "")),
        percentToFloat(fund.returns['1W']),
        percentToFloat(fund.returns['1M']),
        percentToFloat(fund.returns['3M']),
        percentToFloat(fund.returns['6M']),
        percentToFloat(fund.returns['YTD']),
        percentToFloat(fund.returns['1Y']),
        percentToFloat(fund.returns['2Y']),
        percentToFloat(fund.returns['3Y']),
        percentToFloat(fund.returns['5Y']),
        percentToFloat(fund.returns['10Y']),
        fund.schemeCode  // WHERE clause parameter
    );
});
//module.exports = {insertMutualFund, parseReturns}
// Example usage:
try {
 //   insertFund(fundData);
    // or to update:
    // updateFund(fundData);
} catch (error) {
    console.error('Database operation failed:', error);
}