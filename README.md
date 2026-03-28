# Eco Market

<p align="center">
   <img src="Imagenes/logo.JPG" alt="Logo EcoMarket" width="500">
</p>

## Integrantes del Grupo
* Alejandro David Fariña Afonso
* Jorge Suárez Báez
* Nauzet Martel Rodríguez
* Paola Viera Suárez

---

## Diseño de la Web
Recursos visuales y prototipado del proyecto:

* **Mockups:** Prototipos de alta fidelidad de la interfaz. Ruta: `docs/mockups.pdf`
  * [Acceso directo al PDF](docs/mockups.pdf)
* **Archivo JSON:** Archivo con los usuarios guardados. Ruta: `db.json`
  * [Acceso directo al JSON](db.json)

---

## Páginas HTML del Proyecto
A continuación se detallan las páginas que componen la aplicación junto a los aspectos responsive implementados; además de carga JSON y validaciones HTML, si es que realizan.

##

* **INICIO:** `index.html` (Página de inicio)
   * **Aspectos Responsive:**
      * **Layout Híbrido:** Uso de **Flexbox** para la sección *Hero* y **CSS Grid** para la sección de *Valores*, permitiendo una distribución fluida de los elementos.
      * **Tipografía Adaptativa:** Implementación de la función CSS `clamp()` en el título principal, permitiendo que el tamaño de fuente escale suavemente entre dispositivos móviles y escritorio.
      * **Reordenación de Contenido:** En pantallas menores a **768px**, se aplica `flex-direction: column` y se utiliza la propiedad `order: -1` en la imagen del Hero para priorizar el impacto visual sobre el texto en móviles.
      * **Rejilla Automática:** La sección de valores emplea `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))`, lo que permite que las tarjetas se reorganicen solas según el espacio disponible sin depender únicamente de *media queries*.

##

* **CATÁLOGO:** `catalogo.html`
   * **Aspectos Responsive:**
      * **Grid Dinámico:** Implementación de un sistema de rejilla mediante **CSS Grid** que adapta el número de columnas según el dispositivo:
         * **Escritorio:** 4 columnas para maximizar la visualización de productos.
         * **Tablet (< 992px):** Cambio a 2 columnas para mantener la legibilidad.
         * **Móvil (< 768px):** Transición a 1 columna con un `max-width` de 400px centrado, optimizando la experiencia de scroll vertical.
         * **Imágenes Flexibles:** Uso de `object-fit: cover` en las imágenes de los productos para asegurar que mantengan su proporción sin deformarse, independientemente del tamaño de la tarjeta.
         * **Interactividad Adaptada:** Los efectos de *hover* (elevación de tarjeta y zoom en imagen) están diseñados para no interferir con la navegación táctil en dispositivos móviles.

   * 📝 **Validaciones de Formulario HTML:**
      * **Controles de cantidad:** Se utilizan inputs de tipo numérico (`type="number"`) con la validación de valor mínimo (`min="1"`) para evitar pedidos de cantidades negativas o nulas.

##

* **PRODUCTORES:** `productores.html`
   * **Aspectos Responsive:**
      * **Grid de Beneficios:** Se utiliza una cuadrícula (`display: grid`) en el contenedor principal de tarjetas que se adapta proporcionalmente:
      * **Escritorio:** 4 columnas alineadas horizontalmente.
      * **Tablet (< 900px):** Reorganización a 2 columnas para mantener la legibilidad del texto.
      * **Móvil (< 600px):** Transición a 1 sola columna de ancho completo.
      * **Legibilidad Optimizada:** El texto de los párrafos utiliza `max-width: 80ch` en pantallas grandes para evitar líneas demasiado largas que cansen la vista, ajustándose al 100% en pantallas pequeñas.
      * **Botones de Acción Adaptables:** Los botones de "Contactar" y "Ver catálogo" pasan de una disposición horizontal (`flex-row`) a vertical (`flex-column`) en móviles, ocupando todo el ancho disponible para facilitar la interacción táctil.
      * **Diseño de Tarjetas:** Las tarjetas incluyen un borde superior decorativo y sombras suaves que se mantienen estables en todas las resoluciones, asegurando una jerarquía visual clara.

##

