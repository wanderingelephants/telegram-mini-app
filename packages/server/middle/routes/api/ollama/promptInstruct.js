const path = require('path')
const axios = require('axios');
const OLLAMA_URL = process.env.OLLAMA_URL;

const PROMPTS_FOLDER = path.join(__dirname, "prompts")
const fs = require('fs')
const sendPrompt = require('./send_prompt.js')
const mutual_fund_data = require('./mf_holdings.json')
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
      let resp = response.data.response.trim()
      if (resp.startsWith("```javascript")){
        resp = resp.substring("```javascript".length, resp.length)
        if (resp.endsWith("```")) resp = resp.substring(0, resp.length-3)
      }
    console.log(resp)
      const parsedResponse = resp; //.replaceAll("\n", "")
      console.log("Time Taken", (endTime - startTime))
      console.log(parsedResponse)
      //const parsedResponse = JSON.parse(resp);
        //console.log(parsedResponse)
        // Extract and evaluate the JS code
        const analyzeFunction = eval(`(${parsedResponse})`);
        
        // Execute analysis
      const result = analyzeFunction(mutual_fund_data);
      console.log(result)
      res.status(200).json(result)
    }
    
  }
  catch(e){
    console.log(e)
    res.status(500).json("Error in prompt")
  }
}
module.exports = route
