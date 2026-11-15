//buscador de productos

/**
 * Pasamos el texto a minúsculas y le quitamos los acentos, para que "pasteleria" encuentre "Pastelería"
 * @param {string} text - El texto a normalizar
 * @return {string} - El texto normalizado
 */
function normalizeText(text) {
  return text
    .normalize("NFD") // con normalize("NFD") separamos los acentos de las letras, por ejemplo "é" se convierte en "e" + "́"
    .replace(/\p{M}/gu, "") // \p{M} son las marcas de acento que separa normalize("NFD")
    .toLowerCase();
}

/**
 * Buscamos productos en todas las categorías y devolvemos un array con los resultados
 * @param {string} query - La cadena de búsqueda
 * @param {number} limit - Máximo de resultados: 10 para el dropdown, Infinity para la página de resultados
 * @return {Array} - Array de objetos con los resultados de la búsqueda
 */
function searchProducts(query, limit = 10) {
  const results = [];
  const q = normalizeText(query.trim());
  if (q.length < 2) return results;
  //Object.values(PRODUCTS) devuelve un array con los arrays de productos de cada categoría; recorremos cada uno
  for (const products of Object.values(PRODUCTS)) {
    for (const product of products) {
      const stack = normalizeText(
        [product.name, product.description, product.category].join(" "),
      );

      if (stack.includes(q)) {
        results.push(product);
        if (results.length >= limit) return results;
      }
    }
  }
  return results;
}

/**
 * Generamos el HTML de un resultado del dropdown
 * @param {Object} product - Producto encontrado
 * @param {string} basePath - Raíz del sitio (getBasePath())
 */
function buildResultItem(product, basePath) {
  return `
    <li class="search__result-item" data-product-id="${product.id}">
      <img src="${basePath}${product.images[0]}" alt="${product.name}" class="search__result-img" />
      <div class="search__result-info">
        <span class="search__result-name">${product.name}</span>
        <span class="search__result-meta">${product.category} · ${formatPrice(product.price)}</span>
      </div>
    </li>`;
}

/**
 * Inicializamos el buscador de productos, agregando los event listeners necesarios.
 * Se llama desde renderNavbar(), porque depende de los elementos del DOM que se crean ahí.
 */
