const STORAGE_KEY = "sumbu-theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  // Busca el botón cada vez que se llama, no solo al inicio
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

function toggleTheme() {
  const current =
    document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
}

// Aplica el tema guardado cuando el DOM está listo
document.addEventListener("DOMContentLoaded", function () {
  const saved = localStorage.getItem(STORAGE_KEY) || "light";
  applyTheme(saved);
});
