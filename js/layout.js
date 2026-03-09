// js/layout.js
(async function () {
    const headerEl = document.getElementById("header-placeholder");
    const footerEl = document.getElementById("footer-placeholder");

    async function inject(el, path) {
        if (!el) return;
        const res = await fetch(path, { cache: "no-store" });
        if (!res.ok) throw new Error(`No se pudo cargar ${path} (${res.status})`);
        el.innerHTML = await res.text();
    }

    try {
        await inject(headerEl, "templates/header.html");
        await inject(footerEl, "templates/footer.html");

        const menuBtn = document.getElementById('menu-toggle-btn');
        const mainNav = document.getElementById('main-nav');

        if (menuBtn && mainNav) {
            // Función para cerrar el menú
            const closeMenu = () => {
                mainNav.classList.remove('active');
            };

            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que el click se propague al document
                mainNav.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                const isClickInsideMenu = mainNav.contains(e.target);
                const isClickOnButton = menuBtn.contains(e.target);

                if (!isClickInsideMenu && !isClickOnButton && mainNav.classList.contains('active')) {
                    closeMenu();
                }
            });

            mainNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    closeMenu();
                });
            });
        }

        const current = document.body.getAttribute("data-page");
        if (current) {
            document.querySelectorAll(".main-nav a[data-page]").forEach((a) => {
                a.classList.toggle("active", a.dataset.page === current);
            });
        }
    } catch (e) {
        console.error("Error cargando layout:", e);
    }
})();