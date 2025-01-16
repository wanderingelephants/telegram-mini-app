const axios = require('axios');
class MutualFundAgent {
  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL + '/api/generate' || 'http://ollama:11434/api/generate';
  }
  async classifyQuery(query) {
    console.log('classifyQuery', query)
    const classificationPrompt = `
You are a query classifier for an Indian mutual fund analysis system.
The user may have selected specific mutual funds for comparison.

Classify the following query into one of these categories:
- STOCK_HOLDING_QUERY (if query contains words like 'hold', 'holds', 'holding', 'holdings', 'stock', 'share' i.e. when user is searching for funds based on stock criteria like MF holdings in specific stocks or stock sectors)
- FUND_DISCOVERY (when user is searching for mutual funds based on fund specific criteria like returns, sector, fund size, ratings, risk level, or investment strategy)
- GENERAL_KNOWLEDGE (general educational questions about mutual funds, markets, or investment concepts)

Classification rules:
1. If query contains specific fund names AND mentions comparison/overlap/difference → FUND_COMPARISON
2. If query is about a single fund's details/performance/portfolio → FUND_DETAILS
3. If query contains search criteria, filtering conditions, or asks for recommendations → FUND_DISCOVERY
4. Only classify as GENERAL_KNOWLEDGE if the query is purely educational and doesn't fit the above categories

Examples:
- "Compare HDFC Top 100 and Axis Bluechip" → FUND_COMPARISON
- "What is the portfolio of ICICI Prudential Technology Fund?" → FUND_DETAILS
- "Show me large cap funds with 5-star rating" → FUND_DISCOVERY
- "What are the benefits of SIP?" → GENERAL_KNOWLEDGE

Query: "${query}"

Respond with just the category name in uppercase, nothing else.`;

    try {
      const response = await axios.post(this.ollamaUrl, {
        model: "llama3.2",
        prompt: classificationPrompt,
        stream: false
      });

      return response.data.response.trim();
    } catch (error) {
      console.error('Classification error:', error);
      throw error;
    }
  }
  async processQuery(messages) {
    const query = messages[messages.length -  1].content
    
    try {
      const queryType = await this.classifyQuery(query);
      console.log('Query classified as:', queryType);

      switch (queryType) {
        case 'FUND_DISCOVERY':
            return this.handleFundDiscovery(query); 
        case 'STOCK_HOLDING_QUERY':
            return this.handleStockHoldingDiscovery(query);  
        default:
          return this.handleGeneralQuery(query);
      }
    } catch (error) {
      console.error('Error in query processing:', error);
      throw error;
    }
  }

  handleFundComparison(funds) {
    if (!funds || funds.length < 2) {
      return {
        message: "Please select at least two mutual funds to compare.",
        analysisData: null
      };
    }

    // Calculate returns comparison
    /*const returnsComparison = this.compareReturns(funds);
    
    // Calculate expense ratios
    const expenseComparison = this.compareExpenseRatios(funds);
    
    // Calculate risk ratings
    const riskComparison = this.compareRiskRatings(funds);

    // Calculate category distribution
    const categoryAnalysis = this.analyzeCategoryDistribution(funds);*/

    // Create a deterministic response message
    /*const message = this.createComparisonMessage(
      funds,
      returnsComparison,
      expenseComparison,
      riskComparison,
      categoryAnalysis
    );

    return {
      message,
      analysisData: {
        type: 'comparison',
        data: {
          returns: returnsComparison,
          expense: expenseComparison,
          risk: riskComparison,
          categories: categoryAnalysis
        }
      }
    };*/
    return {}
  }

  compareReturns(funds) {
    const timeframes = ['1Y', '3Y', '5Y'];
    const returns = {};

    timeframes.forEach(timeframe => {
      returns[timeframe] = funds.map(fund => ({
        fundName: fund.name,
        return: this.parseReturnValue(fund.returns[timeframe])
      })).sort((a, b) => b.return - a.return);
    });

    return returns;
  }

  parseReturnValue(returnStr) {
    return parseFloat(returnStr.replace('%', '')) || 0;
  }

  compareExpenseRatios(funds) {
    // In real implementation, this would read from actual expense ratio data
    // Using mock data for now
    return funds.map(fund => ({
      fundName: fund.name,
      expenseRatio: parseFloat(fund.expenseRatio || '1.2')
    })).sort((a, b) => a.expenseRatio - b.expenseRatio);
  }

  compareRiskRatings(funds) {
    return funds.map(fund => ({
      fundName: fund.name,
      riskRating: parseInt(fund.rating),
      riskCategory: this.getRiskCategory(parseInt(fund.rating))
    })).sort((a, b) => b.riskRating - a.riskRating);
  }

  getRiskCategory(rating) {
    if (rating >= 5) return 'Very High';
    if (rating >= 4) return 'High';
    if (rating >= 3) return 'Moderate';
    if (rating >= 2) return 'Low';
    return 'Very Low';
  }

  analyzeCategoryDistribution(funds) {
    const categories = {};
    funds.forEach(fund => {
      categories[fund.category] = (categories[fund.category] || 0) + 1;
    });
    return categories;
  }

  createComparisonMessage(funds, returns, expense, risk, categories) {
    const fundCount = funds.length;
    let message = `Comparing ${fundCount} mutual funds:\n\n`;

    // Add returns comparison
    message += '1. Returns Comparison:\n';
    ['1Y', '3Y', '5Y'].forEach(timeframe => {
      if (returns[timeframe]?.[0]) {
        message += `   ${timeframe}: Best performer is ${returns[timeframe][0].fundName} (${returns[timeframe][0].return}%)\n`;
      }
    });

    // Add risk analysis
    message += '\n2. Risk Analysis:\n';
    risk.forEach(fund => {
      message += `   ${fund.fundName}: ${fund.riskCategory} risk (${fund.riskRating}/5 stars)\n`;
    });

    // Add category distribution
    message += '\n3. Category Distribution:\n';
    Object.entries(categories).forEach(([category, count]) => {
      message += `   ${category}: ${count} fund${count > 1 ? 's' : ''}\n`;
    });

    return message;
  }
  async handleFundDiscovery(query) {

    const sqlGenerationPrompt = `
You are an SQL query generator for an Indian mutual fund discovery system. IMPORTANT: Generate SQL based ONLY on the current user query - do not consider any previous context or queries.

DATABASE SCHEMA:
Table: mutual_fund (Details about a Mutual Fund Scheme in Indian Market)
- mutual_fund_name: TEXT (includes fund house names like "ICICI Prudential", "HDFC", "Nippon India")
- mutual_fund_category: TEXT (possible values: "small cap fund", "large cap fund", "ETF", "mid cap fund", "multi cap fund", "sectoral/thematic")
- mutual_fund_star_rating: INTEGER (1-5 star rating)
- mutual_fund_assets_under_management: TEXT (Assets Under Management)
- percentage_annualized_returns_for_1_year_period, percentage_annualized_returns_for_2_year_period, percentage_annualized_returns_for_3_year_period, percentage_annualized_returns_for_5_year_period, percentage_annualized_returns_for_10_year_period: REAL (annualized percentage returns for 1 year, 2 year, 3 year, 5 year, 10 year period)


IMPORTANT RULES FOR TABLE USAGE:
1. Use ONLY mutual_fund table when querying for:
   - Fund names or fund houses (ONLY if explicitly mentioned in current query)
   - Categories ("small cap fund", "large cap fund", etc.)
   - MF Star Ratings
   - Annualized Returns over 1 year, 2 year, 3 year, 5 year, 10 year period
   - Assets Under Management (AUM)
   

2. Always use case-insensitive LIKE for text matching:
  Never use exact matching (=) for text fields as it may miss valid matches
   - For fund names: UPPER(stock_name) LIKE UPPER('%HDFC%') - ONLY if fund house is specified in query
   - For categories: UPPER(mutual_fund_category) LIKE UPPER('%Small Cap Fund%')
   - For Stock names : UPPER(stock_name) LIKE UPPER('%Reliance%')
   

ACTUAL CATEGORY VALUES:
- "Large Cap Fund"
- "Mid Cap Fund"
- "Small Cap Fund"
- "Multi Cap Fund"
- "Sectoral/Thematic"
- "ETF"

USER QUERY: "${query}"

QUERY CONSTRUCTION RULES:
1. Include fund house filter (WHERE UPPER(name) LIKE...) ONLY if explicitly mentioned in current query
2. Include category filter ONLY if mentioned in current query
3. Include return period filters based on what's asked in current query
4. Use proper date formatting (YYYY-MM-DD)
5. Limit results to 10 by default
6. Always include relevant return periods and ratings in output
7. There is NO NEED FOR ANY JOINs. Both Tables mutual_fund and stock_holdings_in_mutual_fund do not have any common joining column.

EXAMPLES OF CORRECT TABLE USAGE:

1. Single Table Query (mutual_fund only):
Input: "show me all HDFC small cap funds"
SELECT name, category, rating, return_1y, return_3y 
FROM mutual_fund 
WHERE UPPER(name) LIKE UPPER('%HDFC%') 
AND UPPER(category) LIKE UPPER('%Small Cap Fund%') 
ORDER BY return_1y DESC 
LIMIT 10;


RESPONSE FORMAT:
Return only the SQL query, nothing else. Do not include backticks or formatting.`;

const response = await axios.post(this.ollamaUrl, {
  model: "llama3.2",
  prompt: sqlGenerationPrompt,
  stream: false
});

console.log(response.data.response)
    
    const detailedAnalysis = [{
      "name": "DSP Value Fund - Direct Plan - Growth",
      "url": "https://www.moneycontrol.com/mutual-funds/nav/dsp-value-fund-direct-plan-growth/MDS1553",
      "schemeCode": "MDS1553",
      "urlCategory": "nav",
      "plan": "Direct Plan",
      "category": "Value Fund",
      "rating": "5",
      "aum": "910.36",
      "returns": {
        "1W": "-1.25%",
        "1M": "-",
        "3M": "-3.28%",
        "6M": "2.94%",
        "YTD": "-0.52%",
        "1Y": "20.58%",
        "2Y": "25.87%",
        "3Y": "15.83%",
        "5Y": "-",
        "10Y": "-"
      }
    }]

    const message = this.createFundDetailsMessage(detailedAnalysis);

    

    return {
      message,
      analysisData: {
        type: 'details',
        data: detailedAnalysis
      }
    };
  }
  async handleStockHoldingDiscovery(query) {

    const sqlGenerationPrompt = `
You are an SQL query generator for an Indian mutual fund discovery system. IMPORTANT: Generate SQL based ONLY on the current user query - do not consider any previous context or queries.

DATABASE SCHEMA:

Table: stock_holdings_in_mutual_fund (Equity Stock Holdings in a Mutual Fund)
- mutual_fund_name: TEXT
- stock_name: TEXT
- stock_sector: TEXT (e.g., "defence", "IT", "Banks")
- stock_holding_in_percentage: REAL (percentage holding of the stock in this mutual fund)
- reporting_date: DATE (The Date on which Mutual Fund updated its holdings data)


Always use case-insensitive LIKE for text matching:
  Never use exact matching (=) for text fields as it may miss valid matches
   - For fund names: UPPER(stock_name) LIKE UPPER('%HDFC%') - ONLY if fund house is specified in query
   - For categories: UPPER(mutual_fund_category) LIKE UPPER('%Small Cap Fund%')
   - For Stock names : UPPER(stock_name) LIKE UPPER('%Reliance%')
   - Suffix query with " order by stock_holding_in_percentage DESC" so that results are sorted by holding percentage

USER QUERY: "${query}"


EXAMPLES OF CORRECT TABLE USAGE:


Single Table Query (stock_holdings_in_mutual_fund only):
Input: "find funds which are holding the stock V2 Retail"
select mutual_fund_name, reporting_date, stock_holding_in_percentage from stock_holdings_in_mutual_fund 
where stock_holdings_in_mutual_fund.stock_name like '%v2%'  order by stock_holding_in_percentage DESC
LIMIT 10;

Single Table Query (stock_holdings_in_mutual_fund only):
Input: "which funds have holding in reliance"
select mutual_fund_name, reporting_date, stock_holding_in_percentage from stock_holdings_in_mutual_fund 
where stock_holdings_in_mutual_fund.stock_name like '%reliance%' order by stock_holding_in_percentage DESC
LIMIT 10;

RESPONSE FORMAT:
Return only the SQL query, nothing else. Do not include backticks or formatting.`;

const response = await axios.post(this.ollamaUrl, {
  model: "llama3.2",
  prompt: sqlGenerationPrompt,
  stream: false
});

console.log(response.data.response)
    
    const detailedAnalysis = [{
      "name": "DSP Value Fund - Direct Plan - Growth",
      "url": "https://www.moneycontrol.com/mutual-funds/nav/dsp-value-fund-direct-plan-growth/MDS1553",
      "schemeCode": "MDS1553",
      "urlCategory": "nav",
      "plan": "Direct Plan",
      "category": "Value Fund",
      "rating": "5",
      "aum": "910.36",
      "returns": {
        "1W": "-1.25%",
        "1M": "-",
        "3M": "-3.28%",
        "6M": "2.94%",
        "YTD": "-0.52%",
        "1Y": "20.58%",
        "2Y": "25.87%",
        "3Y": "15.83%",
        "5Y": "-",
        "10Y": "-"
      }
    }]

    const message = this.createFundDetailsMessage(detailedAnalysis);

    

    return {
      message,
      analysisData: {
        type: 'details',
        data: detailedAnalysis
      }
    };
  }
  handleFundDetails(funds) {
    if (!funds || funds.length === 0) {
      return {
        message: "Please select a mutual fund to analyze.",
        analysisData: null
      };
    }

    const detailedAnalysis = funds.map(fund => {
      return {
        name: fund.name,
        category: fund.category,
        rating: fund.rating,
        aum: fund.aum,
        returns: fund.returns,
        // Add more fund-specific details
      };
    });

    const message = this.createFundDetailsMessage(detailedAnalysis);

    return {
      message,
      analysisData: {
        type: 'details',
        data: detailedAnalysis
      }
    };
  }

  createFundDetailsMessage(fundsDetails) {
    let message = '';
    fundsDetails.forEach(fund => {
      message += `${fund.name}\n`;
      message += `Category: ${fund.category}\n`;
      message += `Rating: ${fund.rating}/5\n`;
      message += `AUM: ₹${fund.aum} Cr\n`;
      message += 'Returns:\n';
      Object.entries(fund.returns).forEach(([period, value]) => {
        message += `  ${period}: ${value}\n`;
      });
      message += '\n';
    });
    return message;
  }

  async handleGeneralQuery(query) {
    // Only use LLM for general knowledge questions
    const response = await axios.post(this.ollamaUrl, {
      model: "llama3.2",
      prompt: `You are a mutual fund expert specializing in Indian markets. Your audience consists exclusively of Indian retail investors.
      If user requests Tips of any kind, politely refuse and explain that you can explain investment principles but not give specific tips. 
      Question: ${query}
      Provide a brief helpful explanation suitable for an Indian retail investor, using only Indian market examples and context.`,
      stream: true
    });

    if (!response.body) {
      throw new Error('No response body');
    }

    // Process the streaming response
    for await (const chunk of response.body) {
      const text = new TextDecoder().decode(chunk);
      const lines = text.split('\n').filter(Boolean);
      
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          res.write(`data: ${JSON.stringify(json)}\n\n`);
          
          if (json.done) {
            res.end();
            return;
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }
    }
    
  }
}
module.exports = MutualFundAgent