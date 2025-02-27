const express = require('express')
const path = require("path")
const fs = require("fs")
const { DateTime } = require('luxon');
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
const processInsiderCSV = require("./routes/api/nse/process_insider_csv")
const processInstruments = require("./utils/process_instruments")
const WebsiteTrafficSimulator = require("./routes/api/nse/WebsiteTrafficSimulator")
const dbManager = require('./routes/api/chat/DatabaseManager');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


/*sleep(20000) // 20 seconds delay
  .then(() => {
    console.log('Starting database initialization...');
    return dbManager.getData();
  })
  .then(data => {
    console.log('Database initialized successfully');
    // Store reference if needed
    const appData = data;
    
    // Start your server here
    startServer();
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1); // Exit if database initialization fails
  });
*/

function  startServer(){
  /*cron.schedule('55 * * * *', async () => {
    if (!process.env.PDF_PROCESS_URL) {
      console.log("PDF_PROCESS_URL not  defined")
      return
    }
    console.log('Starting traffic simulation at:', new Date().toISOString());
    const simulator = new WebsiteTrafficSimulator();
    await simulator.simulateTraffic();
    console.log('Done traffic simulation at:', new Date().toISOString());
  }, { timezone: "Asia/Kolkata" });*/
  //cron.schedule('*/15 * * * *', async () => {
    /*console.log("pdf to text")
    if (process.env.PDF_DOWNLOAD_ENABLED && process.env.PDF_DOWNLOAD_ENABLED.toLowerCase() !== "true") {
      console.log("PDF not enabled on this env")
      return;
    }
    try {
      if (!process.env.PDF_PROCESS_URL) {
        console.log("PDF_PROCESS_URL not  defined")
        return
      }
      const now = DateTime.now().setZone('Asia/Kolkata');
      const date = now.toFormat('yyyy-MM-dd');
      const [year, month, day] = date.split('-');
      const announcement_dir = process.env.NSE_ANNOUNCEMENTS_DOWNLOAD;
       
      for (const index of ['equities', 'sme']) {
        const txtPath = path.join(year, month, day, index, "txt")
        await fs.mkdirSync(path.join(announcement_dir,txtPath), { recursive: true })
        const pdfToTextInputPath = path.join(year, month, day, index, "pdf")
        const t1 = Date.now(); 
        await axios.get(process.env.PDF_PROCESS_URL + `/api/processPDFs?inputFolder=${pdfToTextInputPath}&outputFolder=${txtPath}`)
        const t2 = Date.now();
        console.log(`PDF Task ${index} time taken: ${(t2 - t1)} ms`); 
      
      }
      console.log("TRIGGER SUMMARY TASKS NOW")
      for (const index of ['equities', 'sme']) {
        const txtPath = path.join(announcement_dir, year, month, day, index, "txt")
        const summaryPath = path.join(announcement_dir, year, month, day, index, "summary")
        await fs.mkdirSync(summaryPath, {recursive: true})
        const t1 = Date.now(); 
        await axios.get(process.env.API_SERVER_URL + `/api/nse/summaries?inputFolder=${txtPath}&outputFolder=${summaryPath}`)
        const t2 = Date.now();
        console.log(`Summary Task ${index} time taken: ${(t2 - t1)} ms`); 
      }
  
    }
    catch (e) {
      console.error(e)
    }
  })*/
  /*cron.schedule('33 15 * * 1-5', async () => {
    console.log('end of market', new Date());
    const todayStr = (new Date()).toISOString().split("T")[0]
    let req = { "query": { "dateStr": todayStr } }
    let res = { status: (code) => { console.log(code) }, json: (msg) => { console.log(msg) } }
    await route(req, res)
  }, { timezone: "Asia/Kolkata" });*/
  app.use([
    bodyParser.urlencoded({ limit: '5mb', extended: true }),
    express.json({ limit: '5mb' })
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
    let sessionId = req.cookies?.dSessionID;
    console.log("sesionID recd", sessionId)
    if (!sessionId) {
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
}
startServer()

