const FiftyTwoWeekHighLowScraper = require("./FiftyTwoWeekHighLowScraper")
const { getCurrentActivityBand } = require('../../../config/marketActivity');
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
const route = async (req, res) => {
    const { config } = getCurrentActivityBand();
    let sleepInterval = config.MIN_GAP_TO_START * (2 + Math.random())
    console.log("Market Close Jobs start Sleep for ", sleepInterval, new Date())
    await delay(sleepInterval)            
    const fifty_two_weeks_high = new FiftyTwoWeekHighLowScraper("fifty_two_weeks_high", false, {"fifty_two_weeks_high": []});
    await fifty_two_weeks_high.scrapeTables();
    await delay(sleepInterval)
    const fifty_two_weeks_low = new FiftyTwoWeekHighLowScraper("fifty_two_weeks_low", false, {"fifty_two_weeks_low": []});
    await fifty_two_weeks_low.scrapeTables();

}
module.exports = route