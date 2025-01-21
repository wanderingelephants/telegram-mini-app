const Database = require('better-sqlite3');
const db = new Database(process.env.SQLITE_DB + '/dipsip.db', { verbose: console.log });
const admin = require('firebase-admin');
const config = process.env.CONFIG
const serviceAccount = require(`${config}/firebase-admin.json`)

/*admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});*/

const route = async(req, res) => {
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
}
module.exports = route