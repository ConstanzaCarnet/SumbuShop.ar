# SumbuShop.ar

**Autora:** Carnet Constanza Desireé

## Descripción

SumbuShop.ar es una tienda online de productos variados: mermeladas, conservas, artesanías en papel maché y cosmética natural. Podemos destacar que aunque se orienta a la promoción de productos artesanales, como mermeladas y manualidades, también consta de productos especializados como cremas, serums y fragancias.
En resumen una página ecommerce para la promoción de productos variados.(tienda familiar)

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (vanilla)
- Bootstrap 5

## Login y compra

La tienda se puede recorrer sin iniciar sesión; el login se pide recién al intentar comprar (botón "Agregar" o carrito). La sesión se guarda en `localStorage`, y la página de origen en `sessionStorage` para volver a ella después del login. El navbar muestra "Iniciar sesión" o "Cerrar sesión" según el estado.

## Cómo verlo

Es un sitio estático (sin build ni dependencias que instalar):

- **Local:** clonar el repositorio y abrirlo con una extensión como **Live Server** (VS Code). Abriendo `index.html` con doble click también funciona, salvo el carrusel de opiniones: se carga con `fetch` y el navegador no permite `fetch` en archivos locales (`file://`), así que en ese caso la sección queda oculta.
- **Vercel:** importar el repositorio como proyecto sin framework ("Other"); no necesita comando de build y el directorio de salida es la raíz.

Las rutas se calculan desde la ubicación de `js/components/navbar.js` (`getBasePath()`), así que funcionan igual en los dos casos y en cualquier carpeta. Ojo: Vercel distingue mayúsculas de minúsculas en los nombres de archivo, Windows no; al agregar imágenes, escribir la ruta en `data.js` exactamente igual que el nombre del archivo.

## Estructura del proyecto

```
sumbu-shop.ar/
├── index.html                  ← Página de inicio
├── README.md
├── img/                        ← Imágenes de productos, organizadas por categoría
├── data/
│   └── reviews.json            ← Opiniones de clientes (simulan reseñas de Google)
├── styles/
│   ├── styles.css              ← Estilos globales
│   └── forms.css               ← Estilos para formularios
├── js/
│   ├── data.js                 ← Datos (NAV_PAGES, PRODUCTS) y helpers: findProductById, formatPrice...
│   ├── auth.js                 ← Registro, login, logout, sesión y volver a la página de origen
│   ├── cart.js                 ← Lógica del carrito (localStorage)
│   ├── search.js               ← Buscador del navbar y armado de la página products.html
│   ├── forms.js                ← Submit de login/registro y redirección
│   ├── theme.js                ← Tema claro/oscuro (se carga en el <head>)
│   └── components/
│       ├── navbar.js           ← Navbar (links, link activo, login/logout) y getBasePath()
│       ├── footer.js           ← Componente footer
│       ├── productCard.js      ← Componente card de producto (cantidad + agregar al carrito)
│       ├── productModal.js     ← Modal de detalle de producto con carrusel
│       └── reviews.js          ← Carrusel de opiniones del index (fetch a data/reviews.json)
│
└── pages/
    ├── login.html              ← Inicio de sesión
    ├── register.html           ← Registro de usuario
    ├── about-us.html           ← Descripción del negocio
    ├── jams.html               ← Categoría: Mermeladas
    ├── preserved.html          ← Categoría: Conservas
    ├── bakery.html             ← Categoría: Pastelería
    ├── mache-paper.html        ← Categoría: Papel Maché
    ├── cosmetics.html          ← Categoría: Cosmética Natural
    ├── products.html           ← Catálogo: todos los productos o resultados del buscador (?q=...), con "Ver más"
    └── cart.html               ← Carrito de compras (requiere sesión)
```
