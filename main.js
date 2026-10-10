document.getElementById("year").textContent = new Date().getFullYear();

const menuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

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

$(document).ready(function () {
    $(".recommendations-carousel").owlCarousel({
        loop: true,
        margin: 30,
        autoplay: true,
        autoplayTimeout: 5000,
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

const slider = document.getElementById("experienceSlider");
let cards = Array.from(document.querySelectorAll(".experience-card"));

const gap = 30;
let index = 1;
let isAnimating = false;

const firstClone1 = cards[0].cloneNode(true);
const firstClone2 = cards[1].cloneNode(true);
const lastClone1 = cards[cards.length - 1].cloneNode(true);
const lastClone2 = cards[cards.length - 2].cloneNode(true);

slider.appendChild(firstClone1);
slider.appendChild(firstClone2);
slider.insertBefore(lastClone1, slider.firstChild);
slider.insertBefore(lastClone2, slider.firstChild);

cards = slider.querySelectorAll(".experience-card");

index = 2;

function getCardWidth(){
    return cards[0].offsetWidth + gap;
}

slider.style.transform = `translateX(-${getCardWidth() * index}px)`;

function scrollExperience(direction){

    if(isAnimating) return;
    isAnimating = true;

    index += direction;

    slider.style.transition = "transform 0.4s ease";
    slider.style.transform = `translateX(-${getCardWidth() * index}px)`;
}

slider.addEventListener("transitionend", ()=>{

    const width = getCardWidth();
    const realCount = cards.length - 4;

    if(index >= realCount + 2){
        slider.style.transition = "none";
        index = 2;
        slider.style.transform = `translateX(-${width * index}px)`;
    }

    if(index < 2){
        slider.style.transition = "none";
        index = realCount + 1;
        slider.style.transform = `translateX(-${width * index}px)`;
    }

    isAnimating = false;
});

window.addEventListener("resize", ()=>{
    slider.style.transition = "none";
    slider.style.transform = `translateX(-${getCardWidth() * index}px)`;
});

const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-mode");
} else if (savedTheme === "light") {
    document.documentElement.classList.remove("dark-mode");
} else {
    if (true) {
        document.documentElement.classList.add("dark-mode");
    }
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark-mode");

        if (document.documentElement.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }

        updateIcon();
    });
}

function updateIcon() {
    if (themeToggle) {
        themeToggle.textContent =
            document.documentElement.classList.contains("dark-mode") ? "Light" : "Dark";
    }
}

updateIcon();

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

mediaQuery.addEventListener('change', e => {
    if (!localStorage.getItem("theme")) {
        document.documentElement.classList.toggle("dark-mode", e.matches);
        updateIcon();
    }
});

const rotatingTextElement = document.querySelector('.rotating-text');

if (rotatingTextElement) {
    const phrases = [
       "Information & Communication Engineering Student",
       "Software & Embedded Systems Developer",
       "Technical Support Engineer",
       "AI & Intelligent Systems Enthusiast",
       "Multidisciplinary Problem Solver"
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeSpeed = 40;
    const deleteSpeed = 20;
    const pauseEnd = 800;
    const pauseStart = 100;
    
    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            charIndex--;
            rotatingTextElement.textContent = currentPhrase.substring(0, charIndex);
        } else {
            charIndex++;
            rotatingTextElement.textContent = currentPhrase.substring(0, charIndex);
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeEffect, pauseEnd);
            return;
        }
        
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeEffect, pauseStart);
            return;
        }
        
        const speed = isDeleting ? deleteSpeed : typeSpeed;
        setTimeout(typeEffect, speed);
    }
    
    setTimeout(typeEffect, 100);
}

/* POLISH: progress bar, navbar state, active link, reveal */
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const bar = document.createElement("div"); bar.className = "progress"; document.body.prepend(bar);
const navbar = document.querySelector(".navbar");
function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    navbar.classList.toggle("scrolled", scrollY > 20);
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();
const navAnchors = [...document.querySelectorAll(".nav-links a")];
const spy = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
}), { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("section[id]").forEach(s => spy.observe(s));
if (!reduceMotion) {
    const rv = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); } }), { threshold: 0.08 });
    document.querySelectorAll("section:not(.hero) .container").forEach(c => { c.classList.add("reveal"); rv.observe(c); });
}
document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("show")) closeModal(); });
