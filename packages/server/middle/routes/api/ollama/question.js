const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', {  });
const { Pinecone } = require('@pinecone-database/pinecone');
const { Anthropic } = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const axios = require('axios');
const fs = require('fs')
require('dotenv').config();
const path = require('path')
const PROMPTS_FOLDER = path.join(__dirname, "prompts")

let holding_data = []
const pinecone = new Pinecone({
 apiKey: process.env.PINECONE_API_KEY,
 //environment: process.env.PINECONE_ENVIRONMENT
});
const getMutualFundHoldingsJSONArray = function(){
    const sql = `SELECT mf.name as mutual_fund_name, mf.category as mutual_fund_category, mfh.stock_name, mfh.stock_holding_in_percentage as stock_holding_in_percentage,
mfh.reporting_date as holding_reporting_date
FROM "mutual_fund_holdings" mfh, mutual_fund mf
where mf.scheme_code=mfh.scheme_code`
    holding_data = db.prepare(sql).all()
    console.log("HOLDING DATA FETCHED")
}
getMutualFundHoldingsJSONArray()

const route = async (req, res) => {
 try {
   const { base_prompt, userQuestion, ollamaModel } = req.body;
   const config = {
     MAX_RETRIES: 1,
     MAX_RESULTS: 20,
     OLLAMA_URL: process.env.OLLAMA_URL,
     PINECONE_INDEX: process.env.PINECONE_INDEX
   };

   const index = pinecone.Index(config.PINECONE_INDEX);
   
   let examples = '';
   const queryResponse = await index.query({
     vector: await getEmbeddings(userQuestion),
     topK: 3,
     includeMetadata: true
   });

   if (queryResponse.matches.length === 0) {
     examples = fs.readFileSync(path.join(PROMPTS_FOLDER, 'template_examples.txt'), 'utf-8');
   } else {
     examples = queryResponse.matches
       .map(match => match.metadata.example_text)
       .join('\n\n');
   }

   const prompt = `${base_prompt}\n${examples}\nHere is the Question: ${userQuestion}`;
   console.log("Final Prompt", prompt)
   const getLLMResponse = async (retries = config.MAX_RETRIES) => {
     try {
       if (process.env.LLM_TO_USE === 'Ollama') {
         const { data } = await axios.post(`${config.OLLAMA_URL}/api/generate`, {
           model: ollamaModel,
           prompt,
           stream: false
         });
         return data.response;
       } else if (process.env.LLM_TO_USE === 'Claude') {
         const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
         const resp = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
          });
        console.log(resp)  
         return resp.content[0].text;
       } else {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
          });
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }]
          });
          return response.choices[0].message.content;
       }
     } catch (error) {
       if (retries > 0) return getLLMResponse(retries - 1);
       throw error;
     }
   };

   let functionText = (await getLLMResponse()).trim();
   if (functionText.startsWith('```javascript')) {
     functionText = functionText.substring('```javascript'.length);
     if (functionText.endsWith('```')) {
       functionText = functionText.substring(0, functionText.length - 3);
     }
   }
   let analyzeFunction;
   try {
     analyzeFunction = eval(`(${functionText})`);
     await analyzeFunction([]);
   } catch (e) {
    console.log("Syntax failed, checking")
     const syntaxCheckerPrompt = `You are javascript syntax checker...${functionText}`;
     functionText = await getLLMResponse(syntaxCheckerPrompt);
     console.log("Revised function", functionText)
     analyzeFunction = eval(`(${functionText})`);
   }
   console.log("Final Function", functionText)
   //const mutualFundData = await getMutualFundHoldingsJSONArray();
   let result = [];
   
   try {
     result = analyzeFunction(holding_data);
     result = result.slice(0, config.MAX_RESULTS);

     await index.upsert(
        [{
         id: Date.now().toString(),
         values: await getEmbeddings(userQuestion),
         metadata: {
            example_text: `Example\nQuestion: ${userQuestion}\nResponse:\n${functionText}`,
           success_count: 1,
           created_at: new Date().toISOString()
         }
       }]
     );
   } catch (e) {
     console.error('Execution error:', e);
   }

   res.json({ result });
 } catch (error) {
    console.error(error)
   res.status(500).json({ error: error.message });
 }
};

// Helper function to get embeddings (implement based on your chosen embeddings model)
async function getEmbeddings(text) {
 // Example using OpenAI embeddings
 const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
 const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text
  });
  return response.data[0].embedding;
 return response.data.data[0].embedding;
}

module.exports = route;

// Required environment variables:
/*
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX=
OLLAMA_URL=
CLAUDE_API_KEY=
OPENAI_API_KEY=
LLM_TO_USE=
*/