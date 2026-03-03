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

        // --- NUEVA LÓGICA DEL MENÚ MÓVIL ---
        // Se ejecuta solo después de que el header se haya inyectado correctamente
        const menuBtn = document.getElementById('menu-toggle-btn');
        const mainNav = document.getElementById('main-nav');

        if (menuBtn && mainNav) {
            menuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('active');
            });
        }
        // -----------------------------------

        // Lógica que ya tenías para marcar la página actual
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