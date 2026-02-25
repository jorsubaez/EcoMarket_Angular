document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INYECCIÓN DE TEMPLATES GLOBALES (Header y Footer) ---
    const headerContainer = document.getElementById('template-header');
    if (headerContainer) {
        fetch('templates/header.html')
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
            })
            .catch(error => console.error('Error cargando el header:', error));
    }

    const footerContainer = document.getElementById('template-footer');
    if (footerContainer) {
        fetch('templates/footer.html')
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(error => console.error('Error cargando el footer:', error));
    }

    // --- 2. LÓGICA ESPECÍFICA DEL CATÁLOGO ---
    const gridContainer = document.getElementById('template-grid-productos');

    if (gridContainer) {
        const productosDummy = [
            {
                nombre: "Naranjas ecológicas",
                origen: "Tenerife",
                productor: "AgroTierra Norte",
                precio: "2,50 €/kg",
                unidad: "kg",
                imagen: "https://placehold.co/400x300/ff9800/white?text=Naranjas"
            },
            {
                nombre: "Plátanos ecológicos",
                origen: "La Palma",
                productor: "EcoPlatanera La Palma",
                precio: "2,80 €/kg",
                unidad: "kg",
                imagen: "https://placehold.co/400x300/fbc02d/black?text=Plátanos"
            },
            {
                nombre: "Tomates de rama",
                origen: "Gran Canaria",
                productor: "Finca La Vega",
                precio: "3,10 €/kg",
                unidad: "kg",
                imagen: "https://placehold.co/400x300/e53935/white?text=Tomates"
            },
            {
                nombre: "Lechuga ecológica",
                origen: "Fuerteventura",
                productor: "Finca La Vega",
                precio: "1,70 €/unidad",
                unidad: "unid.",
                imagen: "https://placehold.co/400x300/4caf50/white?text=Lechuga"
            }
        ];

        let tarjetasHTML = '';

        productosDummy.forEach(producto => {
            tarjetasHTML += `
                <article class="producto-card-mockup">
                    <div class="imagen-producto-dummy">
                        <img src="${producto.imagen}" alt="${producto.nombre}" style="width:100%; height:100%; object-fit: cover;">
                    </div>
                    <h4 style="margin: 5px 0 10px 0;">${producto.nombre}</h4>
                    <div style="text-align: left; font-size: 0.85rem; color: #555; line-height: 1.4;">
                        <p style="margin: 0;">Origen: ${producto.origen}</p>
                        <p style="margin: 0;">Productor: ${producto.productor}</p>
                    </div>
                    <p style="font-weight: bold; font-size: 1.1rem; margin: 15px 0 10px 0; text-align: left;">${producto.precio}</p>
                    
                    <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 15px; font-size: 0.9rem;">
                        <label>Cantidad</label>
                        <input type="number" value="1" min="1" style="width: 40px; padding: 2px; border: 1px solid #ccc; border-radius: 4px;">
                        <span>${producto.unidad}</span>
                    </div>

                    <button class="btn-verde-dummy">Añadir al carrito</button>
                </article>
            `;
        });

        gridContainer.innerHTML = tarjetasHTML;
    }
});