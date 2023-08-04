// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBZA6MIYppzRKz4R75yIHe7xSuRlo3SbaU',
  authDomain: 'instagran-new.firebaseapp.com',
  projectId: 'instagran-new',
  storageBucket: 'instagran-new.appspot.com',
  messagingSenderId: '577491888589',
  appId: '1:577491888589:web:e17b0285a7b89f9032bc84',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
