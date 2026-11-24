import { initLocale, translate } from "./i18n";
import "./style.css";
import "./personality.css";
import { renderPage } from "./page";
import { initMotion } from "./motion";
import { initIslandInteractions } from "./island-interactions";
import { initBrandIntro } from "./brand-intro";
import { initChapterReveal } from "./chapter-reveal";
import { initNavigation } from "./navigation";
import "./brand-intro.css";
import "./content-layout.css";
import "./refinement.css";
import "./interaction-motion.css";
import { updateFeedback } from "./feedback";

const app = document.querySelector<HTMLDivElement>("#app")!;
// The production HTML already contains the page; only dev needs client rendering.
if (!app.querySelector("#main")) app.innerHTML = renderPage();

const toast = document.querySelector<HTMLDivElement>(".toast")!;
let emailRequest = 0;
let wechatRequest = 0;
let toastTimer: ReturnType<typeof setTimeout>;
function notify(message: string) {
  toast.textContent = translate(message);
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3000);
}
initIslandInteractions(notify, updateFeedback);
document.querySelector("#copy-email")!.addEventListener("click", async () => {
  const request = ++emailRequest;
  let message = "已复制邮箱地址。";
  try {
    await navigator.clipboard.writeText("miguchn@gmail.com");
  } catch {
    message = "请手动复制邮箱：miguchn@gmail.com";
  }
  if (request === emailRequest) notify(message);
});
document.querySelector('#copy-wechat')!.addEventListener('click', async () => {
  const status = document.querySelector<HTMLElement>('.wechat-status')!;
  const request = ++wechatRequest;
  let message = '名称已复制，请在微信中搜索。';
  try {
    await navigator.clipboard.writeText('别动生产库');
  } catch {
    message = '请在微信中搜索：别动生产库';
  }
  if (request === wechatRequest) updateFeedback(status, translate(message));
});
const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle")!;
const mobileNav = document.querySelector<HTMLElement>("#mobile-nav")!;
function setMenu(expanded: boolean) {
  if (mobileNav.inert === !expanded) return;
  if (!expanded && mobileNav.contains(document.activeElement)) {
    menuButton.focus({ preventScroll: true });
  }
  mobileNav.inert = !expanded;
  menuButton.setAttribute("aria-expanded", String(expanded));
  menuButton.setAttribute("aria-label", translate(expanded ? "关闭导航菜单" : "打开导航菜单"));
}
function closeMenu() { setMenu(false); }
setMenu(false);
mobileNav.hidden = false;
menuButton.addEventListener("click", () => setMenu(mobileNav.inert));
const header = menuButton.closest<HTMLElement>(".header")!;
header.addEventListener("focusout", event => {
  if (event.relatedTarget instanceof Node && !header.contains(event.relatedTarget)) {
    // The browser is already moving focus to the destination.
    queueMicrotask(closeMenu);
  }
});
mobileNav
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !mobileNav.inert) {
    closeMenu();
    menuButton.focus({ preventScroll: true });
  }
});
document.addEventListener("click", (e) => {
  if (e.target instanceof Element && !e.target.closest(".header")) closeMenu();
});
window.matchMedia("(min-width: 701px)").addEventListener("change", (e) => {
  if (e.matches) closeMenu();
});

initLocale();
document.body.classList.add("motion-ready");
initMotion();
initNavigation();
initChapterReveal();
initBrandIntro();

const skills = document.querySelector<HTMLElement>(".skills-list");
if (skills && "IntersectionObserver" in window) {
  skills.classList.add("is-marquee");
  const observer = new IntersectionObserver(([entry]) => {
    skills.classList.toggle("is-in-view", entry.isIntersecting);
  });
  observer.observe(skills);
}
