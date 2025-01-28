const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', {  });
//const { Pinecone } = require('@pinecone-database/pinecone');
const { Anthropic } = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const axios = require('axios');
const fs = require('fs')
require('dotenv').config();
const path = require('path')
const PROMPTS_FOLDER = path.join(__dirname, "prompts")
const temperature = 0

let processed_holding_data = []
let reporting_dates = []
/*const pinecone = new Pinecone({
 apiKey: process.env.PINECONE_API_KEY,
});*/
const stripJSTicks = function(functionText){
    let idx = functionText.indexOf('```javascript') 
   if ( idx > -1) {
     functionText = functionText.substring(idx +  '```javascript'.length);
     idx = functionText.indexOf('```') 
     if (idx > -1) {
       functionText = functionText.substring(0, idx);
     }
   }
   return functionText
}
const removeRegularFunds = function(holding_data){
    const directFunds = new Set();  
    holding_data.forEach(holding => {
    if (holding.mutual_fund_name.includes('Direct Plan')) {
        directFunds.add(getBaseFundName(holding.mutual_fund_name));
    }
});

// Helper function to get base name
function getBaseFundName(fundName) {
    return fundName.replace(' - Direct Plan', '').replace(' - Regular Plan', '');
}

// Find holdings to remove (Regular Plans where Direct exists)
const holdingsToRemove = holding_data.filter(holding => {
    if (!holding.mutual_fund_name.includes('Regular Plan')) return false;
    const baseName = getBaseFundName(holding.mutual_fund_name);
    return directFunds.has(baseName);
});

// Create final filtered holdings
const filtered_holdings = holding_data.filter(holding => {
    if (!holding.mutual_fund_name.includes('Regular Plan')) return true;
    const baseName = getBaseFundName(holding.mutual_fund_name);
    return !directFunds.has(baseName);
});

// Output results
console.log('1. Removed Regular Fund Details:');
console.log('Number of holdings removed:', holdingsToRemove.length);
console.log('Regular funds removed:', 
    [...new Set(holdingsToRemove.map(h => h.mutual_fund_name))]);

console.log('\n2. Final Holdings Count:', filtered_holdings.length);

console.log('\n3. Verification:');
console.log('Initial holdings:', holding_data.length);
console.log('Removed holdings:', holdingsToRemove.length);
console.log('Final holdings:', filtered_holdings.length);
console.log('Numbers add up:', 
    holding_data.length === (holdingsToRemove.length + filtered_holdings.length));
return filtered_holdings    
}

const getMutualFundHoldingsJSONArray = function(){
    const sql = `SELECT mf.name as mutual_fund_name, mf.category as mutual_fund_category, mfh.stock_name, mfh.stock_holding_in_percentage as stock_holding_in_percentage,
mfh.reporting_date as holding_reporting_date
FROM "mutual_fund_holdings" mfh, mutual_fund mf
where mf.scheme_code=mfh.scheme_code`
    const holding_data = db.prepare(sql).all()
    const holding_data_regular_removed = removeRegularFunds(holding_data)
    processed_holding_data = holding_data_regular_removed.map(holding => ({
        ...holding,
        holding_reporting_date: new Date(holding.holding_reporting_date)
    }));
    
    // Create a Set of unique date strings
    const unique_dates = new Set();
    processed_holding_data.forEach(holding => {
        // Convert to ISO string and strip the time portion to compare dates only
        const dateStr = holding.holding_reporting_date.toISOString().split('T')[0];
        unique_dates.add(dateStr);
    });
    
    // Convert Set to array of Date objects and sort in descending order
    reporting_dates = Array.from(unique_dates)
        .map(dateStr => new Date(dateStr))
        .sort((a, b) => b - a);     
    console.log("reporting_dates", reporting_dates)
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

   //const index = pinecone.Index(config.PINECONE_INDEX);
   
   let examples = '';
   /*const queryResponse = await index.query({
     vector: await getEmbeddings(userQuestion),
     topK: 3,
     includeMetadata: true
   });
   console.log("Examples from Embeddings", examples)
   if (queryResponse.matches.length === 0) {
     examples = fs.readFileSync(path.join(PROMPTS_FOLDER, 'template_examples.txt'), 'utf-8');
   } else {
     examples = queryResponse.matches
       .map(match => match.metadata.example_text)
       .join('\n\n');
   }*/

   const prompt = `${base_prompt}\n${examples}\nHere is the Question: ${userQuestion}`;
   const getLLMResponse = async (promptToSend, retries = config.MAX_RETRIES) => {
    console.log("Sending prompt\n", promptToSend)
     try {
       if (process.env.LLM_TO_USE === 'Ollama') {
         const { data } = await axios.post(`${config.OLLAMA_URL}/api/generate`, {
           model: ollamaModel,
           "prompt": promptToSend,
           stream: false,
           temperature
         });
         console.log("LLM Response", data.response)
         return data.response;
       } else if (process.env.LLM_TO_USE === 'Claude') {
         const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
         const resp = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            messages: [{ role: "user", content: prompt }],
            temperature
          });
         return resp.content[0].text;
       } else {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
          });
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature
          });
          return response.choices[0].message.content;
       }
     } catch (error) {
       if (retries > 0) return getLLMResponse(prompt, retries - 1);
       throw error;
     }
   };

   let functionText = (await getLLMResponse(prompt)).trim();
   functionText = stripJSTicks(functionText)
   //console.log("functionText to eval", functionText)
   let analyzeFunction;
   try {
     analyzeFunction = eval(`(${functionText})`);
     await analyzeFunction(processed_holding_data, reporting_dates);
   } catch (e) {
    console.log("Syntax failed, checking")
    console.error(e)
     const syntaxPrompt = fs.readFileSync(path.join(PROMPTS_FOLDER, 'javascript_syntax_prompt.txt'), 'utf-8');
     const syntaxCheckerPrompt = `${syntaxPrompt} \n\n Here is the function to fix: \n\n ${functionText}`;
     functionText = await getLLMResponse(syntaxCheckerPrompt);
     functionText = stripJSTicks(functionText)
     console.log("Revised function", functionText)
     analyzeFunction = eval(`(${functionText})`);
   }
   console.log("Final Function", functionText)
   //const mutualFundData = await getMutualFundHoldingsJSONArray();
   let result = [];
   
   try {
     result = analyzeFunction(processed_holding_data, reporting_dates);
     //result = result.slice(0, config.MAX_RESULTS);

     /*await index.upsert(
        [{
         id: Date.now().toString(),
         values: await getEmbeddings(userQuestion),
         metadata: {
            example_text: `Example\nQuestion: ${userQuestion}\nResponse:\n${functionText}`,
           success_count: 1,
           created_at: new Date().toISOString()
         }
       }]
     );*/
   } catch (e) {
     console.error('Execution error:', e);
   }
   console.log(new Date(), "Result", result)
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