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

        const sessionJson = localStorage.getItem("ecomarket_session");

        if (sessionJson) {
            const session = JSON.parse(sessionJson);
            const loginLink = document.getElementById("login-link");
            const mainNavUl = document.querySelector("#main-nav ul");

            if (loginLink) {
                loginLink.textContent = "Cerrar sesión";
                loginLink.href = "#";
                loginLink.style.color = "#256628";

                loginLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem("ecomarket_session");
                    window.location.href = "index.html";
                });
            }

            if (session.rol === 'productor' && mainNavUl) {
                const liProductor = document.createElement("li");
                const enlaceProductor = document.createElement("a");

                enlaceProductor.href = "panel-productor.html";
                enlaceProductor.setAttribute("data-page", "panel-productor");
                enlaceProductor.textContent = "Panel Productor";

                // Le aplicamos la clase 'active' si ya estamos en esa página
                if (document.body.getAttribute("data-page") === "panel-productor") {
                    enlaceProductor.classList.add("active");
                }

                liProductor.appendChild(enlaceProductor);
                mainNavUl.appendChild(liProductor);
            }
        }

        const menuBtn = document.getElementById('menu-toggle-btn');
        const mainNav = document.getElementById('main-nav');

        if (menuBtn && mainNav) {
            menuBtn.addEventListener('click', () => {
                // Esto añade o quita la clase 'active' cada vez que pulsas el botón
                mainNav.classList.toggle('active');
            });
        }

        const currentPage = document.body.getAttribute("data-page");
        if (currentPage && mainNav) {
            const activeLink = mainNav.querySelector(`a[data-page="${currentPage}"]`);
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }

    } catch (e) {
        console.error("Error cargando layout:", e);
    }
})();