const axios = require('axios');
const model = process.env.OLLAMA_MODEL || 'llama3.2';
const OLLAMA_URL = process.env.OLLAMA_URL;;  // Adjust this to your Ollama container URL
const { initializeOllama } = require('./initOllama');
const Hjson = require('hjson');
const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

const parseMultiLineJson = function (jsonString) {
    // First normalize the SQL string by replacing newlines and extra spaces
    const normalized = jsonString.replace(
        /"SQL":\s*"([\s\S]*?)"(?=\s*,|\s*})/g, 
        (match, sql) => {
            // Normalize SQL: remove newlines and extra spaces
            const normalizedSQL = sql
                .replace(/\s+/g, ' ')
                .trim();
            return `"SQL": "${normalizedSQL}"`;
        }
    );
    
    // Then handle the approach string similarly
    const fullyNormalized = normalized.replace(
        /"Approach_for_NLP_to_SQL":\s*"([\s\S]*?)"(?=\s*})/g,
        (match, approach) => {
            const normalizedApproach = approach
                .replace(/\s+/g, ' ')
                .trim();
            return `"Approach_for_NLP_to_SQL": "${normalizedApproach}"`;
        }
    );
    
    return JSON.parse(fullyNormalized);
}
const nlp_to_query = async function(query){
    await initializeOllama()
    const PROMPT = `
        Generate SQL queries for a SQLite database containing mutual fund data. Reply in JSON format with fields "SQL" and "Approach_for_NLP_to_SQL".

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
4. Do Not Use table aliases, unless you are joining the table to itself (SELF-JOIN). Therefore, for mutual_fund table use mutual_fund. prefix for column names and not "mf." or "m."

Expected Response Format:
{
    "SQL": "your SQL query here",
    "Approach_for_NLP_to_SQL": "explanation of how you converted the NLP to SQL"
}

Note: Provide the response in strict JSON format:
- SQL query should be on a single line without line breaks
- Approach_for_NLP_to_SQL should be on a single line without line breaks
- No extra whitespace or indentation within string values

Example Query and Response:
Input: "Show mutual funds holding TCS stock"
{
    "SQL": "SELECT DISTINCT mf.mutual_fund_name, mfh.stock_holding_in_percentage,mfh.reporting_date FROM mutual_fund m JOIN mutual_fund_holdings mfh ON mf.id = mfh.mutual_fund_id WHERE UPPER(mfh.stock_name) LIKE UPPER('%TCS%') ORDER BY mfh.stock_holding_in_percentage DESC;",
    "SQL": "SELECT DISTINCT mf.mutual_fund_name, mfh.stock_holding_in_percentage,mfh.reporting_date FROM mutual_fund m JOIN mutual_fund_holdings mfh ON mf.id = mfh.mutual_fund_id WHERE UPPER(mfh.stock_name) LIKE UPPER('%TCS%') ORDER BY mfh.stock_holding_in_percentage DESC;",
    "Approach_for_NLP_to_SQL": "1. Identified entity 'TCS' as stock_name2. Chose relevant columns: fund name, holding %, date3. Implemented case-insensitive LIKE with UPPER()4. Added ORDER BY for meaningful sorting"
}

Test Queries:
1. "Which mutual funds have a holding for stock 'V2 Retail'"
2. "Which Mutual Funds have exposure of over 30% in sector 'Pharma'"

For complex queries requiring aggregations, use Common Table Expressions (CTEs).
Include reporting_date in output to show data freshness.
Round percentage values for readability using ROUND(column, 2).
Sort results in a meaningful way based on the query context.


Required Output Structure:
{
    "SQL": "your complete SQLite-compatible query",
    "Approach_for_NLP_to_SQL": "step-by-step explanation of how you:
                               1. Identified entities and relationships
                               2. Determined required calculations
                               3. Structured the query
                               4. Handled edge cases"
}
'

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
    const obj = parseMultiLineJson(resp)
    console.log(obj)
    const dbResp = db.prepare(`${obj.SQL}`).all()
    console.log(dbResp)
})