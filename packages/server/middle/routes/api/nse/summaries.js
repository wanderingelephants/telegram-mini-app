const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { postToGraphQL } = require("../../../lib/helper")

async function processSummaries(inputFolder, outputFolder, fileToSummarize) {
    console.log("Recevied text to summary", inputFolder, outputFolder, fileToSummarize)
    const API_SERVER = process.env.API_SERVER_URL;
    const NSE_PREFIX = "https://nsearchives.nseindia.com/corporate/";

    // Extract date from input folder path
    const pathTokens = inputFolder.split(path.sep);
    const year = pathTokens[pathTokens.length - 3];
    const month = pathTokens[pathTokens.length - 2];
    const day = pathTokens[pathTokens.length - 1];
    const announcementDate = `${year}-${month}-${day}`;

    try {
        // Check if input directory exists
        //await fs.access(inputFolder);
        if (!fs.existsSync(inputFolder)) {
            console.log("input folder does not exist", inputFolder)
            return;
        }
        fs.mkdirSync(outputFolder, { recursive: true })
        // Create output directory if it doesn't exist
        /*try {
            await fs.access(outputFolder);
        } catch {
            await fs.mkdir(outputFolder, { recursive: true });
            console.log(`Creating output directory: ${outputFolder}`);
        }*/

        // Get all .txt files from input directory
        const files = fs.readdirSync(inputFolder, { withFileTypes: true })
            .filter(dirent => dirent.isFile() &&
                dirent.name.endsWith('.txt') &&
                !dirent.name.includes('_api_response.txt'))
            .map(dirent => dirent.name);

        for (const file of files) {
            console.log(`Checking file: ${file}`);

            // Read file content
            const filePath = path.join(inputFolder, file);
            if (fileToSummarize && filePath !== fileToSummarize) {
                console.log("Skipping file", filePath)
                continue;
            }
            else {
                console.log("Will process summary for file", filePath)
            }

            const filenameNoExt = path.parse(file).name;
            // Generate output filename
            const outputFile = path.join(outputFolder, `${filenameNoExt}_api_response.txt`);
            if (fs.existsSync(outputFile)) {
                console.log("Output file exists", outputFile)
                continue
            }
            const content = await fs.readFileSync(filePath, 'utf-8');

            const fullAttachment = `${NSE_PREFIX}${filenameNoExt}`;

            try {

                const summaryMutation = `mutation StockAnnouncementUpdate(
      $attachment: String!, 
      $text: String!
    ) {
      update_stock_announcements(
        where: {announcement_document_link: {_like: $attachment}}, 
        _set: {
          announcement_text: $text
        }
      ) {
        returning {
          id
        }
      }
    }
    `
                const summaryObj = {
                    "attachment": fullAttachment.trim() + "%",
                    "text": content,
                }
                const resp = await postToGraphQL({ "query": summaryMutation, "variables": summaryObj })
                console.log("Updated Announcement Text", resp)
            }
            catch (e) {
                console.error(e)
            }
            
            // Prepare JSON payload
            const jsonData = {
                activity: "announcements_summary",
                email: "dummy@dummy.com",
                customData: {
                    attachment: fullAttachment
                },
                messages: [
                    {
                        role: "user",
                        content: content
                    }
                ]
            };


            try {
                // Make API call
                const response = await axios.post(
                    `${API_SERVER}/api/chat/summary`,
                    jsonData,
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                // Save response to file
                await fs.writeFileSync(outputFile, JSON.stringify(response.data));
                console.log(`Response saved to: ${outputFile}`);

                // Wait for 3 seconds before next request
                await new Promise(resolve => setTimeout(resolve, 3000));
            } catch (error) {
                console.error(error)
                console.error(`Error occurred while processing ${file}:`, error.message);
            }
        }
    } catch (error) {
        console.error(error)
    }
}
const route = async (req, res) => {
    console.log(new Date(), "RECEIVED SUMMARY REQUEST", req.query.inputFolder, req.query.outputFolder)
    await processSummaries(req.query.inputFolder, req.query.outputFolder)

    res.status(200).json("ok")
}
module.exports = route;