//simulacion, usando localStorage para guardar el token
const AUTH_KEY = "sumbu-session";
const USERS_KEY = "sumbu-users";
//array de usuarios "registrados"--> no hay mucha permanencia, pero sirve para simular un login
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}
//buscamos alusuario por email(case-insensitive)
/**
 * @param {string} email
 * @returns {Object|null}
 */
function findUser(email) {
  return (
    getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) ||
    null
  );
}

/**
 * Registra un nuevo usuario.
 * @param {string} nombre
 * @param {string} apellido
 * @param {string} usuario
 * @param {string} email
 * @param {string} password
 * @param {string} fechaNacimiento - formato "AAAA-MM-DD" (valor del input type="date")
 * @returns {{ ok: boolean, user?: Object, error?: string }}
 */
function registerUser(nombre, apellido, usuario, email, password, fechaNacimiento) {
  if (findUser(email)) {
    return { ok: false, error: "Ya existe una cuenta con ese email." };
  }
  const users = getUsers();
  const user = {
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    usuario: usuario.trim(),
    email: email.trim().toLowerCase(),
    password, // texto plano — solo para demostración
    fechaNacimiento,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { ok: true, user };
}

/**
 * Verifica credenciales.
 * @param {string} email
 * @param {string} password
 * @returns {{ ok: boolean, user?: Object, error?: string }}
 */
function verifyCredentials(email, password) {
  const user = findUser(email);
  if (!user) {
    return { ok: false, error: "No encontramos una cuenta con ese email." };
  }
  if (user.password !== password) {
    return { ok: false, error: "La contraseña es incorrecta." };
  }
  return { ok: true, user };
}

// ─── Gestión de sesión ────────────────────────

//La sesión se guarda en los dos storages:
// - sessionStorage: datos del usuario logueado en la pestaña actual (se borra al cerrar la pestaña)
// - localStorage: "recordar sesión", para que siga logueado al volver a abrir la página
//Nunca guardamos la contraseña en la sesión.

/**
 * Inicia sesión guardando los datos del usuario en sessionStorage y en localStorage.
 * @param {Object} user - objeto del usuario registrado
 */
function loginUser(user) {
  const session = {
    email: user.email,
    name: user.nombre,
    apellido: user.apellido,
    usuario: user.usuario,
    loggedAt: new Date().toISOString(),
  };
  const data = JSON.stringify(session);
  sessionStorage.setItem(AUTH_KEY, data);
  localStorage.setItem(AUTH_KEY, data);
}

/**
 * Cierra sesión (borra la sesión de los dos storages).
 */
function logoutUser() {
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Devuelve el objeto de sesión activa, o null.
 * Primero busca en sessionStorage; si no está (ej: pestaña nueva), la toma de
 * localStorage y la vuelve a copiar en sessionStorage.
 * @returns {Object|null}
 */
function getSession() {
  try {
    let data = sessionStorage.getItem(AUTH_KEY);
    if (!data) {
      data = localStorage.getItem(AUTH_KEY);
      if (data) sessionStorage.setItem(AUTH_KEY, data);
    }
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * true si hay sesión activa.
 * @returns {boolean}
 */
function isLoggedIn() {
  return getSession() !== null;
}

// ─── Volver a la página de origen después del login ────────────────────────
//guardamos en sessionStorage la página donde estaba el usuario, para regresar ahí después de iniciar sesión
const REDIRECT_KEY = "sumbu-redirect";

function saveRedirect() {
  sessionStorage.setItem(REDIRECT_KEY, window.location.href);
}

//guarda la página actual y manda al login (lo usan "Agregar al carrito" y la página del carrito)
function redirectToLogin() {
  saveRedirect();
  window.location.href = getBasePath() + "pages/login.html";
}

//después de loguearse: devuelve la página guardada (o el inicio) y la borra
function popRedirect() {
  const redirect = sessionStorage.getItem(REDIRECT_KEY);
  sessionStorage.removeItem(REDIRECT_KEY);
  return redirect || getBasePath() + "index.html";
}
