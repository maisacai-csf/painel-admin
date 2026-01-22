import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  console.log("USER AUTH:", user);

  if (!user) {
    alert("Não logado");
    return window.location.href = "index.html";
  }

  const ref = doc(db, "usuarios", user.uid);
  console.log("BUSCANDO UID:", user.uid);

  const snap = await getDoc(ref);
  console.log("DOC EXISTE?", snap.exists());

  if (!snap.exists()) {
    alert("Documento NÃO existe no Firestore");
    return window.location.href = "index.html";
  }

  console.log("DADOS:", snap.data());

  if (!snap.data().ativo) {
    alert("Usuário inativo");
    return window.location.href = "index.html";
  }

  if (snap.data().cargo !== "admin") {
    alert("Cargo não é admin");
    return window.location.href = "index.html";
  }

  alert("ADMIN AUTORIZADO ✅");
});
