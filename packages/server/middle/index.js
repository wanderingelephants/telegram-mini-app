const express = require('express')
const bodyParser = require('body-parser');
const axios = require("axios")
const app = express()
const port = process.env.PORT || 3000;
const cron = require('node-cron');
const crypto = require('crypto')
const cookieParser = require('cookie-parser');
const ProcessETFQuotes = require('./routes/api/nse/processETFQuotes')
const route = require("./routes/api/kite/instrument/eod")
const { promisify } = require('util');
const summaryServiceUrl = process.env.SUMMARY_SERVICE_URL
const processInstruments = require("./utils/process_instruments")
/*cron.schedule('0 12 * * 1-5', async () => {
  console.log('running a task during market hours of NSE', new Date());
  let jsonFileName = new Date().toISOString().split('T')[0]
  const processor = new ProcessETFQuotes("https://www.nseindia.com",  "/api/etf", jsonFileName + '.json')
  await processor.process()
}, {timezone: "Asia/Kolkata"});
*/
cron.schedule('32 15 * * 1-5', async () => {
  console.log('end of market', new Date());
  await processInstruments()
  const todayStr = (new Date()).toISOString().split("T")[0]
  let req = {"query": {"dateStr": todayStr}}
  let res = {status: (code) => {console.log(code)}, json: (msg) => {console.log(msg)}}
  await route(req, res)  
}, {timezone: "Asia/Kolkata"});
cron.schedule('5 0 * * *', async () => {
  try {
    const t1 = Date.now(); 
    if (!summaryServiceUrl) {
      console.log("Summary Service url not found")
      return;
    }
    // Compute yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toLocaleDateString('en-GB').split('/').join('-'); // Converts to dd-mm-yyyy
    let summaryUrl = `${summaryServiceUrl}/api/nse/summaries?summaryDate=${formattedDate}&index=sme`;
    console.log(`Invoking: ${summaryUrl}`);
    let response = await axios.get(summaryUrl);
    const t2 = Date.now(); // End time
    console.log('SME Summary API response:', response.data);
    console.log(`SME Execution time: ${(t2 - t1)} ms`); 
    summaryUrl = `${summaryServiceUrl}/api/nse/summaries?summaryDate=${formattedDate}&index=equities`;
    console.log(`Invoking: ${summaryUrl}`);
    response = await axios.get(summaryUrl);
    console.log('Equities Summary API response:', response.data);
    const t3 = Date.now();
    console.log(`Equities Execution time: ${(t3 - t2)} ms`); // Log time taken
  } catch (error) {
    console.error('Error calling summary API:', error);
  }
}, {timezone: "Asia/Kolkata"});
app.use([
  bodyParser.urlencoded({limit: '5mb', extended: true}),
  express.json({limit: '5mb'})
  ]);
  app.use(async (err, req, res, next) => {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        error: 'Token expired', 
        code: 'TOKEN_EXPIRED'
      })
    }
    next(err)
  })  
  app.use(cookieParser());
  app.use((req, res, next) => {
    // Check if session cookie exists
    let sessionId = req.cookies?.dSessionID;
    console.log("sesionID recd", sessionId)
    if (!sessionId) {
      // Generate a simple session ID
      sessionId = crypto.randomUUID();
      res.cookie('dSessionID', sessionId, { httpOnly: true });
    }
  
    req.sessionId = sessionId;
    next();
  });
app.use('/', require('./routes'));

app.listen(port, () => {
    console.log(`api server running on port: ${port}`)
})
