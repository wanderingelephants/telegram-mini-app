// src/plugins/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
console.log(process.env.NODE_ENV)
const firebaseConfig = process.env.NODE_ENV === 'production' 
  ? import('../config/firebase.config.prod.json')
  : import('../config/firebase.config.dev.json');
console.log("firebaseConfig", firebaseConfig)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

