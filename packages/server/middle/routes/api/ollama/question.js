const fs = require('fs')
require('dotenv').config();
const path = require('path')
const getData = require('../mutualfunds/getData')
const getLLMResponse = require('./llmResponse')
const fixSyntaxError = require('./syntaxAgent')
const formatResults = require('./formatAgent.js')
let mutualFunds, stockHoldings;
let mutual_fund_data = []
const PROMPTS_FOLDER = path.join(__dirname, "prompts")
const GENERATED_FUNCTIONS_PATH = process.env.GENERATED_FUNCTIONS_PATH
if (!fs.existsSync(GENERATED_FUNCTIONS_PATH)) fs.mkdirSync(GENERATED_FUNCTIONS_PATH, { recursive: true })
const functionName = "analyzeMutualFunds"

let reporting_dates = []
const stripJSTicks = function (functionText) {
  const idx = functionText.indexOf(`const ${functionName} = function`)
  const lastIdx = functionText.lastIndexOf("}")
  return functionText.substring(idx, lastIdx + 1)
}

function normalizeMutualFundsData(inputData) {
  // Extract mutual funds data without stock holdings
  const mutualFunds = inputData.map(({ mutual_fund_stock_holdings, ...fundData }) => fundData);
  
  // Create denormalized stock holdings with mutual fund data
  const stockHoldings = inputData.flatMap(fund => {
      return fund.mutual_fund_stock_holdings.map(holding => ({
          ...holding,
          mutual_fund_name: fund.mutual_fund_name,
          mutual_fund_category: fund.mutual_fund_category,
          mutual_fund_star_rating: fund.mutual_fund_star_rating,
          mutual_fund_aum: fund.mutual_fund_aum,
          mutual_fund_expenses_ratio: fund.mutual_fund_expenses_ratio,
          mutual_fund_category_expenses_ratio: fund.mutual_fund_category_expenses_ratio
      }));
  });
  
  return {
      mutualFunds,
      stockHoldings
  };
}

const getMutualFundHoldingsJSONArray = function () {
  mutual_fund_data = getData([], [])
  
  // Create a Set of unique date strings
  const unique_dates = new Set();
  mutual_fund_data.forEach(mf => {
    mf.mutual_fund_stock_holdings = mf.mutual_fund_stock_holdings.map(holding => {
      unique_dates.add(holding.stock_holding_reporting_date);
      return {
        ...holding,
        stock_holding_reporting_date: new Date(holding.stock_holding_reporting_date)
      }
    })
  });

  
  // Convert Set to array of Date objects and sort in descending order
  reporting_dates = Array.from(unique_dates)
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => b - a);
  console.log("reporting_dates", reporting_dates)
}
getMutualFundHoldingsJSONArray()

const route = async (req, res) => {
  try {
    const { base_prompt, userQuestion, ollamaModel } = req.body;

    const prompt = `${base_prompt}\nHere is the Question: ${userQuestion}`;

    let functionText = (await getLLMResponse(prompt, ollamaModel)).trim();
    functionText = stripJSTicks(functionText, '```')
    if (functionText.indexOf(`module.exports = ${functionName}`) === -1) {
      functionText += `\nmodule.exports = ${functionName}`
    }
    const generatedFileName = (new Date()).getTime() + ".js";
    let generatedFilePath = path.join(GENERATED_FUNCTIONS_PATH, generatedFileName);
    fs.writeFileSync(generatedFilePath, functionText);
    let analyzeMutualFunds;
    let result = [];
    let firstRunFailed = true
    let fixedFilePath = "";
    const {mutualFunds, stockHoldings} = normalizeMutualFundsData(mutual_fund_data)
    try {
      analyzeMutualFunds = require(generatedFilePath);
      result = await analyzeMutualFunds(mutualFunds, stockHoldings, reporting_dates);
      firstRunFailed = false
    } catch (e) {
      console.log("Syntax failed, checking")
      console.error(e)
      fixedFilePath = await fixSyntaxError(generatedFilePath, e.stack, ollamaModel)
    }

    if (firstRunFailed === true && fixedFilePath !== "") {
      console.log("Fixed Function to retry", fixedFilePath)
      try {
        analyzeMutualFunds = require(fixedFilePath);
        result = await analyzeMutualFunds(mutualFunds, stockHoldings, reporting_dates);
      } catch (e) {
        console.error('Execution error:', e);
      }
    }

    console.log(new Date(), "Result", result.slice(0))
    const formattedResponse = await formatResults(result, userQuestion, ollamaModel)
    res.json(formattedResponse);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message });
  }
};
module.exports = route;
