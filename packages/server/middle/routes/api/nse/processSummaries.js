const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');


async function processSummaries(inputFolder, outputFolder) {
    const API_SERVER = process.env.API_SERVER;
    const NSE_PREFIX = "https://nsearchives.nseindia.com/corporate/";

    // Extract date from input folder path
    const pathTokens = inputFolder.split(path.sep);
    const year = pathTokens[pathTokens.length - 3];
    const month = pathTokens[pathTokens.length - 2];
    const day = pathTokens[pathTokens.length - 1];
    const announcementDate = `${year}-${month}-${day}`;

    try {
        // Check if input directory exists
        await fs.access(inputFolder);
        
        // Create output directory if it doesn't exist
        try {
            await fs.access(outputFolder);
        } catch {
            await fs.mkdir(outputFolder, { recursive: true });
            console.log(`Creating output directory: ${outputFolder}`);
        }

        // Get all .txt files from input directory
        const files = (await fs.readdir(inputFolder))
            .filter(file => file.endsWith('.txt') && !file.includes('_api_response.txt'));

        for (const file of files) {
            console.log(`Processing file: ${file}`);
            
            // Read file content
            const filePath = path.join(inputFolder, file);
            const content = await fs.readFile(filePath, 'utf-8');
            
            const filenameNoExt = path.parse(file).name;
            const fullAttachment = `${NSE_PREFIX}${filenameNoExt}`;
            const firstToken = file.split('_')[0];

            // Prepare JSON payload
            const jsonData = {
                distilledModel: "announcements_summary",
                llm: "Ollama",
                singleShotPrompt: true,
                streaming: false,
                customData: {
                    stock_symbol: firstToken,
                    announcement_date: announcementDate,
                    attachment: fullAttachment
                },
                messages: [
                    {
                        role: "user",
                        content: content
                    }
                ]
            };

            // Generate output filename
            const outputFile = path.join(outputFolder, `${filenameNoExt}_api_response.txt`);

            try {
                // Make API call
                const response = await axios.post(
                    `${API_SERVER}/api/chat/reasoning`,
                    jsonData,
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                // Save response to file
                await fs.writeFile(outputFile, JSON.stringify(response.data));
                console.log(`Response saved to: ${outputFile}`);

                // Wait for 3 seconds before next request
                await new Promise(resolve => setTimeout(resolve, 3000));
            } catch (error) {
                console.error(`Error occurred while processing ${file}:`, error.message);
            }
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Error: Input directory '${inputFolder}' does not exist`);
        } else {
            console.error('An error occurred:', error.message);
        }
        throw error;
    }
}

module.exports = processSummaries;