import { translate } from "./i18n";

// The original open-M path is clipped, never redrawn, so its final silhouette
// remains identical to public/logo.svg (including its diagonal opening).
const logoPath = "M20 100V22.8Q20 19.9 22.2 21.88L64 59.5L81.36842 43.86842L108 70.50000V100H90V60.5L64 84L38 60.5V100ZM86.28095 39.44714L105.8 21.88Q108 19.9 108 22.8V61.16619Z";

export function brandIntroMarkup() {
  const slices = [[0, 40], [40, 24], [64, 22], [86, 42]];
  return `<div id="brand-intro" class="brand-intro" hidden role="dialog" aria-modal="true" aria-label="${translate("品牌开场")}">
    <div class="brand-intro-center">
      <svg class="brand-intro-logo" viewBox="0 0 128 128" role="img" aria-label="${translate("咪咕开口 M 标志")}">
        <defs>${slices.map(([x, width], i) => `<clipPath id="brand-intro-slice-${i}"><rect x="${x}" y="0" width="${width}" height="128"/></clipPath>`).join("")}</defs>
        ${slices.map((_, i) => `<g class="brand-intro-piece brand-intro-piece-${i}"><path clip-path="url(#brand-intro-slice-${i})" d="${logoPath}"/></g>`).join("")}
        <path class="brand-intro-complete" d="${logoPath}"/>
      </svg>
      <p>好奇心，正在发生。</p>
    </div>
    <button id="brand-intro-skip" class="brand-intro-skip" type="button">跳过开场 <span aria-hidden="true">↗</span></button>
    <span class="brand-intro-foot" aria-hidden="true">MIGU / A CURIOUS LITTLE CORNER</span>
  </div>`;
}

export function initBrandIntro() {
  const intro = document.querySelector<HTMLElement>("#brand-intro");
  const skip = document.querySelector<HTMLButtonElement>("#brand-intro-skip");
  if (!intro || !skip) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const storageKey = "migu-brand-intro-v1";
  const inertBefore = new Map<HTMLElement, boolean>();
  let exitTimer: ReturnType<typeof setTimeout> | undefined;
  let finishTimer: ReturnType<typeof setTimeout> | undefined;
  let safetyTimer: ReturnType<typeof setTimeout> | undefined;
  let restoreFocus: HTMLElement | null = null;
  let leaving = false;

  function releaseBackground() {
    for (const [element, wasInert] of inertBefore) element.inert = wasInert;
    inertBefore.clear();
  }
  function clearTimers() {
    clearTimeout(exitTimer);
    clearTimeout(finishTimer);
    clearTimeout(safetyTimer);
  }
  function finish(focus = true) {
    const wasOpen = !intro!.hidden;
    clearTimers();
    intro!.hidden = true;
    intro!.classList.remove("brand-intro-leaving");
    document.body.classList.remove("brand-intro-active");
    releaseBackground();
    leaving = false;
    if (focus && wasOpen) restoreFocus?.focus({ preventScroll: true });
    restoreFocus = null;
  }
  function enter() {
    if (intro!.hidden || leaving) return;
    clearTimeout(exitTimer);
    leaving = true;
    intro!.classList.add("brand-intro-leaving");
    document.body.classList.remove("brand-intro-active");
    document.body.classList.add("brand-intro-entered");
    finishTimer = setTimeout(finish, reduced.matches ? 0 : 350);
  }
  function start() {
    if (reduced.matches) { finish(); return; }
    finish(false);
    restoreFocus = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
      ? document.activeElement : document.querySelector<HTMLElement>("#main");
    document.querySelectorAll<HTMLElement>(".header, #main, .footer, .summit-link, .skip-link").forEach(element => {
      inertBefore.set(element, element.inert);
      element.inert = true;
    });
    // Arm a separate fail-open timer before changing the visible state.
    safetyTimer = setTimeout(finish, 1800);
    document.body.classList.remove("brand-intro-entered");
    intro!.hidden = false;
    intro!.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    void intro!.offsetWidth;
    document.body.classList.add("brand-intro-active");
    skip!.focus({ preventScroll: true });
    exitTimer = setTimeout(enter, 850);
    try { sessionStorage.setItem(storageKey, "1"); } catch { /* Storage is optional. */ }
  }

  skip.addEventListener("click", enter);
  document.addEventListener("keydown", event => {
    if (intro.hidden) return;
    if (event.key === "Escape") { event.preventDefault(); enter(); }
    if (event.key === "Tab") { event.preventDefault(); skip.focus({ preventScroll: true }); }
  });
  reduced.addEventListener("change", () => {
    if (reduced.matches) { finish(); document.body.classList.remove("brand-intro-entered"); }
  });
  addEventListener("pagehide", () => finish(false));
  addEventListener("pageshow", event => { if (event.persisted) finish(false); });

  let seen = false;
  try { seen = sessionStorage.getItem(storageKey) === "1"; } catch { /* Storage is optional. */ }
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (!seen && !location.hash && !reduced.matches && navigation?.type !== "back_forward" && navigation?.type !== "reload") start();
}
