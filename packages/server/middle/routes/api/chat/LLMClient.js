const axios = require("axios")
const { Anthropic } = require('@anthropic-ai/sdk');  
const fs = require("fs");
const path = require("path")
let cacheManager;
const {
    GoogleGenerativeAI
  } = require("@google/generative-ai");
  const {
    GoogleAICacheManager,
    GoogleAIFileManager,
  } = require("@google/generative-ai/server")
//Sends a chat request and sends back response. For Instruct also use chat model with  
//sytem prompt and single message
async function initiateCache(){
    console.log("initializeCache", process.env.LLM_TO_USE)
    if (process.env.LLM_TO_USE !== "GeminiCache") return;
                cacheManager = new GoogleAICacheManager(process.env.GEMINI_API_KEY, 3600*1000);
                const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
                const fileData = `${process.env.DATA_ROOT_FOLDER}/full_prompt.txt`;//fs.readFileSync(`${process.env.DATA_ROOT_FOLDER}/full_prompt.txt`)
                
                //console.log(fileData)
                const uploadResult = await fileManager.uploadFile(fileData, {
                    mimeType: "text/plain",
                });
                console.log("uploadResult", uploadResult)
                
                //const listFiles = await fileManager.listFiles()
                const cacheResult = await cacheManager.create({
                    model: `models/gemini-1.5-flash-001`,
                    contents: [
                      {
                        role: "user",
                        parts: [
                          {
                            fileData: {
                              fileUri: uploadResult.file.uri,
                              mimeType: uploadResult.file.mimeType,
                            },
                          },
                        ],
                      },
                    ],
                  });
                  console.log(cacheResult)
                  const cacheName = cacheResult.name;
                  return {cacheName}
                
}
class LLMClient {
    constructor(llmToUse, langModel) {
        console.log("LLMClient constructor", { llmToUse, langModel })
        this.llmToUse = llmToUse
        this.langModel = langModel //'claude-3-5-haiku-20241022'
        this.temperature = 0
        this.initiateCache().then(resp => this.cacheName = resp.cacheName)
    }
    
    //some models like Gemini take message separately and  have history object for n-1 messages
    async sendMessageToLLM(systemPrompt, messages) {
        const llmStructuredMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content[0].text // dynamically wrapping in a string
        }));

        let llmResponse = "";
        switch (this.llmToUse) {
            case 'Claude':
                try {
                    const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
                    const resp = await anthropic.messages.create({
                        model: this.langModel,
                        max_tokens: 1024,
                        system: [{
                            "type":"text",
                            "text": systemPrompt,
                            "cache_control": {"type": "ephemeral"}
                        }
                            
                        ],
                        messages: llmStructuredMessages,
                        temperature: this.temperature
                    });
                    console.log("LLM Full Response", resp)
                    llmResponse = resp.content[0].text.trim();
                }
                catch (e) {
                    console.error(e)
                }
                break
            case 'GeminiCache':
                try{
                    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                    const getCacheResult = await cacheManager.get(this.cacheName);
                      const model = genAI.getGenerativeModelFromCachedContent(getCacheResult);  
                    const generationConfig = {
                        temperature: 0,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 16384,
                        responseModalities: [],
                        responseMimeType: "text/plain"
                    };
                    const historyMessages = messages.length > 2 ? messages.slice(0, messages.length - 1) : messages
                    const history = historyMessages.map(msg => ({
                        role: msg.role === "user" ? "user" : "model",
                        parts: [{"text": msg.content[0].text}] // dynamically wrapping in a string
                    }));
                    const chatSession = model.startChat({
                        generationConfig,
                        history:  history
                    })
                    const result = await chatSession.sendMessage(messages[messages.length-1].content[0].text);
                    llmResponse = result.response.text()
                    
                }
                catch(e){
                    console.error(e)
                }
                break    
            case 'Gemini':
                try{
                
                    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                    const model = genAI.getGenerativeModel({model: this.langModel, systemInstruction: systemPrompt});
                    
                    const generationConfig = {
                        temperature: 0,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 16384,
                        responseModalities: [],
                        responseMimeType: "text/plain"
                    };
                    const historyMessages = messages.length > 2 ? messages.slice(0, messages.length - 1) : messages
                    const history = historyMessages.map(msg => ({
                        role: msg.role === "user" ? "user" : "model",
                        parts: [{"text": msg.content[0].text}] // dynamically wrapping in a string
                    }));
                    const chatSession = model.startChat({
                        generationConfig,
                        history:  history
                    })
                    const result = await chatSession.sendMessage(messages[messages.length-1].content[0].text);
                    llmResponse = result.response.text()
                }
                catch(e){
                    console.error(e)
                }
                break    
            case 'Ollama':
                try {
                    const finalPrompt = systemPrompt.replace("{{text_replace}}", messages[0].content)
                    const response = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, {
                        model: this.langModel,
                        prompt: finalPrompt,
                        stream: false,
                        temperature: this.temperature
                    });
                    llmResponse = response.data.response.trim()
                }
                catch (e) {
                    console.error(e)
                }
                break;

            case 'JavascriptMockLLM':
                //const filePath = path.join(process.env.DATA_ROOT_FOLDER, "generated_functions/2025/03/07/8de3ffe0-b388-4491-a302-7f6f0aa60ded/stock_market_chat", "analysis_1741321347634.js")
                //const fileContent = fs.readFileSync(filePath, "utf-8")
                llmResponse = `
const analysis = function(pre_populated_arrays) {
    return [{"company_name": "Infy", "company_sector": "IT"},{"company_name": "Infy", "company_sector": "IT"},{"company_name": "Infy", "company_sector": "IT"},{"company_name": "Infy", "company_sector": "IT"},{"company_name": "Infy", "company_sector": "IT"}]
}
`
                break;

            case 'FormatMockLLM':
                llmResponse = 'For the corporate announcement by <a href="http://localhost/company/ACC">ACC Ltd</a> dated March 21, 2025, you can access the official document at: https://nsearchives.nseindia.com/corporate/RAVIDAMLE_28032025164527_KCL_intimationof_tradingwindowclosure.pdf'
                break;

            case 'SummaryMockLLM':
                llmResponse = `{
                "Announcement_Summary" : "This is the mock announcement summary text",
                "Annnouncement_Impact_On_Business": "Mock impact on business",
                "Announcement_Sentiment": "Positive",
                "isMock": true
            }`
                break;
        }

        return llmResponse
    }
}
module.exports = LLMClient
initiateCache()