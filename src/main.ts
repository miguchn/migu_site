import "./style.css";
import "./personality.css";
import { renderPage } from "./page";
import { initMotion } from "./motion";
import { initIslandInteractions } from "./island-interactions";

const app = document.querySelector<HTMLDivElement>("#app")!;
// The production HTML already contains the page; only dev needs client rendering.
if (!app.querySelector("#main")) app.innerHTML = renderPage();

const toast = document.querySelector<HTMLDivElement>(".toast")!;
let toastTimer: ReturnType<typeof setTimeout>;
function notify(message: string) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3000);
}
initIslandInteractions(notify);
document.querySelector("#copy-email")!.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("miguchn@gmail.com");
    notify("邮箱已复制，期待你的来信。");
  } catch {
    notify("请手动复制邮箱：miguchn@gmail.com");
  }
});
const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle")!;
const mobileNav = document.querySelector<HTMLElement>("#mobile-nav")!;
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "打开导航菜单");
}
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(expanded));
  menuButton.setAttribute(
    "aria-label",
    expanded ? "关闭导航菜单" : "打开导航菜单",
  );
  mobileNav.hidden = !expanded;
});
mobileNav
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (e) => {
  if (!(e.target as Element).closest(".header")) closeMenu();
});
window.matchMedia("(min-width: 701px)").addEventListener("change", (e) => {
  if (e.matches) closeMenu();
});

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(
      ".section-heading, .explore-item, .project-card, .about-copy, .contact-panel",
    )
    .forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
}

initMotion();
