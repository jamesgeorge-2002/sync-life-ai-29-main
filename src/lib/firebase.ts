import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBmcROmQpTAPcbIZZRdGtvLVJIJ7d7OReY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lifesync-ai-7a745.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lifesync-ai-7a745",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lifesync-ai-7a745.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "339143017671",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:339143017671:web:69fcd399578ca5f2feeae2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
