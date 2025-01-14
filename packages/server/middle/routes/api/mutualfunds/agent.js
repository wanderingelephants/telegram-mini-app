const axios = require('axios');

class MutualFundAgent {
  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL + '/api/generate' || 'http://ollama:11434/api/generate';
  }
  async classifyQuery(query, hasSelectedFunds) {
    const classificationPrompt = `
You are a query classifier for an Indian mutual fund analysis system.
The user may have selected specific mutual funds for comparison.
Currently selected funds: ${hasSelectedFunds ? 'Yes' : 'No'}

Classify the following query into one of these categories:
- FUND_COMPARISON (comparing funds, analyzing portfolio, overlap analysis, performance)
- FUND_DETAILS (specific details about individual funds)
- GENERAL_KNOWLEDGE (general questions about mutual funds)

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
  async processQuery(query, context) {
    const { funds } = context;
    
    try {
      const queryType = await this.classifyQuery(query, !!funds?.length);
      console.log('Query classified as:', queryType);

      switch (queryType) {
        case 'FUND_COMPARISON':
          return this.handleFundComparison(funds);
        case 'FUND_DETAILS':
          return this.handleFundDetails(funds);
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
    const returnsComparison = this.compareReturns(funds);
    
    // Calculate expense ratios
    const expenseComparison = this.compareExpenseRatios(funds);
    
    // Calculate risk ratings
    const riskComparison = this.compareRiskRatings(funds);

    // Calculate category distribution
    const categoryAnalysis = this.analyzeCategoryDistribution(funds);

    // Create a deterministic response message
    const message = this.createComparisonMessage(
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
    };
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
      Question: ${query}
      Provide a helpful explanation suitable for an Indian retail investor, using only Indian market examples and context.`,
      stream: false
    });

    return {
      message: response.data.response,
      analysisData: null
    };
  }
}
module.exports = MutualFundAgent