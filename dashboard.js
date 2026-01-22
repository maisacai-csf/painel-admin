import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function carregarStats() {
  const produtosSnap = await getDocs(collection(db, "produtos"));
  const pedidosSnap = await getDocs(collection(db, "pedidos"));

  document.getElementById("totalProdutos").innerText = produtosSnap.size;
  document.getElementById("totalPedidos").innerText = pedidosSnap.size;
}

carregarStats();
