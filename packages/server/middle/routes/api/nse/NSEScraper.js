const path = require('path');
const { DateTime } = require('luxon');

const { puppeteer, launchOptions } = require("../../../config/puppeteer")();

//const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
const fetchPDF = require("./pdfFetcher");
const SMART_PROXY_URL = process.env.SMART_PROXY_URL
//const announcement_url = process.env.ANNOUNCEMENT_URL
//const announcement_dir = process.env.NSE_ANNOUNCEMENTS_DOWNLOAD
//puppeteer.use(StealthPlugin);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NSEScraper {
    constructor(pdfsToDownload, isMaster){
        this.browser = null;
        this.page = null;
        this.announcement_url = process.env.ANNOUNCEMENT_URL;
        this.announcement_dir = process.env.NSE_ANNOUNCEMENTS_DOWNLOAD;
        
        this.isMaster = isMaster
        this.pdfsToDownload = pdfsToDownload//["https://nsearchives.nseindia.com/corporate/RPOWER_22022025220130_Reliance_Power_Limited_Newspaper_Publication.pdf", "https://nsearchives.nseindia.com/corporate/AKZOINDIA_22022025204853_AkzoIndia_Reg30_Intimation_UPGST_SCNFY20_21_26Nov2024_Update22Feb25.pdf"]
        
    }
    async scrapeAnnouncements() {
        const now = DateTime.now().setZone('Asia/Kolkata');
                const date = now.toFormat('yyyy-MM-dd');
                const [year, month, day] = date.split('-');
        
                console.log("NSEScraper", this.pdfsToDownload, this.isMaster)
                
        /*const targetPath = path.join(announcement_dir, year, month, day, index)
        console.log("make dir", targetPath)
        fs.mkdirSync(targetPath, {recursive: true})
        
        let activityLogs = []
        if (fs.existsSync(path.join(targetPath, "activity.log"))){
            const content = fs.readFileSync(path.join(targetPath, "activity.log"), "utf-8")
            activityLogs = JSON.parse("[" + content + "]")
        }
        console.log(activityLogs)*/
        //if (true) return;
        /*const puppetArgs = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-javascript',
            '--window-size=1920,1080',
            '--disable-dev-shm-usage', 
            '--disable-gpu', '--disable-setuid-sandbox']
        const puppetArgsToSend = useProxy === true ? [`--proxy-server=${SMART_PROXY_URL}`, ...puppetArgs] : puppetArgs
        this.browser = await puppeteer.launch({
            headless: true,
            args: puppetArgsToSend
        });
        this.browser = await puppeteer.launch({
            channel: 'chrome',     // Use system Chrome
            headless: false,       // Set to true if you want headless mode
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'  // Path to system Chrome
          });*/
        this.browser = await puppeteer.launch(launchOptions);  
        this.page = await this.browser.newPage();
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        
        await this.page.goto(this.announcement_url, { waitUntil: 'networkidle2' });
        await delay(5000);
        const pdfLinks = {"sme": [], "equities": []}
        //for (const index of ['equities', 'sme']) {
        //const table_id = index === "equities" ? 'CFanncEquityTable' : 'CFanncsmeTable'
        let announcementData = []
        announcementData = await this.page.evaluate(() => {
            const tables = {
                equities: document.querySelector('#CFanncEquityTable'),
                sme: document.querySelector('#CFanncsmeTable')
            };
            let data = {sme: [], equities: []}
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
                            else if (header === "BROADCAST DATE/TIME"){
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
        console.log("announcementData")
        console.log(announcementData)
        //console.log("PDFs length", index, announcementData)
        //if (this.isMaster)  return announcementData    
        await this.browser.close();
        for (const index of ['equities', 'sme']) {
            const targetPath = path.join(this.announcement_dir, year, month, day, index)
        
        for (const announcement of announcementData[index]){
            //console.log(announcement.ATTACHMENT, this.pdfsToDownload[index].indexOf(announcement.ATTACHMENT))
            if (announcement.ATTACHMENT) {
                pdfLinks[index].push(announcement.ATTACHMENT)
            }
            if (announcement.ATTACHMENT && this.pdfsToDownload[index].indexOf(announcement.ATTACHMENT) > -1){
                console.log("fetching pdf", announcement.ATTACHMENT, targetPath)
                const fileToks = announcement.ATTACHMENT.split('/')
                const fileName = fileToks[fileToks.length - 1]
                if (fs.existsSync(path.join(targetPath, fileName))){
                        console.log("Target PDF exists. Skip", targetPath)
                }
                else {
                    await fetchPDF(announcement.ATTACHMENT, path.join(targetPath, fileName), SMART_PROXY_URL)
                    try{
                        fs.appendFileSync(path.join(targetPath, "activity.log"), JSON.stringify(announcement)+",\n")
                    }   
                    catch(e){
                        console.error(e)
                    }
                }
                
            }
        }
    }

        return pdfLinks;
    }
    
//}
    
}
module.exports = NSEScraper