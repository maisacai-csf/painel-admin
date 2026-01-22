import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const lista = document.getElementById("listaProdutos");
const modal = document.getElementById("modal");

document.getElementById("btnNovoProduto").addEventListener("click", () => {
  modal.style.display = "flex";
});

document.getElementById("btnCancelar").addEventListener("click", () => {
  modal.style.display = "none";
});

document.getElementById("btnSalvar").addEventListener("click", salvarProduto);

// SALVAR PRODUTO
async function salvarProduto() {
  const nome = document.getElementById("nome").value;
  const preco = Number(document.getElementById("preco").value);

  if (!nome || !preco) {
    alert("Preencha todos os campos");
    return;
  }

  await addDoc(collection(db, "produtos"), {
    nome,
    preco,
    ativo: true
  });

  modal.style.display = "none";
  carregarProdutos();
}

// LISTAR PRODUTOS
async function carregarProdutos() {
  lista.innerHTML = "";

  const snap = await getDocs(collection(db, "produtos"));

  snap.forEach(d => {
    const p = d.data();

    lista.innerHTML += `
      <tr>
        <td>${p.nome}</td>
        <td>R$ ${p.preco}</td>
        <td>${p.ativo ? "Ativo" : "Inativo"}</td>
        <td>
          <button data-id="${d.id}" data-ativo="${p.ativo}">
            ${p.ativo ? "Desativar" : "Ativar"}
          </button>
        </td>
      </tr>
    `;
  });

  document.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = async () => {
      await updateDoc(doc(db, "produtos", btn.dataset.id), {
        ativo: btn.dataset.ativo !== "true"
      });
      carregarProdutos();
    };
  });
}

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

carregarProdutos();
