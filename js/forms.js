/*
  forms.js - Lógica de los formularios.
  Se carga SOLO en las páginas que tienen formulario:
  pages/login.html y pages/register.html
*/

// ─── Helpers de UI ───────────────────────────

/**
 * Muestra un mensaje de error debajo del formulario.
 * @param {string} formId
 * @param {string} message
 */
function showFormError(formId, message) {
  // Limpiar error anterior
  clearFormError(formId);
  const form = document.getElementById(formId);
  if (!form) return;
  const div = document.createElement("div");
  div.className = "alert alert-danger form__error mt-3";
  div.setAttribute("role", "alert");
  div.textContent = message;
  form.appendChild(div);
}

function clearFormError(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const prev = form.querySelector(".form__error");
  if (prev) prev.remove();
}

/*Inicio de sesión*/
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFormError("loginForm");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const result = verifyCredentials(email, password);
    if (!result.ok) {
      showFormError("loginForm", result.error);
      return;
    }

    // Credenciales correctas → crear sesión
    loginUser(result.user);

    // Volver a la página de origen si venía redirigido
    const redirect = sessionStorage.getItem("sumbu-redirect");
    sessionStorage.removeItem("sumbu-redirect");
    window.location.href = redirect || "../index.html";
  });
}

const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFormError("registerForm");

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;

    // Validación mínima de contraseña
    if (password.length < 6) {
      showFormError(
        "registerForm",
        "La contraseña debe tener al menos 6 caracteres.",
      );
      return;
    }

    const result = registerUser(
      nombre,
      apellido,
      usuario,
      email,
      password,
      fechaNacimiento,
    );
    if (!result.ok) {
      showFormError("registerForm", result.error);
      return;
    }

    // Registro exitoso → loguear automáticamente y redirigir
    const user = findUser(email);
    loginUser(user);

    const redirect = sessionStorage.getItem("sumbu-redirect");
    sessionStorage.removeItem("sumbu-redirect");
    window.location.href = redirect || "../index.html";
  });
}
