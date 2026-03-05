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

        // ====== NUEVO: BIENVENIDA EN HEADER (según sesión) ======
        const loginLink = document.getElementById("login-link");
        const sessionRaw = localStorage.getItem("ecomarket_session");

        if (loginLink && sessionRaw) {
            const session = JSON.parse(sessionRaw);

            // Texto: "Bienvenido, [nombre]!"
            // (Tu login guarda "name"; si no existiera, usa email)
            const nombre = session.name || session.nombre || session.email || "usuario";
            loginLink.textContent = `Bienvenido, ${nombre}!`;

            // Link según rol (ajusta nombres de páginas si hace falta)
            if (session.role === "admin") loginLink.href = "admin.html";
            else if (session.role === "productor") loginLink.href = "panel-productor.html";
            else loginLink.href = "perfil.html";

            // Botón cerrar sesión (opcional pero recomendado)
            const logoutBtn = document.createElement("button");
            logoutBtn.type = "button";
            logoutBtn.textContent = "Cerrar sesión";
            logoutBtn.className = "logout-btn";

            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("ecomarket_session");
                window.location.href = "index.html";
            });

            loginLink.insertAdjacentElement("afterend", logoutBtn);
        }
        // =======================================================

        // --- NUEVA LÓGICA DEL MENÚ MÓVIL ---
        const menuBtn = document.getElementById('menu-toggle-btn');
        const mainNav = document.getElementById('main-nav');

        if (menuBtn && mainNav) {
            menuBtn.addEventListener('click', () => {
                mainNav.classList.toggle('active');
            });
        }
        // -----------------------------------

        // Marcar página actual
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