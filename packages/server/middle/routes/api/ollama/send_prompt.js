const axios = require('axios');
const OLLAMA_URL = process.env.OLLAMA_URL;
const { initializeOllama } = require('./initOllama')
const PROMPTS_FOLDER = process.env.PROMPTS_FOLDER;
const path = require('path')
const fs = require('fs')

const sendPrompt = async (model, prompt_file_name, query) => {
  try {
    const promptTemplate = fs.readFileSync(path.join(PROMPTS_FOLDER, prompt_file_name), {
      encoding: 'utf8',
      flag: 'r'
    });
    const prompt = promptTemplate.replace("{{}}", query);
    console.log(prompt);
    
    await initializeOllama(model)
    const startTime = new Date()
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model,
      prompt,
      stream: false
    });
    const endTime = new Date()
    console.log(response.data.response.trim())
    console.log("Time Taken", (endTime - startTime))
    return (response.data.response.trim())
  }
  catch (e) {
    console.log(e)
    let errorResponse = {
      "SQL_Can_Answer": "NO",
      "SQL": "",
      "General_Answer": "No Response"
    }
    return JSON.stringify(errorResponse)
  }
}
module.exports = sendPrompt
