const { DateTime } = require('luxon');
const { postToGraphQL } = require("../../../lib/helper");
const { isModuleNamespaceObject } = require('util/types');
const path = require('path');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const fs = require("fs")
const indexFundUrl =  "https://www.moneycontrol.com/mutual-funds/performance-tracker/navs/index-fundsetfs.html"
const { puppeteer, launchOptions } = require("../../../config/puppeteer")();

const scrape = async function(){
    this.browser = await puppeteer.launch(launchOptions);  
        this.page = await this.browser.newPage();
        await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
        
        await this.page.goto(indexFundUrl, { waitUntil: 'networkidle2' });
        await delay(5000);
        const indexFundsData = await this.page.evaluate(() => {
            const table = document.querySelector("#dataTableId");
            const rows = table.querySelectorAll('tbody tr[role="row"]');
            const records = Array.from(rows).map(row => {
                const record = {};
                const cells = Array.from(row.querySelectorAll('td'));
                //const firstCell = cells[0];
                
                const anchor = cells[0].querySelector('a');
                console.log(anchor)
                                if (anchor && anchor.childNodes.length > 0) {
                                    record["fund_name"] = anchor.childNodes[0].textContent.trim();
                                    console.log(anchor.childNodes[0].textContent.trim())
                                    record["url"] = anchor.href
                                } else {
                                    console.log("NO ANCHOR FOUND")
                                }
                record["plan"] = cells[1].textContent.trim()
                return record               
                
            })
            return  records
        })
    //console.log("indexFundsData", indexFundsData)
    try{
                            fs.writeFileSync(path.join(process.env.NSE_ANNOUNCEMENTS_DOWNLOAD, "indexFunds.json"), JSON.stringify(indexFundsData))
                        }   
                        catch(e){
                            console.error(e)
                        }
    await this.browser.close();    
}
const route = async(req, res) => {
    await scrape()
    res.status(200).json("ok")
}
module.exports = route