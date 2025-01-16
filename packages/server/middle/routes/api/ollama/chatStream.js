const axios = require('axios');
const model = process.env.OLLAMA_MODEL || 'llama3.2';
const OLLAMA_URL = process.env.OLLAMA_URL;;  // Adjust this to your Ollama container URL
const { initializeOllama } = require('./initOllama');

const classifyQuery = async function(query) {
  console.log('classifyQuery', query)
  const classificationPrompt = `
You are a query classifier for an Indian mutual fund analysis system.
The user may have selected specific mutual funds for comparison.

Classify the following query into one of these categories:
- STOCK_HOLDING_QUERY (if query contains words like 'hold', 'holds', 'holding', 'holdings', 'stock', 'share' i.e. when user is searching for funds based on stock criteria like MF holdings in specific stocks or stock sectors)
- FUND_DISCOVERY (when user is searching for mutual funds based on fund specific criteria like returns, sector, fund size, ratings, risk level, or investment strategy)
- GENERAL_KNOWLEDGE (general educational questions about mutual funds, markets, or investment concepts)

Classification rules:
1. If query contains specific fund names AND mentions comparison/overlap/difference → FUND_COMPARISON
2. If query is about a single fund's details/performance/portfolio → FUND_DETAILS
3. If query contains search criteria, filtering conditions, or asks for recommendations → FUND_DISCOVERY
4. Only classify as GENERAL_KNOWLEDGE if the query is purely educational and doesn't fit the above categories

Examples:
- "Which Funds are holding Reliance Stock" → STOCK_HOLDING_QUERY
- "Which Funds have exposure to IT sector" → STOCK_HOLDING_QUERY
- "Show me large cap funds with 5-star rating" → FUND_DISCOVERY
- "What are the benefits of SIP?" → GENERAL_KNOWLEDGE

Query: "${query}"

Respond with just the category name in uppercase, nothing else.`;

  try {
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model,
      prompt: classificationPrompt,
      stream: false
    });

    return response.data.response.trim();
  } catch (error) {
    console.error('Classification error:', error);
    throw error;
  }
}
const fundDiscovery = async function(res, messages){
  let json  = {"response": "The Fund Discovery is Zerodha Gold ETF", "done": false}
  res.write(`data: ${JSON.stringify(json)}\n\n`);
  json  = {"response": "", "done": true}
  res.write(`data: ${JSON.stringify(json)}\n\n`);
  
  res.end();
}
const stockHoldingQuery = async function(res, messages){
  let json  = {"response": "The Stock Holding Discovery is Motilal", "done": false}
  res.write(`data: ${JSON.stringify(json)}\n\n`);
  json  = {"response": "", "done": true}
  res.write(`data: ${JSON.stringify(json)}\n\n`);
  res.end();
  console.log("Written to resp", )
  return;
}
const generalQuery = async function(res, messages){
  let prompt = `You are a financial advisor specializing in Indian Financial markets like Stock market, Mutual Funds and ETFs. Your audience consists exclusively of Indian retail investors.
      If user requests Tips of any kind, politely refuse and explain that you can explain investment principles but not give specific tips. 
      Provide explanation suitable for an Indian retail investor, using only Indian market examples and context.
      Do not use personal salutations, keep it professional, since you are a Financial Advisor and not a pal chilling with friends. 
      Answer in the Indian language you are spoken to, e.g. if user asks question in Hindi, then respond in hindi.
      \n`
      ;
  prompt += messages.map(msg => 
    `${msg.role === 'user' ? 'Human: ' : 'Assistant: '}${msg.content}`
  ).join('\n') + '\nAssistant:';
  console.log("PROMPT", prompt)
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt: prompt,
        stream: true
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
          const json = JSON.parse(line);
          res.write(`data: ${JSON.stringify(json)}\n\n`);
          console.log('general write', `data: ${JSON.stringify(json)}\n\n`)
          if (json.done) {
            res.end();
            return;
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
          res.end();
          return;
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
    res.end();
  }
}
const route = async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
    try{
      await initializeOllama();
    const { messages } = req.body;
    console.log("Messages", messages)
    // Set up SSE headers
  
    const latestMessage = messages[messages.length - 1]
    let queryClassification = 'GENERAL_KNOWLEDGE'
    let userQuery; 
    if (latestMessage.role == 'user') {
      userQuery = latestMessage.content
      queryClassification =  await classifyQuery(userQuery)
    }
    console.log("QUERY CLASSIFICATION", queryClassification)
    switch (queryClassification) {
      case 'FUND_DISCOVERY':
          return fundDiscovery(res, messages); 
      case 'STOCK_HOLDING_QUERY':
          return stockHoldingQuery(res, messages);  
      default:
        return generalQuery(res, messages);
    }
    
    }
    catch(e){
      console.log(e)
      res.write(`data: ${JSON.stringify({ error: 'System Error' })}\n\n`);
      res.end();
    }
    
  
}
module.exports = route