
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "studio-2416347475-faeb3",
  appId: "1:796374984590:web:2efde75086b2a4aab866df",
  apiKey: "AIzaSyBiACmPLrPK8yh3WGcx9-4JmvJFep_ZxnY",
  authDomain: "studio-2416347475-faeb3.firebaseapp.com",
  messagingSenderId: "796374984590"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
