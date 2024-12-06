// src/config/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCxahhbG7E6jriwQ6Xjn_HkYW2VTpAcmzI",
    authDomain: "family-engage.firebaseapp.com",
    projectId: "family-engage",
    storageBucket: "family-engage.firebasestorage.app",
    messagingSenderId: "101225458189",
    appId: "1:101225458189:web:2d2df360607fd559318344",
    measurementId: "G-JLYL0MX6B8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
