// Theme toggle: overrides the system preference and remembers the choice
const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

toggle.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// Fade sections in as they scroll into view
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = document.querySelectorAll(".reveal");

if (!reduceMotion && "IntersectionObserver" in window) {
  root.classList.add("js-reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => revealObserver.observe(el));
}

// Highlight the nav link for the section currently on screen
const navLinks = document.querySelectorAll(".nav-links a");
const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute("href")));

function updateActiveLink() {
  const offset = window.innerHeight * 0.35;
  let active = sections[0];
  sections.forEach((s) => { if (s.getBoundingClientRect().top <= offset) active = s; });
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) active = sections[sections.length - 1];
  navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + active.id));
}

window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();
