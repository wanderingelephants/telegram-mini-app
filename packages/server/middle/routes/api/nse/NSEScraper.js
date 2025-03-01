const path = require('path');
const { postToGraphQL } = require("../../../lib/helper")
const moment = require('moment');
const { puppeteer, launchOptions } = require("../../../config/puppeteer")();

const fs = require('fs');
const fetchPDF = require("./pdfFetcher");
const { uploadFileToS3 } = require('../../../utils/s3Upload');
const SMART_PROXY_URL = process.env.SMART_PROXY_URL

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const disclosures = {
    "announcements": {
      "storage_dir_suffix": process.env.NSE_ANNOUNCEMENTS ? process.env.NSE_ANNOUNCEMENTS : "nse_announcements",
      "disclosure_url": process.env.NSE_ANNOUNCEMENT_URL,
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
    },
    "insider_trades": {
      "storage_dir_suffix": process.env.NSE_INSIDER_TRADES ? process.env.NSE_INSIDER_TRADES : "nse_insider_trades",
      "disclosure_url": process.env.NSE_INSIDER_TRADES_URL,
      "tabs":{
        "insider_trades": {
          "tableQuerySelector": "#table-CFinsidertrading",
          "column_headers": ["SYMBOL", "COMPANY NAME", "REGULATION","Name of the Acquirer/ Disposer","TYPE OF SECURITY", "NO. OF SECURITIES", "ACQUISTION/DISPOSAL", "PUBLISH DATE/TIME", "ATTACHMENT"]
        }
      }
    },
    "fifty_two_weeks_high": {
        "as_on_date_time_selector": ".asondatetime",
        "storage_dir_suffix": process.env.NSE_52W_HIGH_LOW ? process.env.NSE_52W_HIGH_LOW : "nse_52w_high_low",
        "disclosure_url": process.env.NSE_52W_HIGH_URL ? process.env.NSE_52W_HIGH_URL  : "https://www.nseindia.com/market-data/52-week-high-equity-market",
        "tabs":{
            "52week_high":{
                "tableQuerySelector": "#cm_52week_high_table",
                "column_headers": ["SYMBOL", "SERIES", "LTP", "CHANGE_PERCENT", "NEW_52W_HIGH", "PREV_HIGH", "PREV_HIGH_DATE"]
            }
        }
    },
    "fifty_two_weeks_low": {
        "as_on_date_time_selector": ".asondatetime",
        "storage_dir_suffix": process.env.NSE_52W_HIGH_LOW ? process.env.NSE_52W_HIGH_LOW : "nse_52w_high_low",
        "disclosure_url": process.env.NSE_52W_LOW_URL ? process.env.NSE_52W_LOW_URL  : "https://www.nseindia.com/market-data/52-week-low-equity-market",
        "tabs":{
            "52week_low":{
                "tableQuerySelector": "#cm_52week_low_table",
                "column_headers": ["SYMBOL", "SERIES", "LTP", "CHANGE_PERCENT", "NEW_52W_LOW", "PREV_LOW", "PREV_LOW_DATE"]
            }
        }
    }
  }
