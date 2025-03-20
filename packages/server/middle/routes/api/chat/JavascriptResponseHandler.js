const path = require("path")
const fs = require("fs")
const { pre_populated_arrays } = require("./DatabaseManager")
const dataFolder = process.env.DATA_ROOT_FOLDER
const MAX_RESULTS_TO_FORMAT = 10
const _getFilePath = function (basePath, chatSessionId, activity, filename) {
    const date = new Date();
    const year = date.getFullYear() + "";
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return path.join(basePath, year, month, day, chatSessionId, activity, filename);
}
class JavascriptResponseHandler {
    constructor(dbManager, messageManager, formattingLLMClient, activity, userQuery, customData, testAgainstFunction) {
        this.dbManager = dbManager
        this.messageManager = messageManager
        this.formattingLLMClient = formattingLLMClient
        this.activity = activity
        this.userQuery = userQuery
        this.customData = customData //primarily email of user to get his portfoliio, which cant be obtained at bootstrap load data
        this.testAgainstFunction = testAgainstFunction
    }
    stripJSTicks(functionText, stringToStrip) {
        const idx = functionText.indexOf(stringToStrip)
        if (idx > -1) functionText = functionText.substring(idx + stringToStrip.length)
        const lastIdx = functionText.lastIndexOf(stringToStrip)
        if (lastIdx > -1)
            return functionText.substring(0, lastIdx)
        else return functionText
    }
    async convertToConstFormat(functionText) {
        let functionName = "general_query"
        let startIdx = functionText.indexOf("const analysis")
        let gqlImportPrefix = ""
        if (startIdx > -1) {
            functionName = "analysis"
            const endIndex = functionText.lastIndexOf("}")
            functionText = functionText.substring(startIdx, endIndex + 1)
            gqlImportPrefix = "const {postToGraphQL} = require(process.env.GRAPHQL_MODULE_PATH)"
        }
        else {
            startIdx = functionText.indexOf("const general_query")
            const endIndex = functionText.lastIndexOf("}")
            functionText = functionText.substring(startIdx, endIndex + 1)
        }
        functionText += `\nmodule.exports = ${functionName}`
        const generatedFileName = `${functionName}_${(new Date()).getTime()}.js`;
        const generatedFilePath = _getFilePath(path.join(dataFolder, "generated_functions"), this.customData.chatSessionId, this.activity, generatedFileName);
        fs.writeFileSync(generatedFilePath, `${gqlImportPrefix}\n${functionText}`);
        return { functionName, generatedFilePath }
    }
    async executeJavaScript(functionText) {
        let result;
        functionText = this.stripJSTicks(functionText, '```javascript')
        functionText = this.stripJSTicks(functionText, '```')
        let lastIdx = functionText.lastIndexOf("}")
        functionText = functionText.substring(0, lastIdx + 1)
        functionText = functionText.trim()
        let functionName;
        let generatedFilePath;
        /*if (this.testAgainstFunction !== "") {
            generatedFilePath = testAgainstFunction
            const toks = generatedFilePath.split("/")
            functionName = toks[toks.length - 1].split("_")[0]
        }
        else {*/
        const functionAndPath = await this.convertToConstFormat(functionText)
        functionName = functionAndPath.functionName
        generatedFilePath = functionAndPath.generatedFilePath
        //}
        
        try {
            switch (functionName) {
                case "general_query":
                    const general_query = require(generatedFilePath)
                    result = await general_query()
                    break;
                case "analysis":
                    const analysis = require(generatedFilePath)
                    const pre_populated_arrays = await this.dbManager.getData()
                    const user_stock_portfolio = await this.dbManager.getUserStockPortfolio(this.customData.email)
                    pre_populated_arrays["user_stock_portfolio"] = user_stock_portfolio
                    result = await analysis(pre_populated_arrays)
                    console.log("JS Result", result)
                    break;
            }

        } catch (e) {
            console.log("JavascriptResponseHander error")
            console.error(e)
            result = "Sorry, No Response"
        }
        return { functionName, result }
    }
    async handleResponse(llmResponse) {
        let formattedResponse;
        let jsExecResponse = await this.executeJavaScript(llmResponse);
        let { result, functionName } = jsExecResponse
        if (result == "Sorry, No Response") return {formattedResponse, result}
        if (Array.isArray(result) && result.length > 10) result = result.slice(0, MAX_RESULTS_TO_FORMAT)
        await this.messageManager.saveMessage(this.customData.chatSessionId, this.activity, { result }, "results.json")

        let resultString = JSON.stringify(result)
        if (resultString.toLocaleLowerCase().indexOf("javascript") > -1) return "Sorry, No Response"
        let formattingPrompt = `
                You are a result formatter for indian stock market data. 
                In response to a User's Question, the system has generated a Result.  
                create a natural response from the Result, considering the   
                User Question as context, to craft the formatted response. If the Question was not related
                to Indian Stock Market, then format a polite refusal. Some times system generated response may 
                contain software terms like 'function' 'javascript'. Remove them before crafting your response. End users are non-technical
                non-programming background, hence response needs to be plain english.
                `
        await this.messageManager.saveMessage(this.customData.chatSessionId, this.activity, {
            "role": 'user', content: [{
                "type": 'text', "text": `This was the User Question: ${this.userQuery}\n
                              and in response, system generated this Result: ${resultString}
                              Output only your formatted response text, and nothing else. ` }]
        }, 'messages_formatted.json');

        //const messages = await this.messageManager.getMessages(this.customData.chatSessionId, this.activity, 'messages_formatted.json')

       
        if (functionName === "analysis"){
            const chatHistory = await this.messageManager.getChatMessages(this.customData.chatSessionId)
            const messagesToSendToFormatter = chatHistory["formatted_responses"]
            messagesToSendToFormatter.push({
                "role": "user",
                "content": [{
                    "type": "text",
                    "text": `This is the User Question: ${this.userQuery} . In response to the User Question, the system generated this data: ${JSON.stringify(result)} . \n Output only your formatted response text, and nothing else. `
                }]
            })
            formattedResponse = await this.formattingLLMClient.sendMessageToLLM(formattingPrompt, messagesToSendToFormatter)
        }
        else if (functionName === "general_query") formattedResponse = result
        else formattedResponse = "No Response"
        await this.messageManager.saveMessage(this.customData.chatSessionId, this.activity, { "role": 'assistant', content: [{ "type": 'text', "text": formattedResponse }] }, 'messages_formatted.json');

        console.log("formattedResponse", formattedResponse)
        return {formattedResponse, result}

    }
}
module.exports = JavascriptResponseHandler