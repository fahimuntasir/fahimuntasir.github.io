/* ============================================================
   MAIN.JS — Portfolio Interactions
   ============================================================ */

/* ---------- 1. UTILITIES ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- 2. MOBILE MENU ---------- */
const menuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
  menuBtn.setAttribute("aria-expanded", "false");

  // Toggle menu
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", navLinks.classList.contains("active"));
  });

  // Close on outside tap
  document.addEventListener("click", (e) => {
    if (!navLinks.classList.contains("active")) return;
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
      navLinks.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- 3. SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
      navLinks?.classList.remove("active");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    }
  });
});

/* ---------- 4. TABS (legacy – keep for compatibility) ---------- */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabContents.forEach((c) => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab)?.classList.add("active");
  });
});

/* ---------- 5. EXPANDABLE DETAILS (experience + training) ---------- */
function toggleDetails(button, openText, closeText) {
  const details = button.nextElementSibling;
  if (!details) return;

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

/* ---------- 6. EDUCATION TOGGLE ---------- */
function toggleEducation(button) {
  const section = document.querySelector(".education-hidden");
  if (!section) return;

  if (section.style.maxHeight === "0px" || section.style.maxHeight === "") {
    section.style.maxHeight = section.scrollHeight + "px";
    button.textContent = "Hide Earlier Education";
  } else {
    section.style.maxHeight = "0px";
    button.textContent = "Show Earlier Education";
  }
}

/* ---------- 7. RESPONSIVE: REFIT OPEN SECTIONS ON RESIZE / ROTATE ---------- */
function refitOpenSections() {
  document
    .querySelectorAll(
      ".experience-details:not(.collapsed), .training-details:not(.collapsed)"
    )
    .forEach((d) => {
      d.style.maxHeight = d.scrollHeight + "px";
    });

  const edu = document.querySelector(".education-hidden");
  if (edu && edu.style.maxHeight && edu.style.maxHeight !== "0px") {
    edu.style.maxHeight = edu.scrollHeight + "px";
  }
}

window.addEventListener("resize", refitOpenSections);
window.addEventListener("orientationchange", () =>
  setTimeout(refitOpenSections, 250)
);

/* ---------- 8. OWL CAROUSEL (recommendations) ---------- */
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
      1000: { items: 2 },
    },
  });
});

/* ---------- 9. BACK TO TOP BUTTON ---------- */
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("show", window.scrollY > 300);
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- 10. CERTIFICATE MODAL ---------- */
const modal = document.getElementById("certificateModal");
const modalImg = document.getElementById("certificateImage");
const modalClose = document.querySelector(".modal-close");

document.querySelectorAll(".award-card").forEach((card) => {
  card.addEventListener("click", () => {
    const certSrc = card.getAttribute("data-cert");
    if (!certSrc) return;

    modalImg.src = certSrc;
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  });
});

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

function closeModal() {
  modal?.classList.remove("show");
  if (modalImg) modalImg.src = "";
  document.body.style.overflow = "";
}

// Close modal with Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.classList.contains("show")) {
    closeModal();
  }
});

/* ---------- 11. EXPERIENCE SLIDER ---------- */
const slider = document.getElementById("experienceSlider");
let cards = Array.from(document.querySelectorAll(".experience-card"));

const gap = 30;
let index = 1;
let isAnimating = false;

if (slider && cards.length >= 2) {
  // Clone cards for infinite loop
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

  function getCardWidth() {
    return cards[0].offsetWidth + gap;
  }

  // Initial position
  slider.style.transform = `translateX(-${getCardWidth() * index}px)`;

  function scrollExperience(direction) {
    if (isAnimating) return;
    isAnimating = true;

    index += direction;
    slider.style.transition = "transform 0.4s ease";
    slider.style.transform = `translateX(-${getCardWidth() * index}px)`;
  }

  // Expose globally so inline onclick handlers work
  window.scrollExperience = scrollExperience;

  slider.addEventListener("transitionend", () => {
    const width = getCardWidth();
    const realCount = cards.length - 4;

    if (index >= realCount + 2) {
      slider.style.transition = "none";
      index = 2;
      slider.style.transform = `translateX(-${width * index}px)`;
    }

    if (index < 2) {
      slider.style.transition = "none";
      index = realCount + 1;
      slider.style.transform = `translateX(-${width * index}px)`;
    }

    isAnimating = false;
  });

  window.addEventListener("resize", () => {
    slider.style.transition = "none";
    slider.style.transform = `translateX(-${getCardWidth() * index}px)`;
  });
}

/* ---------- 12. THEME TOGGLE (dark / light) ---------- */
const themeToggle = document.getElementById("theme-toggle");

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}

// Apply saved theme, or default to dark
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark-mode");
} else if (savedTheme === "light") {
  document.documentElement.classList.remove("dark-mode");
} else {
  // Default to dark mode
  document.documentElement.classList.add("dark-mode");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");

    try {
      localStorage.setItem(
        "theme",
        document.documentElement.classList.contains("dark-mode") ? "dark" : "light"
      );
    } catch (e) {}

    updateIcon();
  });
}

function updateIcon() {
  if (themeToggle) {
    themeToggle.textContent = document.documentElement.classList.contains(
      "dark-mode"
    )
      ? "Light"
      : "Dark";
  }
}

updateIcon();

/* ---------- 13. ROTATING TEXT (hero subtitle) ---------- */
const rotatingTextElement = document.querySelector(".rotating-text");

if (rotatingTextElement) {
  const phrases = [
    "Information & Communication Engineering Student",
    "Software & Embedded Systems Developer",
    "Technical Support Engineer",
    "AI & Intelligent Systems Enthusiast",
    "Multidisciplinary Problem Solver",
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

/* ---------- 14. POLISH: progress bar, navbar state, active link, reveal ---------- */
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Progress bar
const bar = document.createElement("div");
bar.className = "progress";
document.body.prepend(bar);

const navbar = document.querySelector(".navbar");

function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  navbar?.classList.toggle("scrolled", scrollY > 20);
}

addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Active nav link based on scroll position
const navAnchors = [...document.querySelectorAll(".nav-links a")];

const spy = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) =>
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + entry.target.id
          )
        );
      }
    }),
  { rootMargin: "-40% 0px -55% 0px" }
);

document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));

// Reveal-on-scroll animation
if (!reduceMotion) {
  const rv = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          rv.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 }
  );

  document
    .querySelectorAll("section:not(.hero) .container")
    .forEach((c) => {
      c.classList.add("reveal");
      rv.observe(c);
    });
}
