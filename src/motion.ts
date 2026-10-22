import { journeyStops } from "./journey";

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
  const hop = moving ? Math.sin(t * Math.PI) * b.lift : 0;
  return { x: a.x + (b.x - a.x) * travel, y: a.y + (b.y - a.y) * travel,
    hop, t, moving, landing: moving ? Math.sin(range(t, 0.82, 1) * Math.PI) : 0 };
}

/** Four separate limbs, phased through a step; all return to rest at contact. */
export function sampleGait(t: number, moving: boolean, facing: number) {
  const phase = (facing > 0 ? t : 1 - t) * Math.PI * 2;
  const envelope = moving ? Math.sin(clamp(t) * Math.PI) * 10 : 0;
  const stride = Math.sin(phase) * envelope;
  // Diagonal pairs move together like a soft trot; the far pair is quieter.
  return { frontNear: stride,
    backNear: -stride * .9,
    frontFar: -stride * .72,
    backFar: stride * .72 };
}

/** Finish the current step on idle, in the direction of travel. */
export function restingProgress(p: number, direction: number) {
  if (direction > 0) return journeyStops.find((stop) => stop.at >= p - 0.00001)?.at ?? 1;
  return [...journeyStops].reverse().find((stop) => stop.at <= p + 0.00001)?.at ?? 0;
}

