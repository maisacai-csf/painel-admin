import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const btnLogout = document.querySelector(".logout");

btnLogout.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.replace("login.html");
  } catch (err) {
    alert("Erro ao sair");
    console.error(err);
  }
});
