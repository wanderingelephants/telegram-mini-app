// src/plugins/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
//import firebaseConfig from '../config/firebase.config.dev.json'
const firebaseConfig = process.env.NODE_ENV === 'production' 
  ? import('../config/firebase.config.prod.json')
  : import('../config/firebase.config.dev.json');
console.log("firebaseConfig", firebaseConfig)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

