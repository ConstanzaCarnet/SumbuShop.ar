//buscador de productos

//mapeao de categorias  -> pagide categoria
//con esto podemos ir a la página de categoría correspondiente al hacer click en un resultado del dropdown
const CATEGORY_PAGES = {
  Mermeladas: "pages/jams.html",
  Conservas: "pages/preserved.html",
  "Papel Maché": "pages/mache-paper.html",
  Pastelería: "pages/bakery.html",
  Cosmética: "pages/cosmetics.html",
};

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
  //object.values(PRODUCTS) devuelve un array con los arrays de productos de cada categoría, luego hacemos un for of para recorrer cada array de productos y otro for of para recorrer cada producto individualmente
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
 * generamos el HTML de los resultados de búsqueda y lo insertamos en el dropdown
 * @param {Object} results - Array de objetos con los resultados de la búsqueda
 * @param {string} basePath - Ruta base del sitio
 */
function builderResultItem(product, basePath) {
  //si el producto tiene imagen, la usamos, si no, mostramos un placeholder
  const thumb =
    product.images && product.images.length > 0 ? product.images[0] : "";
  const price = product.price.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });
  return `
        <li class="search__result-item" data-product-id="${product.id}" data-category="${product.category}">
      ${
        thumb
          ? `<img src="${basePath}${thumb}" alt="${product.name}" class="search__result-img" />`
          : `<div class="search__result-img" style="background:var(--color-bg-alt,#f7f3ef);"></div>`
      }
      <div class="search__result-info">
        <span class="search__result-name">${product.name}</span>
        <span class="search__result-meta">${product.category} · ${price}</span>
      </div>
    </li>`;
}

/**
 * Inicializamos el buscador de productos, agregando los event listeners necesarios
 * lo inicializamos ya que depende de los elementos del DOM que se crean en el navbar, por eso se llama desde renderNavbar()
 * Debe llamarse después de renderizar el navbar, ya que depende de los elementos del DOM que se crean allí
 */

function initSearch() {
  const input = document.getElementById("searchInput");
  const dropdown = document.getElementById("searchDropdown");
  if (!input || !dropdown) return;

  const basePath = getBasePath();
  //detectar si estamos en una pagina de cateforia
  function getCurrentPage() {
    return window.location.pathname.split("/").pop() || "index.html"; //con esto decimos si no hay nada en la ruta, es decir, estamos en la home, devolvemos index.html y si hay algo, devolvemos el nombre del archivo de la ruta actual
  }
  //paginas donde el modal puede abrirse directamente (categorias y resultados de busqueda)
  const CATEGORY_FILES = {
    "search.html": true,
    "jams.html": true,
    "preserved.html": true,
    "bakery.html": true,
    "mache-paper.html": true,
    "cosmetics.html": true,
  };

  //renderizamos el dropdown con los resultados de búsqueda
  function renderDropdown(results) {
    if (results.length === 0) {
      dropdown.innerHTML = `<li class="search__no-results">No se encontraron resultados</li>`;
    } else {
      dropdown.innerHTML = results
        .map((p) => builderResultItem(p, basePath))
        .join("");
    }
    //agregamos la clase para mostrar el dropdown
    dropdown.classList.add("search__dropdown--open");
  }

  function hideDropdown() {
    dropdown.classList.remove("search__dropdown--open");
    dropdown.innerHTML = "";
  }

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

    e.preventDefault(); //opcional: prevenimos el comportamiento por defecto del Enter, que podría ser enviar un formulario si el input está dentro de uno
    hideDropdown();
    //redireccionamos a la página de resultados con el query en la URL
    window.location.href =
      basePath + "pages/search.html?q=" + encodeURIComponent(query);
  });

  //click en un resultado del dropdown
  dropdown.addEventListener("click", (e) => {
    const item = e.target.closest(".search__result-item");
    if (!item) return; //validacion por si el click no es en un item del dropdown

    const productId = item.dataset.productId;
    const category = item.dataset.category;
    const currentPage = getCurrentPage();

    input.value = ""; // Limpiar el input
    hideDropdown(); // Ocultar el dropdown

    //si estamos en una pagina de categoria, abrimos el modal directamente
    if (CATEGORY_FILES[currentPage] && typeof openProductModal === "function") {
      openProductModal(productId);
    } else {
      // Ir a la página de categoría con el id del producto en la URL
      const targetPage = CATEGORY_PAGES[category] || "index.html";
      window.location.href = basePath + targetPage + "?open=" + productId;
    }
  });

  //cerramos al hacer click afuera del input o del dropdown
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search__wrap")) {
      hideDropdown();
    }
  });

  //cerrar con escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideDropdown();
      input.blur(); //quitar foco del input
    }
  });
}

/**
 * Si la URL tiene ?open=productId, abrimos el modal del producto correspondiente al cargar la página
 */
function handleSearchDirect() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("open");
  if (!productId) return;

  //Espera a que las cards esten renderizadas, luego abre el modal
  setTimeout(() => {
    if (typeof openProductModal === "function") {
      //como en el resto, hacemos la comprobación de que la función existe para evitar errores si no se ha cargado el script del modal
      openProductModal(productId);
    }
    //limpiamos la URL para que no se abra el modal al recargar
    const cleanUrl = window.location.pathname;
    history.replaceState(null, "", cleanUrl);
  }, 150); //espera 150ms para que las cards se rendericen, si no, no encuentra el producto y no abre el modal
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
