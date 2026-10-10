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
function addToCart(product, quantity = 1) {
  //busco y veo si exite
  let product = null;
  for (const category of Object.values(PRODUCTS)) {
    product = category.find((p) => p.id === productId);
    if (product) break;
  }
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
      image: product.image,
      category: product.category,
      quantity: quantity,
    });
  }
  //con esta funcion saveCart, guardamos el carrito actualizado en localStorage, para que se mantenga entre recargas de página
  saveCart(cart);
  //actualizamos el badge del carrito
  updateCartBadge();
}

//Eliminar un item del carrito
function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

//cambiar la cantidad(tener en cuenta que en esta simulación de carrito, no tenemos stock, por lo que no hay validaciones de cantidad máxima.
//cambia la cantidad de un item a un mínimo de 1
function updateCartQty(productId, newQty) {
  if (newQty < 1) {
    removeFromCart(productId);
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
//inicializamos el badge del carrito al cargar la página, para que se muestre correctamente el número de items en el carrito
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(updateCartBadge, 100); //esperamos un poco para que se cargue el DOM y el badge del carrito
});
