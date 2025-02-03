const getLLMResponse = require('./llmResponse')
const MAX_RESULTS_TO_FORMAT = 10

function removeDuplicates(array) {
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
const formatResults = async (result, userQuestion, ollamaModel) => {
    if (result === "" || result.length == 0) return "Sorry, I could not answer"
    if (!Array.isArray(result)) return result 
    
    try{
        result = removeDuplicates(result)
        if (result.length > 10)  result = result.slice(0, MAX_RESULTS_TO_FORMAT)
        let resultString = JSON.stringify(result)
        let base_prompt = `
        You are a result formatter for indian mutual fund data. 
        In response to an Investor's query, create a natural response from the JSON Result.  
        User Query: ${userQuestion}
        \n
        Result: ${resultString}
        \n\n
        Output only your formatted response text, and nothing else.
        `
        //console.log("Sending for formatting", base_prompt)
        const formattedResponse = await getLLMResponse(base_prompt, ollamaModel)
        //console.log("formattedResponse", formattedResponse)
        return formattedResponse    
    }
    catch(err){
        console.log("Error in Syntax Agent")
        console.error(err)
        return ""
    }
    
};
module.exports = formatResults  

