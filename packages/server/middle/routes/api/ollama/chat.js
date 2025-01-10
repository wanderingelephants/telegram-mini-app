const OLLAMA_URL = 'http://localhost:11434';
const {initializeOllama} = require('./initOllama')
const route = async (req, res) => {
    await initializeOllama()
    const { messages, model } = req.body;
    console.log('Messages received:', messages);

    // Format conversation history for Ollama
    const prompt = messages.map(msg =>
        `${msg.role === 'user' ? 'Human: ' : 'Assistant: '}${msg.content}`
    ).join('\n') + '\nAssistant:';

    try {
        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model || 'llama2',
                prompt: prompt,
                stream: false  // Set to true if you want to implement streaming
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        res.json({ response: data.response });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to get response from Ollama' });
    }
}
module.exports = route