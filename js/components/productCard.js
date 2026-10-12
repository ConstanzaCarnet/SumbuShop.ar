/**
 * Genera el HTML de una tarjeta de producto.
 * La imagen usa images[0]. Al hacer click en la card (fuera de los botones)
 * se abre el modal de detalle con carrusel.
 * @param {Object} product
 */
function createProductCard(product) {
  const base = getBasePath();
  const formattedPrice = product.price.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });
  //usat la primera imagen del array de imágenes para la card
  const thumbnail =
    product.images && product.images.length > 0
      ? product.images[0]
      : "img/placeholder.jpg";
  //indicador de multiples imágenes
  const multiImg =
    product.images && product.images.length > 1
      ? `<span class="product__card__multi-img" title="${product.images.length} fotos">
        📷 ${product.images.length}
       </span>`
      : "";

  return `
        <div class="col-12 col-sm-6 col-lg-4 d-flex">
      <div class="product__card" data-product-id="${product.id}">

        <!-- Área clickeable para abrir el modal -->
        <div class="product__card-img-wrap" onclick="openProductModal('${product.id}')" role="button" tabindex="0" aria-label="Ver detalle de ${product.name}">
          <div class="product__card-img">
            <img src="${base}${thumbnail}" alt="${product.name}" loading="lazy" />
          </div>
          ${multiImg}
        </div>

        <div class="product__card__body">
          <p class="product__card__cat">${product.category}</p>
          <h3 class="product__card__name product__card__name--link" onclick="openProductModal('${product.id}')">${product.name}</h3>
          <p class="product__card__desc">${product.description}</p>

          <div class="product__card__price">${formattedPrice}</div>

          <div class="product__card__actions">
            <div class="quantity-control">
              <button class="quantity-btn" onclick="changeQty('${product.id}', -1)" aria-label="Restar">−</button>
              <span class="quantity-display" id="qty-${product.id}">1</span>
              <button class="quantity-btn" onclick="changeQty('${product.id}', +1)" aria-label="Sumar">+</button>
            </div>
            <button class="btn btn-primary btn-sm" onclick="handleAddToCart('${product.id}')">
              Agregar
            </button>
          </div>
        </div>

      </div>
    </div>`;
}

//renderizo los contenedores
function renderProductCards(conteinerId, products) {
  const container = document.getElementById(conteinerId);
  if (!container)
    return console.error(`Contenedor con id ${conteinerId} no encontrado`);

  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">No hay productos disponibles todavía.</p>
      </div>`;
    return;
  }

  container.innerHTML = products.map(createProductCard).join("");
}
//contenedor de cantidad por producto
const quantities = {};
function changeQty(productId, delta) {
  if (quantities[productId] === undefined) quantities[productId] = 1;
  const newQty = Math.max(1, quantities[productId] + delta);
  quantities[productId] = newQty;
  const display = document.getElementById("qty-" + productId);
  if (display) display.textContent = newQty;
}
//agregar al carrito(chequeamos siempre sesion)
function handleAddToCart(productId) {
  if (!isLoggedIn()) {
    const base = getBasePath();
    sessionStorage.setItem("sumbu-redirect", window.location.href);
    window.location.href = base + "pages/login.html";
    return;
  }
  const qty = quantities[productId] || 1;
  addToCart(productId, qty);
  updateCartBadge();
  showToast(`¡Agregado al carrito! ×${qty}`);
}

//Mensaje de confirmación
function showToast(message) {
  let toast = document.getElementById("sumbu-toast");
  if (!toast) {
    //esto le da id para que el style le de estilo al crearlo
    toast = document.createElement("div");
    toast.id = "sumbu-toast";
    toast.className = "sumbu__toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("sumbu__toast--visible");
  //le doy 2.5 miliseguntos
  setTimeout(function () {
    toast.classList.remove("sumbu__toast--visible");
  }, 2500);
}
