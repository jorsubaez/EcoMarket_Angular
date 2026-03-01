(async function () {
    const headerEl = document.getElementById("header-placeholder");
    const footerEl = document.getElementById("footer-placeholder");

    async function inject(el, path) {
        if (!el) return;
        try {
            const res = await fetch(path, { cache: "no-store" });
            if (!res.ok) throw new Error(`Error ${res.status} al cargar ${path}`);
            el.innerHTML = await res.text();
        } catch (e) {
            console.error("Error en inject:", e);
        }
    }

    try {
        await inject(headerEl, "templates/header.html");
        await inject(footerEl, "templates/footer.html");

        const session = JSON.parse(localStorage.getItem("ecomarket_session"));

        if (session) {
            const loginLink = document.querySelector(".login-link");
            if (loginLink) {
                loginLink.textContent = "Ver perfil";
                loginLink.href = "perfil.html";
            }

            if (session.role === "producer") {
                const navUl = document.querySelector(".main-nav ul");
                if (navUl && !document.querySelector('a[data-page="panel-productor"]')) {
                    const li = document.createElement("li");
                    li.innerHTML = `<a href="panel-productor.html" data-page="panel-productor">Panel Productor</a>`;
                    navUl.appendChild(li);
                }
            }
        }

        const currentPage = document.body.getAttribute("data-page");
        if (currentPage) {
            document.querySelectorAll(".main-nav a").forEach((a) => {
                if (a.getAttribute("data-page") === currentPage) {
                    a.classList.add("active");
                }
            });
        }

    } catch (e) {
        console.error("Error general en layout.js:", e);
    }
})();