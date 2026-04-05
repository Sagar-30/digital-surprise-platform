import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyABmZHtOlEJksGDWghDXWv7upi3gpEbh5s",
  authDomain: "digital-surprise.firebaseapp.com",
  projectId: "digital-surprise",
  storageBucket: "digital-surprise.firebasestorage.app",
  messagingSenderId: "921286299034",
  appId: "1:921286299034:web:93f4294a750de9158dfe23",
  measurementId: "G-8YST5F2XW9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;