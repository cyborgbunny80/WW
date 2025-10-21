import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD--kdXRE0jlZZ3j6gu3zSb0AKaGSYGDbc",
  authDomain: "when-win-app.firebaseapp.com",
  projectId: "when-win-app",
  storageBucket: "when-win-app.firebasestorage.app",
  messagingSenderId: "718074747823",
  appId: "1:718074747823:web:46841a725b9cfcaf066d5a",
  measurementId: "G-RYBBWQXJKE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;