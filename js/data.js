// Arrays de páginas para cada sección
const NAV_PAGES = [
  { id: "home", title: "Home", path: "index.html" },
  { id: "about", title: "Sobre Nosotros", path: "pages/about-us.html" },
  { id: "jams", title: "Mermeladas", path: "pages/jams.html" },
  { id: "preserved", title: "Conservas", path: "pages/preserved.html" },
  { id: "backery", title: "Repostería", path: "pages/bakery.html" },
  { id: "mache", title: "Maché", path: "pages/mache-paper.html" },
  { id: "cosmetics", title: "Cosmética", path: "pages/cosmetics.html" },
];

//Ahora vienen los arrays de c/producto
const PRODUCTS = {
  jams: [
    {
      id: "jam-001",
      name: "Mermelada de Frutilla",
      description:
        "Elaborada con frutillas frescas y azúcar de caña. Sin conservantes artificiales.",
      price: 1800,
      images: ["img/mermeladas/mermeladaDeFrutillas.jpg"],
      category: "Mermeladas",
    },
    {
      id: "jam-002",
      name: "Mermelada de Durazno",
      description:
        "Duraznos maduros de temporada convertidos en una mermelada suave y aromática.",
      price: 1800,
      images: ["img/mermeladas/mermeladaDeDurazno.jpg"],
      category: "Mermeladas",
    },
    {
      id: "jam-003",
      name: "Mermelada de Ciruela",
      description:
        "Ciruelas negras con un toque de canela. Perfecta para desayunos y meriendas.",
      price: 1900,
      images: ["img/mermeladas/mermeladaDeCiruelaN.jpg"],
      category: "Mermeladas",
    },
    {
      id: "jam-004",
      name: "Mermelada de Mandarina",
      description:
        "Mandarinas frescas con una pizca de jengibre. Sabor cítrico e intenso.",
      price: 1900,
      images: [
        "img/mermeladas/mermeladaDeMandarina.jpg",
        "img/mermeladas/naranjasParaMermelada.png",
      ],
      category: "Mermeladas",
    },
  ],
  preserved: [
    {
      id: "pres-001",
      name: "Pepinillos en Vinagre",
      description:
        "Pepinillos artesanales en vinagre con hierbas. Crujientes y llenos de sabor.",
      price: 2200,
      images: ["img/conservas/pepinillos.jpg"],
      category: "Conservas",
    },
    {
      id: "pres-002",
      name: "Pollo en Escabeche",
      description:
        "Pollo de campo marinado con verduras, aceitunas y hierbas aromáticas.",
      price: 3200,
      images: ["img/conservas/polloEnEscabeche.jpg"],
      category: "Conservas",
    },
    {
      id: "pres-003",
      name: "Quinotos en Almíbar",
      description:
        "Quinotos enteros en almíbar liviano. Ideales para acompañar quesos y postres.",
      price: 2400,
      images: [
        "img/conservas/quinotos_almnibar.png",
        "img/quinotos_tarros.png",
      ],
      category: "Conservas",
    },
  ],
  bakery: [
    {
      id: "bak-001",
      name: "Brownies de Chocolate",
      description:
        "Brownies húmedos y densos con chips de chocolate. Horneados artesanalmente.",
      price: 2200,
      images: ["img/pasteleria/brownies.jpg"],
      category: "Pastelería",
    },
    {
      id: "bak-002",
      name: "Espiral de Chocolate",
      description:
        "Bizcocho esponjoso con espiral de chocolate negro. Una delicia para toda ocasión.",
      price: 2800,
      images: ["img/pasteleria/chocolateEspiral.png"],
      category: "Pastelería",
    },
    {
      id: "bak-003",
      name: "Tarta de Coco y Dulce de Leche",
      description:
        "Masa crocante, relleno cremoso de coco con generosa capa de dulce de leche.",
      price: 3200,
      images: [
        "img/pasteleria/cocoDulceDeLecheTarta.jpg",
        "img/pasteleria/porcionTartacocoDL.jpg",
      ],
      category: "Pastelería",
    },
    {
      id: "bak-004",
      name: "Lemon Pie",
      description:
        "Tarta de limón con merengue tostado. Equilibrio perfecto entre ácido y dulce.",
      price: 3400,
      images: ["img/pasteleria/Lemon.jpg", "img/pasteleria/porcionLemon.jpg"],
      category: "Pastelería",
    },
    {
      id: "bak-005",
      name: "Pastel Glaseado con Frutas",
      description:
        "Bizcochuelo esponjoso cubierto de glaseado y frutas frescas de temporada.",
      price: 4200,
      images: ["img/pasteleria/pastelGlaseadoConFruta.png"],
      category: "Pastelería",
    },
    {
      id: "bak-006",
      name: "Tarta de Manzana",
      description:
        "Tarta dulce con manzanas caramelizadas y masa casera crujiente.",
      price: 3200,
      images: ["img/pasteleria/tartadeManzana.jpg"],
      category: "Pastelería",
    },
    {
      id: "bak-007",
      name: "Torta de Ananá Invertida",
      description:
        "Clásico bizcochuelo invertido con rodajas de ananá caramelizado.",
      price: 3800,
      images: ["img/pasteleria/tortaAnanaInvert.jpeg"],
      category: "Pastelería",
    },
  ],
  mache: [
    {
      id: "mache-001",
      name: "Árbol Estrella Violeta",
      description:
        "Árbol decorativo en papel maché con estrella. Pintado a mano en tonos violetas.",
      price: 5500,
      images: [
        "img/papelMache/arbolEstrellaVioleta.jpeg",
        "img/papelMache/arbolEstrellaVioleta2.jpeg",
      ],
      category: "Papel Maché",
    },
    {
      id: "mache-002",
      name: "Arbolitos",
      description:
        "Arbolitos decorativos en papel maché. Disponibles en distintos colores y estilos.",
      price: 4200,
      images: [
        "img/papelMache/arbolitoBlanco.png",
        "img/papelMache/arbolitoAzulMache.jpeg",
        "img/papelMache/arbolitosVerdesMache.png",
      ],
      category: "Papel Maché",
    },
    {
      id: "mache-003",
      name: "Botella y Jarrón Decorado",
      description:
        "Botellas y jarrones artesanales en papel maché pintados a mano. Cada pieza es única.",
      price: 4500,
      images: [
        "img/papelMache/botellaDecorada.jpeg",
        "img/papelMache/botellaDecoradaCardo.png",
        "img/papelMache/jarronDecoradoRosa.png",
      ],
      category: "Papel Maché",
    },
    {
      id: "mache-004",
      name: "Duende",
      description:
        "Duende artesanal de papel maché pintado a mano. Perfecto para decoración navideña.",
      price: 5000,
      images: ["img/papelMache/duende.jpeg"],
      category: "Papel Maché",
    },
    {
      id: "mache-005",
      name: "Gato de Papel Maché",
      description:
        "Figura de gato artesanal con detalles pintados a mano. Original y encantador.",
      price: 4800,
      images: ["img/papelMache/gatoDePapelMache.png"],
      category: "Papel Maché",
    },
    {
      id: "mache-006",
      name: "Hadas y Muñecas",
      description:
        "Colección de hadas y muñecas artesanales en papel maché. Pintadas en colores vibrantes.",
      price: 6200,
      images: [
        "img/papelMache/haditaRoja.jpeg",
        "img/papelMache/haditaVioletaVerde.jpeg",
        "img/papelMache/muniecaRosa.jpeg",
      ],
      category: "Papel Maché",
    },
  ],
  cosmetics: [
    {
      id: "cos-001",
      name: "Aceite de Lavanda",
      description:
        "Aceite esencial de lavanda 100% puro. Relajante, ideal para masajes y aromaterapia.",
      price: 4800,
      images: ["img/cosmetica/aceiteDeLavanda.jpg"],
      category: "Cosmética",
    },
    {
      id: "cos-002",
      name: "Aceite de Romero",
      description:
        "Aceite de romero natural. Estimulante y vigorizante para cabello y piel.",
      price: 4500,
      images: ["img/cosmetica/aceiteDeRomero.jpg"],
      category: "Cosmética",
    },
    {
      id: "cos-003",
      name: "Crema de Lavanda",
      description:
        "Crema nutritiva con esencia de lavanda. Sin parabenos ni colorantes artificiales.",
      price: 3600,
      images: ["img/cosmetica/cremaDeLavandaJust.jpg"],
      category: "Cosmética",
    },
    {
      id: "cos-004",
      name: "Crema de Manzanilla",
      description:
        "Crema suavizante con extracto de manzanilla. Ideal para pieles sensibles.",
      price: 3600,
      images: ["img/cosmetica/cremaDeManzanilla.jpg"],
      category: "Cosmética",
    },
    {
      id: "cos-005",
      name: "Crema de Día",
      description:
        "Crema hidratante de uso diario con ingredientes naturales. Textura ligera y absorbente.",
      price: 4200,
      images: [
        "img/cosmetica/cremaParaDiaMK.jpg",
        "img/cosmetica/cosmeticaGral.jpg",
      ],
      category: "Cosmética",
    },
  ],
};
