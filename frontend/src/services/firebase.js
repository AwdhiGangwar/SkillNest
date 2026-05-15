import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSIH6mQvMkTLV_1D0luQTY1ymIX3p-8ik",
  authDomain: "skillnest-db.firebaseapp.com",
  projectId: "skillnest-db",
  storageBucket: "skillnest-db.appspot.com",
  messagingSenderId: "430547669950",
  appId: "1:430547669950:web:99ed8c6ec82b6cda9a5fef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Forgot password function
export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

export default app;