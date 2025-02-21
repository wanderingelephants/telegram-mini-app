const axios = require("axios")
const Puppet = require('./puppet.js')
const fs = require('fs');
const { parse } = require('csv-parse');
const fetchPDF = require('./pdfFetcher');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const processSummaries = require('./processSummaries');
const announcement_data_folder = process.env.NSE_ANNOUNCEMENTS_DOWNLOAD
const { postToGraphQL } = require("../../../lib/helper");
const path = require("path");

const downloadMasterCSV = async (summaryDate, downloadFileName, index) => {
    try {
        const toks = summaryDate.split("-")
        const year = toks[0]
        const month = toks[1]
        const day = toks[2]
        let downloadDateFolder = path.join(announcement_data_folder, year, month, day)
        fs.mkdirSync(path.join(downloadDateFolder, index, "csv"), { recursive: true });
        fs.mkdirSync(path.join(downloadDateFolder, index, "pdf"), { recursive: true });
        fs.mkdirSync(path.join(downloadDateFolder, index, "txt"), { recursive: true });
        fs.mkdirSync(path.join(downloadDateFolder, index, "summaries"), { recursive: true });

        const fullPath = path.join(downloadDateFolder, index, "csv", downloadFileName)
        if (!fs.existsSync(fullPath)) {
            console.log("CSV does not exist, download")
            const baseUrl = "https://www.nseindia.com"
            const fromDate = day + "-" + month + "-" + year

            const urlSuffix = `/api/corporate-announcements?index=${index}&from_date=${fromDate}&to_date=${fromDate}&csv=true`
            console.log("urlSuffix", urlSuffix)
            const puppet = new Puppet(baseUrl, urlSuffix, path.join(downloadDateFolder, index, "csv"), downloadFileName)
            await puppet.downloadFile()
        }
        else console.log("CSV Exists, no download needed")
        return downloadDateFolder
    }
    catch (e) {
        console.error(e)
        return ""
    }

}
toCamelCase = (str) => {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        .replace(/[^a-zA-Z0-9]/g, '');
}
const getRecordsToProcess = async (csvPath, processOnlySubscriptions) => {
    const results = [];
        let filteredResults = [];
        
    const parser = fs.createReadStream(csvPath)
                .pipe(parse({
                    columns: header => header.map(column => toCamelCase(column)),
                    skip_empty_lines: true,
                    trim: true
                }));
                for await (const row of parser) {
                    results.push(row);
                }
                console.log("results", results.length)
                
    let uniqueSymbolSet = []
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
    try {
        const resp = await postToGraphQL({
            query: subscribedSymbolsQuery,
            variables: {}
        })
        uniqueSymbolSet = new Set(resp.data.portfolio_stocks.map(stock => stock.stock.symbol));

        // Extract unique investor emails
        subscriberEmails = [...new Set(resp.data.portfolio_stocks.map(stock => stock.user.email))];

        console.log("Unique Stock Symbols:", uniqueSymbolSet);
        console.log("Unique Investor Emails:", subscriberEmails);
        processOnlySubscriptions.toLowerCase() === "true" ? filteredResults = results.filter(r => uniqueSymbolSet.has(r.symbol)) : filteredResults = results
    

    } catch (e) {
        console.error(e)
    }
    console.log("filteredResults", filteredResults.length)
    return filteredResults
}
const getPdfFileName = (row) => {
    const fileToks = row.attachment.split('/')
    const fileName = fileToks[fileToks.length - 1]
    return fileName
}
const downloadPDFs = async(filteredResults, downloadPdfPath, yyyymmdd, index) => {
    for (const row of filteredResults) {
        try {
            console.log(row.symbol, row.dissemination)
            const dateToks = row.dissemination.split(' ')
            if (dateToks.length != 2) {
                console.log("SKIPING invalid disemination.................", row)
                continue;
            }
            const fileName = getPdfFileName(row)
            if (!fileName.endsWith('.pdf')) {
                console.log("SKIPING non-pdf.................", row)
                continue;
            }
            console.log(`Downloading file for ${row.symbol}...at ${downloadPdfPath}/${fileName}`);
            if (!fs.existsSync(downloadPdfPath + '/' + fileName)) {
                console.log("PDF does not exist, download")
                await fetchPDF(row.attachment, downloadPdfPath + '/' + fileName);
                const resp = await postToGraphQL({
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
                console.log("gql resp, insert doc link", resp)
            }
            else {
                console.log("PDF exists, skip download", downloadPdfPath + '/' + fileName)
                continue
            }
            await delay(500)
            console.log(`Successfully downloaded PDF for : ${row.symbol}`);
        } catch (error) {
            console.error(`Error downloading file for ${row.symbol}:`, error.message);
        }
    }
}
const processSummary = async (summaryDate, index, processOnlySubscriptions) => {
    /*const apiServer = process.env.API_SERVER_URL
    await axios.post(`${apiServer}/api/nse/announcements`, {
        fromDate: summaryDate,
        toDate: summaryDate,
        index,
        processOnlySubscriptions
    })*/
    const downloadFileName = `nse_announcements_${index}_${summaryDate}.csv`
        
    const downloadDateFolder = await downloadMasterCSV(summaryDate, downloadFileName, index)
    console.log("processSummary CSV Done")
    if (downloadDateFolder == "") {
        console.log("downloadDateFolder is blank, no further processing")
        return
    }
    const filteredResults = await getRecordsToProcess(path.join(downloadDateFolder, index, "csv", downloadFileName), processOnlySubscriptions)
    if (filteredResults.length == 0){
        console.log("No Master CSV Records to Process")
        return    
    }
    const pdfBasePath = path.join(downloadDateFolder, index, "pdf")
    const toks = summaryDate.split("-")
    const formattedDate = toks[0] + "/" + toks[1] + "/" + toks[2]
    fs.mkdirSync(pdfBasePath, { recursive: true })
    await downloadPDFs(filteredResults, pdfBasePath, toks[0]+"-"+toks[1]+"-"+toks[2], index)
    for (const row of filteredResults) {
        const fileName = getPdfFileName(row)
        if (!fileName.endsWith('.pdf')) {
                console.log("SKIPING non-pdf.................", row)
                continue;
        }
        
        try {
            const outputPath = path.join(formattedDate, index, "txt")
            const pdfToTextInputPath = path.join(formattedDate, index, "pdf")
            await axios.get(process.env.PDF_PROCESS_URL + `/api/processSinglePDF?inputPDFPath=${pdfToTextInputPath}&outputFolder=${outputPath}`)
        }
        catch (e) {
            console.error(e)
        }    
    }
    console.log("processSummary pdf-to-text done")
    const textBasePath = path.join(announcement_data_folder,formattedDate, index, "txt")
    for (const row of filteredResults) {
        const fileName = getPdfFileName(row)
        if (!fileName.endsWith('.pdf')) {
                console.log("SKIPING non-pdf.................", row)
                continue;
        }
        const textFilePath = path.join(textBasePath, fileName.replace(".pdf", ".txt"))
        try {
            await processSummaries(textBasePath, path.join(announcement_data_folder, formattedDate, index, "summaries"), textFilePath)
        }
        catch (e) {
            console.error(e)
        }
    }
    
    console.log("processSummary summaries done")
}
const route = async (req, res) => {
    //2025-02-13
    const summaryDate = req.query.summaryDate
    const index = req.query.index
    const processOnlySubscriptions = req.query.processOnlySubscriptions

    if (!summaryDate || !index) res.status(500).json("specify summaryDate and index=equities/sme")
    await processSummary(summaryDate, index, processOnlySubscriptions)

    res.status(200).json("ok")
}
module.exports = route