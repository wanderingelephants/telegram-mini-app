const fs = require('fs')
const getLLMResponse = require('./llmResponse')
const path = require('path')
const GENERATED_FUNCTIONS_PATH = process.env.GENERATED_FUNCTIONS_PATH

const fixSyntaxError = async (functionFilePath, stack, ollamaModel) => {
    let generatedFilePath = ""
    try{
        let base_prompt = "You are  a javascript programmer. The function given below breaks with an error listed below. \n\n"
        let moduleCode = fs.readFileSync(functionFilePath, 'utf-8');
        base_prompt += '\nThis is the  function:\n'
        base_prompt += moduleCode
        base_prompt +=  '\n\nThis is  the error : \n' + stack
        base_prompt += '\n\n\nYour Task: Fix the error, and output the function code again. Output only the function code, and nothing else'
        const functionText = await getLLMResponse(base_prompt, ollamaModel);
        const generatedFileName = (new Date()).getTime() + ".js";
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

