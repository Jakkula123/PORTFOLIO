const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// -----------------------------
// Welcome overlay (first screen)
// -----------------------------
const welcomeOverlay = document.getElementById("welcomeOverlay");
const enterBtn = document.getElementById("enterPortfolioBtn");

if (welcomeOverlay) {
  // Prevent scrolling while the intro is visible.
  document.body.style.overflow = "hidden";

  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      welcomeOverlay.classList.add("is-hidden");
      document.body.style.overflow = "";

      const home = document.getElementById("home");
      if (home) {
        home.scrollIntoView({ behavior: "auto", block: "start" });
      }

      // Scroll-spy will update naturally after the reveal.
    });
  }
}

// -----------------------------
// Reveal on scroll (fade-in)
// -----------------------------
const revealEls = Array.from(document.querySelectorAll(".reveal"));
const prefersReducedMotion = window.matchMedia
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

// -----------------------------
// Navigation: smooth scroll + scroll spy
// -----------------------------
const sections = ["home", "projects", "resume", "contact"];
const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
const topNav = document.getElementById("topNav");
const navHeight = topNav ? topNav.getBoundingClientRect().height : 72;

function setActiveNav(id) {
  navLinks.forEach((a) => {
    const linkId = a.getAttribute("data-nav");
    a.classList.toggle("is-active", linkId === id);
  });
}

function getActiveSection() {
  const y = window.scrollY + navHeight + 12;
  let active = sections[0];
  for (const id of sections) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.offsetTop <= y) active = id;
  }
  return active;
}

let rafId = 0;
function onScrollSpy() {
  if (rafId) return;
  rafId = window.requestAnimationFrame(() => {
    rafId = 0;
    setActiveNav(getActiveSection());
  });
}

window.addEventListener("scroll", onScrollSpy, { passive: true });
setActiveNav(getActiveSection());

function closeMobileNav() {
  const navLinksEl = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");
  if (navLinksEl && navLinksEl.classList.contains("is-open")) {
    navLinksEl.classList.remove("is-open");
  }
  if (navToggle) navToggle.setAttribute("aria-expanded", "false");
}

// Mobile menu toggle (simple)
const navToggle = document.getElementById("navToggle");
const navLinksEl = document.getElementById("navLinks");
if (navToggle && navLinksEl) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinksEl.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("data-nav");
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    closeMobileNav();

    const top = target.offsetTop - navHeight + 1;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

window.addEventListener("load", onScrollSpy, { passive: true });

