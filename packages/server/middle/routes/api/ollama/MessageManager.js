class MessageManager {
    constructor() {
        this.conversationHistory = {};
        this.javascriptFunctionHistory = {};
        //this.resultHistory = {};
    }
    addMessagesToHistory(sessionID, userMessage, javascriptFunction, formattedResponse){
        if (!this.conversationHistory[sessionID]) this.conversationHistory[sessionID] = []
        this.conversationHistory[sessionID].push({
            userMessage,
            assistantResponse: formattedResponse
        
            }
        )
        if (!this.javascriptFunctionHistory[sessionID]) this.javascriptFunctionHistory[sessionID] = []
        this.javascriptFunctionHistory.push({
            javascriptFunction
        })
    }
    buildPrompt(sessionID, userMessage) {
        const contextMessages = [];

        if (this.conversationHistory[sessionID]){
        for (let i = 0; i < this.conversationHistory[sessionID].length; i++) {
            contextMessages.push({
                role: "user",
                content: this.conversationHistory[sessionID][i].userMessage
            });

            contextMessages.push({
                role: "system",
                content: `Generated Javascript Function: ${this.javascriptFunctionHistory[sessionID][i]}}`
            });

            contextMessages.push({
                role: "assistant",
                content: this.conversationHistory[sessionID][i].assistantResponse
            });
        }
    }

        /*contextMessages.push({
            role: "system",
            content: `Consider previous questions and their results for context.
                     \n\n${systemPrompt}`
        });*/
        // Add current user message
        contextMessages.push({
            role: "user",
            content: userMessage
        });

        // Add system instruction
        

        return contextMessages;
    }
}
module.exports = MessageManager