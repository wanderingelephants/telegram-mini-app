const OLLAMA_URL = process.env.OLLAMA_URL ? process.env.OLLAMA_URL  : 'http://ollama:11434';

async function initializeOllama(MODEL_NAME) {
  try {
    console.log('Checking if model exists...', MODEL_NAME);
    
    // Check if model exists
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    console.log('ollama tags', data)
    const modelExists = data.models?.some(model => model.name === MODEL_NAME);

    if (!modelExists) {
      console.log(`Model ${MODEL_NAME} not found. Pulling...`);
      
      // Pull the model
      const pullResponse = await fetch(`${OLLAMA_URL}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: MODEL_NAME
        })
      });

      if (!pullResponse.ok) {
        throw new Error(`Failed to pull model: ${pullResponse.statusText}`);
      }

      console.log(`Model ${MODEL_NAME} pulled successfully`);
    } else {
      console.log(`Model ${MODEL_NAME} already exists`);
    }

  } catch (error) {
    console.error('Failed to initialize Ollama:', error);
    throw error;
  }
}

module.exports = { initializeOllama };