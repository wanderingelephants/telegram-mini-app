const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 3000;
const cron = require('node-cron');
const ProcessETFQuotes = require('./routes/api/nse/processETFQuotes')
cron.schedule('0 12 * * 1-5', async () => {
  console.log('running a task during market hours of NSE', new Date());
  let jsonFileName = new Date().toISOString().split('T')[0]
  const processor = new ProcessETFQuotes("https://www.nseindia.com",  "/api/etf", jsonFileName + '.json')
  await processor.process()
}, {timezone: "Asia/Kolkata"});

app.use([
    bodyParser.urlencoded({extended: true}),
    express.json({limit: '1mb'})
]);
app.use('/', require('./routes'));

app.listen(port, () => {
    console.log(`api server running on port: ${port}`)
})
