const path = require('path')
const axios = require('axios');
const OLLAMA_URL = process.env.OLLAMA_URL;

const PROMPTS_FOLDER = path.join(__dirname, "prompts")
const fs = require('fs')
const sendPrompt = require('./send_prompt.js')

const route = async (req, res) => {
  try{
    const {model, promptTemplate, query, promptName, operation = 'savePrompt'} = req.body
    const prompt = promptTemplate.replace("{{}}", query)
    if (operation === 'savePrompt') {
      if (!fs.existsSync(PROMPTS_FOLDER)) fs.mkdirSync(PROMPTS_FOLDER)
      const outputFile = PROMPTS_FOLDER + '/' + promptName +'_prompt.txt'
      fs.writeFileSync(outputFile, promptTemplate)
      res.status(200).json('Saved')
      return;  
    }
    else {
      const startTime = new Date()
      console.log('sending prompt', model, prompt)
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
    
  }
  catch(e){
    console.log(e)
    res.status(500).json("Error in prompt")
  }
}
module.exports = route
