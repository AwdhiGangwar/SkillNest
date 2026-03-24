// src/services/firebase.js
// ⚠️ Replace these values with your actual Firebase project config
// Go to Firebase Console > Project Settings > Your Apps > Web App Config

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSIH6mQvMkTLV_1D0luQTY1ymIX3p-8ik",
  authDomain: "skillnest-db.firebaseapp.com",
  projectId: "skillnest-db",
  storageBucket: "skillnest-db.appspot.com",
  messagingSenderId: "430547669950",
  appId: "1:430547669950:web:99ed8c6ec82b6cda9a5fef",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
