const Puppet = require('./puppet.js')
const downloadFolder = process.env.DOWNLOADS
const axios = require('axios');
const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');
const fetchPDF = require('./pdfFetcher');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const route = async (req, res) => {

    function toCamelCase(str) {
        return str
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, '');
    }
    async function processCSVAndDownload(csvPath, downloadPdfPath) {
        const results = [];
        const wordsToCheck = [];
        //const wordsToCheck = ['Resignation'];
    
        // Create download directory if it doesn't exist
        if (!fs.existsSync(downloadPdfPath)) {
            fs.mkdirSync(downloadPdfPath, { recursive: true });
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
                return wordsToCheck.length == 0 ? true : wordsToCheck.some(word => subject.includes(word.toLowerCase()));
            })
            .map(({ symbol, subject, attachment, dissemination }) => ({ symbol, subject, attachment, dissemination }));
    
        console.log(`Found ${filteredResults.length} matching records to download`);
            
        // Download files sequentially
        for (const row of filteredResults) {
            try {
                console.log(row.symbol, row.dissemination)
                const dateToks = row.dissemination.split(' ')
                if (dateToks.length != 2) {
                    console.log("SSSSKIPING invalid disemination.................", row)
                    continue;
                }
                const  dateFolder = downloadFolder + '/' + dateToks[0]
                if (!fs.existsSync(dateFolder)){
                    fs.mkdirSync(dateFolder, { recursive: true });
                }
                const fileToks = row.attachment.split('/')
                const fileName = fileToks[fileToks.length - 1]
                if (!fileName.endsWith('.pdf')) {
                    console.log("SSSSKIPING non-pdf.................", row)
                    continue;
                }
                console.log(`Downloading file for ${row.symbol}...at ${dateFolder}/${fileName}`);
                await fetchPDF(row.attachment, dateFolder + '/' + fileName);
                await delay(1000)
                console.log(`Successfully downloaded for : ${row.symbol}`);
            } catch (error) {
                console.error(`Error downloading file for ${row.symbol}:`, error.message);
            }
        }
    }

    try {
        const {fromDate, toDate, index} = req.body
        const baseUrl = "https://www.nseindia.com"
        const urlSuffix = `/api/corporate-announcements?index=${index}&from_date=${fromDate}&to_date=${toDate}&csv=true`
        const downloadFileName = `nse_announcements_${fromDate}_${toDate}.csv`
        //const {baseUrl, urlSuffix, downloadFileName} = req.body
        console.log('recd download req', {baseUrl, urlSuffix, downloadFileName})
        
        const puppet = new Puppet(baseUrl, urlSuffix, downloadFolder, downloadFileName)
        await puppet.downloadFile()
        const filepath = path.join(downloadFolder, downloadFileName);
        
       processCSVAndDownload(filepath, downloadFolder).then(() => console.log('Processing completed'))
       .catch(error => console.error('Error:', error));
       res.status(200).json("CSV Downloaded and Processed")
        
    }
    catch(e){
        console.log('err in  processing', e)
        res.status(500).json("ETF did not process")
    }
    
}
module.exports = route