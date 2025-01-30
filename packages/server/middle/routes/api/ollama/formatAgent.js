const getLLMResponse = require('./llmResponse')
const MAX_RESULTS_TO_FORMAT = 10

const formatResults = async (result, userQuestion, ollamaModel) => {
    if (result === "" || result.length == 0) 
    if (!Array.isArray(result)) return "Sorry, No Response" 
    
    try{
        if (result.length > 10)  result = result.slice(0, MAX_RESULTS_TO_FORMAT)
        let resultString = JSON.stringify(result)
        let base_prompt = `
        You are a result formatter for indian mutual fund data. 
        In response to an Investor's query, create a natural response from the JSON Result.  
        User Query: ${userQuestion}
        \n
        JSON Result: ${resultString}
        \n\n
        Output only your formatted response text, and nothing else.
        `
        console.log("Sending for formatting", base_prompt)
        const formattedResponse = await getLLMResponse(base_prompt, ollamaModel)
        console.log("formattedResponse", formattedResponse)
        return formattedResponse    
    }
    catch(err){
        console.log("Error in Syntax Agent")
        console.error(err)
        return ""
    }
    
};
module.exports = formatResults  

