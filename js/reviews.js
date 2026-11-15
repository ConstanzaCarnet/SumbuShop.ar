//opiniones de clientes (simulamos las reseñas de Google,en este caso el negocio no está en Google Maps, así que es una simulación)
//se cargan con fetch desde data/reviews.json(aplicamos async/await) y se muestran en un carrusel de Bootstrap en el index

const REVIEWS_INTERVAL = 7000; //milisegundos que se muestra cada grupo de opiniones: tiempo cómodo para leer
const SITE_URL = "https://sumbu-shop-ar.vercel.app/";

//cuántas opiniones entran por slide según el ancho (mismos cortes que Bootstrap: md = 768px, lg = 992px)-> si no quedaba o muy vacío o muy justo todo
const REVIEWS_LG_QUERY = window.matchMedia("(min-width: 992px)");
const REVIEWS_MD_QUERY = window.matchMedia("(min-width: 768px)");
//Estas funciones se van a reutilizar más adelante
//esta sirve para renderizar las cards de opiniones en el carrusel, dependiendo de la cantidad de opiniones que entran por slide según el ancho de pantalla
function getReviewsPerSlide() {
  if (REVIEWS_LG_QUERY.matches) return 3;
  if (REVIEWS_MD_QUERY.matches) return 2;
  return 1;
}

//En esta función convertimos la cantidad de estrellas en una cadena de símbolos
function renderStars(stars) {
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

//"2024-10-14" → "14 de octubre de 2024"-> hacemos una funcionde formateo)
function formatReviewDate(isoDate) {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
//Aqui vamos a tener todo lo que es del DOM, es decir, la parte visual de las opiniones, como por ejemplo el HTML de una tarjeta de opinión y el armado del carrusel de opiniones
/**
 * HTML de una tarjeta de opinión
 * @param {Object} review - Objeto con los datos de la opinión
 * @returns
 */
function buildReviewCard(review) {
  const productUrl =
    getBasePath() +
    getCategoryPagePath(review.productId) +
    "?open=" +
    review.productId;
  return `
    <article class="review__card">
      <header class="review__header">
        <span class="review__avatar" aria-hidden="true">${review.name.charAt(0)}</span>
        <div>
          <p class="review__name">${review.name}</p>
          <p class="review__meta">${review.location} · ${formatReviewDate(review.date)}</p>
        </div>
      </header>
      <p class="review__stars" aria-label="${review.stars} de 5 estrellas">${renderStars(review.stars)}</p>
      <p class="review__comment">${review.comment}</p>
      <a class="review__product" href="${productUrl}">${review.product} →</a>
    </article>`;
}

/***
 * arma los slides agrupando las opiniones (1, 2 o 3 por slide) y arranca el carrusel
 * @param {HTMLElement} carousel - Elemento del carrusel
 * @param {Array} reviews - Array de objetos con las opiniones
 */
function buildReviewsCarousel(carousel, reviews) {
  //si ya había un carrusel (cambio de tamaño de pantalla), lo detenemos antes de rearmarlo
  const previous = bootstrap.Carousel.getInstance(carousel); //usamos bootstrap.Carousel.getInstance para obtener la instancia del carrusel anterior y luego llamamos a dispose() para eliminarlo y liberar recursos. Esto es importante para evitar que se acumulen múltiples instancias del carrusel y para asegurarnos de que el nuevo carrusel funcione correctamente.
  if (previous) previous.dispose();

  const perSlide = getReviewsPerSlide();
  const slides = [];
  for (let i = 0; i < reviews.length; i += perSlide) {
    slides.push(reviews.slice(i, i + perSlide));
  }
  //armamos el HTML de los slides y los indicadores del carrusel
  carousel.querySelector(".carousel-inner").innerHTML = slides
    .map(
      (group, i) => `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <div class="reviews__group" style="--per-slide: ${perSlide}">
          ${group.map(buildReviewCard).join("")}
        </div>
      </div>`,
    )
    .join("");

  carousel.querySelector(".carousel-indicators").innerHTML = slides
    .map(
      (
        _,
        i,
      ) => `<button type="button" data-bs-target="#reviewsCarousel" data-bs-slide-to="${i}"
        ${i === 0 ? 'class="active" aria-current="true"' : ""} aria-label="Grupo de opiniones ${i + 1}"></button>`,
    )
    .join("");

  //pasa solo cada REVIEWS_INTERVAL ms y se pausa mientras el mouse está encima
  new bootstrap.Carousel(carousel, {
    interval: REVIEWS_INTERVAL,
    ride: "carousel",
    pause: "hover",
  });
}

/**
 * Renderiza las opiniones en el carrusel
 * @async
 * @function renderReviews
 * @returns
 */
//Ahora sí, la función principal que se ejecuta al cargar la página: carga las opiniones con fetch y llama a buildReviewsCarousel para mostrarlas
async function renderReviews() {
  const section = document.getElementById("reviews-section");
  if (!section) return;
  const carousel = document.getElementById("reviewsCarousel");

  try {
    const response = await fetch(getBasePath() + "data/reviews.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const reviews = await response.json();

    //resumen debajo del título: promedio de estrellas y cantidad de opiniones
    const average =
      reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length;
    document.getElementById("reviews-summary").innerHTML = `
      <span class="reviews__score">${average.toFixed(1).replace(".", ",")}</span>
      <span class="review__stars">${renderStars(Math.round(average))}</span>
      <span class="reviews__count">${reviews.length} opiniones</span>`;

    section.hidden = false;
    buildReviewsCarousel(carousel, reviews);
    //al cambiar de tamaño de pantalla, reagrupamos las opiniones
    REVIEWS_LG_QUERY.addEventListener("change", () =>
      buildReviewsCarousel(carousel, reviews),
    );
    REVIEWS_MD_QUERY.addEventListener("change", () =>
      buildReviewsCarousel(carousel, reviews),
    );
  } catch (error) {
    //El fetch no funciona abriendo el index.html con doble click (file://): hace falta un servidor
    //(Vercel, Live Server...). En ese caso mostramos un aviso en lugar del carrusel, en caso de que el usuario abra el index.html directamente desde su computadora.
    //de paso en caso de tener un error de red o de servidor también mostramos un aviso, pero con un mensaje distinto
    console.warn("No se pudieron cargar las opiniones:", error);
    const message =
      window.location.protocol === "file:"
        ? "Las opiniones se cargan con <code>fetch</code>, que no funciona abriendo el archivo directamente. Abrí el sitio con Live Server o miralas en"
        : "No pudimos cargar las opiniones en este momento. Podés verlas en";
    carousel.innerHTML = `
      <p class="reviews__error">
        ${message} <a href="${SITE_URL}" target="_blank" rel="noopener">${SITE_URL.replace("https://", "").replace(/\/$/, "")}</a>.
      </p>`;
    section.hidden = false;
  }
}
//al cargar la página, ejecutamos renderReviews
document.addEventListener("DOMContentLoaded", renderReviews);
