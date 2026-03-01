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

## Descripción del Proyecto
**EcoMarket** es una plataforma web que actúa como nexo entre proveedores agrícolas y clientes. El sistema está diseñado como un producto independiente para simplificar la gestión digital de pequeños inventarios agrícolas. Permite la visualización de catálogos, la gestión de carritos y ofrece un panel de administración para que los productores gestionen sus productos de "Kilómetro 0".

---

## Requisitos Funcionales
El sistema se divide en dos grandes áreas para cubrir las necesidades tanto de los consumidores como de los proveedores locales.

### Área Pública (Cliente)
Enfocada en la experiencia de compra y descubrimiento de productos.

* **Catálogo Interactivo:** Visualización de productos frescos con imágenes reales, precios detallados y origen del producto.
* **Búsqueda y Filtrado:** Sistema de navegación por categorías (frutas, verduras, eco-box, etc.) para localizar productos rápidamente.
* **Gestión de Carrito:** Añadir y gestionar productos de forma intuitiva antes de finalizar la compra.
* **Fichas de Producto:** Consulta detallada de información técnica y descriptiva de cada artículo.
* **Autenticación:** Registro e inicio de sesión diferenciando claramente entre perfil de consumidor y productor.

### Área Privada (Productor)
Panel de control exclusivo para la gestión del inventario y presencia en la plataforma.

* **Panel de Control Personalizado:** Acceso a un dashboard privado donde el productor solo visualiza y gestiona su propio catálogo.
* **Gestión de Productos (CRUD):** Creación mediante un formulario sencillo para dar de alta productos (nombre, precio, descripción, imagen) y gestión técnica de los productos existentes sin necesidad de conocimientos de programación.
* **Control de Inventario:** Simulación digital de la gestión de stock para mantener la información actualizada.
* **Seguridad y Roles:** Separación total de permisos; el productor tiene herramientas administrativas que el consumidor no puede visualizar ni acceder.
* **Autonomía de Datos:** Control total sobre la información publicada, permitiendo actualizaciones en tiempo real.

---

## Diseño de la Web
Recursos visuales y prototipado del proyecto:

* **Mockups:** Prototipos de alta fidelidad de la interfaz. Ruta: `docs/mockups.pdf`
  * [Acceso directo al PDF](docs/mockups.pdf)
* **Storyboard:** Guion gráfico de la experiencia de usuario. Ruta: `docs/storyboard.png`
  * [Acceso directo al PNG](docs/storyboard.png)

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

---

## Observaciones
Aspectos a tener en consideración para la evaluación del proyecto:

* **Arquitectura de Layout:** Se ha implementado un layout compartido con JavaScript para centralizar el header y el footer. Además, se han añadido mejoras en la organización del código, facilitando la agregación de futuras modificaciones de manera escalable.

* **Documentación de Requisitos (IEEE 830):** En la carpeta `docs/`, se incluye un documento basado en la norma `IEEE 830` que detalla la visión prevista para el producto final. 
    * > **Nota sobre el alcance:** Este documento representa la **hoja de ruta y visión actual** del proyecto. No debe considerarse una descripción inamovible al 100% del resultado final, ya que el software está sujeto a cambios iterativos derivados de decisiones de diseño, necesidades técnicas o evolución del equipo de desarrollo durante los Sprints. 
    * [Acceso directo al documento](docs/ecomarket-ieee830.pdf)
