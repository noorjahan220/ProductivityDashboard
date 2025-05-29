// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// TODO: Replace these values with your actual Firebase project configuration
// You can find these values in your Firebase Console > Project Settings > General
const firebaseConfig = {
  apiKey: "AIzaSyBhMHxSryj0bmVgRCkQPNePcpmRHGrP1Ss",
  authDomain: "productivity-dashboard-1e0c4.firebaseapp.com",
  projectId: "productivity-dashboard-1e0c4",
  storageBucket: "productivity-dashboard-1e0c4.appspot.com",
  messagingSenderId: "1234567890", // Replace with your actual messagingSenderId
  appId: "1:1234567890:web:abcdef1234567890" // Replace with your actual appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Configure auth to use only email/password
auth.useDeviceLanguage();
auth.settings.appVerificationDisabledForTesting = true;

export { app, auth };