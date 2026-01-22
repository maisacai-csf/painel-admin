// admin/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDc_GuOTJcTSRK-pocMFm2x5HLfbfX1rk",
  authDomain: "painel-pedidos-2c86b.firebaseapp.com",
  projectId: "painel-pedidos-2c86b",
  storageBucket: "painel-pedidos-2c86b.firebasestorage.app",
  messagingSenderId: "487103024568",
  appId: "1:487103024568:web:87ba54facc402f953c934d"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
