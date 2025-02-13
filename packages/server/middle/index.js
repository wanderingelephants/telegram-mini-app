const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 3000;
const cron = require('node-cron');
const crypto = require('crypto')
const cookieParser = require('cookie-parser');
const ProcessETFQuotes = require('./routes/api/nse/processETFQuotes')

const { promisify } = require('util');


/*cron.schedule('0 12 * * 1-5', async () => {
  console.log('running a task during market hours of NSE', new Date());
  let jsonFileName = new Date().toISOString().split('T')[0]
  const processor = new ProcessETFQuotes("https://www.nseindia.com",  "/api/etf", jsonFileName + '.json')
  await processor.process()
}, {timezone: "Asia/Kolkata"});
*/
/*const serviceAccount = process.env.NODE_ENV === 'production'
  ? require('./config/firebase-admin-prod.json')
  : require('./config/dipsip2025-firebase-admin-dev.json');*/

/*app.post('/api/auth/google', async (req, res) => {
  
});

// Protected route example
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});*/
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
