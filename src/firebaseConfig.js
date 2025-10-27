// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Only import getAuth
import { getFirestore } from "firebase/firestore"; // Removed unused setLogLevel

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error(
    `!!! Firebase Initialization Failed: Missing configuration values for: ${missingKeys.join(', ')}. ` +
    `Ensure your .env file is set up correctly and variables start with REACT_APP_`
  );
}

let app = null;
let auth = null;
let db = null;

try {
    if (missingKeys.length === 0) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        console.log("Firebase Initialized Successfully.");
        // To enable debug logging uncomment the following line and the import above
        // import { setLogLevel } from "firebase/firestore";
        // setLogLevel('debug');
    }
} catch (error) {
    console.error("!!! Firebase Initialization Error:", error);
}

export { app, auth, db };