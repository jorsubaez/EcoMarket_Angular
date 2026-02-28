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
        // Tu estructura: /templates/header.html y /templates/footer.html
        await inject(headerEl, "templates/header.html");
        await inject(footerEl, "templates/footer.html");

        // Marca el link activo usando body[data-page]
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