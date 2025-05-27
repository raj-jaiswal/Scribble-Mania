import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "scribble-mania.firebaseapp.com",
  projectId: "scribble-mania",
  storageBucket: "scribble-mania.firebasestorage.app",
  messagingSenderId: "479718940221",
  appId: "1:479718940221:web:665fd8d8fd5ca04b2a5454",
  databaseURL: "https://scribble-mania-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication - for auth system
export const auth = getAuth();

// Realtime Database - for active users
export const realtimeDb = getDatabase(app);

// Firestore - for everything else
export const db = getFirestore(app);

export default app;