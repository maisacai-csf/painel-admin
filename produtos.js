import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let produtoEditando = null;

const lista = document.getElementById("listaProdutos");
const modal = document.getElementById("modal");

// CAMPOS DO FORM
const nome = document.getElementById("nome");
const descricao = document.getElementById("descricao");
const preco = document.getElementById("preco");
const imagem = document.getElementById("imagem");
const temAcompanhamentos = document.getElementById("temAcompanhamentos");
const listaAcompanhamentos = document.getElementById("listaAcompanhamentos");


// =============================
// ABRIR MODAL NOVO PRODUTO
// =============================
document.getElementById("btnNovoProduto").addEventListener("click", () => {
  produtoEditando = null;

  nome.value = "";
  descricao.value = "";
  preco.value = "";
  imagem.value = "";
  temAcompanhamentos.checked = false;
  listaAcompanhamentos.value = "";

  modal.style.display = "flex";
});

// CANCELAR MODAL
document.getElementById("btnCancelar").addEventListener("click", () => {
  modal.style.display = "none";
});

// SALVAR PRODUTO (NOVO OU EDIÇÃO)
document.getElementById("btnSalvar").addEventListener("click", salvarProduto);

async function salvarProduto() {
  const dadosProduto = {
    nome: nome.value,
    descricao: descricao.value,
    preco: Number(preco.value),
    imagem: imagem.value,
    ativo: true,
    temAcompanhamentos: temAcompanhamentos.checked,
    acompanhamentos: temAcompanhamentos.checked
      ? listaAcompanhamentos.value.split(",").map(a => a.trim()).filter(a => a)
      : []
  };

  if (!dadosProduto.nome || !dadosProduto.preco) {
    alert("Preencha nome e preço");
    return;
  }

  if (produtoEditando) {
    await updateDoc(doc(db, "produtos", produtoEditando), dadosProduto);
    produtoEditando = null;
  } else {
    await addDoc(collection(db, "produtos"), dadosProduto);
  }

  modal.style.display = "none";
  carregarProdutos();
}


// =============================
// LISTAR PRODUTOS
// =============================
async function carregarProdutos() {
  const snap = await getDocs(collection(db, "produtos"));
  let html = "";

  snap.forEach(d => {
    const p = d.data();

    html += `
      <tr>
        <td>${p.nome}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
        <td>${p.ativo ? "Ativo" : "Inativo"}</td>
        <td>
          <button class="btnEditar" data-id="${d.id}">Editar</button>
          <button class="btnAtivar" data-id="${d.id}" data-ativo="${p.ativo}">
            ${p.ativo ? "Desativar" : "Ativar"}
          </button>
          <button class="btnExcluir" data-id="${d.id}">Excluir</button>
        </td>
      </tr>
    `;
  });

  lista.innerHTML = html;
}


// =============================
// AÇÕES DOS BOTÕES (EDITAR / ATIVAR / EXCLUIR)
// =============================
document.addEventListener("click", async (e) => {

  // EDITAR
  if (e.target.classList.contains("btnEditar")) {
    const id = e.target.dataset.id;
    produtoEditando = id;

    const snap = await getDocs(collection(db, "produtos"));
    snap.forEach(docSnap => {
      if (docSnap.id === id) {
        const p = docSnap.data();

        nome.value = p.nome;
        descricao.value = p.descricao;
        preco.value = p.preco;
        imagem.value = p.imagem || "";
        temAcompanhamentos.checked = p.temAcompanhamentos;
        listaAcompanhamentos.value = p.acompanhamentos?.join(", ") || "";

        modal.style.display = "flex";
      }
    });
  }

  // ATIVAR / DESATIVAR
  if (e.target.classList.contains("btnAtivar")) {
    await updateDoc(doc(db, "produtos", e.target.dataset.id), {
      ativo: e.target.dataset.ativo !== "true"
    });
    carregarProdutos();
  }

  // EXCLUIR
  if (e.target.classList.contains("btnExcluir")) {
    const id = e.target.dataset.id;
    const confirmar = confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmar) return;

    await deleteDoc(doc(db, "produtos", id));
    carregarProdutos();
  }

});


// =============================
// LOGOUT
// =============================
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});


// INICIAR LISTA
carregarProdutos();
