const fs = require('fs')
require('dotenv').config();
const path = require('path')
const getData = require('../mutualfunds/getData')
const getLLMResponse = require('./llmResponse')
const fixSyntaxError = require('./syntaxAgent')
const formatResults = require('./formatAgent.js')
let mutual_fund_data = []
const PROMPTS_FOLDER = path.join(__dirname, "prompts")
const GENERATED_FUNCTIONS_PATH = process.env.GENERATED_FUNCTIONS_PATH
if (!fs.existsSync(GENERATED_FUNCTIONS_PATH)) fs.mkdirSync(GENERATED_FUNCTIONS_PATH, { recursive: true })
//const functionName = "analyzeMutualFundsHoldings"

let reporting_dates = []
const stripJSTicks = function (functionText, stringToStrip) {
  const idx = functionText.indexOf(stringToStrip)
  if (idx > -1) functionText =functionText.substring(idx+stringToStrip.length)
  const lastIdx = functionText.lastIndexOf(stringToStrip)
  if (lastIdx > -1)
    return functionText.substring(0, lastIdx)
  else return functionText
}
function convertToConstFormat(functionText) {
  // Extract the function name and parameters
  const functionMatch = functionText.match(/function\s+(\w+)\s*\((.*?)\)/);
  if (!functionMatch) {
      throw new Error("Invalid function format");
  }
  
  const [_, functionName, params] = functionMatch;
  
  // Get the function body (everything between the first { and the last })
  const bodyStart = functionText.indexOf('{');
  const bodyEnd = functionText.lastIndexOf('}');
  const functionBody = functionText.slice(bodyStart);
  let newFunctionText = `const ${functionName} = function(${params})${functionBody}`
  newFunctionText +=  `\nmodule.exports = ${functionName}`
  const generatedFileName = `${functionName}_${(new Date()).getTime()}.js`;

  let generatedFilePath = path.join(GENERATED_FUNCTIONS_PATH, generatedFileName);
  fs.writeFileSync(generatedFilePath, newFunctionText);
  return  {functionName, generatedFilePath}
}
function normalizeMutualFundsData(inputData) {
  // Extract mutual funds data without stock holdings
  const mutualFunds = inputData.map(({ 
    mutual_fund_name,
    mutual_fund_category,
    mutual_fund_star_rating,
    mutual_fund_aum,
    mutual_fund_fee_percentage,
    mutual_fund_category_fee_percentage,
    mutual_fund_return_1Y,
    mutual_fund_return_2Y,
    mutual_fund_return_3Y,
    mutual_fund_return_5Y,
    mutual_fund_return_10Y
          
  }) => ({
    mutual_fund_fee_percentage,
    mutual_fund_category_fee_percentage,
    mutual_fund_name,
    mutual_fund_category,
    mutual_fund_star_rating,
    mutual_fund_aum,
    mutual_fund_return_1Y,
    mutual_fund_return_2Y,
    mutual_fund_return_3Y,
    mutual_fund_return_5Y,
    mutual_fund_return_10Y
  }));
  
  // Create denormalized stock holdings with mutual fund data
  const stockHoldings = inputData.flatMap(fund => {
      return fund.mutual_fund_stock_holdings.map(holding => ({
          ...holding,
          mutual_fund_name: fund.mutual_fund_name,
          mutual_fund_category: fund.mutual_fund_category,
          mutual_fund_star_rating: fund.mutual_fund_star_rating,
          mutual_fund_aum: fund.mutual_fund_aum,
          mutual_fund_fee_percentage: fund.mutual_fund_fee_percentage,
          mutual_fund_category_fee_percentage: fund.mutual_fund_category_fee_percentage,
          mutual_fund_return_1Y: fund.mutual_fund_return_1Y,
    mutual_fund_return_2Y: fund.mutual_fund_return_2Y,
    mutual_fund_return_3Y: fund.mutual_fund_return_3Y,
    mutual_fund_return_5Y: fund.mutual_fund_return_5Y,
    mutual_fund_return_10Y: fund.mutual_fund_return_10Y
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
const handleDipSipQuery = async function(baseModel, userQuestion, ollamaModel){
  const base_prompt = fs.readFileSync(path.join(PROMPTS_FOLDER, baseModel + "_system_prompt.txt"), "utf-8")
  const prompt = `${base_prompt}\nHere is the Question: ${userQuestion}`;
  const formattedResponse = (await getLLMResponse(prompt, ollamaModel)).trim();
  return formattedResponse  
}
const handleMutualFundQuery = async function(baseModel, userQuestion, ollamaModel){
  getMutualFundHoldingsJSONArray()
  const {mutualFunds, stockHoldings} = normalizeMutualFundsData(mutual_fund_data)
    //console.log("Normalized", mutualFunds)
    let base_prompt;
    //promptInstruct ? base_prompt  = promptInstruct :
    base_prompt = fs.readFileSync(path.join(PROMPTS_FOLDER, baseModel + "_system_prompt.txt"), "utf-8")
    const prompt = `${base_prompt}\nHere is the Question: ${userQuestion}`;
    console.log("Question", userQuestion)
    let functionText = (await getLLMResponse(prompt, ollamaModel)).trim();
    console.log("LLM Response", functionText)
    functionText = stripJSTicks(functionText, '```')
    functionText = stripJSTicks(functionText, '```javascript')
    functionText = functionText.trim()
    console.log("functionText after strip\n", functionText)
    const {functionName, generatedFilePath} = convertToConstFormat(functionText)
    //let functionName = "general_query"
    //let generatedFilePath = path.join(GENERATED_FUNCTIONS_PATH, "general_query_1738419569261")
    let result;
    let firstRunFailed = true
    let fixedFilePath = "";
    
    try {
      switch(functionName){
        case "mutual_fund_query": 
          const mutual_fund_query = require(generatedFilePath)
          result = await mutual_fund_query(mutualFunds)
        break;
        case "mutual_fund_stock_holding_query":
          const mutual_fund_stock_holding_query = require(generatedFilePath)
          result = await mutual_fund_stock_holding_query(stockHoldings, reporting_dates) 
        break;
        case "general_query":
          const general_query = require(generatedFilePath)
          result = await general_query()
        break;
        case "input_not_recognized":
          const input_not_recognized = require(generatedFilePath)
          result = await input_not_recognized()
        break;
      }
      firstRunFailed = false
    } catch (e) {
      console.log("Syntax failed, checking")
      console.error(e)
      fixedFilePath = await fixSyntaxError(generatedFilePath, e.stack, ollamaModel)
      console.log("fixedFilePAth", fixedFilePath)
    }

    if (firstRunFailed === true && fixedFilePath !== "") {
      console.log("Fixed Function to retry", fixedFilePath)
      try {
        switch(functionName){
          case "mutual_fund_query": 
            const mutual_fund_query = require(generatedFilePath)
            result = await mutual_fund_query(mutualFunds)
          break;
          case "mutual_fund_stock_holding_query":
            const mutual_fund_stock_holding_query = require(generatedFilePath)
            result = await mutual_fund_stock_holding_query(mutualFunds, stockHoldings, reporting_dates) 
          break;
          case "general_query":
            const general_query = require(generatedFilePath)
            result = await general_query()
          break;
        }
      } catch (e) {
        console.error('Execution error:', e);
      }
    }

    //console.log(new Date(), "Result", Array.isArray(result) ? result.slice(0) : result)
    const formattedResponse = await formatResults(result, userQuestion, ollamaModel)
    return formattedResponse
}

const route = async (req, res) => {
  try {
    const { baseModel, messages, streaming } = req.body;
    console.log("question.js", { baseModel, messages, streaming })
    let {ollamaModel, promptInstruct} = req.body;
    if (!ollamaModel) ollamaModel = process.env.OLLAMA_MODEL ? process.env.OLLAMA_MODEL : "llama3.2:latest" 
    const latestMessage = messages[messages.length - 1]
    let userQuestion; 
    if (latestMessage.role == 'user') {
      userQuestion = latestMessage.content
    }
    let formattedResponse = "Sorry, No Response";
    
    switch(baseModel){
      case "mf_reasoning" : {
        formattedResponse = await handleMutualFundQuery(baseModel, userQuestion, ollamaModel)
        break;
      }
      case "dipsip" : {
        formattedResponse = await handleDipSipQuery(baseModel, userQuestion, ollamaModel)
        break;
      }
    }
    console.log("formattedResponse", formattedResponse)
    if (true == streaming) 
      res.writeHead(200, {'Content-Type': 'text/event-stream','Cache-Control': 'no-cache','Connection': 'keep-alive'});
  
    
    if (true  == streaming){
      let json;
      const lines = formattedResponse.split("\n")
      for (const line of lines){
        json = { "response": line, "done": false }
        res.write(`data: ${JSON.stringify(json)}\n\n`);
      }
      json = { "response": "", "done": true }
      res.write(`data: ${JSON.stringify(json)}\n\n`);
      res.end();
    }
    else res.json(formattedResponse);
  } catch (error) {
    console.error(error)
    json = { "response": "Sorry, no response", "done": true }
    res.write(`data: ${JSON.stringify(json)}\n\n`);
    res.end();
    //res.status(500).json({ error: error.message });
  }
};
module.exports = route;
