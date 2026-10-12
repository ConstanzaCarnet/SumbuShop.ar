function renderFooter() {
  const footer = document.getElementById("footer-container");
  if (!footer) {
    console.error("Footer container not found");
    return;
  }
  //con base le s digo que busque la ruta base del proyecto para poder usarla en los links del footer
  const base = getBasePath();
  //usamos innerHTML para agregar el contenido del footer, incluyendo los links y el año actual
  footer.innerHTML = `
        <footer class="site__footer py-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-4 mb-3 mb-md-0">
            <div class="footer__logo">🍓 Sumbu Shop</div>
            <div>Hecho con ❤️ en Argentina</div>
          </div>
          <div class="col-md-4 text-center mb-3 mb-md-0">
            <div class="d-flex justify-content-center gap-4">
              <a href="${base}pages/about-us.html">Sobre Nosotros</a>
              <a href="mailto:consultasDeMentiritaPorAhora@correo.com">Contacto</a>
            </div>
          </div>
          <div class="col-md-4 text-md-end">
            © ${new Date().getFullYear()} Sumbu Shop. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>`;
}
//addEventListener para que cuando el DOM esté cargado, se ejecute la función renderFooter
document.addEventListener("DOMContentLoaded", renderFooter);
