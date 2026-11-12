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
import "./content-motion.css";
import "./refinement.css";

const app = document.querySelector<HTMLDivElement>("#app")!;
// The production HTML already contains the page; only dev needs client rendering.
if (!app.querySelector("#main")) app.innerHTML = renderPage();

const toast = document.querySelector<HTMLDivElement>(".toast")!;
let toastTimer: ReturnType<typeof setTimeout>;
function notify(message: string) {
  toast.textContent = translate(message);
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
document.querySelector('#copy-wechat')!.addEventListener('click', async () => {
  const status = document.querySelector('.wechat-status')!;
  try {
    await navigator.clipboard.writeText('别动生产库');
    status.textContent = translate('名称已复制，请在微信中搜索。');
  } catch {
    status.textContent = translate('请在微信中搜索：别动生产库');
  }
});
const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle")!;
const mobileNav = document.querySelector<HTMLElement>("#mobile-nav")!;
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", translate("打开导航菜单"));
}
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(expanded));
  menuButton.setAttribute(
    "aria-label",
    translate(expanded ? "关闭导航菜单" : "打开导航菜单"),
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

initLocale();
document.body.classList.add("motion-ready");
initMotion();
initNavigation();
initChapterReveal();
initBrandIntro();
