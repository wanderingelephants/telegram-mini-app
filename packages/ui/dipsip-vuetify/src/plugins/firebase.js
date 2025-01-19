// src/plugins/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Create a function to get the config based on environment
const getFirebaseConfig = async () => {
  const env = process.env.NODE_ENV || 'development';
  
  try {
    if (env === 'production') {
      const prodConfig = await import('../config/firebase.config.prod.json');
      return prodConfig.default;
    } else {
      const devConfig = await import('../config/firebase.config.dev.json');
      return devConfig.default;
    }
  } catch (error) {
    console.error('Error loading Firebase config:', error);
    throw error;
  }
};

// Initialize Firebase with async setup
let app = null;
let auth = null;

const initializeFirebase = async () => {
  if (!app) {
    const config = await getFirebaseConfig();
    app = initializeApp(config);
    auth = getAuth(app);
  }
  return { app, auth };
};

export { initializeFirebase };
