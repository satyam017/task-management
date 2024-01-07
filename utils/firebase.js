// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSUbs-jDgLTHU00wkQYzx_OovtVYbcgho",
  authDomain: "taskmanagement-cebef.firebaseapp.com",
  projectId: "taskmanagement-cebef",
  storageBucket: "taskmanagement-cebef.appspot.com",
  messagingSenderId: "70903375543",
  appId: "1:70903375543:web:b22f6e1f42121745c34f32",
  measurementId: "G-KNPT4BH9VR"
};

// Initialize Firebase
let analytics;
const app = initializeApp(firebaseConfig);

if (typeof window !== 'undefined' && isSupported()) {
  analytics = getAnalytics(app);
}
export const auth = getAuth();
export const db = getFirestore(app);