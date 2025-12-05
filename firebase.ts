import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

// -----------------------------------------
// Firebase Config
// -----------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDZQmxADbHqK-JZFssv-39ZwwmdpJCFtxw",
  authDomain: "chatapp-f6ac6.firebaseapp.com",
  projectId: "chatapp-f6ac6",
  storageBucket: "chatapp-f6ac6.firebasestorage.app",
  messagingSenderId: "822958042518",
  appId: "1:822958042518:web:7305439a58b9c6379201b7"
};

// -----------------------------------------
// Initialize Firebase
// -----------------------------------------
const app = initializeApp(firebaseConfig);
console.log("Firebase connected:", app.name);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// -----------------------------------------
// Firestore Collections
// -----------------------------------------
export const messagesCollection = collection(
  db,
  "messages"
) as CollectionReference<DocumentData>;

// -----------------------------------------
// Auth Functions
// -----------------------------------------
export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

// -----------------------------------------
// Exports
// -----------------------------------------
export {
  auth,
  db,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};