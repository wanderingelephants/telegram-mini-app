const fs = require('fs');
const axios = require("axios")
const path = require('path');
const {getMutualFundHoldingsJSONArray, normalizeMutualFundsData} = require('../mutualfunds/getData')
const MAX_RESULTS_TO_FORMAT = 10
const {postToGraphQL} = require("../../../lib/helper")
const { Anthropic } = require('@anthropic-ai/sdk');
const util = require('util');
//const { json } = require('stream/consumers');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const _getFilePath = function(basePath, sessionId, filename) {
    const date = new Date();
    const year = date.getFullYear() + "";
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return path.join(basePath, year, month, day, sessionId, filename);
  }
const _ensureDirectory = async function(filePath) {
    const dir = path.dirname(filePath);
    await mkdir(dir, { recursive: true });
}

class MessageManager {
  constructor(basePath) {
    this.basePath = basePath;
  }

  async saveMessage(sessionId, message) {
    const filePath = _getFilePath(this.basePath, sessionId, 'messages.json');
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
  async getMessages(sessionId){
    const filePath = _getFilePath(this.basePath, sessionId, 'messages.json');
    let messages = [];
    try {
      const data = await readFile(filePath, 'utf-8');
      messages = JSON.parse(data);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    return messages
  }

  
  
}

class LLMClient {
  constructor(llmToUse) {
    this.llmToUse = llmToUse;
    this.temperature = 0;
  }

  async sendToLLM(systemPrompt, messages, customData) {
    const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content[0].text // dynamically wrapping in a string
      }));
      console.log("sendtoLLM", systemPrompt.substring(0, 20), JSON.stringify(formattedMessages))
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
    if (this.llmToUse === "Ollama"){
        let model = process.env.OLLAMA_MODEL
        const finalPrompt = systemPrompt.replace("{{text_replace}}", messages[0].content)
        //console.log(finalPrompt)
        const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
                model,
                prompt: finalPrompt,
                stream: false,
                //temperature: this.temperature
              });
        let jsonResp = response.data.response.trim() 
        console.log("Raw Response from LLM", jsonResp)
        //jsonResp = jsonResp.replaceAll("```", "")
        let jsonObj;
        try {
            jsonObj = JSON.parse(jsonResp);
          } catch (e) {
            jsonObj = {};
            let firstIdx = jsonResp.indexOf("{")
            if (firstIdx == -1) {
              let idxOfSummary = jsonResp.indexOf("\"Announcement_Summary\"")
              jsonResp = jsonResp.substring(idxOfSummary, jsonResp.length)
              jsonResp = "{" + jsonResp
            }
            let lastIdx = jsonResp.indexOf("}")
            if (lastIdx == -1) jsonResp += "}"
            jsonObj = JSON.parse(jsonResp)
            
          }
          let sentiment = -1
          switch (jsonObj.Announcement_Sentiment.toLowerCase()){
            case "positive" : sentiment = 0; break;
            case "negative" : sentiment = 1; break;
            case "neutral"  : sentiment = 2;  break;
          }
          /*if (true){
            console.log(jsonObj, sentiment)
            return;
          }*/
            try{
                
            const summaryMutation = `mutation StockAnnouncementUpdate(
  $attachment: String!, 
  $textSummary: String, 
  $impact: String, 
  $sentiment: Int
) {
  update_stock_announcements(
    where: {annoucement_document_link: {_like: $attachment}}, 
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
                "attachment": customData.attachment.trim()+"%",
  "textSummary": jsonObj.Announcement_Summary,
  "impact": jsonObj.Announcement_Impact_On_Business,
  "sentiment": sentiment
}   
            const resp = await postToGraphQL({"query": summaryMutation, "variables": summaryObj})  
            console.log(resp)
        
        }
        catch(e){
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
  async handleResponse(response, sessionID) {
    if (this.type === 'NoOp') {
      return response;
    } else if (this.type === 'JavaScript') {
      let jsExecResponse = await this.executeJavaScript(response, sessionID);
      let {result, functionName} = jsExecResponse
      if (functionName.toLowerCase().indexOf("mutual_fund") === -1) return result
      if (result == "Sorry, No Response") return result;
      result = this.removeDuplicates(result)
      if (result.length == 0) return "Sorry, No Results"
        if (result.length > 10)  result = result.slice(0, MAX_RESULTS_TO_FORMAT)
        let resultString = JSON.stringify(result)
        if (resultString.toLocaleLowerCase().indexOf("javascript") > -1) return "Sorry, No Response"
        let formattingPrompt = `
        You are a result formatter for indian mutual fund data. 
        In response to a User's query, create a natural response from the Result.  
        Output only your formatted response text, and nothing else.
        This is the Result: ${resultString}\n
        Use the User question message as context to craft the formatted response.
        `
      const messages = [
      {
            "role": "user",
                "content": [
                {
                    "type": "text",
                    "text": this.formatContext
                    //"text": "Please format the query results"
                }
            ]
        }
        ]
      const formattedResponse = await this.llmClient.sendToLLM(formattingPrompt, messages)
      return formattedResponse
    } 
    throw new Error(`Unsupported handler type: ${this.type}`);
  }
  async convertToConstFormat(functionText, sessionId) {
    // Extract the function name and parameters
    const functionMatch = functionText.match(/function\s+(\w+)\s*\((.*?)\)/);
    if (!functionMatch) {
        throw new Error("Invalid function format");
    }
    
    const [_, functionName, params] = functionMatch;
    
    // Get the function body (everything between the first { and the last })
    const bodyStart = functionText.indexOf('{');
    const bodyEnd = functionText.lastIndexOf('}');
    const functionBody = functionText.substring(bodyStart, bodyEnd+1);
    let newFunctionText = `const ${functionName} = function(${params})${functionBody}`
    newFunctionText +=  `\nmodule.exports = ${functionName}`
    const generatedFileName = `${functionName}_${(new Date()).getTime()}.js`;
    const generatedFilePath = _getFilePath(process.env.LLM_GENERATED_CODE, sessionId, generatedFileName);
    await _ensureDirectory(generatedFilePath);

    //let generatedFilePath = path.join(GENERATED_FUNCTIONS_PATH, generatedFileName);
    fs.writeFileSync(generatedFilePath, newFunctionText);
    return  {functionName, generatedFilePath}
  }
   stripJSTicks(functionText, stringToStrip) {
    const idx = functionText.indexOf(stringToStrip)
    if (idx > -1) functionText =functionText.substring(idx+stringToStrip.length)
    const lastIdx = functionText.lastIndexOf(stringToStrip)
    if (lastIdx > -1)
      return functionText.substring(0, lastIdx)
    else return functionText
  }
  async executeJavaScript(functionText, sessionID) {
    let result;
    functionText = this.stripJSTicks(functionText, '```')
    functionText = this.stripJSTicks(functionText, '```javascript')
    let lastIdx = functionText.lastIndexOf("}")
    functionText = functionText.substring(0, lastIdx+1)
    functionText = functionText.trim()
    const {functionName, generatedFilePath} = await this.convertToConstFormat(functionText, sessionID)
    //const generatedFilePath = path.join(process.env.LLM_GENERATED_CODE, "2025", "02", "06", "8622f154-26ea-47d5-b52d-b3d36fd531ce", "mutual_fund_query_1738834611243.js")
    //const functionName = "mutual_fund_query"
    let mutualFunds = []; 
    let stockHoldings = [];
    let mutual_fund_data
    let reporting_dates
    if (functionName === "mutual_fund_query" || functionName === "mutual_fund_stock_holding_query"){
        const mutualFundsAndReportingDates = getMutualFundHoldingsJSONArray()
        mutual_fund_data = mutualFundsAndReportingDates.mutual_fund_data
        reporting_dates = mutualFundsAndReportingDates.reporting_dates
        const normalizedMutualFundsData = normalizeMutualFundsData(mutual_fund_data)
        mutualFunds = normalizedMutualFundsData.mutualFunds
        stockHoldings = normalizedMutualFundsData.stockHoldings
    }
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
        
      } catch (e) {
        console.log("Syntax failed, checking")
        console.error(e)
        result = "Sorry, No Response"
      }
      return {functionName, result}
  }

  async executeSQL(query) {
    
  }
}

