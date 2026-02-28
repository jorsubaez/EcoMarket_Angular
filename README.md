# Eco Market

<p align="center">
   <img src="css/logo.JPG" alt="Logo EcoMarket" width="500">
</p>

## Integrantes del Grupo
* Alejandro David Fariña Afonso
* Jorge Suárez Báez
* Nauzet Martel Rodríguez
* Paola Viera Suárez

---

## Descripción del Proyecto
**EcoMarket** es una plataforma web que actúa como nexo entre proveedores agrícolas y clientes. El sistema está diseñado como un producto independiente para simplificar la gestión digital de pequeños inventarios agrícolas. Permite la visualización de catálogos, la gestión de carritos y ofrece un panel de administración para que los productores gestionen sus productos de "Kilómetro 0".

---

## Requerimientos Funcionales
Según la especificación de requisitos, el sistema implementa las siguientes funciones principales:

* **Catálogo dinámico:** El sistema muestra productos cargados desde un JSON con imagen, precio, descripción y origen.
* **Persistencia del carrito:** Los productos se mantienen guardados mediante `localStorage` incluso tras cerrar el navegador.
* **Gestión de inventario (CRUD):** El productor puede añadir, editar o eliminar productos a través de un formulario sencillo.
* **Búsqueda y filtrado:** Los consumidores pueden buscar productos y filtrarlos por categorías.
* **Simulación de compra:** El sistema permite la gestión de carritos y simulación del proceso de compra para el consumidor.
* **Carga de imágenes:** Los productores cuentan con la capacidad de cargar imágenes reales de sus productos.

---

## Diseño de la Web
* **Mockups:** docs/mockups.pdf ➯ [Acceso rápido](docs/mockups.pdf)
* **Storyboard:** docs/storyboard.png ➯ [Acceso rápido](docs/storyboard.png)

---

## Páginas HTML del Proyecto
A continuación se detallan las páginas que componen la aplicación junto al mockup implementado.

| Archivo HTML | Mockup |
| :--- | :--- |
| `index.html` (Página de inicio) | `INICIO` |
| `catalogo.html` | `CATÁLOGO` |
| `productores.html` | `PRODUCTORES` |
| `contacto.html` | `CONTACTO` |
| `login.html` | `INICIO SESIÓN` |
| `registro.html` | `REGISTRO` |
| `panel-productor.html` | `PANEL PRODUCTOR` |
| `perfil.html` | `VER PERFIL` |

---

## Templates Identificados
Listado de componentes reutilizables y el archivo encargado de su carga:

* **Template:** `header.html`
    * **Cargado en:** `index.html`, `catalogo.html`, `productores.html`, `contacto.html`, `panel-productor.html` y `perfil.html`
* **Template:** `footer.html`
    * **Cargado en:** `index.html`, `catalogo.html`, `productores.html`, `contacto.html`, `panel-productor.html` y `perfil.html`
* **Template:** `formulario.html`
    * **Cargado en:** `login.html` y `registro.html`

---

## Observaciones
Añadir aspectos a tener en consideración.
