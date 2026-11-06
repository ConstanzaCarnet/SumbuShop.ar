Posibles mejoras

Usando APIs públicas (sin backend ni claves)

1. Checkout con dirección de envío usando la API Georef Argentina (apis.datos.gob.ar/georef). Un formulario de envío donde el usuario elige provincia y luego localidad, cargadas con fetch. Es una API oficial, gratuita y no pide clave. Combina con "Envíos a todo el país" y reemplaza el alert() actual por una pantalla de confirmación real.
2. Pasar el catálogo a products.json y cargarlo con fetch(). Así el sitio "consume" su propia API, con estado de carga (skeletons) y manejo de errores. Es un cambio chico y muestra async/await.
3. "Ideas para usarlo" con TheMealDB. En el modal de algunos productos (limón, manzana, pollo, chocolate) se muestran recetas buscadas por ingrediente. Es lo más original de la lista, pero la API está en inglés.
4. Precio de referencia en dólares con DolarApi.com. Un selector ARS/USD con la cotización del día. Es fácil, aunque para una tienda familiar es menos relevante.

Automatización / asistencia

5. "Finalizar pedido por WhatsApp". Arma automáticamente un mensaje con el detalle del carrito, el total y el nombre del usuario, y abre wa.me/<número>?text=.... Es como venden de verdad muchos emprendimientos argentinos, así que es muy realista.
6. Asistente de preguntas frecuentes. Un botón flotante con un mini chat basado en reglas (envíos, pagos, ingredientes, alergias) que responde y sugiere productos de PRODUCTS. Usar una IA real exigiría un backend para no dejar la clave expuesta, así que para este proyecto no conviene.
7. Barra de "envío gratis". En el carrito, algo como "Te faltan $X para envío gratis", junto con un campo de cupón de descuento (por ejemplo SUMBU10).

Usabilidad 7. Barra de "envío gratis". En el carrito, algo como "Te faltan $X para envío gratis", junto con un campo de cupón de descuento (por ejemplo SUMBU10).

Usabilidad

8. Buscador en el navbar que filtra en vivo entre todas las categorías y abre el modal del producto elegido. <-
9. Ordenar y filtrar en cada categoría: por precio (mayor/menor), por nombre o por rango de precio.
10. Favoritos. Un ❤️ en cada card, guardado en localStorage, con su propia página.
11. "Vistos recientemente" en el inicio, a partir de los productos que el usuario abrió en el modal.
12. Mini carrito lateral (offcanvas de Bootstrap) al tocar "Agregar", para ver el carrito sin salir de la página.
13. Historial de pedidos. Cada compra confirmada se guarda en una página "Mis pedidos". Hoy el carrito se vacía y no queda registro.
14. Compartir producto con la Web Share API: en el celular abre el menú nativo para mandar el producto por WhatsApp o Instagram.

Accesibilidad

15. Repaso de accesibilidad. Las imágenes de las cards tienen tabindex="0" pero no se abren c tiene aria-live, falta un enlace "saltar al contenido" y se puede revisar el contraste enmodo oscuro. Es poco trabajo y suele sumar puntos en una entrega.

Mi recomendación

Para una entrega orientada a frontend, la mejor combinación es 1 + 5: un checkout con la API Georef que termina en pedido por WhatsApp. Tiene consumo real de API, automatiza algo útil y cuenta bien la historia de una tienda familiar de Córdoba. Si querés algo más simple, 8 (buscador) + 15 (accesibilidad) es l
//////////////////////

Vercel tiene Serverless Functions — básicamente archivos .js que ponés en una carpeta /api y Vercel los expone como endpoints HTTP. Se ejecutan del lado del servidor, entonces la API key nunca llega al navegador.

El tier gratuito de Vercel da 100GB de bandwidth y 100k invocaciones de funciones por mes — para una asignación universitaria es más que suficiente.

Algunas ideas concretas:

1. Asistente de compra con IA ⭐
Un pequeño chat flotante en el sitio. El usuario escribe “quiero algo dulce para regalo” y la función serverless llama a la API de OpenAI (o Gemini, que tiene tier gratuito generoso) con el catálogo de productos como contexto, y devuelve una recomendación. La key queda en variables de entorno de Vercel. Es la más impactante visualmente.

2. Formulario de contacto real
El carrito tiene un “checkout simulado” — podría enviar un email real con Resend (tiene 3000 emails/mes gratis). La función serverless recibe los datos del pedido y manda el resumen al email del comprador. Demuestra integración con un servicio externo.

3. Contador de visitas o “más vendidos”
Vercel KV (Redis serverless, tier gratuito) guarda un contador por producto. Cada vez que alguien abre el modal de un producto, suma una visita. Los productos con más vistas aparecen como “tendencia” en el home. No necesita IA, es puro backend ligero.

4. Newsletter con confirmación
Input de email en el footer. La función serverless guarda el email en una hoja de cálculo de Google Sheets via API (gratis) y manda un email de bienvenida. Demuestra integración con dos servicios externos.

Para el contexto de la materia, el asistente de compra (1) es el que tiene más “wow factor” y demuestra conceptos modernos. Gemini Flash de Google tiene un tier gratuito bastante amplio (1500 requests/día) que para una demo universitaria alcanza de sobra.