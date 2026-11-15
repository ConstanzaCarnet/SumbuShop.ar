//opiniones de clientes (simulamos las reseñas de Google: el negocio todavía no está en Google Maps)
//se cargan con fetch desde data/reviews.json y se muestran en un carrusel de Bootstrap en el index

const REVIEWS_INTERVAL = 7000; //milisegundos que se muestra cada grupo de opiniones: tiempo cómodo para leerlas
const SITE_URL = "https://sumbu-shop-ar.vercel.app/";

//cuántas opiniones entran por slide según el ancho (mismos cortes que Bootstrap: md = 768px, lg = 992px)
const REVIEWS_LG_QUERY = window.matchMedia("(min-width: 992px)");
const REVIEWS_MD_QUERY = window.matchMedia("(min-width: 768px)");

function getReviewsPerSlide() {
  if (REVIEWS_LG_QUERY.matches) return 3;
  if (REVIEWS_MD_QUERY.matches) return 2;
  return 1;
}

//"★★★★☆" a partir de la cantidad de estrellas
function renderStars(stars) {
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

//"2024-10-14" → "14 de octubre de 2024"
function formatReviewDate(isoDate) {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

//HTML de una tarjeta de opinión
function buildReviewCard(review) {
  const productUrl =
    getBasePath() + getCategoryPagePath(review.productId) + "?open=" + review.productId;
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

//arma los slides agrupando las opiniones (1, 2 o 3 por slide) y arranca el carrusel
function buildReviewsCarousel(carousel, reviews) {
  //si ya había un carrusel (cambio de tamaño de pantalla), lo detenemos antes de rearmarlo
  const previous = bootstrap.Carousel.getInstance(carousel);
  if (previous) previous.dispose();

  const perSlide = getReviewsPerSlide();
  const slides = [];
  for (let i = 0; i < reviews.length; i += perSlide) {
    slides.push(reviews.slice(i, i + perSlide));
  }

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
      (_, i) => `<button type="button" data-bs-target="#reviewsCarousel" data-bs-slide-to="${i}"
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

async function renderReviews() {
  const section = document.getElementById("reviews-section");
  if (!section) return;
  const carousel = document.getElementById("reviewsCarousel");

  try {
    const response = await fetch(getBasePath() + "data/reviews.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const reviews = await response.json();

    //resumen debajo del título: promedio de estrellas y cantidad de opiniones
    const average = reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length;
    document.getElementById("reviews-summary").innerHTML = `
      <span class="reviews__score">${average.toFixed(1).replace(".", ",")}</span>
      <span class="review__stars">${renderStars(Math.round(average))}</span>
      <span class="reviews__count">${reviews.length} opiniones</span>`;

    section.hidden = false;
    buildReviewsCarousel(carousel, reviews);
    //al cambiar de tamaño de pantalla, reagrupamos las opiniones
    REVIEWS_LG_QUERY.addEventListener("change", () => buildReviewsCarousel(carousel, reviews));
    REVIEWS_MD_QUERY.addEventListener("change", () => buildReviewsCarousel(carousel, reviews));
  } catch (error) {
    //fetch no funciona abriendo el index.html con doble click (file://): hace falta un servidor
    //(Vercel, Live Server...). En ese caso mostramos un aviso en lugar del carrusel.
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

document.addEventListener("DOMContentLoaded", renderReviews);