/** Native scrolling stays in control; rAF only coordinates the visible illustration. */
export function initMotion() {
  const section = document.querySelector<HTMLElement>(".journey-section")!;
  const stage = document.querySelector<HTMLElement>(".journey-stage")!;
  const world = document.querySelector<HTMLElement>(".journey-world")!;
  const bridge = document.querySelector<SVGGElement>(".journey-bridge")!;
  const bridgePivot = document.querySelector<SVGGElement>(".journey-bridge-pivot")!;
  const cat = document.querySelector<SVGGElement>(".journey-cat")!;
  const pose = cat.querySelector<SVGGElement>(".journey-cat-pose")!;
  const front = cat.querySelector<SVGGElement>(".cat-leg-front")!;
  const back = cat.querySelector<SVGGElement>(".cat-leg-back")!;
  const frontFar = cat.querySelector<SVGGElement>(".cat-leg-front-far")!;
  const backFar = cat.querySelector<SVGGElement>(".cat-leg-back-far")!;
  const torso = cat.querySelector<SVGGElement>(".cat-walk-torso")!;
  const shadow = document.querySelector<SVGEllipseElement>(".journey-cat-shadow")!;
  const pieces = [...document.querySelectorAll<SVGGElement>("[data-build]")]
    .map((el) => ({ el, values: el.dataset.build!.split(",").map(Number) }));
  const copies = [...document.querySelectorAll<HTMLElement>(".chapter-copy")];
  const chapterButtons = [...document.querySelectorAll<HTMLButtonElement>("[data-chapter]")];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (location.hash || location.search) history.replaceState(null, "", location.pathname);
  document.querySelectorAll<HTMLAnchorElement>("a[data-scroll]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const destination = link.dataset.scroll!;
      const target = document.getElementById(destination);
      if (!target) return;
      event.preventDefault();
      scrollTo({ top: destination === "home" ? 0 : scrollY + target.getBoundingClientRect().top - 24,
        behavior: reduceMotion.matches ? "instant" : "smooth" });
      if (destination === "main") target.focus({ preventScroll: true });
    });
  });
  const hero = document.querySelector<HTMLElement>(".hero-art")!;
  const portal = document.querySelector<HTMLElement>(".contact-portal")!;
  const ornaments = [...document.querySelectorAll<HTMLElement>(".project-card, .explore-item, .about-art, .contact-panel")];
  const entered = new Set<HTMLElement>();
  const percent = document.querySelector<HTMLElement>(".journey-percent")!;
  const summit = document.querySelector<HTMLAnchorElement>(".summit-link")!;
  const footer = document.querySelector<HTMLElement>(".footer")!;
  summit.hidden = false;
  let frame = 0;
  let activeChapter = -1;
  let catProgress: number | undefined;
  let previousProgress = 0;
  let facing = 1;
  let lastScrollTime = -1000;
  let previousTime = performance.now();

  function update(now: number) {
    frame = 0;
    const dt = Math.min(50, Math.max(1, now - previousTime));
    previousTime = now;
    const showSummit = scrollY > innerHeight * 0.7 && footer.getBoundingClientRect().top > innerHeight;
    summit.classList.toggle("is-visible", showSummit);
    summit.setAttribute("aria-hidden", String(!showSummit));
    summit.tabIndex = showSummit ? 0 : -1;
    const rect = section.getBoundingClientRect();
    const distance = Math.max(1, section.offsetHeight - innerHeight);
    const p = clamp(-rect.top / distance);
    const reduced = reduceMotion.matches;
    const visible = rect.top < innerHeight && rect.bottom > 0;
    document.body.classList.toggle("in-journey", rect.top <= 0 && rect.bottom >= innerHeight);
    if (Math.abs(p - previousProgress) > 0.00005) facing = p > previousProgress ? 1 : -1;
    previousProgress = p;
    if (visible || activeChapter === -1 || reduced) {
      const phase = p < 0.35 ? 0 : p < 0.70 ? 1 : 2;
      stage.style.setProperty("--dusk", String(range(p, 0.23, 0.51) * (1 - range(p, 0.68, 0.96))));
      const night = range(p, 0.67, 0.97);
      stage.style.setProperty("--night", String(night));
      stage.style.setProperty("--copy-night", night > 0.55 ? "1" : "0");
      stage.style.setProperty("--progress", String(p));
      stage.style.setProperty("--orb-x", `${(p - 0.5) * 50}px`);
      stage.style.setProperty("--orb-y", `${Math.sin(p * Math.PI) * -25}px`);
      percent.textContent = String(Math.round(p * 100)).padStart(2, "0");
      // The isometric architecture already supplies the perspective. Keep its horizon stable.
      world.style.transform = reduced ? "none" : `translate3d(0,${range(p, 0.65, 1) * -8}px,0)`;
      for (const { el, values: [start, end, x, y] } of pieces) {
        const t = reduced ? 1 : range(p, start, end);
        el.style.opacity = String(t);
        el.style.transform = `translate(${x * (1 - t)}px,${y * (1 - t)}px)`;
      }
      bridge.style.transform = `rotate(${-78 * (1 - (reduced ? 1 : range(p, 0.24, 0.40)))}deg)`;
      bridgePivot.style.opacity = String(reduced ? 1 : range(p, 0.16, 0.23));
      const scrolling = now - lastScrollTime < 110;
      const target = reduced ? 1 : scrolling ? p : restingProgress(p, facing);
      catProgress ??= target;
      if (reduced) catProgress = 1;
      else catProgress += (target - catProgress) * (1 - Math.exp(-dt / 65));
      if (Math.abs(target - catProgress) < 0.00003) catProgress = target;
      const at = sampleJourney(catProgress);
      const gait = sampleGait(at.t, at.moving, facing);
      cat.setAttribute("transform", `translate(${at.x} ${at.y - at.hop}) scale(1.05)`);
      pose.setAttribute("transform", `scale(${facing} 1)`);
      front.setAttribute("transform", `rotate(${gait.frontNear} 10 -16)`);
      back.setAttribute("transform", `rotate(${gait.backNear} -11 -15)`);
      frontFar.setAttribute("transform", `rotate(${gait.frontFar} 17 -17)`);
      backFar.setAttribute("transform", `rotate(${gait.backFar} -6 -17)`);
      torso.setAttribute("transform", `rotate(${at.moving ? Math.sin(at.t * Math.PI) * -1.2 : 0} 0 -14)`);
      shadow.setAttribute("transform", `translate(${at.x} ${at.y}) scale(${1 - at.hop * 0.025} 1)`);
      shadow.style.opacity = String(0.18 - at.hop * 0.012);
      const chapterTwo = range(p, 0.31, 0.39);
      const chapterThree = range(p, 0.66, 0.74);
      copies.forEach((copy, index) => {
        const opacity = reduced ? Number(index === phase) : index === 0 ? 1 - chapterTwo
          : index === 1 ? chapterTwo * (1 - chapterThree) : chapterThree;
        const offset = index === 0 ? -chapterTwo * 12
          : index === 1 ? (1 - chapterTwo - chapterThree) * 12 : (1 - chapterThree) * 12;
        copy.style.opacity = String(opacity);
        copy.style.transform = reduced ? "none" : `translateY(${offset}px)`;
        copy.setAttribute("aria-hidden", String(!reduced && index !== phase));
      });
      if (phase !== activeChapter) {
        chapterButtons.forEach((button, index) => {
          button.classList.toggle("active", phase === index);
          button.setAttribute("aria-pressed", String(phase === index));
        });
        activeChapter = phase;
      }
      if (!reduced && (scrolling || catProgress !== target)) requestUpdate();
    } else {
      // Resuming an off-screen scene should not replay the whole route.
      catProgress = p;
    }
    const heroRect = hero.getBoundingClientRect();
    if (!reduced && heroRect.bottom > 0) {
      const exit = clamp(-heroRect.top / innerHeight);
      hero.style.setProperty("--hero-turn", `${exit * 2}deg`);
      hero.style.setProperty("--hero-shift", `${exit * 18}px`);
    }
    for (const el of ornaments) {
      if (entered.has(el)) continue;
      const box = el.getBoundingClientRect();
      if (box.top > innerHeight || box.bottom < 0) continue;
      const enter = range(innerHeight - box.top, 0, Math.min(innerHeight * 0.45, box.height));
      el.style.setProperty("--enter", String(reduced ? 1 : enter));
      if (reduced || enter === 1) entered.add(el);
    }
    // The door opens when the door itself is visible, and can replay on return.
    const portalRect = portal.getBoundingClientRect();
    const portalVisible = Math.max(0, Math.min(portalRect.bottom, innerHeight) - Math.max(portalRect.top, 0));
    const portalRatio = portalVisible / Math.max(1, Math.min(portalRect.height, innerHeight));
    portal.style.setProperty("--door-open", String(reduced ? 1 : range(portalRatio, 0.12, 0.68)));
  }
  function requestUpdate() { if (!frame) frame = requestAnimationFrame(update); }
  addEventListener("scroll", () => { lastScrollTime = performance.now(); requestUpdate(); }, { passive: true });
  addEventListener("resize", requestUpdate);
  reduceMotion.addEventListener("change", () => {
    activeChapter = -1;
    catProgress = undefined;
    requestUpdate();
  });
  chapterButtons.forEach((button, index) => button.addEventListener("click", () => {
    const positions = [0.13, 0.54, 0.99];
    scrollTo({ top: scrollY + section.getBoundingClientRect().top + (section.offsetHeight - innerHeight) * positions[index],
      behavior: reduceMotion.matches ? "instant" : "smooth" });
  }));
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    hero.addEventListener("pointermove", (event) => {
      if (reduceMotion.matches) return;
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 5}deg`);
      hero.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height - 0.5) * -3}deg`);
    });
    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--pointer-x", "0deg");
      hero.style.setProperty("--pointer-y", "0deg");
    });
  }
  update(performance.now());
}
