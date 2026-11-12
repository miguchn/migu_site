import { journeyStops } from "./journey";
import { WALK_SPEED } from "./cat-walk-cycle";
export { sampleGait } from "./cat-gait";

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const range = (value: number, start: number, end: number) => smooth((value - start) / (end - start));

/** Every segment begins and ends at a real surface, with zero lift at contact. */
export function sampleJourney(progress: number) {
  const p = clamp(progress);
  const next = journeyStops.findIndex((stop) => stop.at > p);
  const i = next < 0 ? journeyStops.length - 2 : Math.max(0, next - 1);
  const a = journeyStops[i];
  const b = journeyStops[i + 1];
  const t = clamp((p - a.at) / (b.at - a.at));
  const travel = smooth(t);
  const moving = Math.hypot(b.x - a.x, b.y - a.y) > 0.1;
  const hop = moving ? Math.sin(t * Math.PI) ** 2 * b.lift * 0.38 : 0;
  return { x: a.x + (b.x - a.x) * travel, y: a.y + (b.y - a.y) * travel,
    hop, t, moving, landing: moving ? Math.sin(range(t, 0.82, 1) * Math.PI) : 0 };
}

export const CAT_WALK_CADENCE = .78;

/** Advance along the route at a quiet walking pace, even after a wheel flick.
 * Limit actual projected travel, so distance-driven paws retain their foot lock.
 * Binary search respects the easing and pauses already authored in the route.
 */
export function advanceCatProgress(current: number, target: number, dt: number, scale = 1.05) {
  const seconds = clamp(dt, 0, 50) / 1000;
  const direction = Math.sign(target - current);
  const eased = current + (target - current) * (1 - Math.exp(-seconds / .22));
  const candidate = current + direction * Math.min(Math.abs(eased - current), seconds * .16);
  const maxTravel = (20 / Math.sqrt(2)) * scale * WALK_SPEED * CAT_WALK_CADENCE * seconds;
  const start = sampleJourney(current).x;
  if (Math.abs(sampleJourney(candidate).x - start) <= maxTravel) return candidate;
  let low = 0, high = 1;
  for (let i = 0; i < 20; i++) {
    const middle = (low + high) / 2;
    const progress = current + (candidate - current) * middle;
    if (Math.abs(sampleJourney(progress).x - start) > maxTravel) high = middle;
    else low = middle;
  }
  return current + (candidate - current) * low;
}

/** Finish the current step on idle, in the direction of travel. */
export function restingProgress(p: number, direction: number) {
  if (direction > 0) return journeyStops.find((stop) => stop.at >= p - 0.00001)?.at ?? 1;
  return [...journeyStops].reverse().find((stop) => stop.at <= p + 0.00001)?.at ?? 0;
}

