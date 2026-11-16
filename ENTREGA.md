# SumbuShop.ar — Entrega Final del Trabajo Integrador

**Materia:** Aplicaciones Web 1
**Autora:** Carnet Constanza Desireé

## Links

|                      |                                                     |
| -------------------- | --------------------------------------------------- |
| 🌐 Sitio publicado   | https://sumbu-shop-ar.vercel.app/                   |
| 💻 Repositorio       | https://github.com/ConstanzaCarnet/SweetJar.ar      |
| 🎥 Video explicativo | _(completar con el link de YouTube / Drive / Loom)_ |

---

## 1. ¿Qué es SumbuShop.ar?

Es la tienda online de un emprendimiento familiar de Córdoba que vende productos artesanales: mermeladas, conservas, pastelería, artesanías de papel maché y cosmética natural.

Cualquier persona puede recorrer la tienda, ver los productos y usar el buscador sin crear una cuenta. La cuenta se pide recién al comprar, cuando se agrega un producto al carrito o se entra al carrito y/o cuando se oprime en el botón de "Iniciar Sesion" del navbar. Al iniciar sesión, la página vuelve al lugar donde estaba el usuario.

## 2. Cómo funciona (recorrido del sitio)

| Página / función                                                           | Qué hace                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Inicio** (`index.html`)                                                  | Presentación del negocio, accesos a las 5 categorías, sección "Sobre nosotros" y un carrusel con opiniones de clientes. El botón **"Explorar productos"** lleva al catálogo completo.                                                                                         |
| **Catálogo** (`pages/products.html`)                                       | Muestra todos los productos de todas las categorías intercalados, de a 9, con un botón **"Ver más"**. También muestra los resultados del buscador.                                                                                                                            |
| **Categorías** (`jams`, `preserved`, `bakery`, `mache-paper`, `cosmetics`) | Cards de los productos de cada categoría.                                                                                                                                                                                                                                     |
| **Card de producto**                                                       | Título, imagen, categoría, descripción, precio, botones **− / +** para elegir la cantidad y botón **"Agregar"**. Si el producto tiene varias fotos, muestra un indicador 📷.                                                                                                  |
| **Detalle del producto** (modal)                                           | Al hacer click en la imagen o en el nombre se abre una ventana con un carrusel de fotos, la descripción, la cantidad y "Agregar al carrito".                                                                                                                                  |
| **Buscador** (navbar)                                                      | Busca mientras se escribe, sin importar mayúsculas ni acentos ("pasteleria" encuentra "Pastelería"). Muestra hasta 10 resultados en una lista desplegable. Con **Enter** va a la página de todos los resultados. En pantallas chicas se ve solo como una lupa que se expande. |
| **Registro / Login**                                                       | Formularios con validación. Al registrarse, el usuario queda logueado automáticamente.                                                                                                                                                                                        |
| **Carrito** (`pages/cart.html`)                                            | Lista de productos con imagen, cantidad editable, subtotal por producto y total. Permite eliminar un producto, vaciar el carrito y confirmar la compra (simulada). Todas estas acciones piden confirmación con un modal.                                                      |
| **Modo claro / oscuro**                                                    | Botón de luna / sol en el navbar; el sitio recuerda la elección.                                                                                                                                                                                                              |
| **Badge del carrito**                                                      | El ícono del carrito muestra cuántos productos hay.                                                                                                                                                                                                                           |

### ¿Dónde se guarda cada dato?

| Dato                                     | Dónde                                                   | Por qué                                                                                                                                                                            |
| ---------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Productos                                | `js/data.js` (objeto `PRODUCTS`)                        | Fuente de datos del catálogo, separada por categoría.                                                                                                                              |
| Opiniones de clientes                    | `data/reviews.json`, cargado con **`fetch`**            | Demuestra cómo se consumen datos externos en formato JSON con `async/await`.                                                                                                       |
| Usuarios registrados                     | `localStorage` (`sumbu-users`)                          | Simula una base de datos de usuarios.                                                                                                                                              |
| Usuario logueado                         | **`sessionStorage`** y `localStorage` (`sumbu-session`) | `sessionStorage` guarda los datos de la sesión actual; `localStorage` la recuerda al volver a abrir el sitio. Al cerrar sesión se borra de los dos. Nunca se guarda la contraseña. |
| Página a la que volver después del login | `sessionStorage` (`sumbu-redirect`)                     | Solo hace falta durante la navegación actual.                                                                                                                                      |
| Carrito                                  | **`localStorage`** (`sumbu-cart`)                       | Los productos elegidos se mantienen aunque se recargue la página.                                                                                                                  |
| Tema claro / oscuro                      | `localStorage` (`sumbu-theme`)                          | Preferencia del usuario.                                                                                                                                                           |

