const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const config = process.env.CONFIG
const serviceAccount = require(`${config}/firebase-admin.json`)

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});
const verifyAdminToken = async (req, res, next) => {
    try {
      const idToken = req.headers.authorization?.split('Bearer ')[1];
      if (!idToken) {
        return res.status(401).json({ error: 'No token provided' });
      }
    
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      //req.user = decodedToken;
      if (decodedToken.email !== process.env.ADMIN_ID) res.status(401).json({error: 'Unauthorized'})
      else next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
    };
const verifyToken = async (req, res, next) => {
try {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'No token provided' });
  }
  console.log('route token verified')
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  req.user = decodedToken;
  next();
} catch (error) {
  res.status(401).json({ error: 'Invalid token' });
}
};

const routes = {
    api: {
        auth: {
            google: require('./api/auth/google')
        },
        db: {
            create: require('./api/db/create'),
            import: require('./api/db/import'),
            getuser: require('./api/db/getuser'),
            updateuser: require('./api/db/updateuser'),
            saveconfig: require('./api/db/saveconfig')
        },
        kite:{
            order: {
                create: require('./api/kite/order/create')
            },
            login: {
                success: require('./api/kite/login/success')
            },
            instrument: {
                quote: require('./api/kite/instrument/quote')
            }
        },
        mutualfunds: {
            list: require('./api/mutualfunds/list'),
            analyze: require('./api/mutualfunds/analyze'),
            categoryScrape: require('./api/mutualfunds/categoryScrape')
        },
        nse: {
            receive: require('./api/nse/receive'),
            publish: require('./api/nse/publish'),
            process: require('./api/nse/process'),
            announcements: require('./api/nse/announcements'),
            instruments: require('./api/nse/instruments')
        },
        ollama:{
            singleShotStream: require('./api/ollama/singleShotStream'),
            promptInstruct: require('./api/ollama/question'),
            promptChat: require('./api/ollama/promptChat'),
        },
        telegram:{
            auth: require('./api/telegram/auth')
        },

        
    }
};
router.post('/api/auth/google', routes.api.auth.google)
router.post('/api/telegram/auth', routes.api.telegram.auth)
router.post('/api/db/create', verifyAdminToken, routes.api.db.create)
router.post('/api/db/import', routes.api.db.import)
router.get('/api/db/getuser', routes.api.db.getuser)
router.post('/api/db/updateuser', routes.api.db.updateuser)
router.post('/api/db/saveconfig', verifyToken, routes.api.db.saveconfig)
router.get('/api/kite/order/create', routes.api.kite.order.create)
router.get('/api/kite/login/success', routes.api.kite.login.success)
router.get('/api/kite/instrument/quote', routes.api.kite.instrument.quote)
router.post ('/api/mutualfunds/compare', routes.api.mutualfunds.analyze)
router.get('/api/mutualfunds/list', verifyToken, routes.api.mutualfunds.list)
router.post('/api/mutualfunds/categoryScrape', routes.api.mutualfunds.categoryScrape)
router.post('/api/mutualfunds/chatStream', routes.api.ollama.singleShotStream)
router.post('/api/nse/receive', routes.api.nse.receive)
router.post('/api/nse/announcements', routes.api.nse.announcements)
router.post('/api/nse/process', routes.api.nse.process)
router.get('/api/nse/instruments', routes.api.nse.instruments)
router.post('/api/ollama/promptInstruct', routes.api.ollama.promptInstruct)
router.post('/api/ollama/promptChat', routes.api.ollama.promptChat)


module.exports = router
