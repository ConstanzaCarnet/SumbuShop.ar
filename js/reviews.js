//opiniones de clientes (simulamos las reseñas de Google: el negocio todavía no está en Google Maps)
//se cargan con fetch desde data/reviews.json y se muestran en un carrusel de Bootstrap en el index

const REVIEWS_INTERVAL = 7000; //milisegundos que se muestra cada opinión: tiempo cómodo para leerla

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

//HTML de una opinión (un slide del carrusel)
function buildReviewSlide(review, index) {
  const productUrl =
    getBasePath() + getCategoryPagePath(review.productId) + "?open=" + review.productId;
  return `
    <div class="carousel-item ${index === 0 ? "active" : ""}">
      <article class="review__card">
        <header class="review__header">
          <span class="review__avatar" aria-hidden="true">${review.name.charAt(0)}</span>
          <div>
            <p class="review__name">${review.name}</p>
            <p class="review__meta">${review.location} · ${formatReviewDate(review.date)}</p>
          </div>
        </header>
        <p class="review__stars" aria-label="${review.stars} de 5 estrellas">${renderStars(review.stars)}</p>
        <p class="review__comment">“${review.comment}”</p>
        <a class="review__product" href="${productUrl}">${review.product} →</a>
      </article>
    </div>`;
}

async function renderReviews() {
  const section = document.getElementById("reviews-section");
  if (!section) return;

  try {
    const response = await fetch(getBasePath() + "data/reviews.json");
    if (!response.ok) throw new Error("HTTP " + response.status);
    const reviews = await response.json();

    //resumen arriba del carrusel: promedio de estrellas y cantidad de opiniones
    const average = reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length;
    document.getElementById("reviews-summary").innerHTML = `
      <span class="reviews__score">${average.toFixed(1).replace(".", ",")}</span>
      <span class="review__stars">${renderStars(Math.round(average))}</span>
      <span class="reviews__count">${reviews.length} opiniones</span>`;

    const carousel = document.getElementById("reviewsCarousel");
    carousel.querySelector(".carousel-inner").innerHTML = reviews
      .map(buildReviewSlide)
      .join("");
    carousel.querySelector(".carousel-indicators").innerHTML = reviews
      .map(
        (_, i) => `<button type="button" data-bs-target="#reviewsCarousel" data-bs-slide-to="${i}"
          ${i === 0 ? 'class="active" aria-current="true"' : ""} aria-label="Opinión ${i + 1}"></button>`,
      )
      .join("");

    section.hidden = false;
    //pasa solo cada REVIEWS_INTERVAL ms y se pausa mientras el mouse está encima
    new bootstrap.Carousel(carousel, {
      interval: REVIEWS_INTERVAL,
      ride: "carousel",
      pause: "hover",
    });
  } catch (error) {
    //fetch no funciona abriendo el index.html con doble click (file://): hace falta un servidor
    //(Vercel, Live Server...). En ese caso mostramos un aviso en lugar del carrusel.
    console.warn("No se pudieron cargar las opiniones:", error);
    const isLocalFile = window.location.protocol === "file:";
    document.getElementById("reviewsCarousel").innerHTML = `
      <p class="reviews__error">
        ${
          isLocalFile
            ? "Las opiniones se cargan con <code>fetch</code>, que no funciona abriendo el archivo directamente. Abrí el sitio con Live Server para verlas."
            : "No pudimos cargar las opiniones en este momento."
        }
      </p>`;
    section.hidden = false;
  }
}

document.addEventListener("DOMContentLoaded", renderReviews);
