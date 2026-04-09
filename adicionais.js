import { db } from "./firebase.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// CAMPOS
const nomeAdicional = document.getElementById("nomeAdicional");
const precoAdicional = document.getElementById("precoAdicional");
const btnSalvarAdicional = document.getElementById("btnSalvarAdicional");

// BOTÃO SALVAR
btnSalvarAdicional.onclick = async () => {

  if (!nomeAdicional.value || !precoAdicional.value) {
    alert("Preencha nome e preço");
    return;
  }

  try {
    await addDoc(collection(db, "adicionais"), {
      nome: nomeAdicional.value,
      preco: Number(precoAdicional.value),
      ativo: true
    });

    alert("Adicional criado ✅");

    // limpa campos
    nomeAdicional.value = "";
    precoAdicional.value = "";

  } catch (err) {
    console.error(err);
    alert("Erro ao salvar adicional");
  }
};