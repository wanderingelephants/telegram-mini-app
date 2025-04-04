//const Breeze = require("./breeze")

//const breeze = new Breeze()
//breeze.subscribeFeed("4.1!1594", "1minute").then(resp => console.log(resp))
//breeze.subscribeFeed("4.2!1594", "1minute").then(resp => console.log(resp))

//breeze.subscribeFeed("INFTEC", "1minute").then(resp => console.log(resp))
//breeze.loadHistoricalData("1minute")

const Breeze = require("./breeze");

(async () => {
	const breeze = await Breeze.init();
	await breeze.loadHistoricalData("1minute");
})();