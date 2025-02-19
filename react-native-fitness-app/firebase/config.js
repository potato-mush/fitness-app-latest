import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA1kaXo4ClUtw2M3XKyFvpxKosJ4brbYIA",
  authDomain: "react-native-fitness-app-1c2cd.firebaseapp.com",
  projectId: "react-native-fitness-app-1c2cd",
  storageBucket: "react-native-fitness-app-1c2cd.firebasestorage.app",
  messagingSenderId: "182505494804",
  appId: "1:182505494804:web:997d8f3f2888a2722a4a01",
  measurementId: "G-KB4EW7SQT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
