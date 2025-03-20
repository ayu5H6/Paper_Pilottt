import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyANap_kmWe7fiPa_xPT06mFQSssSKiHJbw",
  authDomain: "aiapp-dcff1.firebaseapp.com",
  projectId: "aiapp-dcff1",
  storageBucket: "aiapp-dcff1.firebasestorage.app",
  messagingSenderId: "257072184221",
  appId: "1:257072184221:web:4d674c730f47799f3f0d74",
  measurementId: "G-9NW46ZVH48"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const GoogleProvider = new GoogleAuthProvider();