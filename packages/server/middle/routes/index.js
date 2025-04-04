const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const config = process.env.CONFIG
const serviceAccount = require(`${config}/firebase-admin.json`)

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});
const verifyInternalHeader = async(req, res, next) => {
    if (req.headers['x-internal-request'] !== 'true') {
        return res.status(403).send('Forbidden');
    }
    next()
}
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
            reasoning: require("./api/chat/reasoning_v2"),
            share: require("./api/chat/share"),
            setalert: require("./api/chat/setalert"),
            view: require("./api/chat/view"),
            runPrompt: require("./api/chat/runPrompt"),
            promptfields: require("../cmots/endpoints/promptfields"),
            arrayview: require("./api/chat/arrayview")
        },
        company:{
            details: require("./api/company/details"),
            list: require("./api/company/list")
        },
        cmots:{
            company: require("../cmots/endpoints/company"),
            master: require("../cmots/endpoints/master"),
            fromdatetodate: require("../cmots/endpoints/fromdatetodate")
        },
        icicidirect:{
            login: require("./api/icicidirect/login")
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
                eod: require("./api/kite/instrument/eod"),
                dipsipalert: require("./api/kite/instrument/dipsipalert")
            }
        },
        mutualfunds: {
            //migrate: require("./api/mutualfunds/migrate_to_pg"),
            list: require("./api/mutualfunds/list"),
            analyze: require("./api/mutualfunds/analyze"),
            recommend: require("./api/mutualfunds/recommend"),
            //scrape: require("./api/mutualfunds/scrapeLocalfile"),
            categoryScrape: require("./api/mutualfunds/categoryScrape")
        },
        nse: {
            announcements: require("./api/nse/announcements"),
            summaries: require("./api/nse/summaries"),
            sendSummaries: require("./api/nse/sendSummaryEmails"),
            insider: require("./api/nse/process_insider_csv"),
            marketclose: require("./api/nse/market_close")
        },
        telegram:{
            auth: require("./api/telegram/auth")
        },

        
    }
};
router.post("/api/auth/google", routes.api.auth.google)
router.get("/api/auth/callback", routes.api.auth.callback)
router.get("/api/company/details/:symbol/:entity", verifyToken, routes.api.company.details)
router.get("/api/company/list", routes.api.company.list)
router.get("/api/chat/arrayview", verifyAdminToken, routes.api.chat.arrayview)
router.get("/api/internal/data", verifyInternalHeader, routes.api.chat.arrayview)
router.post("/api/chat/reasoning", verifyToken, routes.api.chat.reasoning)
router.post("/api/chat/runPrompt", verifyToken, routes.api.chat.runPrompt)
router.post("/api/chat/share", verifyToken, routes.api.chat.share)
router.post("/api/chat/setalert", verifyToken, routes.api.chat.setalert)
router.get("/api/chat/view", routes.api.chat.view)
router.get("/api/chat/promptfields", routes.api.chat.promptfields)
router.post("/api/chat/summary", routes.api.chat.reasoning)
router.get("/api/cmots/master/:apiType", routes.api.cmots.master)
router.get("/api/cmots/master/:apiType/:categoryId", routes.api.cmots.master)
router.get("/api/cmots/company/:apiType/:companyId", routes.api.cmots.company)
router.get("/api/cmots/company/:apiType/:companyId/:standaloneConsolidated", routes.api.cmots.company)
router.get("/api/cmots/fromdatetodate/:apiType/:fromdate/:todate", routes.api.cmots.fromdatetodate)
router.post("/api/telegram/auth", routes.api.telegram.auth)
router.get("/api/kite/order/create", routes.api.kite.order.create)
router.post("/api/icicidirect/login", routes.api.icicidirect.login)

router.get("/api/kite/login/success", routes.api.kite.login.success)
router.get("/api/kite/instrument/quote", routes.api.kite.instrument.eod)
router.get("/api/kite/instrument/eod", routes.api.kite.instrument.eod)
router.get("/api/kite/instrument/dipsipalert", routes.api.kite.instrument.dipsipalert)
router.post("/api/mutualfunds/analyze", routes.api.mutualfunds.analyze)
router.post("/api/mutualfunds/recommend", routes.api.mutualfunds.recommend)
router.get("/api/mutualfunds/list", routes.api.mutualfunds.list)
//router.get("/api/mutualfunds/scrape", routes.api.mutualfunds.scrape)
router.post("/api/mutualfunds/categoryScrape", routes.api.mutualfunds.categoryScrape)
router.get("/api/nse/marketclose", routes.api.nse.marketclose)
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


module.exports = router
