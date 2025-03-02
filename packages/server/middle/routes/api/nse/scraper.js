const WebsiteTrafficSimulator = require("./WebsiteTrafficSimulator")
const route = async(req, res) => {
  
    const announcementSimulator = new WebsiteTrafficSimulator("announcements", true, {"sme": [], "equities": []});
    await announcementSimulator.simulateTraffic();

    const insiderTradesSimulator = new WebsiteTrafficSimulator("insider_trades", true, {"insider_trades": []});
    await insiderTradesSimulator.simulateTraffic();

  res.status(200).json("ok")
}
module.exports = route