const WebsiteTrafficSimulator = require("./WebsiteTrafficSimulator")
const FiftyTwoWeekHighLowScraper = require("./FiftyTwoWeekHighLowScraper")
const route = async(req, res) => {
  
    /*const announcementSimulator = new WebsiteTrafficSimulator("announcements", true, {"sme": [], "equities": []});
    await announcementSimulator.simulateTraffic();

    const insiderTradesSimulator = new WebsiteTrafficSimulator("insider_trades", true, {"insider_trades": []});
    await insiderTradesSimulator.simulateTraffic();*/

    const fifty_two_weeks_high = new FiftyTwoWeekHighLowScraper("fifty_two_weeks_high", false, {"fifty_two_weeks_high": []});
    await fifty_two_weeks_high.scrapeTables();

    const fifty_two_weeks_low = new FiftyTwoWeekHighLowScraper("fifty_two_weeks_low", false, {"fifty_two_weeks_low": []});
    await fifty_two_weeks_low.scrapeTables();

    /*const fifty_two_weeks_low = new WebsiteTrafficSimulator("fifty_two_weeks_low", true, {"fifty_two_weeks_low": []});
    await fifty_two_weeks_low.simulateTraffic();*/


  res.status(200).json("ok")
}
module.exports = route