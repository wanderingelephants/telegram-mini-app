const Puppet = require('./puppet.js')
const downloadPath = process.env.DOWNLOADS
const axios = require('axios');
const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');
const fetchPDF = require('./pdfFetcher');


const route = async (req, res) => {

    function toCamelCase(str) {
        return str
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, '');
    }
    async function downloadFile(url, downloadPath) {
        try {
            // Extract filename from URL
            const fileName = path.basename(url);
            const filePath = path.join(downloadPath, fileName);
            
            // Download file
            const response = await axios({
                method: 'GET',
                url: url,
                responseType: 'stream',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Sec-Fetch-User': '?1',
                    'Upgrade-Insecure-Requests': '1',
                    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"'
                },
                maxRedirects: 5,  // Handle redirects if any
                timeout: 10000    
            });
    
            // Create write stream
            const writer = fs.createWriteStream(filePath);
    
            // Pipe the response data to the file
            response.data.pipe(writer);
    
            // Return a promise that resolves when the file is written
            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(filePath));
                writer.on('error', reject);
            });
        } catch (error) {
            throw new Error(`Failed to download ${url}: ${error.message}`);
        }
    }
    async function processCSVAndDownload(csvPath, downloadPath) {
        const results = [];
        //const wordsToCheck = ['update', 'award', 'promotion'];
        const wordsToCheck = ['Resignation'];
    
        // Create download directory if it doesn't exist
        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath, { recursive: true });
        }
    
        // Read and parse CSV
        const parser = fs.createReadStream(csvPath)
            .pipe(parse({
                columns: header => header.map(column => toCamelCase(column)),
                skip_empty_lines: true,
                trim: true
            }));
    
        // Collect all rows
        for await (const row of parser) {
            results.push(row);
        }
    
        // Filter and map results
        const filteredResults = results
            .filter(row => {
                const subject = row.subject.toLowerCase();
                return wordsToCheck.some(word => subject.includes(word.toLowerCase()));
            })
            .map(({ symbol, subject, attachment }) => ({ symbol, subject, attachment }));
    
        console.log(`Found ${filteredResults.length} matching records to download`);
            
        // Download files sequentially
        for (const row of filteredResults) {
            try {
                console.log(`Downloading file for ${row.symbol}...`);
                await fetchPDF(row.attachment, downloadPath + '/' + row.symbol + '.pdf');
                console.log(`Successfully downloaded for : ${row.symbol}`);
            } catch (error) {
                console.error(`Error downloading file for ${row.symbol}:`, error.message);
            }
        }
    }

    try {
        const {baseUrl, urlSuffix, downloadFileName} = req.body
        console.log('recd download req', {baseUrl, urlSuffix, downloadFileName})
        
        //const puppet = new Puppet(baseUrl, urlSuffix, downloadPath, downloadFileName)
        //await puppet.downloadFile()
        const results = [];
        const wordsToCheck = ['update', 'award', 'promotion'];

        const filepath = path.join(downloadPath, downloadFileName);
        
       processCSVAndDownload(filepath, downloadPath)
    .then(() => console.log('Processing completed'))
    .catch(error => console.error('Error:', error));
        

        
    }
    catch(e){
        console.log('err in  processing', e)
        res.status(500).json("ETF did not process")
    }
    
}
module.exports = route