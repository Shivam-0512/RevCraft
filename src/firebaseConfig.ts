import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIvSbp8IuETq2je35jwKS3y-IzNvnpq_k",
  authDomain: "photobooth-ef65f.firebaseapp.com",
  projectId: "photobooth-ef65f",
  storageBucket: "photobooth-ef65f.firebasestorage.app",
  messagingSenderId: "101423479851",
  appId: "1:101423479851:web:3f6b438cc2deeaa0797e6e",
  measurementId: "G-D2PH0RQPE4"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);