* **CONTACTO:** `contacto.html`
   * **Aspectos Responsive:**
      * **Distribución en Dos Columnas:** En pantallas de escritorio, se utiliza **CSS Grid** (`2fr 1fr`) para separar el formulario de la información de contacto lateral.
      * **Adaptación de Layout (Breakpoints):**
         * **< 900px:** El diseño cambia a una sola columna, posicionando la tarjeta de información de contacto debajo del formulario.
         * **< 600px:** La cuadrícula interna del formulario (`form-grid`) pasa de 2 columnas (Nombre/Email) a 1 sola columna, facilitando la escritura en dispositivos móviles.
      * **Inputs Flexibles:** Todos los campos de entrada y el área de texto tienen un ancho del 100%, adaptándose automáticamente al contenedor padre.
      * **Accesibilidad Táctil:** Los botones y campos de selección tienen rellenos (*padding*) generosos para facilitar su uso en pantallas táctiles.

   * 📝 **Validaciones de Formulario HTML:**
      * **Validación Semántica:** Se utiliza `type="email"` para el campo de correo electrónico, lo que activa la validación nativa del navegador para asegurar un formato de dirección válido.
      * **Controles de Interfaz:** El elemento `<select>` restringe las opciones de "Motivo" a una lista predefinida, evitando entradas de texto libre no deseadas.
      * **Área de Texto:** El `textarea` incluye un atributo `min-height` y `resize: vertical` para mantener la integridad del diseño mientras el usuario escribe.

##

* **INICIO SESIÓN:** `login.html`
   * **Aspectos Responsive:**
      * **Centrado Absoluto:** Uso de `display: grid` y `place-items: center` en el contenedor principal para que la tarjeta de acceso esté siempre perfectamente centrada en pantalla, independientemente de la resolución.
      * **Sistema de Rejilla Adaptativa (`grid-2`):** * En **Registro**, los campos de "Nombre/Apellidos" y "Contraseñas" aparecen en dos columnas en escritorio.
         * Al bajar de **600px**, la rejilla colapsa a una sola columna para facilitar el llenado del formulario en móviles.
      * **Optimización de Interfaz en Móvil:** * El enlace de "¿Has olvidado tu contraseña?" y el checkbox de "Recordarme" cambian de una disposición horizontal a una vertical en dispositivos pequeños para evitar el desbordamiento.
         * Ajuste de tamaños de fuente (`font-size`) y rellenos (`padding`) en pantallas inferiores a **420px** para maximizar el área de escritura.
      * **Interactividad Visual:** Se incluye un botón con icono (`eye/eye-slash`) para conmutar la visibilidad de la contraseña, optimizando la UX en móviles donde es más común cometer errores de escritura.

   * 🗃️ **Carga de Contenido JSON:**
      * **Realiza carga dinámica:** Utiliza la API `fetch` para conectar con un servidor local (`json-server`) en el endpoint `/usuarios`. Valida las credenciales comparando el email y la contraseña con los datos almacenados en el JSON.

   * 📝 **Validaciones de Formulario HTML:**
      * `type="email"`: Valida el formato de correo electrónico.
      * `required`: Obliga a rellenar ambos campos para enviar el formulario.
      * `minlength="6"`: Restricción de longitud mínima para la contraseña.

