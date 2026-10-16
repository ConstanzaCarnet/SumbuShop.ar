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

## Estructura del proyecto

```
sumbu-shop.ar/
├── index.html                  ← Página de inicio
├── README.md
├── img/                        ← Imágenes de productos, organizadas por categoría
├── styles/
│   ├── styles.css              ← Estilos globales
│   └── forms.css               ← Estilos para formularios
├── js/
│   ├── data.js                 ← Datos: páginas del navbar (NAV_PAGES) y productos (PRODUCTS)
│   ├── auth.js                 ← Registro, login, logout y sesión (localStorage)
│   ├── cart.js                 ← Lógica del carrito (localStorage)
│   ├── forms.js                ← Submit de login/registro y redirección
│   ├── theme.js                ← Tema claro/oscuro
│   └── components/
│       ├── navbar.js           ← Componente navbar (links, link activo, login/logout)
│       ├── footer.js           ← Componente footer
│       ├── productCard.js      ← Componente card de producto (cantidad + agregar al carrito)
│       └── productModal.js     ← Modal de detalle de producto con carrusel
└── pages/
    ├── login.html              ← Inicio de sesión
    ├── register.html           ← Registro de usuario
    ├── about-us.html           ← Descripción del negocio
    ├── jams.html               ← Categoría: Mermeladas
    ├── preserved.html          ← Categoría: Conservas
    ├── bakery.html             ← Categoría: Pastelería
    ├── mache-paper.html        ← Categoría: Papel Maché
    ├── cosmetics.html          ← Categoría: Cosmética Natural
    └── cart.html               ← Carrito de compras (requiere sesión)
```
