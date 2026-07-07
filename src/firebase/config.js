import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDSuVvuHlLYtcojdCYTxAFUh37I8uwNtSI",
  authDomain: "lastproject-4138e.firebaseapp.com",
  projectId: "lastproject-4138e",
  storageBucket: "lastproject-4138e.firebasestorage.app",
  messagingSenderId: "313811075922",
  appId: "1:313811075922:web:d919754fb451c5d9e9308b",
  measurementId: "G-1M8RQG59YV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export const functions = getFunctions(app);
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export default app;