function initSearch() {
  const input = document.getElementById("searchInput");
  const dropdown = document.getElementById("searchDropdown");
  const wrap = document.getElementById("searchWrap");
  const toggle = document.getElementById("searchToggle");
  const back = document.getElementById("searchBack");
  const nav = wrap.closest(".navbar");
  const quickBar = nav.querySelector(".navbar__quick");
  const navLinks = nav.querySelector(".navbar-nav");
  const basePath = getBasePath();

  //las páginas que tienen #modal-container (categorías y resultados) pueden abrir el detalle del producto ahí mismo
  const canOpenModalHere = Boolean(document.getElementById("modal-container"));

  //renderizamos el dropdown con los resultados de búsqueda
  function renderDropdown(results) {
    if (results.length === 0) {
      dropdown.innerHTML = `<li class="search__no-results">No se encontraron resultados</li>`;
    } else {
      dropdown.innerHTML = results
        .map((p) => buildResultItem(p, basePath))
        .join("");
    }
    dropdown.classList.add("search__dropdown--open");
  }

  function hideDropdown() {
    dropdown.classList.remove("search__dropdown--open");
    dropdown.innerHTML = "";
  }

  /* ─── Buscador compacto (lupa) ───
   * Hasta 1399px el buscador se muestra solo como lupa (SEARCH_COMPACT_QUERY, en navbar.js):
   * - hasta 1199px (menú hamburguesa) la lupa va en la barra superior y al abrirse ocupa toda la barra
   * - entre 1200px y 1399px queda al lado de los links y al abrirse ocupa el lugar de los links
   * Se cierra con la flecha ←, con Escape, tocando afuera o con el botón "atrás" del celular/navegador.
   */
  function isExpanded() {
    return wrap.classList.contains("search__wrap--expanded");
  }

  //mueve el buscador a la barra superior, antes del carrito (móvil) o al menú junto a los links (escritorio)
  function placeSearch() {
    closeCompactSearch();
    if (NAVBAR_MOBILE_QUERY.matches) {
      quickBar.prepend(wrap);
    } else {
      navLinks.after(wrap);
    }
  }

  function openCompactSearch() {
    if (isExpanded()) return;
    //si el menú hamburguesa está abierto lo cerramos, para que no quede debajo del buscador
    const menu = nav.querySelector(".navbar-collapse.show");
    if (menu) bootstrap.Collapse.getOrCreateInstance(menu).hide();

    nav.classList.add("navbar--searching");
    wrap.classList.add("search__wrap--expanded");
    toggle.setAttribute("aria-expanded", "true");
    input.focus();
    //agregamos una entrada al historial: así el botón "atrás" cierra el buscador en vez de salir de la página
    history.pushState({ sumbuSearch: true }, "");
  }

  //solo restablece la vista (sin tocar el historial)
  function collapseSearchUI() {
    nav.classList.remove("navbar--searching");
    wrap.classList.remove("search__wrap--expanded");
    toggle.setAttribute("aria-expanded", "false");
    input.value = "";
    input.blur();
    hideDropdown();
  }

  function closeCompactSearch() {
    if (!isExpanded()) return;
    //si abrimos con pushState, volvemos atrás y el evento popstate se encarga de cerrar
    if (history.state && history.state.sumbuSearch) {
      history.back();
    } else {
      collapseSearchUI();
    }
  }

  //navegar desde el buscador: si hay una entrada "falsa" en el historial la reemplazamos,
  //para que al volver desde la otra página no haya que tocar "atrás" dos veces
  function goTo(url) {
    if (history.state && history.state.sumbuSearch) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  }

  toggle.addEventListener("click", openCompactSearch);
  back.addEventListener("click", closeCompactSearch);
  window.addEventListener("popstate", () => {
    if (isExpanded()) collapseSearchUI();
  });
  NAVBAR_MOBILE_QUERY.addEventListener("change", placeSearch);
  SEARCH_COMPACT_QUERY.addEventListener("change", closeCompactSearch);
  placeSearch();

  //Busqueda dinamica mientras el usuario escribe(evento input)
  input.addEventListener("input", () => {
    if (input.value.trim().length < 2) {
      hideDropdown();
      return;
    }
    renderDropdown(searchProducts(input.value));
  });

  //con Enter vamos a la pagina con todos los resultados
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const query = input.value.trim();
    if (query.length < 2) return;

    e.preventDefault();
    hideDropdown();
    goTo(basePath + "pages/search.html?q=" + encodeURIComponent(query));
  });

  //click en un resultado del dropdown
  dropdown.addEventListener("click", (e) => {
    const item = e.target.closest(".search__result-item");
    if (!item) return; //validacion por si el click no es en un item del dropdown
    const productId = item.dataset.productId;

    if (canOpenModalHere) {
      input.value = "";
      hideDropdown();
      closeCompactSearch(); //si estaba abierto como lupa, vuelve a la lupa
      openProductModal(productId);
    } else {
      //vamos a la página de la categoría y el modal se abre allá (ver handleSearchDirect)
      goTo(basePath + getCategoryPagePath(productId) + "?open=" + productId);
    }
  });

  //cerramos al hacer click afuera del buscador
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search__wrap")) {
      hideDropdown();
      closeCompactSearch();
    }
  });

  //cerrar con escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideDropdown();
      input.blur();
      closeCompactSearch();
    }
  });
}

/**
 * Si la URL tiene ?open=productId (venimos de un resultado del buscador), abrimos el modal de ese producto
 */
function handleSearchDirect() {
  const productId = new URLSearchParams(window.location.search).get("open");
  if (!productId || !document.getElementById("modal-container")) return;

  openProductModal(productId);
  //limpiamos la URL para que no se vuelva a abrir el modal al recargar
  history.replaceState(null, "", window.location.pathname);
}

document.addEventListener("DOMContentLoaded", handleSearchDirect);

/**
 * Pinta la página de resultados (pages/search.html) a partir del ?q= de la URL
 * Usamos textContent para el título porque el texto viene de la URL y no debe interpretarse como HTML
 */
function renderSearchPage() {
  const title = document.getElementById("searchResultsTitle");
  const query = (
    new URLSearchParams(window.location.search).get("q") || ""
  ).trim();

  //dejamos la búsqueda escrita en el navbar para poder corregirla
  const input = document.getElementById("searchInput");
  if (input) input.value = query;

  if (query.length < 2) {
    title.textContent = "Escribí al menos 2 letras para buscar";
    return;
  }

  const results = searchProducts(query, Infinity);
  if (results.length === 0) {
    title.textContent = `No encontramos productos para "${query}"`;
    document.getElementById("search-results").innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">Probá con otra palabra o revisá las categorías.</p>
      </div>`;
    return;
  }

  const label = results.length === 1 ? "resultado" : "resultados";
  title.textContent = `${results.length} ${label} para "${query}"`;
  renderProductCards("search-results", results);
}