const route = async (req, res) => {
  const sessionId = req.sessionId;
  const { distilledModel, messages , llm, streaming = false, singleShotPrompt = false, customData } = req.body;
  const LLMToUse = llm ? llm : process.env.LLM_TO_USE;
    console.log("reasoning route customData", customData)
  try {
    const PROMPTS_FOLDER = path.join(__dirname, 'prompts');
    const systemPromptPath = path.join(PROMPTS_FOLDER, `${distilledModel}_system_prompt.txt`);
    const systemPrompt = await readFile(systemPromptPath, 'utf-8');

    const messageManager = new MessageManager(process.env.LLM_GENERATED_CODE);
    await messageManager.saveMessage(sessionId, { "role": 'user', content: [{ "type": 'text', "text": messages[messages.length - 1].content }] });

    const llmClient = new LLMClient(LLMToUse);
    
    let messagesToSend;
    //const llmResponse = await llmClient.sendToLLM(systemPrompt, [{ "role": 'user', content: [{ "type": 'text', "text": messages[messages.length - 1].content }] }]);
    messagesToSend = singleShotPrompt === false ? await messageManager.getMessages(sessionId) : [messages[messages.length - 1]]
    const llmResponse = await llmClient.sendToLLM(systemPrompt, messagesToSend, customData);
    
    console.log("llmResponse", llmResponse)
    await messageManager.saveMessage(sessionId, { "role": 'assistant', "content": [{ "type": 'text', "text": llmResponse }] });

    const handlerType = distilledModel.includes('mutual_funds') || distilledModel.includes('stocks') ? 'JavaScript' : 'NoOp';
    const formatContext = messages[messages.length - 1].content; // Pass user query context
    
    const responseHandler = new LLMResponseHandler(handlerType, llmClient, formatContext);
    const formattedResponse = await responseHandler.handleResponse(llmResponse, sessionId);

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
    console.error('Error processing request:', error);
    json = { "response": "Sorry, no response", "done": true }
    res.write(`data: ${JSON.stringify(json)}\n\n`);
    res.end();
    
  }
};

module.exports = route;
