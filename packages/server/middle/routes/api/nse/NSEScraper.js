const path = require('path');
const { postToGraphQL } = require("../../../lib/helper")
const moment = require('moment');
const { puppeteer, launchOptions } = require("../../../config/puppeteer")();

const fs = require('fs');
const fetchPDF = require("./pdfFetcher");
const { uploadFileToS3 } = require('../../../utils/s3Upload');
const SMART_PROXY_URL = process.env.SMART_PROXY_URL

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const extractDateComponents = function (dateStr) {
    const date = moment(dateStr, "DD-MMM-YYYY HH:mm:ss");
    return [date.format("YYYY"), date.format("MM"), date.format("DD")];
}
class NSEScraper {
    constructor(disclosureConfig, isMaster, filesToDownload) {
        this.browser = null;
        this.page = null;
        this.disclosureConfig = disclosureConfig
        this.isMaster = isMaster
        console.log(disclosureConfig)
        console.log("NSEScraper constructor", process.env.DATA_ROOT_FOLDER, disclosureConfig["storage_dir_suffix"])
        this.storage_dir = path.join(process.env.DATA_ROOT_FOLDER, disclosureConfig["storage_dir_suffix"]);
        //this.announcement_url = announcement_url;
        
        
        this.filesToDownload = filesToDownload
        console.log("NSEScraper filesToDownload", this.filesToDownload)
        this.tableKeys = Object.keys(disclosureConfig.tabs) //["sme", "equities"] e.g. announcements
        //this.tableKeys.forEach(k => this.filesToDownload[k] = [])
        
        //["https://nsearchives.nseindia.com/corporate/RPOWER_22022025220130_Reliance_Power_Limited_Newspaper_Publication.pdf", "https://nsearchives.nseindia.com/corporate/AKZOINDIA_22022025204853_AkzoIndia_Reg30_Intimation_UPGST_SCNFY20_21_26Nov2024_Update22Feb25.pdf"]

    }
    //tableQuerySelectors - {"sme": "#CFanncsmeTable", "equities": "#CFanncEquityTable"}
    //headersForSegment = {"sme": ["SYMBOL", "COMPANY NAME", "SUBJECT", "DETAILS", "ATTACHMENT", "BROADCAST DATE/TIME"],
    //"equities": ["SYMBOL", "COMPANY NAME", "SUBJECT", "DETAILS", "ATTACHMENT", "BROADCAST DATE/TIME"]}
    async scrapeTables() {
        console.log("ScrapeTables", this.isMaster)
        //tableQuerySelectors, headersForSegment
        this.browser = await puppeteer.launch(launchOptions);
        this.page = await this.browser.newPage();
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
/*"announcements": {
      "storage_dir_suffix": "nse_announcements",
      "disclosure_url": process.env.ANNOUNCEMENT_URL,
      "tabs": {
        "sme": {
          "tableQuerySelector": "#CFanncsmeTable",
          "column_headers": ["SYMBOL", "COMPANY NAME", "SUBJECT", "DETAILS", "ATTACHMENT", "BROADCAST DATE/TIME"]
        },
        "equities":{
          "tableQuerySelector": "#CFanncEquityTable",
          "column_headers": ["SYMBOL", "COMPANY NAME", "SUBJECT", "DETAILS", "ATTACHMENT", "BROADCAST DATE/TIME"]
        }
      }
    }*/
        await this.page.goto(this.disclosureConfig.disclosure_url, { waitUntil: 'networkidle2' });
        await delay(10000);
        let documentLinks = {}; //{ "sme": [], "equities": [] }
        this.tableKeys.forEach(k => documentLinks[k] = [])
        let tableData = []
        tableData = await this.page.evaluate((disclosureConfig) => {
            console.log(disclosureConfig)
            const columnHeaders = {}
            const tables = {}
            const tableKeys = Object.keys(disclosureConfig.tabs)
            tableKeys.forEach(k => tables[k] = document.querySelector(disclosureConfig.tabs[k].tableQuerySelector))
            tableKeys.forEach(k => columnHeaders[k] = disclosureConfig.tabs[k].column_headers)
            console.log("Tables to parse", tables)
            console.log("Column Headers", columnHeaders)
            
            /*const tables = {
                equities: document.querySelector('#CFanncEquityTable'),
                sme: document.querySelector('#CFanncsmeTable')
            };*/
            let data = {}; //{ sme: [], equities: [] }
            tableKeys.forEach(k => data[k] = [])
            for (const key of tableKeys) {
                try {
                    const table = tables[key]
                    //const table = document.querySelector(`#${tableId}`);
                    console.log("Table found:", !!table);

                    if (!table) return null;

                    const headers = columnHeaders[key]//["SYMBOL", "COMPANY NAME", "SUBJECT", "DETAILS", "ATTACHMENT", "BROADCAST DATE/TIME"];
                    console.log("Headers:", headers);

                    // Get all rows with class=" " and log the count
                    const rows = table.querySelectorAll('tbody tr[class=" "]');
                    console.log("Number of matching rows found:", rows.length);

                    const records = Array.from(rows).map(row => {
                        const cells = Array.from(row.querySelectorAll('td'));
                        const record = {};

                        headers.forEach((header, index) => {
                            if (cells[index]) {
                                // For SYMBOL, get the text from the anchor tag
                                if (header === "SYMBOL") {
                                    const symbolLink = cells[index].querySelector('a');
                                    record[header] = symbolLink ? symbolLink.textContent.trim() : cells[index].textContent.trim();
                                }
                                // For ATTACHMENT, check if PDF link exists
                                else if (header === "ATTACHMENT") {
                                    const pdfLink = cells[index].querySelector('a');
                                    record[header] = pdfLink ? pdfLink.href : '';
                                }
                                else if (header === "BROADCAST DATE/TIME") {
                                    const anchor = cells[index].querySelector('a');
                                    if (anchor && anchor.childNodes.length > 0) {
                                        record[header] = anchor.childNodes[0].textContent.trim();
                                    } else {
                                        record[header] = '';
                                    }
                                }
                                // For other cells, just get the text content
                                else {
                                    record[header] = cells[index].textContent.trim();
                                }
                            } else {
                                record[header] = '';
                            }
                        });

                        return record; // Make sure to return the record object
                    });

                    data[key] = records;

                } catch (error) {
                    console.error("Error in data extraction:", error);
                    return null;
                }
            }
            return data;
        }, this.disclosureConfig);
        this.browser.close()
        //console.log("tableData", tableData)
        if (this.isMaster) return tableData
        console.log("Child Simulator processTableData", this.disclosureConfig)
        documentLinks = await this.processTableData(tableData, this.tableKeys)
       
        console.log("Scraping done")
        return documentLinks;
    }
    //keys ['equities', 'sme']
    //dateTimeColumnKey - "BROADCAST DATE/TIME"
    //documentType = pdf
    //skipExtension=".xml"
    async processTableData(tableData, keys){
        let documentLinks = {}
        if (!tableData) {
            console.log("processTableData Undefined tableData", this.filesToDownload)
            return documentLinks
        }
        keys.forEach(k => documentLinks[k] = [])
        for (const index of keys) {
            for (const announcement of tableData[index]) {
                const [year, month, day] = extractDateComponents(announcement["BROADCAST DATE/TIME"]);
                const targetPath = path.join(this.storage_dir, year, month, day, index, "pdf")
                console.log("process announcement", index, targetPath, announcement, this.filesToDownload[index].findIndex(announcement.ATTACHMENT))
                fs.mkdirSync(targetPath, { recursive: true })
                if (announcement.SUBJECT.toLowerCase().indexOf("newspaper") > -1) {
                    console.log("Skipping newspaper record", announcement.ATTACHMENT)
                    continue;
                }
                if (announcement.ATTACHMENT && announcement.ATTACHMENT.endsWith(".xml")) {
                    console.log("Skipping XML announcement", announcement.ATTACHMENT)
                    continue;
                }
                if (announcement.ATTACHMENT) {
                    documentLinks[index].push(announcement.ATTACHMENT)
                }
                if (announcement.ATTACHMENT && this.filesToDownload[index].findIndex(announcement.ATTACHMENT) > -1) {
                    console.log("checking pdf", announcement.ATTACHMENT, targetPath)
                    const fileToks = announcement.ATTACHMENT.split('/')
                    const fileName = fileToks[fileToks.length - 1]
                    if (fs.existsSync(path.join(targetPath, fileName))) {
                        console.log("Target PDF exists. Skip", targetPath)
                    }
                    else {
                        await fetchPDF(announcement.ATTACHMENT, path.join(targetPath, fileName), SMART_PROXY_URL)
                        try {
                            await uploadFileToS3(this.storage_dir, path.join(year, month, day, index, "pdf", fileName))
                        }
                        catch (e) {
                            console.log("Upload to S3 failed")
                            console.error(e)
                        }
                        try {
                            await postToGraphQL({
                                query: `mutation StockAnnouncementInsertOne($object: stock_announcements_insert_input!) {
          insert_stock_announcements_one(object: $object) {
            id
          }
        }`,
                                variables: {
                                    "object": {
                                        "announcement_document_link": announcement.ATTACHMENT.trim(),
                                        "announcement_date": `${year}-${month}-${day}`,
                                        "announcement_text_summary": "",
                                        "announcement_sentiment": -1,
                                        "announcement_impact": "",
                                        "stock": {
                                            "data": {
                                                "symbol": announcement.SYMBOL,
                                                "company_name": announcement["COMPANY NAME"],
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
                        }
                        catch (e) {
                            console.log("Error Posting GQL", announcement)
                            console.error(e)
                        }
                        try {
                            fs.appendFileSync(path.join(this.storage_dir, year, month, day, index, "activity.log"), JSON.stringify(announcement) + ",\n")
                        }
                        catch (e) {
                            console.error(e)
                        }
                    }

                }
            }
        }
    }
    //}

}
module.exports = NSEScraper