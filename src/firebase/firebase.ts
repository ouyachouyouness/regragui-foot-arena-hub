// src/firebase/firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYEhO30luMCHX7XmUsxnfcW_btSNJp1So",
    authDomain: "reservation-fc-regragui.firebaseapp.com",
    projectId: "reservation-fc-regragui",
    storageBucket: "reservation-fc-regragui.firebasestorage.app",
    messagingSenderId: "321527060828",
    appId: "1:321527060828:web:a94daac3bb6ea79ae98999"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const firestore = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, firestore, auth};