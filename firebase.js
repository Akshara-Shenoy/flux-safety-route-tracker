// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"; 
//firebase config 
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnh9QfJRoWHXYE0qRhS1S1SPEA_RGB2bs",
  authDomain: "flux-dd8b4.firebaseapp.com",
  projectId: "flux-dd8b4",
  storageBucket: "flux-dd8b4.firebasestorage.app",
  messagingSenderId: "755217187737",
  appId: "1:755217187737:web:a9f0979309af46626dc908",
  measurementId: "G-L744M96VP4"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);