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

// CAMPOS
const nome = document.getElementById("nome");
const descricao = document.getElementById("descricao");
const preco = document.getElementById("preco");
const imagem = document.getElementById("imagem");

// ADICIONAIS
const listaAdicionais = document.getElementById("listaAdicionais");
const toggle = document.getElementById("toggleAdicionais");

// 🔽 ABRIR / FECHAR DROPDOWN
toggle.addEventListener("click", () => {
  listaAdicionais.style.display =
    listaAdicionais.style.display === "none" ? "block" : "none";
});

// =============================
// ABRIR MODAL
// =============================
document.getElementById("btnNovoProduto").addEventListener("click", async () => {
  produtoEditando = null;

  nome.value = "";
  descricao.value = "";
  preco.value = "";
  imagem.value = "";

  listaAdicionais.innerHTML = "";

  // 🔥 CARREGA ADICIONAIS
  const snap = await getDocs(collection(db, "adicionais"));

  snap.forEach(docSnap => {
    const a = docSnap.data();

    if (!a.ativo) return;

    listaAdicionais.innerHTML += `
      <label style="display:block; margin-bottom:5px;">
        <input type="checkbox" value="${docSnap.id}">
        ${a.nome} - R$ ${Number(a.preco).toFixed(2)}
      </label>
    `;
  });

  modal.style.display = "flex";
});

// CANCELAR
document.getElementById("btnCancelar").addEventListener("click", () => {
  modal.style.display = "none";
});

// =============================
// SALVAR PRODUTO
// =============================
document.getElementById("btnSalvar").addEventListener("click", salvarProduto);

async function salvarProduto() {

  if (!nome.value || !preco.value) {
    alert("Preencha nome e preço");
    return;
  }

  const selecionados = [
    ...document.querySelectorAll("#listaAdicionais input:checked")
  ].map(el => el.value);

  const dadosProduto = {
    nome: nome.value,
    descricao: descricao.value,
    preco: Number(preco.value),
    imagem: imagem.value || "https://via.placeholder.com/150",
    ativo: true,
    adicionais: selecionados,
    temAdicionais: selecionados.length > 0
  };

  try {
    if (produtoEditando) {
      await updateDoc(doc(db, "produtos", produtoEditando), dadosProduto);
      produtoEditando = null;
    } else {
      await addDoc(collection(db, "produtos"), dadosProduto);
    }

    modal.style.display = "none";
    carregarProdutos();

  } catch (err) {
    console.error("Erro ao salvar:", err);
    alert("Erro ao salvar produto");
  }
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
        <td>R$ ${Number(p.preco || 0).toFixed(2)}</td>
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
// AÇÕES
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
    const confirmar = confirm("Tem certeza que deseja excluir?");
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

// INICIAR
carregarProdutos();