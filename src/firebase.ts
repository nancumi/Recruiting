import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBCaw33rIGI8JgF_cI6lEhVTL2t42AkSoY",
  authDomain: "mytodolist-623a9.firebaseapp.com",
  projectId: "mytodolist-623a9",
  storageBucket: "mytodolist-623a9.firebasestorage.app",
  messagingSenderId: "432727655266",
  appId: "1:432727655266:web:2418b3a25e3aed732ca23b"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

