import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const btn = document.getElementById("loginBtn");
const error = document.getElementById("error");

btn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  error.textContent = "";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.replace("login.html");
  } catch (err) {
    error.textContent = "Email ou senha inválidos";
    console.error(err);
  }
});
