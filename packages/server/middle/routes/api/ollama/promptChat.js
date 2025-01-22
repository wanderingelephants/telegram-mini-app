const axios = require('axios');
const OLLAMA_URL = process.env.OLLAMA_URL;
const {initializeOllama} = require('./initOllama')
const PROMPTS_FOLDER = process.env.PROMPTS_FOLDER;
const fs = require('fs')
const path = require('path')
const sendPrompt = require('./send_prompt.js')

const route = async (req, res) => {
  try{
    const {model, messages, promptName, operation = 'sendPrompt'} = req.body
    console.log({model, messages, promptName, operation})
    const prompt_file_name = promptName + "_system_prompt.txt"
    const systemPrompt = fs.readFileSync(path.join(PROMPTS_FOLDER, prompt_file_name), {
      encoding: 'utf8',
      flag: 'r'
    });
    if (operation === 'savePrompt') {
      if (!fs.existsSync(PROMPTS_FOLDER)) fs.mkdirSync(PROMPTS_FOLDER)
      const outputFile = PROMPTS_FOLDER + '/' + promptName +'_system_prompt.txt'
      fs.writeFileSync(outputFile, systemPrompt)
      res.status(200).json('Saved')
      return;  
    }
    else {
      
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
        let prompt = `System:   ${systemPrompt}\n\n`
        prompt += messages.map(msg => 
          `${msg.role === 'user' ? 'Human: ' : 'Assistant: '}${msg.content}`
        ).join('\n') + '\nAssistant:';
        console.log(prompt)
        try {
          const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model,
              prompt: prompt,
              stream: true,
              temperature: 0
            })
          });
      
          if (!response.body) {
            throw new Error('No response body');
          }
      
          // Process the streaming response
          for await (const chunk of response.body) {
            const text = new TextDecoder().decode(chunk);
            const lines = text.split('\n').filter(Boolean);
            
            for (const line of lines) {
              try {
                console.log('line', line)
                const json = JSON.parse(line);
                res.write(`data: ${JSON.stringify(json)}\n\n`);
                if (json.done) {
                  res.end();
                  return;
                }
              } catch (e) {
                console.error('Error parsing JSON:', e);
                if (line.indexOf('"done":true') > -1)
                {
                  let json = {"response": "", "done":  true}
                  res.write(`data: ${JSON.stringify(json)}\n\n`);
                  res.end();
                }
                //res.end();
                //return;
              }
            }
          }
      
        } catch (error) {
          console.error('Error:', error);
          res.write(`data: ${JSON.stringify({ error: 'error' })}\n\n`);
          res.end();
        }
      
    }
    
  }
  catch(e){
    console.log(e)
    res.status(500).json("Error in prompt")
  }
}
module.exports = route
