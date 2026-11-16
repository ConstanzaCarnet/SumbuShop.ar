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
              <!-- data-bs-toggle y data-bs-target hacen que Bootstrap abra el modal de contacto sin salir del sitio -->
              <a href="#" data-bs-toggle="modal" data-bs-target="#contactModal">Contacto</a>
            </div>
          </div>
          <div class="col-md-4 text-md-end">
            © ${new Date().getFullYear()} Sumbu Shop. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>

    <!-- Modal de contacto simulado (datos ficticios, sitio de demostración) -->
    <div class="modal fade" id="contactModal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <!-- text-dark para que el texto se lea bien sobre el fondo blanco del modal, incluso en modo oscuro -->
        <div class="modal-content text-dark">
          <div class="modal-header">
            <h5 class="modal-title" id="contactModalLabel">💬 Contactanos</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <p class="mb-2"><strong>WhatsApp:</strong> +54 9 11 XXXX-XXXX</p>
            <p class="mb-2"><strong>Email:</strong> consultas@sumbushop.com.ar</p>
            <p class="mb-3"><strong>Horario:</strong> Lunes a Viernes de 9 a 18 hs</p>
            <button type="button" id="whatsappBtn" class="btn w-100 text-white fw-bold"
              style="background-color: #25D366; border-color: #25D366;">
              📱 Abrir WhatsApp
            </button>
            <!-- Mensaje oculto que aparece al tocar el botón verde -->
            <div id="whatsappMsg" class="alert alert-success mt-3 mb-0 d-none" role="alert">
              Simulación: en la versión real esto abriría un chat de WhatsApp con Sumbu Shop.
            </div>
            <p class="small text-muted mt-3 mb-0">Sitio de demostración – los datos de contacto son ficticios.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>`;

  //al tocar el botón verde mostramos el mensaje de simulación en lugar de abrir WhatsApp de verdad
  const whatsappBtn = document.getElementById("whatsappBtn");
  const whatsappMsg = document.getElementById("whatsappMsg");
  whatsappBtn.addEventListener("click", () => {
    whatsappMsg.classList.remove("d-none");
  });

  //cuando se cierra el modal volvemos a ocultar el mensaje, así la próxima vez arranca limpio
  document.getElementById("contactModal").addEventListener("hidden.bs.modal", () => {
    whatsappMsg.classList.add("d-none");
  });
}
//addEventListener para que cuando el DOM esté cargado, se ejecute la función renderFooter
document.addEventListener("DOMContentLoaded", renderFooter);
