const OLLAMA_URL = 'http://localhost:11434';  // Adjust this to your Ollama container URL

const route = async (req, res) => {
    const { messages, model } = req.body;

  // Set up SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

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
          
          if (json.done) {
            res.end();
            return;
          }
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }
    }

  } catch (error) {
    console.error('Error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
    res.end();
  }
}