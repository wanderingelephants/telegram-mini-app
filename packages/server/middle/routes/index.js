const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const config = process.env.CONFIG
const serviceAccount = require(`${config}/firebase-admin.json`)

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});
const verifyAdminToken = async (req, res, next) => {
    try {
      const idToken = req.headers.authorization?.split("Bearer ")[1];
      if (!idToken) {
        return res.status(401).json({ error: "No token provided" });
      }
    
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      //req.user = decodedToken;
      if (decodedToken.email !== process.env.ADMIN_ID) res.status(401).json({error: "Unauthorized"})
      else next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
    };
const verifyToken = async (req, res, next) => {
try {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) {
    return res.status(401).json({ error: "No token provided" });
  }
  console.log("route token verified")
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  req.user = decodedToken;
  next();
} catch (error) {
  res.status(401).json({ error: "Invalid token" });
}
};

const routes = {
    api: {
        auth: {
            google: require("./api/auth/google"),
            callback: require("./api/auth/callback")
        },
        chat: {
            reasoning: require("./api/chat/reasoning_v2")
        },
        db: {
            create: require("./api/db/create"),
            import: require("./api/db/import"),
            getuser: require("./api/db/getuser"),
            updateuser: require("./api/db/updateuser"),
            saveconfig: require("./api/db/saveconfig")
        },
        indices: {
            AUTOBEES: require("./api/indices/AUTOBEES.json"),
            BANKBEES: require("./api/indices/BANKBEES.json"),
            etf_funds_data: require("./api/indices/etf_funds_data.json"),
            indexFunds: require("./api/indices/indexFunds.json"),
            GOLDBEES: require("./api/indices/GOLDBEES.json"),
            ITBEES: require("./api/indices/ITBEES.json"),
            MAKEINDIA: require("./api/indices/MAKEINDIA.json"),
            MID150BEES: require("./api/indices/MID150BEES.json"),
            NIFTYBEES: require("./api/indices/NIFTYBEES.json"),
            PHARMABEES: require("./api/indices/PHARMABEES.json"),
            SHARIABEES: require("./api/indices/SHARIABEES.json"),
            SILVERBEES: require("./api/indices/SILVERBEES.json"),
            SMALLCAP: require("./api/indices/SMALLCAP.json"),
            TNIDETF: require("./api/indices/TNIDETF.json"),
        },
        kite:{
            order: {
                create: require("./api/kite/order/create")
            },
            login: {
                success: require("./api/kite/login/success")
            },
            instrument: {
                quote: require("./api/kite/instrument/quote"),
                eod: require("./api/kite/instrument/eod")
            }
        },
        mutualfunds: {
            migrate: require("./api/mutualfunds/migrate_to_pg"),
            list: require("./api/mutualfunds/list"),
            analyze: require("./api/mutualfunds/analyze"),
            recommend: require("./api/mutualfunds/recommend"),
            scrape: require("./api/mutualfunds/scrapeLocalfile"),
            categoryScrape: require("./api/mutualfunds/categoryScrape")
        },
        nse: {
            receive: require("./api/nse/receive"),
            publish: require("./api/nse/publish"),
            process: require("./api/nse/process"),
            announcements: require("./api/nse/announcements"),
            instruments: require("./api/nse/instruments"),
            summaries: require("./api/nse/processSummaries"),
            sendSummaries: require("./api/nse/sendSummaryEmails"),
            insider: require("./api/nse/process_insider_csv"),
            scraper: require("./api/nse/scraper")
        },
        /*ollama:{
            singleShotStream: require("./api/ollama/singleShotStream"),
            promptInstruct: require("./api/ollama/question"),
        },*/
        telegram:{
            auth: require("./api/telegram/auth")
        },

        
    }
};
router.post("/api/auth/google", routes.api.auth.google)
router.get("/api/auth/callback", routes.api.auth.callback)
router.get("/api/mutualfunds/migrate", routes.api.mutualfunds.migrate)
router.post("/api/chat/reasoning", routes.api.chat.reasoning)
router.post("/api/telegram/auth", routes.api.telegram.auth)
router.post("/api/db/create", verifyAdminToken, routes.api.db.create)
router.post("/api/db/import", routes.api.db.import)
router.get("/api/db/getuser", routes.api.db.getuser)
router.post("/api/db/updateuser", routes.api.db.updateuser)
router.post("/api/db/saveconfig", routes.api.db.saveconfig)
router.get("/api/kite/order/create", routes.api.kite.order.create)
router.get("/api/kite/login/success", routes.api.kite.login.success)
router.get("/api/kite/instrument/quote", routes.api.kite.instrument.eod)
router.get("/api/kite/instrument/eod", routes.api.kite.instrument.eod)
router.post("/api/mutualfunds/compare", routes.api.mutualfunds.analyze)
router.post("/api/mutualfunds/recommend", routes.api.mutualfunds.recommend)
router.get("/api/mutualfunds/list", routes.api.mutualfunds.list)
router.get("/api/mutualfunds/scrape", routes.api.mutualfunds.scrape)
router.post("/api/mutualfunds/categoryScrape", routes.api.mutualfunds.categoryScrape)
router.post("/api/nse/receive", routes.api.nse.receive)
router.post("/api/nse/announcements", routes.api.nse.announcements)
router.post("/api/nse/process", routes.api.nse.process)
router.get("/api/nse/insider", routes.api.nse.insider)
router.get("/api/nse/scraper", routes.api.nse.scraper)
router.get("/api/nse/instruments", routes.api.nse.instruments)
router.get("/api/nse/summaries", routes.api.nse.summaries)
router.get("/api/nse/sendSummaries", routes.api.nse.sendSummaries)