> [!NOTE]
> 
> En este sprint hemos migrado a un sistema de usuarios usando `json-server`. Para que el inicio de sesión y las validaciones funcionen correctamente, es necesario levantar el servidor de la base de datos simulada. Para ello, asegúrese de tener instalado [Node.js](https://nodejs.org/es/download) y ejecute el siguiente comando en la terminal del **WebStorm**:
> ```bash
> npm run backend
> ```
> 
> Una vez el servidor esté corriendo, puede acceder con los siguientes usuarios para probar los distintos roles y vistas. La contraseña para todos ellos es `123456`:
> 
> * **Administrador:** `carlos@ecomarket.com`
> * **Productor:** `ana@ecomarket.com`
> * **Cliente:** `julio@ecomarket.com`

##

* **REGISTRO:** `registro.html`
   * **Aspectos Responsive:**
      * **Centrado Absoluto:** Uso de `display: grid` y `place-items: center` en el contenedor principal para que la tarjeta de acceso esté siempre perfectamente centrada en pantalla, independientemente de la resolución.
      * **Sistema de Rejilla Adaptativa (`grid-2`):** * En **Registro**, los campos de "Nombre/Apellidos" y "Contraseñas" aparecen en dos columnas en escritorio.
         * Al bajar de **600px**, la rejilla colapsa a una sola columna para facilitar el llenado del formulario en móviles.
      * **Optimización de Interfaz en Móvil:** * El enlace de "¿Has olvidado tu contraseña?" y el checkbox de "Recordarme" cambian de una disposición horizontal a una vertical en dispositivos pequeños para evitar el desbordamiento.
         * Ajuste de tamaños de fuente (`font-size`) y rellenos (`padding`) en pantallas inferiores a **420px** para maximizar el área de escritura.
      * **Interactividad Visual:** Se incluye un botón con icono (`eye/eye-slash`) para conmutar la visibilidad de la contraseña, optimizando la UX en móviles donde es más común cometer errores de escritura.

   * 📝 **Validaciones de Formulario HTML:**
      * `type="text"` y `required`: Aplicado en Nombre y Apellidos.
      * `type="email"` y `required`: Validación de formato de correo.
      * `type="password"` y `minlength="6"`: Seguridad mínima para la contraseña.
      * `required` (Checkbox): Validación obligatoria para la aceptación de Términos y Política de Privacidad.

##

* **PANEL PRODUCTOR:** `panel-productor.html`
   * **Aspectos Responsive:**
      * **Transformación de Tabla a Tarjetas (Mobile First Design):** Es el aspecto más avanzado de la interfaz. En pantallas menores a **900px**, la tabla HTML tradicional se desestructura completamente:
         * Se oculta el encabezado (`thead`).
         * Las filas (`tr`) y celdas (`td`) pasan a `display: block`, convirtiéndose cada fila en una **tarjeta independiente**.
         * Las acciones (editar/eliminar) cambian de una disposición alineada a botones de ancho completo para mejorar la usabilidad táctil.
      * **Formulario Adaptativo:** El formulario de alta utiliza **CSS Grid** con dos columnas en escritorio que colapsan a una sola en móviles, asegurando que los campos sean fáciles de completar.
      * **Gestión de Imágenes:** En la versión móvil, las miniaturas de los productos crecen hasta ocupar todo el ancho de la tarjeta (`height: 200px`), permitiendo una mejor previsualización del producto.
      * **Barra de Búsqueda:** El buscador se expande al 100% del ancho en dispositivos pequeños para facilitar el filtrado de productos.

   * 🗃️ **Carga de Contenido JSON:**
      * **Realiza carga dinámica:** El sistema consume y gestiona datos en formato **JSON** almacenados en el `localStorage`. 
      * Implementa una lógica de persistencia que permite leer (`JSON.parse`), escribir (`JSON.stringify`), filtrar y eliminar productos en tiempo real sin recargar la página.

   * 📝 **Validaciones de Formulario HTML:**
      * `required`: Aplicado en nombre, origen, precio y unidad para asegurar la integridad de los datos.
      * `type="number"` con `min="0"`: Impide introducir precios negativos.
      * `step="0.01"`: Permite la introducción de decimales para los precios (céntimos).
      * `accept="image/*"`: Restringe la subida de archivos en el input de imagen únicamente a formatos de imagen válidos.

##

* **VER PERFIL:** `perfil.html`
   * **Aspectos Responsive:**
      * **Sidebar Evolutivo (Vertical a Slider):** Es la característica más destacada de esta vista. 
         * **Escritorio:** Se muestra como una barra lateral fija a la izquierda.
         * **Móvil/Tablet (< 900px):** El menú rota 90 grados para convertirse en una **barra de navegación horizontal con scroll**. Se activan dinámicamente flechas laterales (`slider-arrow`) controladas por JavaScript para facilitar el desplazamiento táctil.
      * **Sistema de Tarjetas de Información:** Las fichas de datos (Email, Teléfono, Dirección) utilizan **CSS Grid** para adaptarse al ancho de pantalla:
         * **3 columnas** en monitores grandes.
         * **2 columnas** en tablets.
         * **1 columna** (apilamiento vertical) en móviles.
      * **Imagen de Perfil Adaptativa:** El avatar reduce su tamaño proporcionalmente en móviles para dejar más espacio al contenido textual, manteniendo siempre su centrado y proporciones mediante `object-fit`.

   * 🗃️ **Carga de Contenido JSON:**
      * **Realiza carga dinámica:** Al igual que en el panel de productor, esta página consume datos en formato **JSON** desde el `localStorage`.
      * El script detecta la sesión activa, parsea el objeto JSON y **mapea automáticamente** el nombre y el correo electrónico del usuario en los campos correspondientes del DOM al cargar la página.

---

## Observaciones
Aspectos a tener en consideración para la evaluación del proyecto:

* **JSON Package:** Se ha incluido un arhivo `package.json` para poder levantar la base de datos más fácilmente sin tener que ejecutar el comando completo de `json-server`. 
    * [Acceso directo al archivo](package.json)
