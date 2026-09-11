/*
  forms.js - Lógica de los formularios.
  Se carga SOLO en las páginas que tienen formulario:
  pages/login.html y pages/register.html
*/
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

/*Inicio de sesión*/
if (loginForm) {
  loginForm.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const email = document.getElementById("email").value.trim();

    /*Por ahora no hay backend, guardamos el usuario en el navegador*/
    localStorage.setItem("usuario", email);
    window.location.href = "../index.html";
  });
}

/*Registro de usuario*/
if (registerForm) {
  registerForm.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();

    /*Por ahora no hay backend, guardamos el usuario en el navegador*/
    localStorage.setItem("usuario", usuario);
    window.location.href = "../index.html";
  });
}
