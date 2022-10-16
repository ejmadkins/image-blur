// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  authDomain: 'ejmadkins-sky-tech-day.firebaseapp.com',
  projectId: 'ejmadkins-sky-tech-day',
  storageBucket: 'ejmadkins-sky-tech-day.appspot.com',
  messagingSenderId: '274138617363',
  appId: '1:274138617363:web:8018b7ba0a1d231b5bd1e6',
  measurementId: 'G-WZD4GYH241'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
