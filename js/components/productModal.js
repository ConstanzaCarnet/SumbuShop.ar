//dejo por defecto un solo producto en el modal
let modalQty = 1;
//genera el carrusel
/**
 *  * Si tiene una sola imagen, renderiza sin controles ni indicadores.
 * @param {Object} product
 * @param {string} basePath - resultado de getBasePath()
 * @returns {string} HTML del carrusel
 */

function buildCarousel(product, basePath) {
  const images = product.images;
  const hasMultipleImages = images.length > 1;
  //indicadores (sólo si hay más de una imagen)
  const indicators = hasMultipleImages
    ? `<div class="carousel-indicators">
            ${images
              .map(
                (_, i) => `<button type="button"
                data-bs-target="#productCarousel"
                data-bs-slide-to="${i}"
                ${i === 0 ? 'class="active" aria-current="true"' : ""}
                aria-label="Imagen ${i + 1}">
              </button>`,
              )
              .join("")}
      </div>`
    : "";

  // Slides
  const slides = images
    .map(
      (imgPath, i) =>
        `<div class="carousel-item ${i === 0 ? "active" : ""}">
          <img
            src="${basePath}${imgPath}"
            class="d-block w-100 product__modal__img"
            alt="${product.name} - imagen ${i + 1}"
            loading="lazy"
          />
        </div>`,
    )
    .join("");
  //flechitas/controles para cambiar o pasar de imagen
  const controls = hasMultipleImages
    ? `<button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>`
    : "";
  //acomodamos
  return `
    <div id="productCarousel" class="carousel slide" data-bs-ride="false">
      ${indicators}
      <div class="carousel-inner">
        ${slides}
      </div>
      ${controls}
    </div>`;
}

/**
 * Inyectamos html del modal en el contenedor correspondiente
 * @param{string} productId - id del producto a mostrar
 */

function openProductModal(productId) {
  //buscamos el producto en las categorías
  let product = null;
  for (const category of Object.values(PRODUCTS)) {
    product = category.find((p) => p.id === productId);
    if (product) break;
  }
  if (!product)
    return console.error(`Producto con id ${productId} no encontrado`);
  const basePath = getBasePath();
  modalQty = 1; //reiniciamos la cantidad a 1 cada vez que se abre el modal
  const carousel = buildCarousel(product, basePath);
  const price = product.price.toLocaleString("es-AR");

  const modalHTML = `
    <div class="modal fade" id="productDetailModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content product__modal__content">

          <!-- Botón cerrar -->
          <button type="button" class="btn-close product__modal__close" data-bs-dismiss="modal" aria-label="Cerrar"></button>

          <div class="row g-0">
            <!-- Carrusel de imágenes -->
            <div class="col-12 col-md-6">
              <div class="product__modal__carousel-wrap">
                ${carousel}
              </div>
            </div>

            <!-- Detalle del producto -->
            <div class="col-12 col-md-6">
              <div class="product__modal__body">
                <span class="product__card__cat">${product.category}</span>
                <h2 class="product__modal__name" id="productModalLabel">${product.name}</h2>
                <p class="product__modal__desc">${product.description}</p>
                <p class="product__modal__price">$${price}</p>

                <!-- Contador de cantidad -->
                <div class="quantity-control mb-3">
                  <button class="quantity-btn" onclick="changeModalQty(-1)" aria-label="Disminuir cantidad">−</button>
                  <span class="quantity-display" id="modalQtyDisplay">1</span>
                  <button class="quantity-btn" onclick="changeModalQty(1)" aria-label="Aumentar cantidad">+</button>
                </div>

                <!-- Botón agregar al carrito -->
                <button
                  class="btn btn-primary w-100 product__modal__add-btn"
                  onclick="handleModalAddToCart('${product.id}')"
                >
                  🛒 Agregar al carrito
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>`;
  // Inyectamos el modal en el contenedor
  const container = document.getElementById("modal-container");
  if (!container) return console.error("Contenedor del modal no encontrado");
  //aca le decimos que el innerHTML del contenedor del modal sea igual al modalHTML que generamos arriba para que se muestre el modal con la información del producto
  container.innerHTML = modalHTML;
  //iniciamos el modal con Bootstrap
  const modalEl = document.getElementById("productDetailModal");
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
  //Limpiamos el modal del DOM cuando se cierra para evitar duplicados y problemas de memoria
  modalEl.addEventListener("hidden.bs.modal", () => {
    container.innerHTML = "";
  });
}

/**
 * Cambia la cantidad seleccionada en el modal
 * @param {number} delta - cantidad a sumar o restar
 */
function changeModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta); //no permitimos que sea menor a 1
  const display = document.getElementById("modalQtyDisplay");
  if (display) display.textContent = modalQty;
}

/**
 * Agregar al carrito desde el modal
 * @param {string} productId - id del producto a agregar
 */
function handleModalAddToCart(productId) {
  //reviso que el usuario esté logueado antes de agregar al carrito
  if (!isLoggedIn()) {
    //con sessionStorage guardo la página actual para redirigir después del login
    //setItem guarda la página actual en sessionStorage con la clave "sumbu-redirect" y el valor de la URL actual (window.location.href). Esto permite que después de que el usuario inicie sesión, pueda ser redirigido de vuelta a la página donde estaba antes de intentar agregar un producto al carrito.
    sessionStorage.setItem("sumbu-redirect", window.location.href); //guardamos la página actual para redirigir después del login
    window.location.href = getBasePath() + "pages/login.html";
    return;
  }
  addToCart(productId, modalQty);
  updateCartBadge();
  showToast("Producto agregado al carrito", "success");
  //cierro el modalEl
  const modalEl = document.getElementById("productDetailModal");
  if (modalEl) {
    //con bootstrap.Modal.getInstance(modalEl) obtengo la instancia del modal y luego llamo a hide() para cerrarlo
    const bsModal = bootstrap.Modal.getInstance(modalEl);
    if (bsModal) bsModal.hide();
  }
}
