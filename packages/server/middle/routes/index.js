const express = require('express');
const router = express.Router();

const routes = {
    api: {
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
            compare: require('./api/mutualfunds/compare')
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
            prompt: require('./api/ollama/prompt'),
        },
        telegram:{
            auth: require('./api/telegram/auth')
        },

        
    }
};
router.post('/api/telegram/auth', routes.api.telegram.auth)
router.get('/api/db/create', routes.api.db.create)
router.post('/api/db/import', routes.api.db.import)
router.get('/api/db/getuser', routes.api.db.getuser)
router.post('/api/db/updateuser', routes.api.db.updateuser)
router.post('/api/db/saveconfig', routes.api.db.saveconfig)
router.get('/api/kite/order/create', routes.api.kite.order.create)
router.get('/api/kite/login/success', routes.api.kite.login.success)
router.get('/api/kite/instrument/quote', routes.api.kite.instrument.quote)
router.post ('/api/mutualfunds/compare', routes.api.mutualfunds.compare)
router.get('/api/mutualfunds/list', routes.api.mutualfunds.list)
router.post('/api/mutualfunds/chatStream', routes.api.ollama.singleShotStream)
router.post('/api/nse/receive', routes.api.nse.receive)
router.post('/api/nse/announcements', routes.api.nse.announcements)
router.get('/api/nse/process', routes.api.nse.process)
router.get('/api/nse/instruments', routes.api.nse.instruments)
router.post('/api/ollama/prompt', routes.api.ollama.prompt)


module.exports = router
