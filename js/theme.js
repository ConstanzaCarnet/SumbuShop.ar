const THEME_KEY = "sumbu-theme";

function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

//íconos de línea (mismo estilo que los del navbar, ver navIcon en navbar.js)
const THEME_ICONS = {
  moon: '<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
};

//ícono del botón: muestra el tema al que se va a cambiar (luna en claro, sol en oscuro)
function getThemeIcon() {
  const paths = getTheme() === "dark" ? THEME_ICONS.sun : THEME_ICONS.moon;
  return `<svg class="nav__icon" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("themeToggle");
  if (btn) btn.innerHTML = getThemeIcon();
}

function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

//aplicamos el tema guardado apenas se carga el script (va en el <head>, sin defer),
//así la página no aparece un instante en claro antes de pasar a oscuro
applyTheme(localStorage.getItem(THEME_KEY) || "light");
