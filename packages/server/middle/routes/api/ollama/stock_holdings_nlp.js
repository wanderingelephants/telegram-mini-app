const axios = require('axios');
const model = process.env.OLLAMA_MODEL || 'llama3.2';
const OLLAMA_URL = process.env.OLLAMA_URL;;  // Adjust this to your Ollama container URL
//const { initializeOllama } = require('./initOllama');
const fs = require('fs');
const path = require('path');

const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });

//const formatResults = require("./format_results")


const nlp_to_query = async function(query){
  console.log("calling nlp to query")
    //await initializeOllama(model)
    const promptTemplate = fs.readFileSync(
      path.join(__dirname, 'stock_holdings_prompt.txt'),
      'utf8'
    );
    const PROMPT = promptTemplate.replace('{{QUERY}}', query);

try {
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model,
      prompt: PROMPT,
      stream: false
    });
    //return response.data.response.trim()
    let sqlQuery = response.data.response.trim()
    sqlQuery = sqlQuery.replaceAll("```sql", "")
    sqlQuery = sqlQuery.replaceAll("```", "")
    console.log(sqlQuery)
    const dbResp = db.prepare(`${sqlQuery}`).all()
    //const finalResp = await formatResults(query, sqlQuery, dbResp)
    return JSON.stringify(dbResp)
    
  } catch (error) {
    console.error('Classification error:', error);
    return [];
  }

}
module.exports = nlp_to_query
//const query = "which funds have holdings in Retail stocks, output fund name, stock name and stock sector, stock holding %. order results by holding percentage descending"
//const query = "Find Retail stock sector holdings in mutual funds, that have a holding in stock 'V2 Retail'"

/*nlp_to_query(query).then(resp => {
    console.log("nlp tp query resp", resp)
    const dbResp = db.prepare(`${resp}`).all()
    console.log(dbResp)
})*/