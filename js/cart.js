//simulamos el manejo de carrito con localStorage, para poder guardar los productos agregados al carrito y mostrarlos en la página de carrito
//le damos un CART_KEY para poder identificar el carrito en localStorage, y así poder leerlo y guardarlo
const CART_KEY = "sumbu-cart";
//leer y guardar
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}
//lo quer hacemos es pasarle el CART_KEY y el carrito en formato JSON para guardarlo en localStorage, de esta manera podemos mantener el estado del carrito entre recargas de página
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

//Operaciones con el carrito
//agregar un producto al carrito, si el producto ya existe, se incrementa la cantidad
function addToCart(productId, quantity = 1) {
  const product = findProductById(productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      //los productos tienen un array de imágenes: en el carrito mostramos la primera
      image: product.images[0],
      category: product.category,
      quantity: quantity,
    });
  }
  //con esta funcion saveCart, guardamos el carrito actualizado en localStorage, para que se mantenga entre recargas de página
  saveCart(cart);
  //actualizamos el badge del carrito
  updateCartBadge();
}

//Eliminar un item del carrito (sin preguntar: la confirmación la hace confirmRemoveFromCart)
function removeFromCart(productId) {
  //se filtra el carrito para eliminar el producto con el id correspondiente, y luego se guarda el carrito actualizado en localStorage y se actualiza el badge del carrito
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

//Modal de confirmación del carrito (lo usan "eliminar producto", "vaciar carrito" y "confirmar compra")
//guardamos qué hacer si el usuario confirma (eliminar, vaciar, volver a renderizar el carrito...)
let pendingConfirmAction = null;
//se pone en true sólo si el usuario tocó el botón de confirmar (no con Cancelar, Esc o click afuera)
let confirmAccepted = false;

//crea el modal una sola vez y lo agrega al final del body; las siguientes veces lo reutiliza
function getCartConfirmModal() {
  let modalEl = document.getElementById("cartConfirmModal");
  if (modalEl) return modalEl;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <div class="modal fade" id="cartConfirmModal" tabindex="-1" aria-labelledby="cartConfirmTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content product__modal__content p-4 text-center">
          <h2 class="product__modal__name" id="cartConfirmTitle"></h2>
          <p class="product__modal__desc">
            <span id="cartConfirmMsgStart"></span>
            <strong id="cartConfirmHighlight"></strong>
            <span id="cartConfirmMsgEnd"></span>
          </p>
          <div class="d-flex gap-3 justify-content-center flex-wrap">
            <button type="button" class="btn btn__sumbu__outline" id="cartConfirmCancel" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn__sumbu" id="cartConfirmBtn"></button>
          </div>
        </div>
      </div>
    </div>`,
  );
  modalEl = document.getElementById("cartConfirmModal");

  //botón de confirmar -> marca que el usuario aceptó y cierra el modal
  document.getElementById("cartConfirmBtn").addEventListener("click", () => {
    confirmAccepted = true;
    bootstrap.Modal.getInstance(modalEl).hide();
  });

  //cuando el modal terminó de cerrarse ejecutamos la acción (sólo si confirmó).
  //lo hacemos acá y no en el click para que la acción pueda abrir otra vez el modal
  //(ej: después de confirmar la compra se muestra el mensaje de éxito)
  modalEl.addEventListener("hidden.bs.modal", () => {
    const action = confirmAccepted ? pendingConfirmAction : null;
    pendingConfirmAction = null;
    confirmAccepted = false;
    if (action) action();
  });

  return modalEl;
}

/**
 * Abre el modal de confirmación con los textos que recibiré de la funcion que lo llama (confirmRemoveFromCart o confirmClearCart)
 * @param {Object} options
 * @param {string} options.title - título del modal
 * @param {string} options.message - texto del mensaje
 * @param {string} [options.highlight] - parte del mensaje en negrita (ej: nombre del producto)
 * @param {string} [options.messageEnd] - texto que va después de la parte en negrita
 * @param {string} options.confirmText - texto del botón de confirmar
 * @param {Function} [options.onConfirm] - se ejecuta si el usuario confirma
 * @param {boolean} [options.showCancel] - false para mostrar sólo un botón (ej: mensaje de compra exitosa)
 */
function showCartConfirm({
  title,
  message,
  highlight = "",
  messageEnd = "",
  confirmText,
  onConfirm = null,
  showCancel = true,
}) {
  const modalEl = getCartConfirmModal();
  //usamos textContent para que los textos (ej: nombre del producto) no se interpreten como HTML
  document.getElementById("cartConfirmTitle").textContent = title;
  document.getElementById("cartConfirmMsgStart").textContent = message;
  document.getElementById("cartConfirmHighlight").textContent = highlight;
  document.getElementById("cartConfirmMsgEnd").textContent = messageEnd;
  document.getElementById("cartConfirmBtn").textContent = confirmText;
  document.getElementById("cartConfirmCancel").hidden = !showCancel;
  pendingConfirmAction = onConfirm;
  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

/**
 * Pregunta si el usuario quiere eliminar el producto del carrito
 * @param {string} productId - id del producto a eliminar
 * @param {Function} [onRemoved] - se ejecuta después de eliminarlo (ej: renderCart)
 */
function confirmRemoveFromCart(productId, onRemoved) {
  const item = getCart().find((item) => item.id === productId);
  if (!item) return;

  showCartConfirm({
    title: "¿Eliminar producto?",
    message: "¿Estás seguro de que quieres eliminar",
    highlight: item.name,
    messageEnd: "del carrito?",
    confirmText: "Sí, eliminar",
    onConfirm: () => {
      removeFromCart(productId);
      if (onRemoved) onRemoved();
    },
  });
}

/**
 * Pregunta si el usuario quiere vaciar el carrito
 * @param {Function} [onCleared] - se ejecuta después de vaciarlo (ej: renderCart)
 */
function confirmClearCart(onCleared) {
  showCartConfirm({
    title: "¿Vaciar el carrito?",
    message: "Se van a eliminar todos los productos del carrito.",
    confirmText: "Sí, vaciar",
    onConfirm: () => {
      clearCart();
      if (onCleared) onCleared();
    },
  });
}

/**
 * Pregunta si el usuario quiere confirmar la compra (simulada); si confirma,
 * vacía el carrito y muestra el mensaje de compra exitosa en el mismo modal
 * @param {Function} [onCompleted] - se ejecuta después de la compra (ej: renderCart)
 */
function confirmCheckout(onCompleted) {
  const total = formatPrice(getCartTotal());
  const count = getCartCount();

  showCartConfirm({
    title: "¿Confirmar compra?",
    message: "Vas a pagar",
    highlight: total,
    messageEnd: `por ${count} ${count === 1 ? "producto" : "productos"}.`,
    confirmText: "Sí, comprar",
    onConfirm: () => {
      const session = getSession();
      clearCart();
      if (onCompleted) onCompleted();
      //mensaje de éxito: sólo con el botón "Aceptar"
      showCartConfirm({
        title: "✅ ¡Compra confirmada!",
        message: "Total:",
        highlight: total,
        messageEnd: `— te escribiremos a ${session.email} para coordinar el envío. 🍓 (Compra simulada)`,
        confirmText: "Aceptar",
        showCancel: false,
      });
    },
  });
}

//cambiar la cantidad(tener en cuenta que en esta simulación de carrito, no tenemos stock, por lo que no hay validaciones de cantidad máxima.
//cambia la cantidad de un item a un mínimo de 1; si baja de 1, pregunta si se quiere eliminar
function updateCartQty(productId, newQty, onRemoved) {
  if (newQty < 1) {
    confirmRemoveFromCart(productId, onRemoved);
    return;
  }
  const cart = getCart();
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = newQty;
    saveCart(cart);
    updateCartBadge();
  }
}

//vaciar el carrito
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

//total de items(suma)
function getCartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

//Total en pesos
function getCartTotal() {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}

//Badge del navbar
function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const count = getCartCount();
  if (!badge) return;
  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}
//el badge se inicializa en renderNavbar(), apenas se crea el navbar
