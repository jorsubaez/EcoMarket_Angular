# EcoMarket

## Integrantes del Grupo
* Alejandro David Fariña Afonso
* Jorge Suárez Báez
* Nauzet Martel Rodríguez
* Paola Viera Suárez

---

## Descripción del Proyecto
[cite_start]**EcoMarket** es una plataforma web que actúa como nexo entre proveedores agrícolas y clientes[cite: 27]. [cite_start]El sistema está diseñado como un producto independiente para simplificar la gestión digital de pequeños inventarios agrícolas[cite: 42]. [cite_start]Permite la visualización de catálogos, la gestión de carritos y ofrece un panel de administración para que los productores gestionen sus productos de "Kilómetro 0"[cite: 28, 30].

---

## Requerimientos Funcionales
Según la especificación de requisitos, el sistema implementa las siguientes funciones principales:

* [cite_start]**Catálogo dinámico:** El sistema muestra productos cargados desde un JSON con imagen, precio, descripción y origen[cite: 68].
* [cite_start]**Persistencia del carrito:** Los productos se mantienen guardados mediante `localStorage` incluso tras cerrar el navegador[cite: 70].
* [cite_start]**Gestión de inventario (CRUD):** El productor puede añadir, editar o eliminar productos a través de un formulario sencillo[cite: 72].
* [cite_start]**Búsqueda y filtrado:** Los consumidores pueden buscar productos y filtrarlos por categorías[cite: 44].
* [cite_start]**Simulación de compra:** El sistema permite la gestión de carritos y simulación del proceso de compra para el consumidor[cite: 44].
* [cite_start]**Carga de imágenes:** Los productores cuentan con la capacidad de cargar imágenes reales de sus productos[cite: 45].

---

## Diseño (Mockups y Storyboard)
* **Nombre del archivo:** `[[INSERTAR_NOMBRE_DEL_PDF_DE_MOCKUPS]]`
* **Ubicación:** `[[INSERTAR_RUTA_DEL_ARCHIVO_POR_EJEMPLO_/docs/design/]]`

---

## Páginas HTML del Proyecto
A continuación se detallan las páginas que componen la aplicación, su relación con los mockups y la indicación de la página de inicio.

| Archivo HTML | Mockup que implementa | Página de Inicio |
| :--- | :--- | :--- |
| `[[nombre_inicio]].html` | `[[nombre_mockup_inicio]]` | **SÍ** |
| `[[archivo_2]].html` | `[[nombre_mockup_2]]` | NO |
| `[[archivo_3]].html` | `[[nombre_mockup_3]]` | NO |

---

## Plantillas (Templates) Identificadas
Listado de componentes reutilizables y el archivo encargado de su carga:

* **Template:** `[[NOMBRE_DEL_TEMPLATE_1]]`
    * **Cargado en:** `[[ARCHIVO_DONDE_SE_CARGA_1]]`
* **Template:** `[[NOMBRE_DEL_TEMPLATE_2]]`
    * **Cargado en:** `[[ARCHIVO_DONDE_SE_CARGA_2]]`

---

## Restricciones Tecnológicas
* [cite_start]**Persistencia de datos:** Uso de archivos **JSON** para los datos del servidor[cite: 58].
* [cite_start]**Almacenamiento en cliente:** Uso de **localStorage** para la persistencia del carrito[cite: 59].

---

## Observaciones
Añadir aspectos a tener en consideración.
