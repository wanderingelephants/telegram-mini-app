const axios = require('axios');
const model = process.env.OLLAMA_MODEL || 'llama3.2';
const OLLAMA_URL = process.env.OLLAMA_URL;;  // Adjust this to your Ollama container URL
//const { initializeOllama } = require('./initOllama');
const fs = require('fs');
const path = require('path');

const formatResults = async function(userQuery, sqlQuery, dbResults){
    //await initializeOllama(model)
    const promptTemplate = fs.readFileSync(
      path.join(__dirname, 'format_results_prompt.txt'),
      'utf8'
    );
    let PROMPT = promptTemplate.replace('{{USER_QUERY}}', userQuery);
    PROMPT = PROMPT.replace('{{RESULTS}}', JSON.stringify(dbResults));
    console.log("Format prompt", PROMPT)
    try {
        const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
          model,
          prompt: PROMPT,
          stream: false
        });
        //return response.data.response.trim()
        console.log(response.data.response.trim())
        
        return response.data.response.trim();
      } catch (error) {
        console.error('Classification error:', error);
        return "No Results";
      }
}
module.exports = formatResults