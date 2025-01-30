const fs = require('fs')
const getLLMResponse = require('./llmResponse')

const fixSyntaxError = async (functionFilePath, stack) => {
    let generatedFilePath = ""
    try{
        let base_prompt = "You are  a javascript programmer. The module given below has a syntax problem. \n\n"
        let moduleCode = fs.readFileSync(functionFilePath, 'utf-8');
        base_prompt += moduleCode
        base_prompt +=  '\n\nThis is  the error : \n' + stack
        base_prompt += '\n\n\nYour Task: Fix the error, and output the function code again. Output only the function code, and nothing else'
        const functionText = await getLLMResponse(base_prompt, ollamaModel)
        generatedFilePath = path.join(GENERATED_FUNCTIONS_PATH, generatedFileName);
        fs.writeFileSync(generatedFilePath, functionText);
        return generatedFilePath    
    }
    catch(err){
        console.log("Error in Syntax Agent")
        console.error(err)
        return ""
    }
    
};
module.exports = fixSyntaxError   

