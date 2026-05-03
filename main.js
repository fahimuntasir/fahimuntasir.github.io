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
   const card = button.closest(".experience-card");
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
   EDUCATION TOGGLE
========================= */
function toggleEducation(button) {
    const section = document.querySelector(".education-hidden");

    if (section.style.maxHeight === "0px" || section.style.maxHeight === "") {
        section.style.maxHeight = section.scrollHeight + "px";
        button.textContent = "Hide Earlier Education";
    } else {
        section.style.maxHeight = "0px";
        button.textContent = "Show Earlier Education";
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

/* =========================
   CERTIFICATE MODAL
========================= */
const modal = document.getElementById("certificateModal");
const modalImg = document.getElementById("certificateImage");
const modalClose = document.querySelector(".modal-close");

document.querySelectorAll(".award-card").forEach(card => {
    card.addEventListener("click", () => {
        const certSrc = card.getAttribute("data-cert");
        if (!certSrc) return;

        modalImg.src = certSrc;
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
    });
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.remove("show");
    modalImg.src = "";
    document.body.style.overflow = "";
}

/* =========================
   EXPERIENCE SLIDER
========================= */

const slider = document.getElementById("experienceSlider");
let cards = Array.from(document.querySelectorAll(".experience-card"));

const gap = 30;
let index = 1;
let isAnimating = false;

// clone first two and last two cards (because 2 cards are visible)
const firstClone1 = cards[0].cloneNode(true);
const firstClone2 = cards[1].cloneNode(true);
const lastClone1 = cards[cards.length - 1].cloneNode(true);
const lastClone2 = cards[cards.length - 2].cloneNode(true);

// add clones
slider.appendChild(firstClone1);
slider.appendChild(firstClone2);
slider.insertBefore(lastClone1, slider.firstChild);
slider.insertBefore(lastClone2, slider.firstChild);

cards = slider.querySelectorAll(".experience-card");

// start after the prepended clones
index = 2;

function getCardWidth(){
    return cards[0].offsetWidth + gap;
}

// initial position
slider.style.transform = `translateX(-${getCardWidth() * index}px)`;

// scroll direction
function scrollExperience(direction){

    if(isAnimating) return;
    isAnimating = true;

    index += direction;

    slider.style.transition = "transform 0.4s ease";
    slider.style.transform = `translateX(-${getCardWidth() * index}px)`;
}

slider.addEventListener("transitionend", ()=>{

    const width = getCardWidth();
    const realCount = cards.length - 4; // remove clones

    // right side reset
    if(index >= realCount + 2){
        slider.style.transition = "none";
        index = 2;
        slider.style.transform = `translateX(-${width * index}px)`;
    }

    // left side reset
    if(index < 2){
        slider.style.transition = "none";
        index = realCount + 1;
        slider.style.transform = `translateX(-${width * index}px)`;
    }

    isAnimating = false;
});

// keep alignment correct on resize
window.addEventListener("resize", ()=>{
    slider.style.transition = "none";
    slider.style.transform = `translateX(-${getCardWidth() * index}px)`;
});

/* =========================
   DARK MODE (AUTO + SAVE)
========================= */

const themeToggle = document.getElementById("theme-toggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
} else if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
} else {
    // No saved preference → follow system
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add("dark-mode");
    }
}

// Toggle manually
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }

        updateIcon();
    });
}

// Change icon
function updateIcon() {
    if (themeToggle) {
        themeToggle.textContent =
            document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    }
}

updateIcon();

/* =========================
   DARK MODE AUTO SWITCH ON SYSTEM CHANGE
========================= */

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

mediaQuery.addEventListener('change', e => {
    if (!localStorage.getItem("theme")) {
        document.body.classList.toggle("dark-mode", e.matches);
        updateIcon();
    }
});

/* =========================
   ROTATING TEXT (HERO SUBTITLE)
========================= */

const rotatingTextElement = document.querySelector('.rotating-text');

if (rotatingTextElement) {
    const phrases = [
        "Computer Science Graduate",
        "AI & Embedded Systems Enthusiast",
        "Full-Stack Developer"
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = "";

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            currentText = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        rotatingTextElement.textContent = currentText;
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeEffect, 300);
            return;
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(typeEffect, speed);
    }
    
    typeEffect();
}
