/*
  navbar.js - Lógica del navbar.
  Se carga en las páginas que TIENEN navbar:
  index.html, las categorías de pages/ y about-us.html
*/

/*
  Devuelve la ruta relativa hacia la carpeta pages/ según dónde estemos parados.
  Así los links funcionan igual en cualquier computadora, sin importar en qué
  carpeta se clone el repositorio (no dependemos de rutas absolutas tipo /pages/).
*/
function rutaPages() {
  const estoyEnPages = window.location.pathname.includes("/pages/");
  return estoyEnPages ? "" : "pages/";
}

/*Cierra la sesión y vuelve al login*/
function logout() {
  localStorage.removeItem("usuario");
  window.location.href = rutaPages() + "login.html";
}
