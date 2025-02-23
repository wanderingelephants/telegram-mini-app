const WebsiteTrafficSimulator = require("./WebsiteTrafficSimulator")
const route = async(req, res) => {
    const simulator = new WebsiteTrafficSimulator();
  await simulator.simulateTraffic();
  res.status(200).json("ok")
}
module.exports = route