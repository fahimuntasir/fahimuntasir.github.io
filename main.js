/* Minimal interactions for a fast, accessible one-page portfolio. */
(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.getElementById('site-header');
  const themeButton = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('menu-toggle');
  const navigation = document.getElementById('site-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  // Keep the original user's preference across visits; light is the default.
  function setThemeIcon() {
    if (!themeButton) return;
    const dark = root.classList.contains('dark-mode');
    themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeButton.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeButton.querySelector('i').className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0c1727' : '#f8fafc');
  }
  setThemeIcon();
  themeButton?.addEventListener('click', () => {
    root.classList.toggle('dark-mode');
    try { localStorage.setItem('portfolio-theme', root.classList.contains('dark-mode') ? 'dark' : 'light'); }
    catch (e) { /* Keep working when storage is disabled. */ }
    setThemeIcon();
  });

  function closeMenu() {
    navigation?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
    const icon = menuButton?.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-bars';
  }
  menuButton?.addEventListener('click', () => {
    const open = !navigation.classList.contains('open');
    navigation.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuButton.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
  navigation?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (navigation?.classList.contains('open') && !navigation.contains(e.target) && !menuButton?.contains(e.target)) closeMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

  // The active navigation link follows the section currently on screen.
  const watchedSections = [...document.querySelectorAll('#home, #about, #projects, #experience, #contact')];
  function setActiveLink(id) {
    navLinks.forEach(a => {
      const active = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      // Of visible intersecting sections, select the one closest to top.
      const intersecting = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (intersecting.length) setActiveLink(intersecting[0].target.id);
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    watchedSections.forEach(section => observer.observe(section));
  }
  navLinks.forEach(link => link.addEventListener('click', () => setActiveLink(link.hash.slice(1))));

  // A low-cost header change instead of a heavy animation library.
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();

