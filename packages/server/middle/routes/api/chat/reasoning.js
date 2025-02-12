const fs = require('fs');
const axios = require("axios")
const path = require('path');
const { getMutualFundHoldingsJSONArray, normalizeMutualFundsData } = require('../mutualfunds/getData')
const MAX_RESULTS_TO_FORMAT = 10
const { postToGraphQL } = require("../../../lib/helper")
const { Anthropic } = require('@anthropic-ai/sdk');
const util = require('util');
let messageManager;
//const { json } = require('stream/consumers');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const _getFilePath = function (basePath, sessionId, modelName, filename) {
  const date = new Date();
  const year = date.getFullYear() + "";
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return path.join(basePath, year, month, day, sessionId, modelName, filename);
}
const testAgainstFunction = ""; //process.env.LLM_GENERATED_CODE + "/2025/02/10/8622f154-26ea-47d5-b52d-b3d36fd531ce/processAnnouncements_1739200686466.js";
const {reverse_mapping_category_of_insider, reverse_mapping_regulation, 
  reverse_mapping_type_of_security, reverse_mapping_mode_of_transaction, 
  reverse_mapping_transaction_type, reverse_mapping_exchange,
  mapping_announcement_sentiment, reverse_mapping_announcement_sentiment} = require("../../../stocks/mappings");
const { query } = require('express');

const _ensureDirectory = async function (filePath) {
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
}
let corporate_announcements = []
let insider_trades = []
class MessageManager {
  constructor(basePath) {
    this.basePath = basePath;
  }

