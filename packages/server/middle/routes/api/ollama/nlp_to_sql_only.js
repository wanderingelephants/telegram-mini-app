const axios = require('axios');
const model = process.env.OLLAMA_MODEL || 'llama3.2';
const OLLAMA_URL = process.env.OLLAMA_URL;;  // Adjust this to your Ollama container URL
const { initializeOllama } = require('./initOllama');
const Hjson = require('hjson');
const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

const nlp_to_query = async function(query){
    await initializeOllama()
    const PROMPT = `
        Generate SQL queries for a SQLite database containing mutual fund data. Reply only with the SQL, and nothing else at all".

Database Schema:
CREATE TABLE mutual_fund  (
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
)

CREATE TABLE mutual_fund_holdings  (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mutual_fund_id INTEGER NOT NULL,
  scheme_code TEXT NOT NULL,
  stock_name TEXT NOT NULL,
  stock_sector TEXT,
  stock_market_value_in_millions REAL,
  stock_holding_in_percentage REAL,
  change_1m_percent REAL,
  highest_holding_1y_percent REAL,
  highest_holding_1y_date DATE,
  -- Changed to DATE type
    lowest_holding_1y_percent REAL,
  lowest_holding_1y_date DATE,
  -- Changed to DATE type
    quantity REAL,
  quantity_change_1m REAL,
  reporting_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mutual_fund_id) REFERENCES mutual_fund(id),
  UNIQUE(mutual_fund_id, stock_name)
)

Key Requirements:
1. This is a SQLite database - use SQLite compatible syntax
2. NEVER use "=" for string matching. e.g. after identifying entity as 'stock sector', then use LIKE for matching.
e.g. UPPER(stock_sector) LIKE UPPER('%Pharma%') and not stock_sector = 'Pharma'. Note: LIKE Instead of '=' and wild card matching (using %)
Always use case-insensitive LIKE:
   CORRECT: UPPER(stock_name) LIKE UPPER('%Apple%')
   INCORRECT: stock_name = 'Apple'
   INCORRECT: LOWER(stock_name) = LOWER('Apple')
3. Tables join on mutual_fund_holdings.mutual_fund_id = mutual_fund.id


Example Query and Response:
Input: "Show mutual funds holding TCS stock"

    "SELECT DISTINCT mf.mutual_fund_name, mfh.stock_holding_in_percentage,mfh.reporting_date FROM mutual_fund m JOIN mutual_fund_holdings mfh ON mf.id = mfh.mutual_fund_id WHERE UPPER(mfh.stock_name) LIKE UPPER('%TCS%') ORDER BY mfh.stock_holding_in_percentage DESC;",

Test Queries:
1. "Which mutual funds have a holding for stock 'V2 Retail'"
2. "Which Mutual Funds have exposure of over 30% in sector 'Pharma'"

For complex queries requiring aggregations, use Common Table Expressions (CTEs).
Include reporting_date in output to show data freshness.
Round percentage values for readability using ROUND(column, 2).
Sort results in a meaningful way based on the query context.

RESPONSE FORMAT:
Return only the SQL query, nothing else. Do not include backticks or formatting.

Here is the Query: ${query}
`
try {
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model,
      prompt: PROMPT,
      stream: false
    });

    return response.data.response.trim();
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }

}
const query = "which funds have maximum holdings in Pharma sector"
nlp_to_query(query).then(resp => {
    console.log(resp);
    //const obj = Hjson.parse(resp)
    const dbResp = db.prepare(`${resp}`).all()
    console.log(dbResp)
})