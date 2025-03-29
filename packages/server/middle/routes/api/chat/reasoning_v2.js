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
const isUnitTest = process.env.IS_MOCK_CHAT === "true" ? true : false
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
  const { activity, messages, customData, chatSessionId } = req.body;
  const email = activity === "stock_market_chat" ? req.user.email : req.body.email
  
  //console.log("reasoning_v2", { email, activity, messages, customData, chatSessionId })
  let streaming
  let userLatestMessage = messages[messages.length - 1].content
  if (userLatestMessage.trim().length  == 0){
    console.log("Recevied Empty message", activity, customData)
    res.status(500).json("Empty message")
    return
  }
  if (activity === "stock_market_chat" && userLatestMessage.length > await getMaxMessageLength(email, activity)) res.status(401).json("msg size")  
  try {  
    const PROMPTS_FOLDER = path.join(__dirname, 'prompts');
    const systemPromptPath = path.join(PROMPTS_FOLDER, `${activity}_system_prompt.txt`);
    let systemPrompt = await readFile(systemPromptPath, 'utf-8');
    if (activity === "stock_market_chat"){
      const cachedArraysDefinition = path.join(process.env.DATA_ROOT_FOLDER, "prompts_fields.json")
      const arrayContent = fs.readFileSync(cachedArraysDefinition, "utf-8")
      systemPrompt = systemPrompt.replace("{{cached_pre_loaded_graphql_fields}}", arrayContent)
      fs.writeFileSync(path.join(process.env.DATA_ROOT_FOLDER, "full_stock_market_chat_prompt.txt"), systemPrompt)
  
    }
    const llmClient = new LLMClient(await getLLMToUse(email, activity), await getModelToUse(email, activity));
    let formattingLLMClient = new LLMClient(await getFormattingLLMToUse(email, activity), await getModelToUse(email, activity))
    let responseHandler;
    let messagesToSend;
    let messageManager;
    let isFirst = false;
    //console.log("chatHistory", chatHistory)
    switch(activity){
        case "stock_market_chat":
            streaming = true
            messageManager = new MessageManager(path.join(dataRootFolder, "generated_functions"));
            const chatHistory = await messageManager.getChatMessages(chatSessionId)
    
        //    if (chatHistory["results"].length > 0) userLatestMessage = `Result of Previous Function Execution was :  ${chatHistory["results"][chatHistory["results"].length - 1].result} .\n Latest User Question: ${messages[messages.length - 1].content}` 
        //try without sending previous execution result. because of chat history, context should still be there. works in  claude console.    
        if (chatHistory["results"].length > 0) userLatestMessage = `User Question: ${messages[messages.length - 1].content}` 
        else isFirst = true
            await messageManager.saveMessage(chatSessionId, activity, { "role": 'user', content: [{ "type": 'text', "text": userLatestMessage }] }, chatMessagesFileName);
            responseHandler = new JavascriptResponseHandler(dbManager, messageManager, formattingLLMClient, activity, messages[messages.length - 1].content, {chatSessionId, email})
            messagesToSend = chatHistory["user_chats"]
            messagesToSend.push({ "role": 'user', content: [{ "type": 'text', "text": userLatestMessage }]})
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
    if (activity === "stock_market_chat") await messageManager.saveMessage(chatSessionId, activity, { "role": 'assistant', "content": [{ "type": 'text', "text": llmResponse }] }, chatMessagesFileName);
    console.log("llmResponse", llmResponse)
    const handlerResponse = await responseHandler.handleResponse(llmResponse)
    const {formattedResponse, result} = handlerResponse
    let chatId;
    const chat_title = messages[messages.length - 1].content; //FIXME this will be summary title of the Question
    if (activity === "stock_market_chat"){
      const resp = await messageManager.updateGQL(chatSessionId, chat_title, email, messages[messages.length - 1].content, llmResponse, JSON.stringify(result), formattedResponse, isFirst)
      chatId = resp.data.insert_user_chat_one.id  
    } if (true == streaming) {
      let json;
      const lines = formattedResponse.split("\n")
      for (const line of lines) {
        let sendLine = line;
        /*if (line.indexOf("https://") > -1) {
          sendLine = line.replace(
            /(https?:\/\/[^\s.]+(?:\.[^\s.]+)*)(?=\.*\s|$)/g,
            '<a href="$1" class="links data-link" target="_blank" rel="noopener noreferrer">$1</a>'
          );
        }*/
        json = { "response": sendLine, "done": false }
        res.write(`data: ${JSON.stringify(json)}\n\n`);
      }
      /*json = { "response": `<div style="display: flex; align-items: center;">
  <span   
  style="background-color: #ff3b30; 
         color: white; 
         padding: 4px 10px; 
         padding-left: 12px;
         border: none; 
         border-radius: 6px; 
         cursor: pointer; 
         font-weight: 500; 
         font-size: 14px;
         box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
         display: inline-flex;
         align-items: center;
         justify-content: center;
         height: 32px;
         line-height: 1px;
         text-align: center;
         white-space: nowrap;"
  data-action="set-alert"
  data-chatuuid="${chatSessionId}"
  data-chatid="${chatId}"
>
  Save
</span>

  <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  style="margin-left: 8px; fill: #2196F3; cursor: pointer;"
  data-action="show-snackbar"
  data-message="After Saving, you can run this like a Tabular Report, and also schedule it. Most Cost-Effective way for commonly used prompts. Think of it as a Saved Screen/Adhoc Report, in other systems."
>
  <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
</svg>
</div>`, "done": false }
        res.write(`data: ${JSON.stringify(json)}\n\n`);*/
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