class NSEScraper {
    constructor(typeOfDisclosure, isMaster, filesToDownload) {
        this.browser = null;
        this.page = null;
        this.typeOfDisclosure = typeOfDisclosure;
        this.disclosureConfig = disclosures[typeOfDisclosure]
        this.isMaster = isMaster
        this.storage_dir = path.join(process.env.DATA_ROOT_FOLDER, this.disclosureConfig["storage_dir_suffix"]);
        //this.announcement_url = announcement_url;
        
        
        this.filesToDownload = filesToDownload
        this.tableKeys = Object.keys(this.disclosureConfig.tabs) //["sme", "equities"] e.g. announcements
        //this.tableKeys.forEach(k => this.filesToDownload[k] = [])
        
        //["https://nsearchives.nseindia.com/corporate/RPOWER_22022025220130_Reliance_Power_Limited_Newspaper_Publication.pdf", "https://nsearchives.nseindia.com/corporate/AKZOINDIA_22022025204853_AkzoIndia_Reg30_Intimation_UPGST_SCNFY20_21_26Nov2024_Update22Feb25.pdf"]

    }
    extractDateComponents(dateStr) {
        const date = moment(dateStr, "DD-MMM-YYYY HH:mm:ss");
        return [date.format("YYYY"), date.format("MM"), date.format("DD")];
    }
    parseNumber(value){
        if (typeof value !== 'string') return isNaN(value) ? 0 : value;
        const num = parseFloat(value.replace(/,/g, ''));
        return isNaN(num) ? 0 : num;
    };
    async scrapeTables() {
        //tableQuerySelectors, headersForSegment
        this.browser = await puppeteer.launch(launchOptions);
        this.page = await this.browser.newPage();
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

        await this.page.goto(this.disclosureConfig.disclosure_url, { waitUntil: 'networkidle2' });
        await delay(10000);
        let documentLinksDownloaded = {}; //{ "sme": [], "equities": [] }
        this.tableKeys.forEach(k => documentLinksDownloaded[k] = [])
        let tableData = []
        
        tableData = await this.page.evaluate((disclosureConfig) => {
            const columnHeaders = {}
            const tables = {}
            const tableKeys = Object.keys(disclosureConfig.tabs)
            tableKeys.forEach(k => tables[k] = document.querySelector(disclosureConfig.tabs[k].tableQuerySelector))
            tableKeys.forEach(k => columnHeaders[k] = disclosureConfig.tabs[k].column_headers)
            
            let asondatetime;
            if (disclosureConfig.as_on_date_time_selector){
                    const element = document.querySelector('.asondatetime');
                    asondatetime = element ? element.textContent.trim() : null;
            }
            console.log("asondatetime", asondatetime)
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
                        if (disclosureConfig.as_on_date_time_selector){
                            record["AS_ON_DATE_TIME"] = asondatetime
                        }
                        console.log("parsed record", record)
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
        //this.browser.close()
        console.log("tableData", tableData)
        if (this.isMaster) return tableData
        console.log("Child Simulator processTableData", this.disclosureConfig)
        documentLinksDownloaded = await this.processTableData(tableData, this.tableKeys)
       
        console.log("Scraping done")
        return documentLinksDownloaded;
    }
    async updateGQL(announcement, index, year, month, day){
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
    }
    async updateActivityLog(announcement, index, year, month, day){
        try {
            fs.appendFileSync(path.join(this.storage_dir, year, month, day, index, "activity.log"), JSON.stringify(announcement) + ",\n")
        }
        catch (e) {
            console.error(e)
        }
    }
    //keys ['equities', 'sme']
    //dateTimeColumnKey - "BROADCAST DATE/TIME"
    //documentType = pdf
    //skipExtension=".xml"
    async processTableData(tableData, keys){
        let documentLinksDownloaded = {}
        if (!tableData) {
            return documentLinksDownloaded
        }
        keys.forEach(k => documentLinksDownloaded[k] = [])
        for (const index of keys) {
            for (const announcement of tableData[index]) {
                const [year, month, day] = this.extractDateComponents(announcement["BROADCAST DATE/TIME"]);
                const targetPath = path.join(this.storage_dir, year, month, day, index, "pdf")
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
                    
                }
                if (announcement.ATTACHMENT && this.filesToDownload[index].findIndex(item => item.ATTACHMENT === announcement.ATTACHMENT) > -1) {
                    console.log("checking pdf", announcement.ATTACHMENT, targetPath)
                    const fileToks = announcement.ATTACHMENT.split('/')
                    const fileName = fileToks[fileToks.length - 1]
                    if (fs.existsSync(path.join(targetPath, fileName))) {
                        console.log("Target PDF exists. Skip", targetPath)
                    }
                    else {
                        await fetchPDF(announcement.ATTACHMENT, path.join(targetPath, fileName), SMART_PROXY_URL)
                        try {
                            await uploadFileToS3("announcementsnse", this.storage_dir, path.join(year, month, day, index, "pdf", fileName))
                        }
                        catch (e) {
                            console.log("Upload to S3 failed")
                            console.error(e)
                        }
                        await this.updateGQL(announcement, index, year, month, day)
                        await this.updateActivityLog(announcement, index, year, month, day)
                        documentLinksDownloaded[index].push(announcement.ATTACHMENT)
                    }

                }
            }
        }
        return documentLinksDownloaded
    }
    //}

}
module.exports = NSEScraper