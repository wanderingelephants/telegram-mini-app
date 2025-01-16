const Database = require('better-sqlite3');
console.log(process.env)
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

const createTableSchema = `
CREATE TABLE IF NOT EXISTS mutual_fund (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mutual_fund_name TEXT NOT NULL,
    url TEXT,
    scheme_code TEXT UNIQUE NOT NULL,
    url_category TEXT,
    plan TEXT,
    mutual_fund_category TEXT,
    mutual_fund_star_rating INTEGER,
    mutual_fund_assets_under_management TEXT,
    return_1w REAL,
    return_1m REAL,
    return_3m REAL,
    return_6m REAL,
    return_ytd REAL,
    percentage_annualized_returns_for_1_year_period REAL,
    percentage_annualized_returns_for_2_year_period REAL,
    percentage_annualized_returns_for_3_year_period REAL,
    percentage_annualized_returns_for_5_year_period REAL,
    percentage_annualized_returns_for_10_year_period REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`;

// Create the table
db.exec(createTableSchema);

// Optional: Create an index on scheme_code for faster lookups
db.exec('CREATE INDEX IF NOT EXISTS idx_mutual_fund_scheme_code ON mutual_fund(scheme_code)');

// Helper function to convert percentage string to float
function percentToFloat(percentStr) {
    if (!percentStr || percentStr === '-') return null;
    return parseFloat(percentStr.replace('%', ''));
}

// Example insert statement preparation
const insertMutualFund = db.prepare(`
INSERT INTO mutual_fund (
    mutual_fund_name, url, scheme_code, url_category, plan, mutual_fund_category, mutual_fund_star_rating, mutual_fund_assets_under_management,
    return_1w, return_1m, return_3m, return_6m, return_ytd,
    percentage_annualized_returns_for_1_year_period, percentage_annualized_returns_for_2_year_period, percentage_annualized_returns_for_3_year_period, percentage_annualized_returns_for_5_year_period, percentage_annualized_returns_for_10_year_period,
    created_at, updated_at
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)`);

// Example update statement preparation
const updateMutualFund = db.prepare(`
UPDATE mutual_fund SET
    mutual_fund_name = ?,
    url = ?,
    url_category = ?,
    plan = ?,
    mutual_fund_category = ?,
    mutual_fund_star_rating = ?,
    mutual_fund_assets_under_management = ?,
    return_1w = ?,
    return_1m = ?,
    return_3m = ?,
    return_6m = ?,
    return_ytd = ?,
    percentage_annualized_returns_for_1_year_period = ?,
    percentage_annualized_returns_for_2_year_period = ?,
    percentage_annualized_returns_for_3_year_period = ?,
    percentage_annualized_returns_for_5_year_period = ?,
    percentage_annualized_returns_for_10_year_period = ?,
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
    "category": "Contra Fund",
    "rating": "4",
    "aum": "41,906.90",
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
fundData = {
    "name": "Motilal Oswal NASDAQ 100 ETF",
    "url": "/mutual-funds/nav/motilal-oswal-nasdaq-100-etf/MMO003",
    "schemeCode": "MMO003",
    "category": "etf",
    "aum": "8868.32",
    "1W": "-1.02",
    "returns": {
      "1M": "--",
      "3M": "4.6",
      "6M": "5.83",
      "1Y": "28.44",
      "2Y": "38.52",
      "3Y": "16.14"
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
        fund.category,
        parseInt(fund.rating),
        fund.aum,
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
        fund.aum,
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

// Example usage:
try {
    insertFund(fundData);
    // or to update:
    // updateFund(fundData);
} catch (error) {
    console.error('Database operation failed:', error);
}