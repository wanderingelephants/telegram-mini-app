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
    constructor(pdfsToDownload, isMaster) {
        this.browser = null;
        this.page = null;
        this.announcement_url = process.env.ANNOUNCEMENT_URL;
        this.announcement_dir = process.env.NSE_ANNOUNCEMENTS_DOWNLOAD;

        this.isMaster = isMaster
        this.pdfsToDownload = pdfsToDownload//["https://nsearchives.nseindia.com/corporate/RPOWER_22022025220130_Reliance_Power_Limited_Newspaper_Publication.pdf", "https://nsearchives.nseindia.com/corporate/AKZOINDIA_22022025204853_AkzoIndia_Reg30_Intimation_UPGST_SCNFY20_21_26Nov2024_Update22Feb25.pdf"]

    }
    async scrapeAnnouncements() {
        this.browser = await puppeteer.launch(launchOptions);
        this.page = await this.browser.newPage();
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

        await this.page.goto(this.announcement_url, { waitUntil: 'networkidle2' });
        await delay(5000);
        const pdfLinks = { "sme": [], "equities": [] }
        let announcementData = []
        announcementData = await this.page.evaluate(() => {
            const tables = {
                equities: document.querySelector('#CFanncEquityTable'),
                sme: document.querySelector('#CFanncsmeTable')
            };
            let data = { sme: [], equities: [] }
            for (const [idx, table] of Object.entries(tables)) {
                try {
                    //const table = document.querySelector(`#${tableId}`);
                    console.log("Table found:", !!table);

                    if (!table) return null;

                    const headers = ["SYMBOL", "COMPANY NAME", "SUBJECT", "DETAILS", "ATTACHMENT", "BROADCAST DATE/TIME"];
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

                    data[idx] = records;

                } catch (error) {
                    console.error("Error in data extraction:", error);
                    return null;
                }
            }
            return data;
        });
        console.log("announcementData", announcementData)
        for (const index of ['equities', 'sme']) {
            for (const announcement of announcementData[index]) {
                const [year, month, day] = extractDateComponents(announcement["BROADCAST DATE/TIME"]);
                const targetPath = path.join(this.announcement_dir, year, month, day, index, "pdf")
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
                    pdfLinks[index].push(announcement.ATTACHMENT)
                }
                if (announcement.ATTACHMENT && this.pdfsToDownload[index].indexOf(announcement.ATTACHMENT) > -1) {
                    console.log("checking pdf", announcement.ATTACHMENT, targetPath)
                    const fileToks = announcement.ATTACHMENT.split('/')
                    const fileName = fileToks[fileToks.length - 1]
                    if (fs.existsSync(path.join(targetPath, fileName))) {
                        console.log("Target PDF exists. Skip", targetPath)
                    }
                    else {
                        await fetchPDF(announcement.ATTACHMENT, path.join(targetPath, fileName), SMART_PROXY_URL)
                        try {
                            await uploadFileToS3(this.announcement_dir, path.join(year, month, day, index, "pdf", fileName))
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
                            fs.appendFileSync(path.join(this.announcement_dir, year, month, day, index, "activity.log"), JSON.stringify(announcement) + ",\n")
                        }
                        catch (e) {
                            console.error(e)
                        }
                    }

                }
            }
        }
        console.log("Scraping done")
        return pdfLinks;
    }

    //}

}
module.exports = NSEScraper