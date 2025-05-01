// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRM584NcSL6yyEUx0nBKRG3cIxg0ojHQY",
  authDomain: "collab-workspace-app-osama.firebaseapp.com",
  projectId: "collab-workspace-app-osama",
  storageBucket: "collab-workspace-app-osama.firebasestorage.app",
  messagingSenderId: "71897934699",
  appId: "1:71897934699:web:a4fd1c3a1c43ef18567a2e"
};

const app = initializeApp(firebaseConfig);

// Export individual services
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app);
