// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "catchuapp.firebaseapp.com",
  projectId: "catchuapp",
  storageBucket: "catchuapp.firebasestorage.app",
  messagingSenderId: "802670938516",
  appId: "1:802670938516:web:1f5adfc66f4f2a78cf6781",
  measurementId: "G-6CWS34G4QE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = app.name && typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);