---

## 3. Roadmap de desarrollo

El trabajo se organizó en etapas que acompañaron las entregas parciales. Las fechas salen del historial de commits del repositorio (40 commits entre agosto y noviembre de 2026).

### Etapa 0 / 1 — Boceto, estructura y primeros estilos (21 al 28 de agosto)
- Boceto inicial del e-commerce: rubro, nombre y categorías.
- Estructura HTML de todas las páginas: inicio, "Sobre nosotros", una página por categoría y los formularios de **registro y login**.
- Primeros estilos con CSS propio y estilos para los formularios.
- Organización de carpetas y corrección de rutas entre páginas.

### Etapa 2 — Diseño con Bootstrap y pulido visual (11 al 18 de septiembre)
- Incorporación de **Bootstrap 5**: hero, botones, navbar responsive.
- Pulido sección por sección: mermeladas, conservas, cosmética, papel maché, login, registro e index.
- Se agregó la categoría **Pastelería** y se mejoraron las cards.
- Mejoras en imágenes e íconos.
- **Tema claro / oscuro** y ajuste de la paleta de colores.

### Etapa 3 — Datos, carrito y componentes con JavaScript (6 al 16 de octubre)
- Correcciones de las observaciones de la entrega anterior y primera **unificación** de código.
- Fuente de datos de productos (`data.js`) y cards generadas desde esos datos.
- **Carrito** con `localStorage` y lógica de **registro / login** con JavaScript.
- Navbar y footer como **componentes** reutilizables generados con JavaScript.
- **Modal de detalle** de producto y estilos del carrito y los modales.
- Uso de `sessionStorage` y mejoras de estética en el botón de cerrar sesión.

### Etapa 4 — Buscador y mejoras del carrito (6 de noviembre)
- **Buscador** de productos en el navbar.
- Eliminar productos del carrito.
- Actualización del README.

### Etapa final — Refactorización, publicación y cierre (15 y 16 de noviembre)
- Mejoras del buscador: búsqueda sin acentos, lupa compacta en el celular y página de resultados.
- Página de **catálogo** (`products.html`) con todos los productos y botón **"Ver más"**.
- **Opiniones de clientes** en `data/reviews.json`, cargadas con **`fetch`** en un carrusel.
- **Refactorización:** se unificó código repetido en funciones reutilizables (`findProductById`, `formatPrice`, `getAllProducts`, `getCategoryPagePath`, `createProductCard`). También se calculan las rutas con `getBasePath()` para que funcionen igual en local y en Vercel.
- Después del login, el usuario **vuelve a la página donde estaba**.
- **Modales de confirmación** para eliminar, vaciar el carrito y confirmar la compra.
- Usuario logueado guardado en `sessionStorage` (y recordado en `localStorage`).
- Publicación en **Vercel** y documentación (README y este documento).

### Cambios de rumbo durante el proceso
- **Login:** al principio, después de iniciar sesión siempre se volvía al inicio. Se cambió para que vuelva a la página donde estaba el usuario. Así, si quiso agregar un producto desde una categoría, vuelve ahí y sigue comprando.
- **`fetch`:** los productos quedaron en `data.js` y el uso de `fetch` + JSON se muestra con las opiniones de clientes (acordado con el profesor). Para mostrar todos los productos se usa la página de catálogo, a la que se llega desde "Explorar productos".
- **Rutas:** las rutas fijas fallaban al pasar de Live Server a Vercel, así que se reemplazaron por rutas calculadas con `getBasePath()`. También se corrigieron nombres de imágenes, porque Vercel distingue mayúsculas de minúsculas.

---

## 4. Tecnologías utilizadas

### Base

- **HTML5:** estructura semántica (`main`, `section`, `article`, `nav`, `header`).
- **CSS3:** estilos propios, variables CSS para el modo oscuro y diseño responsive.
- **JavaScript (vanilla):** toda la lógica de la tienda, sin frameworks.

### Tecnologías adicionales y por qué se eligieron

