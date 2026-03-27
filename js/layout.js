(async function () {
    const headerEl = document.getElementById("header-placeholder");
    const footerEl = document.getElementById("footer-placeholder");

    async function inject(el, path) {
        if (!el) return;
        const res = await fetch(path, { cache: "no-store" });
        if (!res.ok) throw new Error(`No se pudo cargar ${path} (${res.status})`);
        el.innerHTML = await res.text();
    }

    function getSession() {
        try {
            return JSON.parse(localStorage.getItem("ecomarket_session"));
        } catch {
            return null;
        }
    }

    try {
        await inject(headerEl, "templates/header.html");
        await inject(footerEl, "templates/footer.html");

        const session = getSession();
        const loginLink = document.getElementById("login-link");
        const mainNav = document.getElementById("main-nav");
        const mainNavUl = document.querySelector("#main-nav ul");
        const currentPage = document.body.getAttribute("data-page");

        if (session) {
            if (loginLink) {
                loginLink.textContent = "Cerrar sesión";
                loginLink.href = "#";
                loginLink.style.color = "#d9534f";

                loginLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem("ecomarket_session");
                    window.location.href = "index.html";
                });
            }

            if (session.rol === "productor" && mainNavUl) {
                const yaExiste = mainNavUl.querySelector('a[data-page="panel-productor"]');

                if (!yaExiste) {
                    const liProductor = document.createElement("li");
                    const enlaceProductor = document.createElement("a");

                    enlaceProductor.href = "panel-productor.html";
                    enlaceProductor.setAttribute("data-page", "panel-productor");
                    enlaceProductor.textContent = "Panel Productor";

                    if (currentPage === "panel-productor") {
                        enlaceProductor.classList.add("active");
                    }

                    liProductor.appendChild(enlaceProductor);
                    mainNavUl.appendChild(liProductor);
                }
            }
        }

        if (mainNav && currentPage) {
            const activeLink = mainNav.querySelector(`a[data-page="${currentPage}"]`);
            if (activeLink) {
                activeLink.classList.add("active");
            }
        }

        const menuBtn = document.getElementById("menu-toggle-btn");

        if (menuBtn && mainNav) {
            menuBtn.addEventListener("click", () => {
                mainNav.classList.toggle("active");
            });
        }

    } catch (e) {
        console.error("Error cargando layout:", e);
    }
})();