const path = require('path')
const PROMPTS_FOLDER = path.join(__dirname, "prompts")
const fs = require('fs')
const sendPrompt = require('./send_prompt.js')

const route = async (req, res) => {
  try{
    const {model, promptTemplate, query, promptName, operation = 'savePrompt'} = req.body
    //const prompt = promptTemplate.replace("{{}}", query)
    if (operation === 'savePrompt') {
      if (!fs.existsSync(PROMPTS_FOLDER)) fs.mkdirSync(PROMPTS_FOLDER)
      const outputFile = PROMPTS_FOLDER + '/' + promptName +'_prompt.txt'
      fs.writeFileSync(outputFile, promptTemplate)
      res.status(200).json('Saved')
      return;  
    }
    else {
      const response = await sendPrompt(model , promptName +'_prompt.txt', query)
      res.status(200).json(response)
      return;
    }
    
  }
  catch(e){
    console.log(e)
    res.status(500).json("Error in prompt")
  }
}
module.exports = route