| Tecnología                                          | Por qué se eligió                                                           | Qué aporta y cómo se integró                                                                                                                                                             |
| --------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bootstrap 5.3** (CDN)                             | Acelera la maquetación responsive y ofrece componentes probados.            | Grilla, navbar colapsable, **modales** (detalle de producto y confirmaciones) y **carruseles** (fotos del producto y opiniones). Se carga desde un CDN y se combina con estilos propios. |
| **Google Fonts**                                    | Darle identidad visual artesanal a la marca.                                | Playfair Display para títulos y Lato para textos.                                                                                                                                        |
| **`fetch` + JSON + `async/await`**                  | Aprender a consumir datos externos como lo haría una API real.              | `js/components/reviews.js` lee `data/reviews.json`, calcula el promedio de estrellas y arma el carrusel. Si la carga falla, muestra un aviso en vez de romper la página.                 |
| **Web Storage** (`localStorage` / `sessionStorage`) | Guardar datos en el navegador sin necesitar un servidor.                    | Usuarios, sesión, carrito, tema y página de retorno (ver la tabla de la sección 2).                                                                                                      |
| **Vercel**                                          | Publicación gratuita y automática desde GitHub.                             | Cada `push` a GitHub actualiza el sitio publicado. No necesita build: es un sitio estático.                                                                                              |
| **`Intl` / `toLocaleString("es-AR")`**              | Mostrar precios y fechas en formato argentino.                              | `formatPrice(1800)` → `$ 1.800`; fechas como "14 de octubre de 2024".                                                                                                                    |
| **`history.pushState` / `URLSearchParams`**         | Que el buscador se comporte bien en el celular y poder compartir búsquedas. | El botón "atrás" del celular cierra el buscador en lugar de salir de la página; `products.html?q=tarta` muestra los resultados de "tarta".                                               |
| **`matchMedia`**                                    | Adaptar el navbar y el carrusel de opiniones según el tamaño de pantalla.   | Mueve la lupa y el carrito en el celular y cambia cuántas opiniones se ven por slide (1, 2 o 3).                                                                                         |
| **Git + GitHub**                                    | Control de versiones y entrega.                                             | Historial de cambios por etapa.                                                                                                                                                          |

---

## 5. Mejora significativa

**La mejora principal es la experiencia de compra completa**: buscar un producto, ver su detalle, agregarlo y confirmar la compra. En las entregas anteriores ya existían las cards y un carrito básico, pero no había buscador, catálogo completo, confirmaciones ni retorno a la página de origen después del login. Incluye:

1. **Buscador inteligente:** busca mientras se escribe, no distingue acentos ni mayúsculas, busca en nombre, descripción y categoría, y tiene página de resultados.
2. **Catálogo con "Ver más":** muestra todos los productos de a tandas para que la página no sea eterna.
3. **Modal de detalle con carrusel:** permite ver todas las fotos de un producto sin salir de la página.
4. **Carrito completo:** cambiar cantidades, eliminar, vaciar y confirmar la compra, siempre con un modal de confirmación para evitar errores.
5. **Login que no interrumpe:** se pide solo al comprar y después vuelve a la misma página.

**Otras mejoras:**

- **UX/UI:** mensajes "¡Agregado al carrito!", badge con la cantidad, buscador tipo lupa en el celular.
- **Accesibilidad:** atributos `aria-label` en botones de íconos, textos alternativos en imágenes y navegación con teclado (Escape cierra el buscador, Enter busca).
- **Seguridad básica:** los textos que vienen del usuario o de la URL se muestran con `textContent` para que no se interpreten como HTML, y la contraseña no se guarda en la sesión.
- **Rendimiento:** imágenes con `loading="lazy"`, el tema se aplica antes de pintar la página (sin parpadeo) y el modal se elimina del DOM al cerrarse.
- **Organización del código:** componentes separados (`navbar`, `footer`, `productCard`, `productModal`, `reviews`), funciones reutilizables comentadas con JSDoc y un solo lugar para los datos.

---

## 6. Consignas de la etapa 4

| Consigna                                                             | Estado                                                               |
| -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Fuente de datos de productos                                         | ✅ `js/data.js`, organizada por categoría                            |
| Traer datos con `fetch`                                              | ✅ Opiniones desde `data/reviews.json` (acordado con el profesor)    |
| Cards con la información de cada producto por categoría              | ✅ Una página por categoría                                          |
| Cards con título, imagen, descripción, precio, + / − y botón agregar | ✅                                                                   |
| Mostrar productos en la tienda                                       | ✅ Catálogo completo en `products.html` (botón "Explorar productos") |
| Usuario logueado en `sessionStorage`                                 | ✅ (también se recuerda en `localStorage`)                           |
| Productos a comprar en `localStorage`                                | ✅                                                                   |
| Mostrar los productos en el carrito                                  | ✅                                                                   |
| Eliminar productos del carrito (opcional)                            | ✅ Eliminar uno, vaciar todo y bajar la cantidad a 0                 |

## 7. Cómo verlo en local

Clonar el repositorio y abrirlo con **Live Server** (VS Code). Abriendo `index.html` con doble click también funciona, salvo las opiniones: el navegador no permite `fetch` en archivos locales (`file://`), y en ese caso se muestra un aviso con el link al sitio publicado.
