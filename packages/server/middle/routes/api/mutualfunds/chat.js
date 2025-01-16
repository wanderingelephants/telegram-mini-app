const MutualFundAgent = require('./agent')
const { initializeOllama } = require('./initOllama');

const agent = new MutualFundAgent()
const route = async (req, res) => {
  await initializeOllama();
    try {
        const { messages } = req.body;  // Now matches frontend payload
        const response = await agent.processQuery(messages);  // Pass funds as part of context
        res.json(response);
      } catch (error) {
        console.error('Error processing chat:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}
module.exports = route;