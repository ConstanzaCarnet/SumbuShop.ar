//generamos el navbar dinamicamente para que se pueda reutilizar en todas las páginas del sitio
function getBasePath() {
  return window.location.pathname.includes("/pages/") ? "../" : "";
}
// con resolvePath, se resuelve la ruta de cada página del navbar para que funcione correctamente en todas las páginas del sitio, ya que algunas páginas están en la raíz y otras en la carpeta "pages"
function resolvePath(rootPath) {
  const base = getBasePath();
  if (base == "") {
    return rootPath;
  }
  if (rootPath.startsWith("pages/")) {
    return rootPath.replace("pages/", "");
  }
  return "../" + rootPath;
}
//en esete metodo getActiveClass, se compara la ruta actual con la ruta de cada página del navbar para determinar si es la página activa y asignarle la clase "active"
function getActiveClass(page) {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const pageFile = page.path.split("/").pop();
  return currentFile === pageFile ? "active" : "";
}

function renderNavbar() {
  const container = document.getElementById("navbar-container");
  //login y register no tienen navbar a propósito, así que si no hay contenedor simplemente no lo renderizamos
  if (!container) return;
  const base = getBasePath();
  const navLinks = NAV_PAGES.map(function (page) {
    return `
      <li class="nav-item">
        <a class="nav-link ${getActiveClass(page)}" href="${resolvePath(page.path)}">
          ${page.title}
        </a>
      </li>`;
  }).join("");
  //deterninar las rutas del carrito según la ubicación de la página actual, para que funcione correctamente en todas las páginas del sitio
  const cartPath = base + "pages/cart.html";
  const loginPath = base + "pages/login.html";
  //agregamos el contenido del navbar al contenedor, incluyendo los links y los botones de carrito y cerrar sesión
  container.innerHTML = `
    <nav class="navbar navbar-expand-lg sticky-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="${base}index.html">🍓 Sumbu <span>Shop</span></a>
        <button class="navbar-toggler border-0" type="button"
                data-bs-toggle="collapse" data-bs-target="#mainNav"
                aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav mx-auto gap-1">
            ${navLinks}
          </ul>
          <div class="d-flex align-items-center gap-2">
            <button id="themeToggle" class="btn__theme" onclick="toggleTheme()" aria-label="Cambiar tema">🌙</button>
            <a href="${cartPath}" class="cart__btn" aria-label="Ver carrito">
              🛒
              <span id="cartBadge" class="cart__badge" style="display:none;">0</span>
            </a>
            <button class="btn-logout" onclick="logout()">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>`;
}

//Logout, borramos la sesion y redirigimos al login
function logout() {
  //usamos typeof para verificar si las funciones logoutUser y clearCart existen antes de llamarlas, para evitar errores si no están definidas
  if (typeof logoutUser === "function") logoutUser();
  if (typeof clearCart === "function") clearCart();
  window.location.href = getBasePath() + "pages/login.html";
}
//importante aclara que estas ultimas funciones se encuentran en cart.js y auth.js, y que se deben cargar antes de navbar.js para que funcionen correctamente

//addEventListener para que cuando el DOM esté cargado, se ejecute la función renderNavbar
document.addEventListener("DOMContentLoaded", renderNavbar);
