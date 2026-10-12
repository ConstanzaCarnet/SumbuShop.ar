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
 * @returns {{ ok: boolean, error?: string }}
 */
function registerUser(nombre, apellido, usuario, email, password, fechaNacimiento) {
  if (findUser(email)) {
    return { ok: false, error: "Ya existe una cuenta con ese email." };
  }
  const users = getUsers();
  users.push({
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    usuario: usuario.trim(),
    email: email.trim().toLowerCase(),
    password, // texto plano — solo para demostración
    fechaNacimiento,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { ok: true };
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

/**
 * Inicia sesión guardando los datos del usuario en localStorage.
 * @param {Object} user - objeto del usuario registrado
 */
function loginUser(user) {
  const session = {
    email: user.email,
    name: user.nombre,
    loggedAt: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

/**
 * Cierra sesión.
 */
function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Devuelve el objeto de sesión activa, o null.
 * @returns {Object|null}
 */
function getSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
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