router.get("/api/indices/AUTOBEES", (req, res) => {res.status(200).json(routes.api.indices.AUTOBEES)})
router.get("/api/indices/BANKBEES", (req, res) => {res.status(200).json(routes.api.indices.BANKBEES)})
router.get("/api/indices/etf_funds_data", (req, res) => {res.status(200).json(routes.api.indices.etf_funds_data)})
router.get("/api/indices/indexFunds", (req, res) => {res.status(200).json(routes.api.indices.indexFunds)})
router.get("/api/indices/GOLDBEES", (req, res) => {res.status(200).json(routes.api.indices.GOLDBEES)})
router.get("/api/indices/ITBEES", (req, res) => {res.status(200).json(routes.api.indices.ITBEES)})
router.get("/api/indices/MAKEINDIA", (req, res) => {res.status(200).json(routes.api.indices.MAKEINDIA)})
router.get("/api/indices/MID150BEES", (req, res) => {res.status(200).json(routes.api.indices.MID150BEES)})
router.get("/api/indices/NIFTYBEES", (req, res) => {res.status(200).json(routes.api.indices.NIFTYBEES)})
router.get("/api/indices/PHARMABEES", (req, res) => {res.status(200).json(routes.api.indices.PHARMABEES)})
router.get("/api/indices/SHARIABEES", (req, res) => {res.status(200).json(routes.api.indices.SHARIABEES)})
router.get("/api/indices/SILVERBEES", (req, res) => {res.status(200).json(routes.api.indices.SILVERBEES)})
router.get("/api/indices/SMALLCAP", (req, res) => {res.status(200).json(routes.api.indices.SMALLCAP)})
router.get("/api/indices/TNIDETF", (req, res) => {res.status(200).json(routes.api.indices.TNIDETF)})

//router.post("/api/mutualfunds/chatStream", routes.api.ollama.singleShotStream)
//router.post("/api/ollama/promptInstruct", routes.api.ollama.promptInstruct)
//router.post("/api/reasoning/promptChat", routes.api.ollama.promptInstruct)


module.exports = router