/** Native scrolling is the scene timeline; no hidden actor keeps a render loop alive. */
export function initMotion() {
  const section = document.querySelector<HTMLElement>(".journey-section")!;
  const stage = document.querySelector<HTMLElement>(".journey-stage")!;
  const world = document.querySelector<HTMLElement>(".journey-world")!;
  const bridge = document.querySelector<SVGGElement>(".journey-bridge")!;
  const bridgePivot = document.querySelector<SVGGElement>(".journey-bridge-pivot")!;
  const pieces = [...document.querySelectorAll<SVGGElement>("[data-build]")]
    .map((el) => ({ el, values: el.dataset.build!.split(",").map(Number) }));
  const copies = [...document.querySelectorAll<HTMLElement>(".chapter-copy")];
  const chapterButtons = [...document.querySelectorAll<HTMLButtonElement>("[data-chapter]")];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const mobileJourney = matchMedia("(max-width: 700px)");
  const hero = document.querySelector<HTMLElement>(".hero-art")!;
  const ornaments = [...document.querySelectorAll<HTMLElement>(".project-card, .explore-item, .about-art, .contact-panel")];
  const percent = document.querySelector<HTMLElement>(".journey-percent")!;
  const scrollHint = document.querySelector<HTMLElement>(".journey-scroll-hint")!;
  const summit = document.querySelector<HTMLAnchorElement>(".summit-link")!;
  const footer = document.querySelector<HTMLElement>(".footer")!;
  summit.hidden = false;
  let frame = 0;
  let scrollAnimation = 0;
  let activeChapter = -1;
  const root = document.documentElement;
  let restoreScrollBehavior = () => {};

  function stopScrollAnimation() {
    cancelAnimationFrame(scrollAnimation);
    restoreScrollBehavior();
    removeEventListener("wheel", stopScrollAnimation);
    removeEventListener("touchstart", stopScrollAnimation);
    removeEventListener("keydown", stopScrollAnimation);
  }
  function scrollPageTo(top: number) {
    stopScrollAnimation();
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    restoreScrollBehavior = () => {
      root.style.scrollBehavior = previous;
      restoreScrollBehavior = () => {};
    };
    if (reduceMotion.matches || Math.abs(top - scrollY) < 1) {
      scrollTo(0, top);
      restoreScrollBehavior();
      return;
    }
    const start = scrollY;
    const change = top - start;
    const duration = Math.min(720, 280 + Math.abs(change) * 0.2);
    const t0 = performance.now();
    addEventListener("wheel", stopScrollAnimation, { passive: true });
    addEventListener("touchstart", stopScrollAnimation, { passive: true });
    addEventListener("keydown", stopScrollAnimation);
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      scrollTo(0, Math.round(start + change * smooth(t)));
      if (t < 1) scrollAnimation = requestAnimationFrame(tick);
      else stopScrollAnimation();
    };
    scrollAnimation = requestAnimationFrame(tick);
  }
  document.querySelectorAll<HTMLAnchorElement>("a[data-scroll]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const destination = link.dataset.scroll!;
      const target = document.getElementById(destination);
      if (!target) return;
      event.preventDefault();
      const top = scrollY + target.getBoundingClientRect().top;
      const headerHeight = document.querySelector<HTMLElement>('.header')?.offsetHeight ?? 0;
      scrollPageTo(destination === "home" ? 0 : destination === "journey" ? Math.ceil(top) : top - headerHeight);
      if (destination === "main") target.focus({ preventScroll: true });
    });
  });

  function update() {
    frame = 0;
    const reduced = reduceMotion.matches;
    const fluid = reduced || mobileJourney.matches;
    const showSummit = scrollY > innerHeight * 0.7 && footer.getBoundingClientRect().top > innerHeight;
    summit.classList.toggle("is-visible", showSummit);
    summit.setAttribute("aria-hidden", String(!showSummit));
    summit.tabIndex = showSummit ? 0 : -1;
    const rect = section.getBoundingClientRect();
    const p = clamp(-rect.top / Math.max(1, section.offsetHeight - innerHeight));
    // Static layouts show a completed island. Desktop assembles directly under the scroll.
    const builtProgress = fluid ? 1 : p;
    const sceneProgress = fluid ? 0 : p;
    const phase = Math.min(2, Math.floor(p * 3));
    const night = range(sceneProgress, 0.67, 0.97);
    stage.style.setProperty("--dusk", String(range(sceneProgress, 0.23, 0.51) * (1 - range(sceneProgress, 0.68, 0.96))));
    stage.style.setProperty("--night", String(night));
    stage.style.setProperty("--copy-night", night > 0.55 ? "1" : "0");
    stage.style.setProperty("--progress", String(sceneProgress));
    stage.style.setProperty("--orb-x", `${(sceneProgress - 0.5) * 50}px`);
    stage.style.setProperty("--orb-y", `${Math.sin(sceneProgress * Math.PI) * -25}px`);
    percent.textContent = String(Math.round(p * 100)).padStart(2, "0");
    scrollHint.style.opacity = String(1 - range(sceneProgress, 0.93, 0.99));
    world.style.transform = fluid ? "none" : `translate3d(0,${range(p, 0.65, 1) * -8}px,0)`;
    for (const { el, values: [start, end, x, y] } of pieces) {
      const t = fluid ? 1 : range(builtProgress, start, end);
      el.style.opacity = String(t);
      el.style.transform = `translate(${x * (1 - t)}px,${y * (1 - t)}px)`;
    }
    bridge.style.transform = `rotate(${-78 * (1 - (fluid ? 1 : range(builtProgress, 0.24, 0.40)))}deg)`;
    bridgePivot.style.opacity = String(fluid ? 1 : range(builtProgress, 0.16, 0.23));
    copies.forEach((copy, index) => {
      if (fluid) {
        copy.style.removeProperty("opacity");
        copy.style.removeProperty("transform");
        copy.style.removeProperty("visibility");
        copy.removeAttribute("aria-hidden");
      } else {
        const visible = index === phase;
        copy.style.opacity = visible ? "1" : "0";
        copy.style.transform = `translateY(calc(-50% + ${(index - phase) * 34}px))`;
        copy.style.visibility = visible ? "visible" : "hidden";
        copy.setAttribute("aria-hidden", String(!visible));
      }
    });
    if (phase !== activeChapter) {
      chapterButtons.forEach((button, index) => {
        button.classList.toggle("active", phase === index);
        button.setAttribute("aria-pressed", String(phase === index));
      });
      activeChapter = phase;
    }
    const heroRect = hero.getBoundingClientRect();
    const exit = reduced ? 0 : clamp(-heroRect.top / innerHeight);
    hero.style.setProperty("--hero-turn", `${exit * 2}deg`);
    hero.style.setProperty("--hero-shift", `${exit * -26}px`);
    if (reduced) {
      hero.style.setProperty("--pointer-x", "0deg");
      hero.style.setProperty("--pointer-y", "0deg");
    }
    for (const el of ornaments) {
      const box = el.getBoundingClientRect();
      const enter = range(innerHeight - box.top, 0, Math.min(innerHeight * 0.45, Math.max(1, box.height)));
      el.style.setProperty("--enter", String(reduced ? 1 : enter));
    }
  }
  function requestUpdate() { if (!frame) frame = requestAnimationFrame(update); }
  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate);
  addEventListener("pageshow", requestUpdate);
  reduceMotion.addEventListener("change", () => { stopScrollAnimation(); requestUpdate(); });
  mobileJourney.addEventListener("change", requestUpdate);
  chapterButtons.forEach((button, index) => button.addEventListener("click", () => {
    const positions = [0.12, 0.5, 0.88];
    if (reduceMotion.matches || mobileJourney.matches) {
      scrollPageTo(scrollY + copies[index].getBoundingClientRect().top - 24);
    } else {
      scrollPageTo(scrollY + section.getBoundingClientRect().top + (section.offsetHeight - innerHeight) * positions[index]);
    }
  }));
  // Preserve direct links after progressive enhancement changes section heights.
  if (location.hash) {
    requestAnimationFrame(() => {
      try {
        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) {
          const offset = target.id === 'journey' ? 0 : document.querySelector<HTMLElement>('.header')?.offsetHeight ?? 0;
          scrollTo({ top: Math.max(0, scrollY + target.getBoundingClientRect().top - offset), behavior: "instant" });
        }
      } catch { /* A malformed fragment does not affect normal navigation. */ }
      requestUpdate();
    });
  }
  update();
}
