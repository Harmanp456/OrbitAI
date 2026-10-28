// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "orbitai-32314.firebaseapp.com",
  projectId: "orbitai-32314",
  storageBucket: "orbitai-32314.firebasestorage.app",
  messagingSenderId: "533747248420",
  appId: "1:533747248420:web:803fdba2e23513240817b1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth=getAuth(app)
export const googleProvider=new GoogleAuthProvider();

