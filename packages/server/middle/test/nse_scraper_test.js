const WebsiteTrafficSimulator = require("../routes/api/nse/WebsiteTrafficSimulator");
const FiftyTwoWeekHighLowScraper = require("../routes/api/nse/FiftyTwoWeekHighLowScraper")

//(async () => {
    const simulator = new WebsiteTrafficSimulator("announcements", true, []);
    simulator.simulateTraffic().then(resp => console.log(resp));

    //const fifty_two_weeks_high = new FiftyTwoWeekHighLowScraper("fifty_two_weeks_high", false, {"fifty_two_weeks_high": []});
    //fifty_two_weeks_high.scrapeTables().then(resp => console.log(resp));
        
//})();

  