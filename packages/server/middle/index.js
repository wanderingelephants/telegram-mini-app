const express = require('express')
const path = require("path")
const fs = require("fs")
const bodyParser = require('body-parser');
const axios = require("axios")
const app = express()
const port = process.env.PORT || 3000;
const cron = require('node-cron');
const crypto = require('crypto')
const cookieParser = require('cookie-parser');
const WebsiteTrafficSimulator = require("./routes/api/nse/WebsiteTrafficSimulator")
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const { DateTime } = require('luxon');

  cron.schedule('17 16 * * 1-5', async () => {
    console.log("Triggered EoD job", process.env.EOD_JOBS_ENABLED)
    if ("true" === process.env.EOD_JOBS_ENABLED){
      const now = DateTime.now().setZone('Asia/Kolkata');
  const date = now.toFormat('yyyy-MM-dd');
  const [year, month, day] = date.split('-');
  
      console.log("eod job", process.env.API_SERVER + `/api/kite/instrument/eod?dateStr=${year}-${month}-${day}`)
      let resp = await axios.get(process.env.API_SERVER + `/api/kite/instrument/eod?dateStr=${year}-${month}-${day}`)
      console.log("eod resp", resp)
      //resp = await axios.get(process.env.API_SERVER + "/api/nse/marketclose")
      console.log("eod resp", resp)
    }
    else console.log("EOD Jobs not enabled on this env")
  }, { timezone: "Asia/Kolkata" })
  cron.schedule('15 10 * * *', async () => {
    if ("true" === process.env.EOD_JOBS_ENABLED){
      const now = DateTime.now().setZone('Asia/Kolkata');
      const yesterday = now.minus({ days: 1 });
      const ydayFormatted = yesterday.toFormat('yyyy-MM-dd');
      const [year, month, day] = ydayFormatted.split("-")
      console.log("eod job", process.env.API_SERVER + `/api/nse/sendSummaries?dateStr=${year}-${month}-${day}`)
      resp = await axios.get(process.env.API_SERVER + `/api/nse/sendSummaries?dateStr=${year}-${month}-${day}`)
    }
    else console.log("EOD Jobs not enabled on this env")
  }, { timezone: "Asia/Kolkata" })
  cron.schedule('30 12 * * 1-5', async () => {
    console.log("Triggered DipSip Alert job", process.env.DIPSIP_ALERT_JOBS_ENABLED)
    if ("true" === process.env.DIPSIP_ALERT_JOBS_ENABLED){
      await axios.get(process.env.API_SERVER + "/api/kite/instrument/dipsipalert")
    }
    else console.log("DipSip Alert Jobs not enabled on this env")
  }, { timezone: "Asia/Kolkata" })
  cron.schedule('55 * * * *', async () => {
    if (!process.env.PDF_PROCESS_URL) {
      console.log("PDF_PROCESS_URL not  defined")
      return
    }
    console.log('Starting traffic simulation insider_trades at:', new Date().toISOString());
    //let simulator = new WebsiteTrafficSimulator("insider_trades", true, []);
    //await simulator.simulateTraffic();
    console.log('Done traffic simulation insider_trades at:', new Date().toISOString());
    simulator = new WebsiteTrafficSimulator("announcements", true, []);
    await simulator.simulateTraffic();
    console.log('Done traffic simulation announcements at:', new Date().toISOString());
  }, { timezone: "Asia/Kolkata" });
  cron.schedule('*/15 * * * *', async () => {
    console.log("cron pdf to text")
    /*if (process.env.PDF_DOWNLOAD_ENABLED && process.env.PDF_DOWNLOAD_ENABLED.toLowerCase() !== "true") {
      console.log("PDF not enabled on this env")
      return;
    }*/
    try {
    if (!process.env.PDF_PROCESS_URL) {
        console.log(new Date(), "cron PDF_PROCESS_URL not  defined")
        return
      }
      console.log(new Date(), "process website traffic")
      const announcement_dir = path.join(process.env.DATA_ROOT_FOLDER, process.env.NSE_ANNOUNCEMENTS ? process.env.NSE_ANNOUNCEMENTS : "nse_announcements");
      const now = DateTime.now().setZone('Asia/Kolkata');
      const date = now.toFormat('yyyy-MM-dd');
      const [year, month, day] = date.split('-');
      
      for (const index of ['equities', 'sme']) {
        const txtPath = path.join(year, month, day, index, "txt")
        await fs.mkdirSync(path.join(announcement_dir, txtPath), { recursive: true })
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
        await fs.mkdirSync(summaryPath, { recursive: true })
        const t1 = Date.now();
        await axios.get(process.env.API_SERVER_URL + `/api/nse/summaries?inputFolder=${txtPath}&outputFolder=${summaryPath}`)
        const t2 = Date.now();
        console.log(`Summary Task ${index} time taken: ${(t2 - t1)} ms`);
      }
  
    }
    catch (e) {
      console.error(e)
    }
  })
  
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
    try {
      let sessionId = req.cookies?.dSessionID;
      
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        res.cookie("dSessionID", sessionId, { httpOnly: true });
      }
  
      req.sessionId = sessionId;
      console.log("Incoming request req.method, req.url, req.body:", req.method, req.url, req.body);
      next(); // Proceed to the next middleware
    } catch (error) {
      console.error("Session middleware error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  app.use('/', require('./routes'));
  
  app.listen(port, () => {
    console.log(`api server running on port: ${port}`)
  })
  
  const dbManager = require("./routes/api/chat/DatabaseManager");

  dbManager.getData().then(fetch(`${process.env.DENO_HOST_PORT}/init`, {
    method: "POST"
  }).then(resp => console.log(resp)))

//})




