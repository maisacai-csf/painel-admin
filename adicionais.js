import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista = document.getElementById("listaAdicionais");
const modal = document.getElementById("modalAdicional");

const nome = document.getElementById("nomeAdicional");
const preco = document.getElementById("precoAdicional");

// ABRIR MODAL
document.getElementById("btnNovoAdicional").onclick = () => {
  nome.value = "";
  preco.value = "";
  modal.style.display = "block";
};

// CANCELAR
document.getElementById("btnCancelarAdicional").onclick = () => {
  modal.style.display = "none";
};

// SALVAR
document.getElementById("btnSalvarAdicional").onclick = async () => {
  await addDoc(collection(db, "adicionais"), {
    nome: nome.value,
    preco: Number(preco.value),
    ativo: true
  });

  modal.style.display = "none";
  carregar();
};

// LISTAR
async function carregar() {
  const snap = await getDocs(collection(db, "adicionais"));
  let html = "";

  snap.forEach(d => {
    const a = d.data();

    html += `
      <tr>
        <td>${a.nome}</td>
        <td>R$ ${a.preco}</td>
        <td>${a.ativo ? "Ativo" : "Inativo"}</td>
        <td>
          <button onclick="excluir('${d.id}')">Excluir</button>
        </td>
      </tr>
    `;
  });

  lista.innerHTML = html;
}

window.excluir = async (id) => {
  await deleteDoc(doc(db, "adicionais", id));
  carregar();
};

carregar();