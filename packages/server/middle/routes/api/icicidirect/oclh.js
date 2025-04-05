//const Breeze = require("./breeze")

//const breeze = new Breeze()
//breeze.subscribeFeed("4.1!1594", "1minute").then(resp => console.log(resp))
//breeze.subscribeFeed("4.2!1594", "1minute").then(resp => console.log(resp))

//breeze.subscribeFeed("INFTEC", "1minute").then(resp => console.log(resp))
//breeze.loadHistoricalData("1minute")

const Breeze = require("./breeze");
const moment = require("moment");

(async () => {
	const breeze = await Breeze.init();

	const fromTime = moment().set({ hour: 9, minute: 15, second: 0, millisecond: 0 }).utcOffset("+05:30").toISOString();
	const toTime = moment().set({ hour: 15, minute: 30, second: 0, millisecond: 0 }).utcOffset("+05:30").toISOString();

	await breeze.loadHistoricalData("1minute", fromTime, toTime);

	const fy24Start = moment().subtract(1, 'year').utcOffset("+05:30").set({ month: 3, date: 1, hour: 9, minute: 15, second: 0, millisecond: 0 });
	//console.log(fy24Start, toTime)
	//await breeze.loadHistoricalData("1day", fy24Start, toTime)
	console.log("Loading Done")
	
})();
