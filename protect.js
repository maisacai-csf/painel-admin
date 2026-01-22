import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  // 1️⃣ não logado
  if (!user) {
    return window.location.href = "index.html";
  }

  // 2️⃣ busca dados do usuário
  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);

  // 3️⃣ não cadastrado ou bloqueado
  if (!snap.exists() || !snap.data().ativo) {
    alert("Acesso não autorizado");
    return window.location.href = "index.html";
  }

  // 4️⃣ confere cargo
  if (snap.data().cargo !== "admin") {
    alert("Somente administradores");
    return window.location.href = "index.html";
  }

  // ✅ passou por tudo
  console.log("Admin autenticado");
});
