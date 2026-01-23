/* =========================
   FOOTER YEAR
========================= */
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================
   MOBILE MENU
========================= */
const menuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

/* =========================
   SMOOTH SCROLLING
========================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: "smooth"
            });

            navLinks.classList.remove("active");
        }
    });
});

/* =========================
   RECOMMENDATION TABS
========================= */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

/* =========================
   TOGGLE DETAILS (MERGED)
========================= */
function toggleDetails(button, openText, closeText) {
    const details = button.nextElementSibling;

    if (details.classList.contains("collapsed")) {
        details.classList.remove("collapsed");
        details.style.maxHeight = details.scrollHeight + "px";
        button.textContent = closeText;
    } else {
        details.style.maxHeight = "0";
        details.classList.add("collapsed");
        button.textContent = openText;
    }
}

/* =========================
   OWL CAROUSEL
========================= */
$(document).ready(function () {
    $(".recommendations-carousel").owlCarousel({
        loop: true,
        margin: 30,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        smartSpeed: 1000,
        dots: true,
        nav: false,
        responsive: {
            0: { items: 1 },
            768: { items: 1 },
            1000: { items: 2 }
        }
    });
});

/* =========================
   BACK TO TOP BUTTON
========================= */
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
