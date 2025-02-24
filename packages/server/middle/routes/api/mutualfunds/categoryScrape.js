const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const {postToGraphQL} = require("../../../lib/helper")
// Helper functions remain the same
const helpers = {
    percentToFloat(percentStr) {
        if (!percentStr || percentStr === '-') return null;
        return parseFloat(percentStr.replace('%', ''));
    },
    safeParseInt(str) {
        // Handle null, undefined, empty string, and whitespace
        if (!str || typeof str !== 'string' || str.trim() === '') {
            return -1;
        }
    
        // Remove leading/trailing whitespace
        const trimmed = str.trim();
        
        // Check if it's just a minus sign or decimal point
        if (trimmed === '-' || trimmed === '.') {
            return -1;
        }
    
        // Parse the string and check if it's a valid integer
        const num = parseInt(trimmed, 10);
        
        // Check if the result is NaN or infinite
        if (isNaN(num) || !isFinite(num)) {
            return -1;
        }
    
        // Check if the parsed integer matches the original string
        // This catches cases like "123.45" or "123abc"
        if (num.toString() !== trimmed) {
            return -1;
        }
    
        return num;
    },
    parseHoldingWithDate(str) {
        if (!str) return { percent: null, date: null };
        const match = str.match(/(\d+\.?\d*)%\s*\((\w+)\s+(\d{4})\)/);
        if (!match) return { percent: null, date: null };

        const percent = parseFloat(match[1]);
        const monthStr = match[2];
        const year = match[3];

        const monthMap = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
            'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
            'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };

        return {
            percent,
            date: `${year}-${monthMap[monthStr]}-01`
        };
    },

    parseIndianQuantity(str) {
        if (!str) return null;
        const match = str.match(/([\d.]+)\s*(Cr|L)/);
        if (!match) return null;
        const number = parseFloat(match[1]);
        const multiplier = match[2] === 'Cr' ? 10000000 : 100000;
        return number * multiplier;
    }
};

const parseReturns = (returns) => {
    const parsed = {};
    for (const [period, value] of Object.entries(returns)) {
        parsed[period] = value === '-' ? null : parseFloat(value.replace('%', ''));
    }
    return parsed;
};

const INSERT_MUTUAL_FUND = `
  mutation InsertMutualFund($object: mutual_fund_insert_input!) {
    insert_mutual_fund_one(
      object: $object
      on_conflict: {
        constraint: mutual_fund_scheme_code_key,
        update_columns: [scheme_code]
      }
    ) {
      id
      scheme_code
    }
  }
`;

const INSERT_HOLDING = `
  mutation InsertHolding($object: mutual_fund_holdings_insert_input!) {
    insert_mutual_fund_holdings_one(
      object: $object
      on_conflict: {
        constraint: mutual_fund_holdings_mutual_fund_id_stock_id_reporting_date_key,
        update_columns: [mutual_fund_id, stock_id, reporting_date]
      }
    ) {
      id
    }
  }
`;

const route = async (req, res) => {
    try {
        const { categoryKey, funds } = req.body;

        for (const fund of funds) {
            if (null == fund) {
                console.log("NULL FUND");
                continue;
            }

            try {
                const returns = parseReturns(fund.returns);
                
                // Insert mutual fund and get its ID
                const mutualFundResult = await postToGraphQL({
                    query: INSERT_MUTUAL_FUND,
                    variables: {
                        object: {
                            name: fund.name,
                            url: fund.url,
                            scheme_code: fund.schemeCode,
                            url_category: fund.urlCategory,
                            plan: fund.plan,
                            category_key: categoryKey,
                            category: fund.category,
                            star_rating: helpers.safeParseInt(fund.rating),
                            aum: parseInt(fund.aum.replaceAll(",", "")),
                            expenses_ratio: parseFloat(fund.expensesRatio.trim().replaceAll("%", "")),
                            expenses_ratio_cat_avg: parseFloat(fund.expensesRatioCategoryAverage.trim().replace(/[^0-9.]/g, '')),
                            return_1w: returns['1W'],
                            return_1m: returns['1M'],
                            return_3m: returns['3M'],
                            return_6m: returns['6M'],
                            return_ytd: returns['YTD'],
                            return_1Y: returns['1Y'],
                            return_2Y: returns['2Y'],
                            return_3Y: returns['3Y'],
                            return_5Y: returns['5Y'],
                            return_10Y: returns['10Y'],
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    }
                });

                const mutualFundId = mutualFundResult.data.insert_mutual_fund_one.id;

                // Insert holdings
                for (const holding of fund.holdings) {
                    if (!holding['Stock Invested in'] || !holding['% of Total Holdings']) {
                        console.log("Invalid Holding", holding);
                        continue;
                    }

                    const highestHolding = helpers.parseHoldingWithDate(holding['1Y Highest Holding']);
                    const lowestHolding = helpers.parseHoldingWithDate(holding['1Y Lowest Holding']);

                    await postToGraphQL({
                        query: INSERT_HOLDING,
                        variables: {
                            object: {
                                mutual_fund_id: mutualFundId,
                                "stock_mf": {
    "data": {
        "symbol": holding['Stock Invested in'],
      "company_name": holding['Stock Invested in'],
      "company_sector": holding['Sector']
    },
    "on_conflict": {
      "constraint": "stock_mf_company_name_key",
      "update_columns": ["company_name"]
    }
  },
                                //stock_id: holding['Stock Invested in'],  // Changed from stock_name to stock_id
                                //company_sector: holding['Sector'],
                                stock_value_in_millions: parseInt(holding['Value(Mn)']),
                                stock_holding_in_percentage: helpers.percentToFloat(holding['% of Total Holdings']),
                                change_1m_percent: helpers.percentToFloat(holding['1M Change']),
                                highest_holding_1y_percent: highestHolding.percent,
                                highest_holding_1y_date: highestHolding.date,
                                lowest_holding_1y_percent: lowestHolding.percent,
                                lowest_holding_1y_date: lowestHolding.date,
                                quantity: helpers.parseIndianQuantity(holding['Quantity']),
                                quantity_change_1m: helpers.parseIndianQuantity(holding['1M Change in Qty']),
                                reporting_date: fund.reportingDate,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            }
                        }
                    });
                }

                await delay(3000);
            } catch (err) {
                console.log("Error processing fund", fund.schemeCode, err);
            }
        }

        res.status(200).json("Loaded");
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
};

module.exports = route;