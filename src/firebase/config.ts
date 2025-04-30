// src/firebase/config.ts
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBRM584NcSL6yyEUx0nBKRG3cIxg0ojHQY",
  authDomain: "collab-workspace-app-osama.firebaseapp.com",
  projectId: "collab-workspace-app-osama",
  storageBucket: "collab-workspace-app-osama.firebasestorage.app",
  messagingSenderId: "71897934699",
  appId: "1:71897934699:web:a4fd1c3a1c43ef18567a2e"
};

const app = initializeApp(firebaseConfig);
export default app;
