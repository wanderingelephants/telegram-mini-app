const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs/promises');
const path = require('path');
const fetchPDF = require("./pdfFetcher");
const SMART_PROXY_URL = process.env.SMART_PROXY_URL
const announcement_url = process.env.ANNOUNCEMENT_URL
const announcement_dir = process.env.NSE_ANNOUNCEMENTS_DOWNLOAD
puppeteer.use(StealthPlugin);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NSEScraper {
    constructor(){
        this.browser = null;
        this.page = null;
        this.cookies = null;
        
        this.isPaused = false;
    }
    async scrapeAnnouncements(announcement_date, index) {
        if (this.isPaused) return;
        const puppetArgs = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--enable-javascript',
            '--window-size=1920,1080',
            '--disable-dev-shm-usage', 
            '--disable-gpu', '--disable-setuid-sandbox']
        const puppetArgsToSend = SMART_PROXY_URL ? [`--proxy-server=${SMART_PROXY_URL}`, ...puppetArgs] : puppetArgs
        this.browser = await puppeteer.launch({
            headless: true,
            args: puppetArgsToSend
        });
        this.page = await this.browser.newPage();
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        
        await this.page.goto(announcement_url, { waitUntil: 'networkidle2' });
        const toks = announcement_date.split("-")
        const targetPath = path.join(announcement_dir, toks[0], toks[1], toks[2], index)
        const table_id = index === "equities" ? 'CFanncEquityTable' : 'CFanncsmeTable'
        const rows = await this.page.$x(`//table[@id=$table_id]//tr`);
        for (let row of rows.slice(1)) { // Skipping header
            if (this.isPaused) break;
            const data = await this.extractRowData(row);
            console.log("Extracted data", data)
            if (data.pdfLink) {
                SMART_PROXY_URL ? await fetchPDF(data.pdfLink, targetPath, SMART_PROXY_URL) : await fetchPDF(data.pdfLink, targetPath)
            }
        }
    }
    async extractRowData(row) {
        const getText = async (xpath) => {
            const el = await row.$x(xpath);
            return el.length ? (await this.page.evaluate(el => el.textContent.trim(), el[0])) : '';
        };

        const symbol = await getText(".//td[1]");
        const companyName = await getText(".//td[2]");
        const subject = await getText(".//td[3]");
        const details = await getText(".//td[4]");
        const pdfElement = await row.$x(".//td[5]//a");
        const pdfLink = pdfElement.length ? await this.page.evaluate(el => el.href, pdfElement[0]) : '';
        const date = await getText(".//td[6]");

        return { symbol, companyName, subject, details, pdfLink, date };
    }

}
const route = async (req, res) => {
    try{
        const announcement_date = req.query.announcement_date
        const scraper = new NSEScraper()
        await scraper.scrapeAnnouncements(announcement_date)
        res.stauts(200).json("ok")
    }
    catch(e){
        console.error(e)
        res.status(500).json(e)
    }
}   
module.exports = route