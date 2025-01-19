const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

// First, create helper functions for parsing special formats
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

// Create table schema
const createHoldingsTableSchema = `
CREATE TABLE IF NOT EXISTS mutual_fund_holdings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mutual_fund_id INTEGER NOT NULL,
    scheme_code TEXT NOT NULL,
    stock_name TEXT NOT NULL,
    stock_sector TEXT,
    stock_market_value_in_millions REAL,
    stock_holding_in_percentage REAL,
    change_1m_percent REAL,
    highest_holding_1y_percent REAL,
    highest_holding_1y_date DATE,    -- Changed to DATE type
    lowest_holding_1y_percent REAL,
    lowest_holding_1y_date DATE,     -- Changed to DATE type
    quantity REAL,
    quantity_change_1m REAL,
    reporting_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mutual_fund_id) REFERENCES mutual_fund(id),
    UNIQUE(mutual_fund_id, stock_name)
)`;

// Create indexes for better performance
const createIndexes = `
CREATE INDEX IF NOT EXISTS idx_holdings_scheme_code ON mutual_fund_holdings(scheme_code);
CREATE INDEX IF NOT EXISTS idx_holdings_reporting_date ON mutual_fund_holdings(reporting_date);
CREATE INDEX IF NOT EXISTS idx_holdings_stock ON mutual_fund_holdings(stock_name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_holdings_scheme_stock_reportingdate ON mutual_fund_holdings(scheme_code, stock_name, reporting_date);
`;

// Initialize tables and indexes
db.exec(createHoldingsTableSchema);
db.exec(createIndexes);

// Prepare statements for operations
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

// Example usage:
/*let holdings = [{
    
    "Stock Invested in": "Reliance Industries Ltd.",
    "Sector": "Refineries & marketing",
    "Value(Mn)": "15930.6",
    "% of Total Holdings": "3.80%",
    "1M Change": "0.68%",
    "1Y Highest Holding": "3.39% (Sep 2024)",
    "1Y Lowest Holding": "1.36% (Mar 2024)",
    "Quantity": "1.23 Cr",
    "1M Change in Qty": "28.50 L"
}];*/
holdings = [
    {
        "Stock Invested in": "Apple",
        "Sector": "Foreign equity",
        "Value(Mn)": "8676.7",
        "% of Total Holdings": "9.78%",
        "1M Change": "0.00%",
        "1Y Highest Holding": "11.06% (Nov 2023)",
        "1Y Lowest Holding": "7.4% (Mar 2024)",
        "Quantity": "4.05 L",
        "1M Change in Qty": "21.17 k"
      },
      {
        "Stock Invested in": "NVIDIA Corporation",
        "Sector": "Foreign equity",
        "Value(Mn)": "7538.6",
        "% of Total Holdings": "8.50%",
        "1M Change": "0.00%",
        "1Y Highest Holding": "8.38% (Oct 2024)",
        "1Y Lowest Holding": "3.76% (Dec 2023)",
        "Quantity": "6.56 L",
        "1M Change in Qty": "36.90 k"
      },
]
try {
    upsertHoldings("MMO003", holdings, "2024-03-31");
} catch (error) {
    console.error('Failed to update holdings:', error);
}