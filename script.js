const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeColor = document.querySelector('meta[name="theme-color"]');
const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

root.dataset.theme = savedTheme || (prefersDark ? "dark" : "light");

const syncThemeControls = () => {
  const isDark = root.dataset.theme === "dark";
  themeToggle?.setAttribute(
    "aria-label",
    isDark ? "Switch to light color theme" : "Switch to dark color theme",
  );
  themeColor?.setAttribute("content", isDark ? "#0c111b" : "#6847f5");
};

syncThemeControls();

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  syncThemeControls();
});

const progressBar = document.querySelector(".scroll-progress span");
let scrollFrame;

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar?.style.setProperty("transform", `scaleX(${Math.min(1, Math.max(0, progress))})`);
  scrollFrame = undefined;
};

window.addEventListener(
  "scroll",
  () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollProgress);
  },
  { passive: true },
);

updateScrollProgress();

const heroVisual = document.querySelector(".hero-visual");
const canTilt = window.matchMedia("(pointer: fine)").matches
  && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroVisual && canTilt) {
  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    heroVisual.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
    heroVisual.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
    heroVisual.style.setProperty("--pointer-x", `${x * 100}%`);
    heroVisual.style.setProperty("--pointer-y", `${y * 100}%`);
  });

  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--tilt-x", "0deg");
    heroVisual.style.setProperty("--tilt-y", "0deg");
    heroVisual.style.setProperty("--pointer-x", "50%");
    heroVisual.style.setProperty("--pointer-y", "50%");
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
