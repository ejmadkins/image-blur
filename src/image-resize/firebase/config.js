// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app')
const { getStorage } = require('firebase/storage')
const { getFirestore } = require('firebase/firestore')

// Your web app's Firebase configuration
const firebaseConfig = {
    authDomain: 'ejmadkins-sky-tech-day.firebaseapp.com',
    projectId: 'ejmadkins-sky-tech-day',
    storageBucket: 'ejmadkins-sky-tech-day.appspot.com',
    messagingSenderId: '274138617363',
    appId: '1:274138617363:web:8018b7ba0a1d231b5bd1e6',
    measurementId: 'G-WZD4GYH241',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const firebaseStorage = getStorage(app)
const db = getFirestore(app)

module.exports = { app, firebaseStorage, db }
