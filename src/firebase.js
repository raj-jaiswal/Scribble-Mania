import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "scribble-mania.firebaseapp.com",
  projectId: "scribble-mania",
  storageBucket: "scribble-mania.firebasestorage.app",
  messagingSenderId: "479718940221",
  appId: "1:479718940221:web:665fd8d8fd5ca04b2a5454"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;