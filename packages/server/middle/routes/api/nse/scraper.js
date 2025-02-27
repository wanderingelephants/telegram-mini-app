const WebsiteTrafficSimulator = require("./WebsiteTrafficSimulator")
const NSEScraper = require("./NSEScraper")
const InsiderScraper = require("./InsiderScraper")
const route = async(req, res) => {
  
    const announcementSimulator = new WebsiteTrafficSimulator("announcements", true, {"sme": [], "equities": []});
    await announcementSimulator.simulateTraffic();

    const insiderTradesSimulator = new WebsiteTrafficSimulator("insider_trades", true, {"insider_trades": []});
    await insiderTradesSimulator.simulateTraffic();

    /*const tableQuerySelectors = {"sme": "#CFanncsmeTable", "equities": "#CFanncEquityTable"}
    const headersForSegment = {"sme": ["SYMBOL", "COMPANY NAME", "SUBJECT", "DETAILS", "ATTACHMENT", "BROADCAST DATE/TIME"],
    "equities": ["SYMBOL", "COMPANY NAME", "SUBJECT", "DETAILS", "ATTACHMENT", "BROADCAST DATE/TIME"]}
    
    const scraper = new NSEScraper([], false, path.join(process.env.DATA_ROOT_FOLDER, "nse_announcements"), process.env.ANNOUNCEMENT_URL);
    await scraper.scrapeTables(tableQuerySelectors, headersForSegment);

    const tableQuerySelectors = {"insider": "#table-CFinsidertrading"}
    const headersForSegment = {"insider": ["SYMBOL", "COMPANY NAME", "REGULATION","Name of the Acquirer/ Disposer","TYPE OF SECURITY", "NO. OF SECURITIES", "ACQUISTION/DISPOSAL", "PUBLISH DATE/TIME", "ATTACHMENT"]}
    
    const scraper = new InsiderScraper([], false, path.join(process.env.DATA_ROOT_FOLDER, "nse_insider_trades"), "https://www.nseindia.com/companies-listing/corporate-filings-insider-trading");
    await scraper.scrapeTables(tableQuerySelectors, headersForSegment);*/
  
  res.status(200).json("ok")
}
module.exports = route