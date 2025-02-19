const Puppet = require('./puppet.js')
const downloadFolder = process.env.NSE_ANNOUNCEMENTS_DOWNLOAD
const axios = require('axios');
const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');
const fetchPDF = require('./pdfFetcher');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { postToGraphQL } = require("../../../lib/helper")

const route = async (req, res) => {

    function toCamelCase(str) {
        return str
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, '');
    }
    async function processCSVAndDownload(csvPath, downloadPath,  yyyymmdd, index, processOnlySubscriptions = true) {
        const results = [];
        let filteredResults = [];
        const downloadPdfPath = downloadPath + "/" + index
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
            let uniqueSymbolSet = []
            let subscribedSymbols = []
            let subscriberEmails = []
            const subscribedSymbolsQuery = `query getSubscribedSymbols{
  portfolio_stocks{
    stock{
      symbol
      company_name
    }
    user{
      email
    }
  }
}`
            try{
                const resp = await postToGraphQL({
                    query: subscribedSymbolsQuery,
                    variables: {}
                })
                uniqueSymbolSet = new Set(resp.data.portfolio_stocks.map(stock => stock.stock.symbol));

// Extract unique investor emails
subscriberEmails = [...new Set(resp.data.portfolio_stocks.map(stock => stock.user.email))];

console.log("Unique Stock Symbols:", uniqueSymbolSet);
console.log("Unique Investor Emails:", subscriberEmails);

            }catch(e){
                console.error(e)
            }
        // Collect all rows
        for await (const row of parser) {
            results.push(row);
        }
        processOnlySubscriptions === true ? filteredResults = results.filter(r => uniqueSymbolSet.has(r.symbol)  ) : filteredResults = results
        if (true){
            console.log("Filtered Results", filteredResults.length)
            console.log(filteredResults)
            console.log("unique subscribers", subscriberEmails)
            return;
        }
          for (const row of filteredResults) {
            try {
                console.log(row.symbol, row.dissemination)
                const dateToks = row.dissemination.split(' ')
                if (dateToks.length != 2) {
                    console.log("SKIPING invalid disemination.................", row)
                    continue;
                }
                /*const  dateFolder = downloadFolder + '/' + dateToks[0]
                if (!fs.existsSync(dateFolder)){
                    fs.mkdirSync(dateFolder, { recursive: true });
                }*/
                const fileToks = row.attachment.split('/')
                const fileName = fileToks[fileToks.length - 1]
                if (!fileName.endsWith('.pdf')) {
                    console.log("SKIPING non-pdf.................", row)
                    continue;
                }
                console.log(`Downloading file for ${row.symbol}...at ${downloadPdfPath}/${fileName}`);
                if (!fs.existsSync(downloadPdfPath + '/' + fileName)){
                    console.log("PDF does not exist, download")
                    await fetchPDF(row.attachment, downloadPdfPath + '/' + fileName);
                }
                else {
                    console.log("PDF exists, skip download", downloadPdfPath + '/' + fileName)
                    return
                }
                
                await postToGraphQL({
                    query: `mutation StockAnnouncementInsertOne($object: stock_announcements_insert_input!) {
  insert_stock_announcements_one(object: $object) {
    id
  }
}`,
                    variables: {
                        "object": {
    "announcement_document_link": row.attachment.trim(),
    "announcement_date": yyyymmdd,
    "announcement_text_summary": "",
    "announcement_sentiment": -1,
    "announcement_impact": "",
    "stock": {
      "data": {
        "symbol": row.symbol,
        "company_name": row.companyName,
        "segment": index.toLowerCase() === "sme" ? 1 : 0
      },
      "on_conflict": {
        "constraint": "stock_symbol_key",
        "update_columns": ["symbol", "company_name"]
      }
    }
  }
                    }
                })
                await delay(500)
                console.log(`Successfully downloaded for : ${row.symbol}`);
            } catch (error) {
                console.error(`Error downloading file for ${row.symbol}:`, error.message);
            }
        }
    }

    try {
        const { fromDate, toDate, index, processOnlySubscriptions } = req.body
        const baseUrl = "https://www.nseindia.com"
        const urlSuffix = `/api/corporate-announcements?index=${index}&from_date=${fromDate}&to_date=${toDate}&csv=true`
        const downloadFileName = `nse_announcements_${index}_${fromDate}_${toDate}.csv`
        //const {baseUrl, urlSuffix, downloadFileName} = req.body
        console.log('recd download req', { baseUrl, urlSuffix, downloadFileName })
        const toks = fromDate.split("-")
        const day = toks[0]
        const month = toks[1]
        const year = toks[2]
        let downloadDateFolder = path.join(downloadFolder, year, month, day)
        fs.mkdirSync(downloadDateFolder, { recursive: true });
        /*if (fs.existsSync(path.join(downloadDateFolder, downloadFileName))) {
            res.status(200).json("CSV already exists")
            return;
        }*/
            if (!fs.existsSync(path.join(downloadDateFolder, downloadFileName))) {
                console.log("CSV does not exist, download")
                const puppet = new Puppet(baseUrl, urlSuffix, downloadDateFolder, downloadFileName)
                await puppet.downloadFile()
            }
            else console.log("CSV Exists, no download needed")
        const filepath = path.join(downloadDateFolder, downloadFileName);
          
        await processCSVAndDownload(filepath, downloadDateFolder, year+"-"+month+"-"+day, index, processOnlySubscriptions).then(() => console.log('Processing completed'))
            .catch(error => console.error('Error:', error));
        res.status(200).json("CSV Downloaded and Processed")

    }
    catch (e) {
        console.log('err in  processing', e)
        res.status(500).json("ETF did not process")
    }

}
module.exports = route