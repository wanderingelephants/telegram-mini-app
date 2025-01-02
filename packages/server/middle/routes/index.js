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
        nse: {
            receive: require('./api/nse/receive'),
            publish: require('./api/nse/publish'),
            process: require('./api/nse/process'),
            download: require('./api/nse/download'),
            instruments: require('./api/nse/instruments')
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
        telegram:{
            auth: require('./api/telegram/auth'),
            //notify: require('./api/telegram/notify')
        },
        
    }
};
router.get('/api/telegram/auth', routes.api.telegram.auth)
//router.get('/api/telegram/notify', routes.api.telegram.notify)
router.get('/api/db/create', routes.api.db.create)
router.post('/api/db/import', routes.api.db.import)
router.get('/api/db/getuser', routes.api.db.getuser)
router.post('/api/db/updateuser', routes.api.db.updateuser)
router.post('/api/db/saveconfig', routes.api.db.saveconfig)
router.get('/api/kite/order/create', routes.api.kite.order.create)
router.get('/api/kite/login/success', routes.api.kite.login.success)
router.get('/api/kite/instrument/quote', routes.api.kite.instrument.quote)
router.post('/api/nse/receive', routes.api.nse.receive)
router.post('/api/nse/download', routes.api.nse.download)
router.get('/api/nse/process', routes.api.nse.process)
router.get('/api/nse/instruments', routes.api.nse.instruments)


module.exports = router
