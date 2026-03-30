import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAohqUtHmP2gNb-_tFVuv_xG4Foz3DhKLk",
  authDomain: "cn-irctc-7ea18.firebaseapp.com",
  projectId: "cn-irctc-7ea18",
  storageBucket: "cn-irctc-7ea18.firebasestorage.app",
  messagingSenderId: "603064453834",
  appId: "1:603064453834:web:f26e995e89aa8fb4f80233"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;