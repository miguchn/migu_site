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
  const perspective = section.querySelector<HTMLElement>(".journey-perspective")!;
  const world = document.querySelector<HTMLElement>(".journey-world")!;
  const bridge = document.querySelector<SVGGElement>(".journey-bridge")!;
  const bridgePivot = document.querySelector<SVGGElement>(".journey-bridge-pivot")!;
  const pieces = [...document.querySelectorAll<SVGGElement>("[data-build]")]
    .map((el) => ({ el, values: el.dataset.build!.split(",").map(Number) }));
  const buildEnd = Math.max(0.40, ...pieces.map(({ values }) => values[1]));
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
  let activeProgress = -1;
  let activeBuildProgress = -1;
  let wasFluid: boolean | undefined;
  let summitVisible: boolean | undefined;
  let previousHeroExit = -1;

  function stopScrollAnimation() {
    cancelAnimationFrame(scrollAnimation);
    scrollAnimation = 0;
    removeEventListener("wheel", stopScrollAnimation);
    removeEventListener("pointerdown", stopScrollAnimation);
    removeEventListener("keydown", stopScrollAnimation);
  }
  function scrollPageTo(top: number) {
    stopScrollAnimation();
    top = clamp(top, 0, document.documentElement.scrollHeight - innerHeight);
    if (reduceMotion.matches || Math.abs(top - scrollY) < 1) {
      scrollTo({ top, behavior: "instant" });
      return;
    }
    const start = scrollY;
    const change = top - start;
    const duration = Math.min(560, 200 + Math.sqrt(Math.abs(change)) * 6);
    const t0 = performance.now();
    addEventListener("wheel", stopScrollAnimation, { passive: true });
    addEventListener("pointerdown", stopScrollAnimation, { passive: true });
    addEventListener("keydown", stopScrollAnimation);
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      scrollTo({ top: start + change * (1 - (1 - t) ** 3), behavior: "instant" });
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
      const pinnedJourney = destination === "journey" && !mobileJourney.matches && !reduceMotion.matches;
      scrollPageTo(destination === "home" ? 0 : pinnedJourney ? Math.ceil(top) : top - headerHeight);
      if (event.detail === 0 || destination === "main") {
        if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    });
  });

  function update() {
    frame = 0;
    // Take all layout measurements before touching styles.
    const reduced = reduceMotion.matches;
    const mobile = mobileJourney.matches;
    const fluid = reduced || mobile;
    const viewport = innerHeight;
    const top = scrollY;
    const showSummit = summit === document.activeElement ||
      (top > viewport * 0.7 && footer.getBoundingClientRect().top > viewport);
    const rect = section.getBoundingClientRect();
    const progress = fluid ? 0 : clamp(-rect.top / Math.max(1, rect.height - viewport));
    const buildProgress = reduced ? 1 : mobile
      ? buildEnd * range(viewport - perspective.getBoundingClientRect().top, viewport * 0.28, viewport - 72)
      : progress;
    const heroExit = reduced ? 0 : clamp(-hero.getBoundingClientRect().top / viewport);
    const ornamentProgress = ornaments.map(element => {
      if (reduced) return 1;
      const box = element.getBoundingClientRect();
      return range(viewport - box.top, 0, Math.min(viewport * 0.45, Math.max(1, box.height)));
    });

    if (showSummit !== summitVisible) {
      summit.classList.toggle("is-visible", showSummit);
      summit.inert = !showSummit;
      summitVisible = showSummit;
    }
    if (progress !== activeProgress || fluid !== wasFluid) {
      const night = range(progress, 0.67, 0.97);
      const phase = fluid ? -1 : Math.min(copies.length - 1, Math.floor(progress * copies.length));
      stage.style.setProperty("--dusk", String(range(progress, 0.23, 0.51) * (1 - range(progress, 0.68, 0.96))));
      stage.style.setProperty("--night", String(night));
      stage.style.setProperty("--copy-night", night >= 0.55 ? "1" : "0");
      stage.style.setProperty("--reading-light", String(range(night, 0.13, 0.85) * 0.9));
      stage.style.setProperty("--progress", String(progress));
      stage.style.setProperty("--orb-x", `${(progress - 0.5) * 50}px`);
      stage.style.setProperty("--orb-y", `${Math.sin(progress * Math.PI) * -25}px`);
      const value = String(Math.round(progress * 100)).padStart(2, "0");
      if (percent.textContent !== value) percent.textContent = value;
      scrollHint.style.opacity = String(1 - range(progress, 0.93, 0.99));
      world.style.transform = fluid ? "none" : `translate3d(0,${range(progress, 0.65, 1) * -8}px,0)`;

      copies.forEach((copy, index) => {
        if (fluid) {
          copy.style.removeProperty("opacity");
          copy.style.removeProperty("transform");
          copy.style.removeProperty("visibility");
          return;
        }
        // Keep a paused chapter readable at the boundary and avoid overlapping headlines.
        const fade = 0.027;
        const start = index / copies.length;
        const end = (index + 1) / copies.length;
        const enter = index === 0 ? 1 : range(progress, start, start + fade);
        const exit = index === copies.length - 1 ? 0 : range(progress, end - fade, end);
        copy.style.opacity = String(0.88 + 0.12 * enter * (1 - exit));
        copy.style.visibility = index === phase ? "visible" : "hidden";
        copy.style.transform = `translateY(calc(-50% + ${(1 - enter - exit) * 8}px))`;
      });
      if (phase !== activeChapter || fluid !== wasFluid) {
        copies.forEach((copy, index) => {
          if (fluid) copy.removeAttribute("aria-hidden");
          else copy.setAttribute("aria-hidden", String(index !== phase));
        });
        chapterButtons.forEach((button, index) => {
          button.classList.toggle("active", phase === index);
          button.setAttribute("aria-pressed", String(phase === index));
        });
        activeChapter = phase;
      }
      activeProgress = progress;
      wasFluid = fluid;
    }
    if (buildProgress !== activeBuildProgress) {
      for (const { el, values: [start, end, x, y] } of pieces) {
        const t = range(buildProgress, start, end);
        el.style.opacity = String(t);
        el.style.transform = `translate(${x * (1 - t)}px,${y * (1 - t)}px)`;
      }
      bridge.style.transform = `rotate(${-78 * (1 - range(buildProgress, 0.24, 0.40))}deg)`;
      bridgePivot.style.opacity = String(range(buildProgress, 0.16, 0.23));
      activeBuildProgress = buildProgress;
    }
    if (heroExit !== previousHeroExit) {
      hero.style.setProperty("--hero-turn", `${heroExit * 2}deg`);
      hero.style.setProperty("--hero-shift", `${heroExit * -18}px`);
      previousHeroExit = heroExit;
    }
    ornaments.forEach((element, index) => {
      const value = String(ornamentProgress[index]);
      if (element.style.getPropertyValue("--enter") !== value) element.style.setProperty("--enter", value);
    });
  }
  function requestUpdate() { if (!frame) frame = requestAnimationFrame(update); }
  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", () => { stopScrollAnimation(); requestUpdate(); });
  addEventListener("localechange", () => { stopScrollAnimation(); requestUpdate(); });
  summit.addEventListener("focusout", requestUpdate);
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
          const pinnedJourney = target === section && !mobileJourney.matches && !reduceMotion.matches;
          const offset = pinnedJourney ? 0 : document.querySelector<HTMLElement>(".header")?.offsetHeight ?? 0;
          scrollTo({ top: Math.max(0, scrollY + target.getBoundingClientRect().top - offset), behavior: "instant" });
        }
      } catch { /* A malformed fragment does not affect normal navigation. */ }
      requestUpdate();
    });
  }
  update();
}
