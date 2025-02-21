// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDU65G8yoEstHb3THuxH37WYl48rjQM9pg",
  authDomain: "univoices-blog.firebaseapp.com",
  projectId: "univoices-blog",
  storageBucket: "univoices-blog.appspot.com",
  messagingSenderId: "201459593179",
  appId: "1:201459593179:web:68966422b6329129da01fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDb = getFirestore(app);
const auth = getAuth(app);
const storage  = getStorage(app);

export {fireDb, auth, storage}