const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = process.env.PORT || 3000;
const cron = require('node-cron');
const ProcessETFQuotes = require('./routes/api/nse/processETFQuotes')
const admin = require('firebase-admin');
const Database = require('better-sqlite3');
const { promisify } = require('util');


cron.schedule('0 12 * * 1-5', async () => {
  console.log('running a task during market hours of NSE', new Date());
  let jsonFileName = new Date().toISOString().split('T')[0]
  const processor = new ProcessETFQuotes("https://www.nseindia.com",  "/api/etf", jsonFileName + '.json')
  await processor.process()
}, {timezone: "Asia/Kolkata"});

const serviceAccount = process.env.NODE_ENV === 'production'
  ? require('./config/firebase-admin-prod.json')
  : require('./config/dipsip2025-firebase-admin-dev.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });
app.use([
  bodyParser.urlencoded({extended: true}),
  express.json({limit: '1mb'})
]);

const verifyToken = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
app.post('/api/auth/google', async (req, res) => {
  console.log("API  AUTH GOOGLE", req.body)
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('decodedToken', decodedToken)
    // Check if user exists in Database, else create
    const user = db.prepare('SELECT * FROM users WHERE google_id = ?')
                  .get(decodedToken.sub);
    
    if (!user) {
      // Create new user
      db.prepare(`
        INSERT INTO users (google_id, email, display_name, photo_url) 
        VALUES (?, ?, ?, ?)
      `).run(
        decodedToken.sub,
        decodedToken.email,
        decodedToken.name,
        decodedToken.picture
      );
    } else {
      // Update last login time
      db.prepare(`
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE google_id = ?
      `).run(decodedToken.sub);
    }

    // Generate session token or use Firebase token
    res.json({ 
      tokenGoogle: idToken,
      userGoogle: {
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture
      }
    }).status(200);
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Protected route example
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

app.use('/', require('./routes'));

app.listen(port, () => {
    console.log(`api server running on port: ${port}`)
})
