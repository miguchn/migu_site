const clamp = (value: number, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));
const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const range = (value: number, start: number, end: number) =>
  smooth((value - start) / (end - start));

/** Native scrolling stays in control. One animation frame updates the visible layers. */
export function initMotion() {
  const section = document.querySelector<HTMLElement>(".journey-section")!;
  const stage = document.querySelector<HTMLElement>(".journey-stage")!;
  const world = document.querySelector<HTMLElement>(".journey-world")!;
  const bridge = document.querySelector<SVGGElement>(".journey-bridge")!;
  const cat = document.querySelector<SVGGElement>(".journey-cat")!;
  const pieces = [
    ...document.querySelectorAll<SVGGElement>("[data-build]"),
  ].map((el) => ({ el, values: el.dataset.build!.split(",").map(Number) }));
  const copies = [...document.querySelectorAll<HTMLElement>(".chapter-copy")];
  const chapterButtons = [
    ...document.querySelectorAll<HTMLButtonElement>("[data-chapter]"),
  ];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  // Preserve one clean public URL while navigating between sections.
  if (location.hash || location.search)
    history.replaceState(null, "", location.pathname);
  document
    .querySelectorAll<HTMLAnchorElement>("a[data-scroll]")
    .forEach((link) => {
      link.addEventListener("click", (event) => {
        const destination = link.dataset.scroll!;
        const target = document.getElementById(destination);
        if (!target) return;
        event.preventDefault();
        scrollTo({
          top: scrollY + target.getBoundingClientRect().top - 24,
          behavior: reduceMotion.matches ? "instant" : "smooth",
        });
        if (destination === "main") target.focus({ preventScroll: true });
      });
    });
  const hero = document.querySelector<HTMLElement>(".hero-art")!;
  const ornaments = [
    ...document.querySelectorAll<HTMLElement>(
      ".project-card, .explore-item, .about-art, .contact-panel",
    ),
  ];
  const percent = document.querySelector<HTMLElement>(".journey-percent")!;
  let frame = 0;
  let activeChapter = -1;

  function update() {
    frame = 0;
    const rect = section.getBoundingClientRect();
    const distance = Math.max(1, section.offsetHeight - innerHeight);
    const p = clamp(-rect.top / distance);
    const reduced = reduceMotion.matches;
    const visible = rect.top < innerHeight && rect.bottom > 0;
    if (visible || activeChapter === -1 || reduced) {
      const phase = p < 0.35 ? 0 : p < 0.69 ? 1 : 2;
      const dusk = range(p, 0.2, 0.5) * (1 - range(p, 0.66, 0.95));
      const night = range(p, 0.63, 0.95);
      stage.style.setProperty("--dusk", String(dusk));
      stage.style.setProperty("--night", String(night));
      stage.style.setProperty("--progress", String(p));
      stage.style.setProperty("--orb-x", `${(p - 0.5) * 130}px`);
      stage.style.setProperty("--orb-y", `${Math.sin(p * Math.PI) * -70}px`);
      percent.textContent = String(Math.round(p * 100)).padStart(2, "0");
      world.style.transform = reduced
        ? "none"
        : `translate3d(${Math.sin(p * Math.PI * 2) * -18}px,${Math.sin(p * Math.PI) * -12}px,0) rotateY(${-15 + Math.sin(p * Math.PI) * 28}deg) rotateZ(${-5 + Math.sin(p * Math.PI) * 8}deg) scale(${0.9 + range(p, 0, 0.5) * 0.12})`;
      for (const {
        el,
        values: [start, end, x, y],
      } of pieces) {
        const t = reduced ? 1 : range(p, start, end);
        el.style.opacity = String(0.12 + t * 0.88);
        el.style.transform = `translate(${x * (1 - t)}px,${y * (1 - t)}px)`;
      }
      const rotation = reduced ? 1 : range(p, 0.29, 0.6);
      bridge.style.transform = `rotate(${-88 * (1 - rotation)}deg)`;
      bridge.style.opacity = String(0.2 + 0.8 * range(p, 0.2, 0.38));
      const points = [
        [174, 513],
        [330, 397],
        [412, 373],
        [640, 260],
        [747, 225],
      ];
      const route = clamp(p / 0.86) * (points.length - 1);
      const i = Math.min(Math.floor(route), points.length - 2);
      const t = route - i;
      const x = points[i][0] + (points[i + 1][0] - points[i][0]) * t;
      const y = points[i][1] + (points[i + 1][1] - points[i][1]) * t;
      cat.setAttribute(
        "transform",
        reduced
          ? "translate(747 225) scale(1.25)"
          : `translate(${x} ${y - Math.abs(Math.sin(p * 100)) * 4}) scale(1.25)`,
      );
      copies.forEach((copy, index) => {
        let opacity =
          index === 0
            ? 1 - range(p, 0.25, 0.35)
            : index === 1
              ? range(p, 0.29, 0.39) * (1 - range(p, 0.61, 0.71))
              : range(p, 0.65, 0.75);
        if (reduced) opacity = 1;
        copy.style.opacity = String(opacity);
        copy.style.transform = reduced
          ? "none"
          : `translateY(${(1 - opacity) * (index > phase ? 30 : -25)}px)`;
        copy.setAttribute("aria-hidden", String(!reduced && index !== phase));
      });
      if (phase !== activeChapter) {
        chapterButtons.forEach((button, index) => {
          button.classList.toggle("active", phase === index);
          button.setAttribute("aria-pressed", String(phase === index));
        });
        activeChapter = phase;
      }
    }
    const heroRect = hero.getBoundingClientRect();
    if (!reduced && heroRect.bottom > 0) {
      const exit = clamp(-heroRect.top / innerHeight);
      hero.style.setProperty("--hero-turn", `${exit * 14}deg`);
      hero.style.setProperty("--hero-shift", `${exit * 65}px`);
    }
    for (const el of ornaments) {
      const box = el.getBoundingClientRect();
      if (box.top > innerHeight + 100 || box.bottom < -100) continue;
      const enter = range(
        innerHeight - box.top,
        0,
        Math.min(innerHeight * 0.65, box.height),
      );
      el.style.setProperty("--enter", String(reduced ? 1 : enter));
    }
  }
  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate);
  reduceMotion.addEventListener("change", () => {
    activeChapter = -1;
    requestUpdate();
  });
  chapterButtons.forEach((button, index) =>
    button.addEventListener("click", () => {
      const positions = [0.13, 0.5, 0.98];
      const y =
        scrollY +
        section.getBoundingClientRect().top +
        (section.offsetHeight - innerHeight) * positions[index];
      scrollTo({
        top: y,
        behavior: reduceMotion.matches ? "instant" : "smooth",
      });
    }),
  );
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    hero.addEventListener("pointermove", (event) => {
      if (reduceMotion.matches) return;
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty(
        "--pointer-x",
        `${((event.clientX - rect.left) / rect.width - 0.5) * 12}deg`,
      );
      hero.style.setProperty(
        "--pointer-y",
        `${((event.clientY - rect.top) / rect.height - 0.5) * -8}deg`,
      );
    });
    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--pointer-x", "0deg");
      hero.style.setProperty("--pointer-y", "0deg");
    });
  }
  update();
}
