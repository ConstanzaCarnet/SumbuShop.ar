//generamos el navbar dinamicamente para que se pueda reutilizar en todas las páginas del sitio

//raíz del sitio, calculada a partir de la ubicación de ESTE archivo (js/components/navbar.js → dos carpetas arriba).
//Así las rutas funcionan igual en Vercel (https://...vercel.app/), con Live Server o abriendo el index.html
//directamente desde la carpeta clonada (file:///...), sin importar en qué carpeta esté el proyecto.
const SITE_ROOT = new URL("../../", document.currentScript.src).href;

/**
 * Devuelve la raíz del sitio para armar rutas: getBasePath() + "pages/cart.html", getBasePath() + "img/...".
 * @returns {string}
 */
function getBasePath() {
  return SITE_ROOT;
}

//comparamos la ruta de cada página del navbar con la actual para marcar la activa ("/" e "/index.html" cuentan como la misma)
function getActiveClass(page) {
  const clean = (path) => path.replace(/index\.html$/, "");
  const pagePath = new URL(page.path, SITE_ROOT).pathname;
  return clean(pagePath) === clean(window.location.pathname) ? "active" : "";
}

//cortes de pantalla del navbar (los mismos que en styles.css):
//- hasta 1199px el menú es hamburguesa (navbar-expand-xl) y la lupa + el carrito van en la barra superior
//- hasta 1399px el buscador se muestra como lupa, porque el campo completo no entra junto a todos los links
const NAVBAR_MOBILE_QUERY = window.matchMedia("(max-width: 1199.98px)");
const SEARCH_COMPACT_QUERY = window.matchMedia("(max-width: 1399.98px)");

//íconos de línea del navbar (SVG): todos con el mismo trazo, toman el color del botón (currentColor).
//Los del tema (luna/sol) están en theme.js
const NAV_ICON_PATHS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2.5 3h3l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21.5 7H6.3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
};

function navIcon(name) {
  return `<svg class="nav__icon" viewBox="0 0 24 24" aria-hidden="true">${NAV_ICON_PATHS[name]}</svg>`;
}

//en móvil el carrito va en la barra superior (siempre visible); en escritorio vuelve junto al botón de tema
function placeNavbarItems() {
  const cart = document.getElementById("cartBtn");
  if (NAVBAR_MOBILE_QUERY.matches) {
    document.querySelector(".navbar__quick").append(cart);
  } else {
    document.getElementById("themeToggle").after(cart);
  }
}

function renderNavbar() {
  const container = document.getElementById("navbar-container");
  //login y register no tienen navbar a propósito, así que si no hay contenedor simplemente no lo renderizamos
  if (!container) return;
  const base = getBasePath();
  const navLinks = NAV_PAGES.map(function (page) {
    return `
      <li class="nav-item">
        <a class="nav-link ${getActiveClass(page)}" href="${base}${page.path}">
          ${page.title}
        </a>
      </li>`;
  }).join("");
  //si hay sesión mostramos "Cerrar sesión", si no, "Iniciar sesión"
  const authButton = isLoggedIn()
    ? `<button class="btn-logout" onclick="logout()">Cerrar sesión</button>`
    : `<a href="${base}pages/login.html" class="btn-logout" onclick="saveRedirect()">Iniciar sesión</a>`;

  container.innerHTML = `
    <nav class="navbar navbar-expand-xl">
      <div class="container-fluid">
        <a class="navbar-brand" href="${base}index.html">🍓 Sumbu <span>Shop</span></a>
        <!-- accesos rápidos de la barra superior en móvil (lupa + carrito); en escritorio queda vacío.
             placeNavbarItems() e initSearch() mueven acá el carrito y el buscador -->
        <div class="navbar__quick"></div>
        <button class="navbar-toggler nav__icon-btn" type="button"
                data-bs-toggle="collapse" data-bs-target="#mainNav"
                aria-controls="mainNav" aria-expanded="false" aria-label="Abrir menú">
          ${navIcon("menu")}
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav mx-auto gap-1">
            ${navLinks}
          </ul>

          <!-- Buscador: en pantallas chicas o medianas se muestra solo la lupa (search__toggle) y se expande al tocarla -->
          <div class="search__wrap" id="searchWrap">
            <button type="button" class="search__toggle nav__icon-btn" id="searchToggle"
                    aria-label="Abrir buscador" aria-controls="searchInput" aria-expanded="false">${navIcon("search")}</button>
            <div class="search__input-wrap">
              <button type="button" class="search__back nav__icon-btn nav__icon-btn--plain" id="searchBack" aria-label="Cerrar buscador">${navIcon("back")}</button>
              <span class="search__icon">${navIcon("search")}</span>
              <input
                type="search"
                id="searchInput"
                class="search__input"
                placeholder="Buscar productos..."
                autocomplete="off"
                aria-label="Buscar productos"
              />
            </div>
            <ul id="searchDropdown" class="search__dropdown" role="listbox" aria-label="Resultados de búsqueda"></ul>
          </div>

          <div class="navbar__tools d-flex align-items-center gap-2">
            <button id="themeToggle" class="nav__icon-btn" onclick="toggleTheme()" aria-label="Cambiar tema">${getThemeIcon()}</button>
            <a href="${base}pages/cart.html" class="nav__icon-btn cart__btn" id="cartBtn" aria-label="Ver carrito">
              ${navIcon("cart")}
              <span id="cartBadge" class="cart__badge" style="display:none;">0</span>
            </a>
            ${authButton}
          </div>
        </div>
      </div>
    </nav>`;

  //en móvil el carrito sube a la barra superior, junto a la lupa
  placeNavbarItems();
  NAVBAR_MOBILE_QUERY.addEventListener("change", placeNavbarItems);
  //el buscador depende de los elementos que acabamos de crear
  initSearch();
  updateCartBadge();
}

//Logout: borramos la sesión y el carrito, y vamos al login
function logout() {
  logoutUser();
  clearCart();
  window.location.href = getBasePath() + "pages/login.html";
}

//renderNavbar usa funciones de theme.js, data.js, auth.js, cart.js y search.js: esos scripts tienen que estar incluidos en la página
document.addEventListener("DOMContentLoaded", renderNavbar);
