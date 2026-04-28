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
        await inject(headerEl, "templates/header.html"); // Ojo a la ruta, si header.html está en la raíz quita "templates/"
        await inject(footerEl, "templates/footer.html");

        const sessionJson = localStorage.getItem("ecomarket_session");
        const loginLink = document.getElementById("login-link");
        const mainNavUl = document.querySelector("#main-nav ul");

        if (sessionJson) {
            const session = JSON.parse(sessionJson);

            // USUARIO LOGUEADO
            // 1. Cambiamos el texto de la cabecera por el icono y le ponemos la clase 'is-logged-in'
            if (loginLink) {
                loginLink.innerHTML = `
                    <span class="account-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </span>
                `;
                loginLink.href = "perfil.html";
                loginLink.classList.add("is-logged-in");
            }

            // 2. Si es productor, añadimos su panel al menú
            if (session.rol === 'productor' && mainNavUl) {
                const liProductor = document.createElement("li");
                const enlaceProductor = document.createElement("a");

                enlaceProductor.href = "panel-productor.html";
                enlaceProductor.setAttribute("data-page", "panel-productor");
                enlaceProductor.textContent = "Panel Productor";

                if (document.body.getAttribute("data-page") === "panel-productor") {
                    enlaceProductor.classList.add("active");
                }

                liProductor.appendChild(enlaceProductor);
                mainNavUl.appendChild(liProductor);
            }

        } else {
            // USUARIO NO LOGUEADO
            // Creamos la opción "Iniciar sesión" para inyectarla al final del menú desplegable
            if (mainNavUl) {
                const liLoginMobile = document.createElement("li");
                liLoginMobile.className = "mobile-only-menu"; // Esta clase la oculta en PC

                const btnLoginMobile = document.createElement("a");
                btnLoginMobile.href = "login.html";
                btnLoginMobile.textContent = "Iniciar sesión";

                liLoginMobile.appendChild(btnLoginMobile);
                mainNavUl.appendChild(liLoginMobile);
            }
        }

        // Lógica del menú móvil
        const menuBtn = document.getElementById('menu-toggle-btn');
        const mainNav = document.getElementById('main-nav');

        if (menuBtn && mainNav) {
            menuBtn.addEventListener('click', () => {
                // Esto añade o quita la clase 'active' cada vez que pulsas el botón
                mainNav.classList.toggle('active');
            });
        }

        // Marcar la página activa en el menú
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