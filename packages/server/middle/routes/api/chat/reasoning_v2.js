const fs = require('fs');
const path = require('path');
const util = require('util');
const dbManager = require("./DatabaseManager");
const MessageManager = require("./MessageManager")
const JavascriptResponseHandler = require("./JavascriptResponseHandler")
const AnnouncementSummaryResponseHandler = require("./AnnouncementSummaryResponseHandler")
const LLMClient = require("./LLMClient")
const readFile = util.promisify(fs.readFile);
const chatMessagesFileName = "chat_messages.json"
const execResultsFileName = "results.json"
const dataRootFolder = process.env.DATA_ROOT_FOLDER
const isUnitTest = false
const getLLMToUse = async (email, activity) => {
    return  isUnitTest === true ? (activity === "stock_market_chat" ? "JavascriptMockLLM" : "SummaryMockLLM") : process.env.LLM_TO_USE
}
const getFormattingLLMToUse = async (email, activity) => {
    return  isUnitTest === true ? "FormatMockLLM" : process.env.LLM_TO_USE
}
const getModelToUse = async(email, activity) => {
    return  process.env.LLM_MODEL
}
const getMaxMessageLength = async(email, activity) => {
  return  1000
}
const route = async (req, res) => {
  const sessionId = req.sessionId;
  const { email, activity, messages, customData } = req.body;
  console.log("reasoning_v2", { email, activity, messages, customData })
  let streaming
  let userLatestMessage = messages[messages.length - 1].content
  if (userLatestMessage.length > await getMaxMessageLength(email, activity)) res.status(401).json("msg size")  
  try {  
    const PROMPTS_FOLDER = path.join(__dirname, 'prompts');
    const systemPromptPath = path.join(PROMPTS_FOLDER, `${activity}_system_prompt.txt`);
    const systemPrompt = await readFile(systemPromptPath, 'utf-8');
    const llmClient = new LLMClient(await getLLMToUse(email, activity), await getModelToUse(email, activity));
    let formattingLLMClient = new LLMClient(await getFormattingLLMToUse(email, activity), await getModelToUse(email, activity))
    let responseHandler;
    let messagesToSend;
    const messageManager = new MessageManager(path.join(dataRootFolder, "generated_functions"));
    switch(activity){
        case "stock_market_chat":
            streaming = true
            let lastResultMessage = await messageManager.getLastMessage(sessionId, activity, execResultsFileName)
            if (lastResultMessage.result) userLatestMessage = "Result of Previous function execution was : " + JSON.stringify(lastResultMessage.result) + "\n" + userLatestMessage
            await messageManager.saveMessage(sessionId, activity, { "role": 'user', content: [{ "type": 'text', "text": userLatestMessage }] }, chatMessagesFileName);
            responseHandler = new JavascriptResponseHandler(dbManager, messageManager, formattingLLMClient, activity, userLatestMessage, {sessionId, email})
            messagesToSend = await messageManager.getMessages(sessionId, activity, chatMessagesFileName)
            break
        case "announcements_summary": 
            streaming = false
            responseHandler = new AnnouncementSummaryResponseHandler(customData)
            messagesToSend =  [messages[messages.length - 1]]
            break    
    }
    if (true == streaming)
        res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
    
    const llmResponse = await llmClient.sendMessageToLLM(systemPrompt, messagesToSend, customData);
    if (activity === "stock_market_chat") await messageManager.saveMessage(sessionId, activity, { "role": 'assistant', "content": [{ "type": 'text', "text": llmResponse }] }, chatMessagesFileName);
    console.log("llmResponse", llmResponse)
    const formattedResponse = await responseHandler.handleResponse(llmResponse)
    
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
    else res.status(200).json(formattedResponse);

  } catch (error) {
    console.error('Error processing request:', error);
    json = { "response": "Sorry, no response", "done": true }
    if (true == streaming) {
        res.write(`data: ${JSON.stringify(json)}\n\n`);
        res.end();
    }
    else {
        res.status(500).json(error)
    }

  }
};

module.exports = route;
