// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.Firebase_api,
  authDomain: "realitimecollab.firebaseapp.com",
  projectId: "realitimecollab",
  storageBucket: "realitimecollab.firebasestorage.app",
  messagingSenderId: "400181112525",
  appId: "1:400181112525:web:377142cf91e3a163f90384",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; // ✅ Exporting db properly