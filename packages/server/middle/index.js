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
const WebsiteTrafficSimulator = require("./routes/api/nse/WebsiteTrafficSimulator")
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

cron.schedule('30 12 * * 1-5', async () => {
  console.log("Triggered DipSip Alert job", process.env.DIPSIP_ALERT_JOBS_ENABLED)
  if ("true" === process.env.DIPSIP_ALERT_JOBS_ENABLED){
    await axios.post(process.env.DIPSIP_API_SERVER + "/api/kite/instrument/dipsipalert")
  }
  else console.log("EOD Jobs not enabled on this env")
}, { timezone: "Asia/Kolkata" })
cron.schedule('55 * * * *', async () => {
  if (!process.env.PDF_PROCESS_URL) {
    console.log("PDF_PROCESS_URL not  defined")
    return
  }
  console.log('Starting traffic simulation at:', new Date().toISOString());
  const simulator = new WebsiteTrafficSimulator("insider_trades", true, []);
  await simulator.simulateTraffic();
  console.log('Done traffic simulation at:', new Date().toISOString());
}, { timezone: "Asia/Kolkata" });
cron.schedule('*/15 * * * *', async () => {
  console.log("pdf to text")
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
    const announcement_dir = path.join(process.env.DATA_ROOT_FOLDER, process.env.NSE_ANNOUNCEMENTS ? process.env.NSE_ANNOUNCEMENTS : "nse_announcements");

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


