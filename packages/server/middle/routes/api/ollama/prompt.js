const fs = require('fs');
const path = require('path');

// Read the template
const promptTemplate = fs.readFileSync(
  path.join(__dirname, 'prompt.txt'),
  'utf8'
);

// Function to generate final prompt
function generatePrompt(userQuery) {
  return promptTemplate.replace('{{QUERY}}', userQuery);
}

// Usage
async function generateSQL(userQuery) {
  const finalPrompt = generatePrompt(userQuery);
  // Use finalPrompt with your LLM
}