  async saveMessage(sessionId, modelName, message, filename) {
    const filePath = _getFilePath(this.basePath, sessionId, modelName, filename);
    await _ensureDirectory(filePath);

    let messages = [];
    try {
      const data = await readFile(filePath, 'utf-8');
      messages = JSON.parse(data);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    messages.push(message);
    await writeFile(filePath, JSON.stringify(messages, null, 2));
  }
  async getMessages(sessionId, modelName, filename) {
    const filePath = _getFilePath(this.basePath, sessionId, modelName, filename);
    let messages = [];
    try {
      const data = await readFile(filePath, 'utf-8');
      messages = JSON.parse(data);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    return messages
  }
  async getLastMessage(sessionId, modelName, filename){
    const filePath = _getFilePath(this.basePath, sessionId, modelName, filename);
    let messages = [];
    try {
      const data = await readFile(filePath, 'utf-8');
      messages = JSON.parse(data);
    } catch (err) {
      console.error(err)
      return []
      //if (err.code !== 'ENOENT') throw err;
    }
    return messages.length > 0 ? messages[messages.length - 1] : []
  }


}

class LLMClient {
  constructor(llmToUse) {
    this.llmToUse = llmToUse;
    this.temperature = 0;
  }
  stripJSTicks(functionText, stringToStrip) {
    const idx = functionText.indexOf(stringToStrip)
    if (idx > -1) functionText = functionText.substring(idx + stringToStrip.length)
    const lastIdx = functionText.lastIndexOf(stringToStrip)
    if (lastIdx > -1)
      return functionText.substring(0, lastIdx)
    else return functionText
  }
  async sendToLLM(systemPrompt, messages, customData) {
    const sentimentQueryResponse = await postToGraphQL({
      query: sentimentQuery, 
      variables: {
        "docLink": customData.attachment.trim() + "%"
      }
    })
    const sentimentValue = sentimentQueryResponse.data.stock_announcements[0].announcement_sentiment
    if (sentimentValue > -1){
      console.log("Summary already exists for ", customData.attachment.trim())
      return;
    }
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content[0].text // dynamically wrapping in a string
    }));
    console.log(formattedMessages)
    if (testAgainstFunction !== "") return ""
    //return "function mutual_fund_query(){}"
    if (this.llmToUse === 'Claude') {
      const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
      const resp = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: formattedMessages,
        temperature: this.temperature
      });
      return resp.content[0].text;
    }
    if (this.llmToUse === "Ollama") {
      let model = process.env.OLLAMA_MODEL
      const finalPrompt = systemPrompt.replace("{{text_replace}}", messages[0].content)
      const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
        model,
        prompt: finalPrompt,
        stream: false,
        //temperature: this.temperature
      });
      let jsonResp = response.data.response.trim()
      console.log("Raw Response from LLM", jsonResp)
      jsonResp = jsonResp.replace(/\\+/g, '')
      jsonResp = jsonResp.replace(/\\/g, '\\\\');
      jsonResp = this.stripJSTicks(jsonResp, "```")
      console.log("after js tocks removal", jsonResp)
      let jsonObj;
      try {
        jsonObj = JSON.parse(jsonResp);
      } catch (e) {
        console.error(e)
        jsonObj = {};
        let firstIdx = jsonResp.indexOf("{")
        if (firstIdx == -1) {
          let idxOfSummary = jsonResp.indexOf("\"Announcement_Summary\"")
          jsonResp = jsonResp.substring(idxOfSummary, jsonResp.length)
          jsonResp = "{" + jsonResp
        }
        let lastIdx = jsonResp.lastIndexOf("}")
        if (lastIdx == -1) jsonResp += "}"
        jsonResp = jsonResp.replace(/\\u[\dA-Fa-f]{4}/g, '');
        
        console.log("post massage", jsonResp)
        jsonObj = JSON.parse(jsonResp)

      }
      let sentiment = -1
      if (jsonObj.Announcement_Sentiment) {
        switch (jsonObj.Announcement_Sentiment.toLowerCase()) {
          case "positive": sentiment = 0; break;
          case "negative": sentiment = 1; break;
          case "neutral": sentiment = 2; break;
        }
      }
      const sentimentQuery = `query stock_announcements($docLink: String!){
  stock_announcements(where: {announcement_document_link: {_like: $docLink}}){
    announcement_sentiment
  }
}`
      
      /*if (true){
        console.log(jsonObj, sentiment)
        return;
      }*/
      try {

        const summaryMutation = `mutation StockAnnouncementUpdate(
  $attachment: String!, 
  $textSummary: String, 
  $impact: String, 
  $sentiment: Int
) {
  update_stock_announcements(
    where: {announcement_document_link: {_like: $attachment}}, 
    _set: {
      announcement_text_summary: $textSummary, 
      announcement_impact: $impact, 
      announcement_sentiment: $sentiment
    }
  ) {
    returning {
      id
    }
  }
}
`
        const summaryObj = {
          "attachment": customData.attachment.trim() + "%",
          "textSummary": jsonObj.Announcement_Summary,
          "impact": jsonObj.Announcement_Impact_On_Business,
          "sentiment": sentiment
        }
        const resp = await postToGraphQL({ "query": summaryMutation, "variables": summaryObj })
        console.log(resp)

      }
      catch (e) {
        console.error(e)
      }
      return jsonResp
    }
    throw new Error(`Unsupported LLM: ${this.llmToUse}`);
  }
}

