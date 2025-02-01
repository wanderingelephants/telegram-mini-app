const axios = require("axios")
const { Anthropic } = require('@anthropic-ai/sdk');
const OpenAI = require('openai');
const OLLAMA_URL = process.env.OLLAMA_URL;
const temperature = 0
const getLLMResponse = async (prompt, ollamaModel) => {
    //console.log("Sending prompt\n", prompt, process.env.LLM_TO_USE)
    try {
        if (process.env.LLM_TO_USE === 'Ollama') {
            const { data } = await axios.post(`${OLLAMA_URL}/api/generate`, {
                model: ollamaModel,
                "prompt": prompt,
                stream: false,
                temperature
            });
            return data.response;
        } else if (process.env.LLM_TO_USE === 'Claude') {
            const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
            const resp = await anthropic.messages.create({
                model: "claude-3-5-haiku-20241022",
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
        console.error(error);
        return ""
    }
};
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
module.exports = getLLMResponse   
