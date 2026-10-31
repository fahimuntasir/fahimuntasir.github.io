/* Fast, accessible interactions for the one-page portfolio. */
(() => {
  'use strict';

  const root = document.documentElement;
  const header = document.getElementById('site-header');
  const themeButton = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('menu-toggle');
  const navigation = document.getElementById('site-nav');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const year = document.getElementById('year');

  // Show only the first three roles, in the order written in index.html.
  // Add new roles to the top of #experience-entries and older ones move to the archive.
  const experienceList = document.getElementById('experience-entries');
  const archive = document.getElementById('earlier-experience');
  const archiveList = document.getElementById('earlier-list');
  const archiveCount = document.getElementById('earlier-count');
  if (experienceList && archive && archiveList) {
    const roles = [...experienceList.children].filter(role => role.classList.contains('timeline-entry'));
    const older = roles.slice(3);
    older.forEach(role => archiveList.appendChild(role));
    archive.hidden = older.length === 0;
    if (archiveCount) archiveCount.textContent = String(older.length);
  }

  if (year) year.textContent = new Date().getFullYear();

  // Respect the saved theme preference (applied early in index.html).
  function setThemeIcon() {
    if (!themeButton) return;
    const dark = root.classList.contains('dark-mode');
    themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeButton.setAttribute('title', dark ? 'Switch to light mode' : 'Switch to dark mode');
    const icon = themeButton.querySelector('i');
    if (icon) icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0c1727' : '#f8fafc');
  }
  setThemeIcon();
  themeButton?.addEventListener('click', () => {
    root.classList.toggle('dark-mode');
    try { localStorage.setItem('portfolio-theme', root.classList.contains('dark-mode') ? 'dark' : 'light'); }
    catch (e) { /* The toggle still works if storage is unavailable. */ }
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
    if (!navigation) return;
    const open = !navigation.classList.contains('open');
    navigation.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    const icon = menuButton.querySelector('i');
    if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (navigation?.classList.contains('open') && !navigation.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

  // Highlight the navigation link corresponding to the visible section.
  const watchedSections = [...document.querySelectorAll('#home, #about, #projects, #experience, #contact')];
  function setActiveLink(id) {
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const intersecting = entries.filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (intersecting.length) setActiveLink(intersecting[0].target.id);
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    watchedSections.forEach(section => observer.observe(section));
  }
  navLinks.forEach(link => link.addEventListener('click', () => setActiveLink(link.hash.slice(1))));

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
})();