class LLMResponseHandler {
  constructor(type, llmClient, formatContext) {
    this.type = type;
    this.llmClient = llmClient;
    this.formatContext = formatContext;
  }
  removeDuplicates(array) {
    // If array is empty, return empty array
    if (!array.length) return [];

    // Check if first element is an object
    const isObjectArray = typeof array[0] === 'object' && array[0] !== null;

    if (isObjectArray) {
      // For arrays of objects
      const seen = new Set();
      return array.filter(item => {
        // Create unique key by concatenating all values
        const key = Object.values(item).join('-');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } else {
      // For arrays of primitive values
      return [...new Set(array)];
    }
  }
  async handleResponse(response, sessionId, modelName) {
    if (this.type === 'NoOp') {
      return response;
    } else if (this.type === 'JavaScript') {
      let jsExecResponse = await this.executeJavaScript(response, sessionId, modelName);
      console.log("jsExecResponse", jsExecResponse)
      if (testAgainstFunction !== "") return JSON.stringify(jsExecResponse)
      let { result, functionName } = jsExecResponse
      if (Array.isArray(result) && result.length == 0) return "Sorry, No Results"
      if (!(functionName.toLowerCase().indexOf("mutual_fund") > -1 || 
      functionName.toLowerCase().indexOf("processInsiderTrades".toLowerCase()) > -1
      || functionName.toLowerCase().indexOf("processAnnouncements".toLowerCase()) > -1)) return result
      if (result == "Sorry, No Response") return result;
      if (Array.isArray(result)) result = this.removeDuplicates(result)
      
      if (Array.isArray(result) && result.length > 10) result = result.slice(0, MAX_RESULTS_TO_FORMAT)
        await messageManager.saveMessage(sessionId, modelName, {result}, "results.json")
      let resultString = JSON.stringify(result)
      if (resultString.toLocaleLowerCase().indexOf("javascript") > -1) return "Sorry, No Response"
      let formattingPrompt = `
        You are a result formatter for indian stock market data. 
        In response to a User's Question, the system has generated a Result.  
        create a natural response from the Result, considering the   
        User Question as context, to craft the formatted response. If the Question was not related
        to Indian Stock Market, then format a polite refusal.
        `
      await messageManager.saveMessage(sessionId, modelName, { "role": 'user', content: [{ "type": 'text', "text": `This was the User Question: ${this.formatContext}\n
                      and in response, system generated this Result: ${resultString}
                      Output only your formatted response text, and nothing else. ` }] }, 'messages_formatted.json');

      const messages =  await messageManager.getMessages(sessionId, modelName, 'messages_formatted.json')
      console.log("formattingPrompt", formattingPrompt, messages)
      const formattedResponse = await this.llmClient.sendToLLM(formattingPrompt, messages)
      await messageManager.saveMessage(sessionId, modelName, { "role": 'assistant', content: [{ "type": 'text', "text": formattedResponse }] }, 'messages_formatted.json');

      console.log("formattedResponse", formattedResponse)
      return formattedResponse
    }
    throw new Error(`Unsupported handler type: ${this.type}`);
  }
  async convertToConstFormat(functionText, sessionId, modelName) {
    // Extract the function name and parameters
    const functionMatch = functionText.match(/function\s+(\w+)\s*\((.*?)\)/);
    if (!functionMatch) {
      throw new Error("Invalid function format");
    }

    const [_, functionName, params] = functionMatch;

    // Get the function body (everything between the first { and the last })
    const bodyStart = functionText.indexOf('{');
    const bodyEnd = functionText.lastIndexOf('}');
    const functionBody = functionText.substring(bodyStart, bodyEnd + 1);
    let newFunctionText = `const ${functionName} = function(${params})${functionBody}`
    newFunctionText += `\nmodule.exports = ${functionName}`
    const generatedFileName = `${functionName}_${(new Date()).getTime()}.js`;
    const generatedFilePath = _getFilePath(process.env.LLM_GENERATED_CODE, sessionId, modelName, generatedFileName);
    await _ensureDirectory(generatedFilePath);

    //let generatedFilePath = path.join(GENERATED_FUNCTIONS_PATH, generatedFileName);
    fs.writeFileSync(generatedFilePath, newFunctionText);
    return { functionName, generatedFilePath }
  }
  stripJSTicks(functionText, stringToStrip) {
    const idx = functionText.indexOf(stringToStrip)
    if (idx > -1) functionText = functionText.substring(idx + stringToStrip.length)
    const lastIdx = functionText.lastIndexOf(stringToStrip)
    if (lastIdx > -1)
      return functionText.substring(0, lastIdx)
    else return functionText
  }
  async executeJavaScript(functionText, sessionId, modelName) {
    let result;
    functionText = this.stripJSTicks(functionText, '```')
    functionText = this.stripJSTicks(functionText, '```javascript')
    let lastIdx = functionText.lastIndexOf("}")
    functionText = functionText.substring(0, lastIdx + 1)
    functionText = functionText.trim()
    let functionName;
    let generatedFilePath;
    if (testAgainstFunction !== "") {
      generatedFilePath = testAgainstFunction
      const toks = generatedFilePath.split("/")
      functionName = toks[toks.length - 1].split("_")[0]
    }
    else {
      const functionAndPath = await this.convertToConstFormat(functionText, sessionId, modelName)
      functionName = functionAndPath.functionName
      generatedFilePath = functionAndPath.generatedFilePath
    }
    //const generatedFilePath = path.join(process.env.LLM_GENERATED_CODE, "2025", "02", "06", "8622f154-26ea-47d5-b52d-b3d36fd531ce", "mutual_fund_query_1738834611243.js")
    //const functionName = "mutual_fund_query"
    let mutualFunds = [];
    let stockHoldings = [];
    let mutual_fund_data
    let reporting_dates
    if (functionName === "mutual_fund_query" || functionName === "mutual_fund_stock_holding_query") {
      const mutualFundsAndReportingDates = getMutualFundHoldingsJSONArray()
      mutual_fund_data = mutualFundsAndReportingDates.mutual_fund_data
      reporting_dates = mutualFundsAndReportingDates.reporting_dates
      const normalizedMutualFundsData = normalizeMutualFundsData(mutual_fund_data)
      mutualFunds = normalizedMutualFundsData.mutualFunds
      stockHoldings = normalizedMutualFundsData.stockHoldings
    }
    if (functionName === "processInsiderTrades" || functionName === "processAnnouncements") {
      const today = new Date();
      const toDate = today.toISOString().split("T")[0]
      const fromDate = (new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))).toISOString().split("T")[0]
      const announcementQuery = `query stock_announcements($fromDate: date!, $toDate: date!){
  stock_announcements(where: {announcement_date: {_gte: $fromDate, _lte: $toDate}}){
    stock{
      company_name
      company_sector
    }
    announcement_date
    announcement_text_summary
    announcement_impact
    announcement_sentiment
    announcement_document_link
  }
}`
      let resp = await postToGraphQL({"query": announcementQuery, "variables": {
        fromDate, toDate
      }})
      corporate_announcements = resp.data.stock_announcements.map(a => {
        return {
          company_name: a.stock.company_name,
          company_sector: a.stock.company_sector,
          announcement_date: a.announcement_date,
    announcement_summary: a.announcement_text_summary,
    announcement_impact: a.announcement_impact,
    announcement_sentiment: reverse_mapping_announcement_sentiment[a.announcement_sentiment],
    announcement_link : a.announcement_document_link
        }
      })

      const insiderTradesQuery = `
      query insiderTrades($fromDate: date!, $toDate: date!) {
  insider_trades(where: {transaction_date: {_gte: $fromDate, _lte: $toDate}}){
    name_of_insider
    category_of_insider
    mode_of_transaction
    transaction_type
    shareholding_before_transaction
    shareholding_after_transaction
    transaction_date
    intimation_date
    stock{
      company_name
      company_sector
    }
  }
}
`
resp = await postToGraphQL({"query": insiderTradesQuery, "variables": {
  fromDate, toDate
}})
insider_trades = resp.data.insider_trades.map(a => {
  return {
    company_name: a.stock.company_name,
    company_sector: a.stock.company_sector,
    name_of_insider:  a.name_of_insider,
    type_of_insider: reverse_mapping_category_of_insider[a.category_of_insider],
    exchange: a.exchange,
    transaction_date: a.transaction_date,
    intimation_date: a.intimation_date,
    transaction_type: reverse_mapping_transaction_type[a.transaction_type]
  }
})

    }
    try {
      switch (functionName) {
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
        case "unable_to_classify":
          const unable_to_classify = require(generatedFilePath)
          result = await unable_to_classify()
          break;
        case "processInsiderTrades":
            const processInsiderTrades = require(generatedFilePath)
            result = await processInsiderTrades(insider_trades)
            break;
        case "processAnnouncements":
            const processAnnouncements = require(generatedFilePath)
            result = await processAnnouncements(corporate_announcements)
            console.log("announcement results", result)
            break;   
      }

    } catch (e) {
      console.log("Syntax failed, checking")
      console.error(e)
      result = "Sorry, No Response"
    }
    //if (!Array.isArray(result)) result = [result]
    return { functionName, result }
  }
}

