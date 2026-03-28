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
* **Storyboard:** Guion gráfico de la experiencia de usuario. Ruta: `docs/storyboard.png`
  * [Acceso directo al PNG](docs/storyboard.png)
* **Archivo JSON:** Archivo con los usuarios guardados. Ruta: `db.json`
  * [Acceso directo al JSON](db.json)

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

> [!NOTE]
> 
> En este sprint hemos migrado a un sistema de usuarios usando `json-server`. Para que el inicio de sesión y las validaciones funcionen correctamente, es necesario levantar el servidor de la base de datos simulada. Para ello, asegúrese de tener instalado [Node.js](https://nodejs.org/es/download) y ejecute el siguiente comando en la terminal del proyecto:
> ```bash
> npm run backend
> ```
> 
> Una vez el servidor esté corriendo, puede acceder con los siguientes usuarios para probar los distintos roles y vistas. La contraseña para todos ellos es `123456`:
> 
> * **Administrador:** `carlos@ecomarket.com`
> * **Productor:** `ana@ecomarket.com`
> * **Cliente:** `julio@ecomarket.com`

---

## Observaciones
Aspectos a tener en consideración para la evaluación del proyecto:

* **JSON Package:** Se ha incluido un arhivo `package.json` para poder levantar la base de datos más fácilmente sin tener que ejecutar el comando completo de `json-server`. 
    * [Acceso directo al archivo](package.json)