const route = async (req, res) => {
  const sessionId = req.sessionId;
  const { distilledModel, messages, llm, streaming = false, singleShotPrompt = false, customData } = req.body;
  const modelName = distilledModel
  const LLMToUse = llm ? llm : process.env.LLM_TO_USE;
  console.log("reasoning route customData", customData)
  try {
    const PROMPTS_FOLDER = path.join(__dirname, 'prompts');
    const systemPromptPath = path.join(PROMPTS_FOLDER, `${distilledModel}_system_prompt.txt`);
    const systemPrompt = await readFile(systemPromptPath, 'utf-8');

    messageManager = new MessageManager(process.env.LLM_GENERATED_CODE);
    let userLatestMessage = messages[messages.length - 1].content
    let lastResultMessage = await messageManager.getLastMessage(sessionId, modelName, "results.json")
    if (lastResultMessage.result) userLatestMessage = "Result of Previous function execution was : " + JSON.stringify(lastResultMessage.result) + "\n" + messages[messages.length - 1].content
    await messageManager.saveMessage(sessionId, modelName, { "role": 'user', content: [{ "type": 'text', "text": userLatestMessage }] }, 'messages.json');
    
    const llmClient = new LLMClient(LLMToUse);

    let messagesToSend;
    //const llmResponse = await llmClient.sendToLLM(systemPrompt, [{ "role": 'user', content: [{ "type": 'text', "text": messages[messages.length - 1].content }] }]);
    messagesToSend = singleShotPrompt === false ? await messageManager.getMessages(sessionId, modelName, 'messages.json') : [messages[messages.length - 1]]
  
    const llmResponse = await llmClient.sendToLLM(systemPrompt, messagesToSend, customData);
    console.log("llmResponse", llmResponse)
    await messageManager.saveMessage(sessionId, modelName, { "role": 'assistant', "content": [{ "type": 'text', "text": llmResponse }] }, 'messages.json');

    const handlerType = distilledModel.includes('mutual_funds') || distilledModel.includes('stocks') ? 'JavaScript' : 'NoOp';
    const formatContext = messages[messages.length - 1].content; // Pass user query context

    const responseHandler = new LLMResponseHandler(handlerType, llmClient, formatContext);
    const formattedResponse = await responseHandler.handleResponse(llmResponse, sessionId, modelName);
    console.log("formattedResponse", formattedResponse)
    if (true == streaming)
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });


    if (true == streaming) {
      let json;
      const lines = formattedResponse.split("\n")
      for (const line of lines) {
        let sendLine = line;
        if (line.indexOf("https://") > -1) {
          sendLine = line.replace(
              /(https?:\/\/[^\s.]+(?:\.[^\s.]+)*)(?=\.*\s|$)/g,
              '<a href="$1" class="links data-link" target="_blank" rel="noopener noreferrer">$1</a>'
          );
      }
      
        json = { "response": sendLine, "done": false }
        res.write(`data: ${JSON.stringify(json)}\n\n`);
      }
      json = { "response": "", "done": true }
      res.write(`data: ${JSON.stringify(json)}\n\n`);
      res.end();
    }
    else res.json(formattedResponse);
  } catch (error) {
    console.error('Error processing request:', error);
    json = { "response": "Sorry, no response", "done": true }
    res.write(`data: ${JSON.stringify(json)}\n\n`);
    res.end();

  }
};

module.exports = route;
