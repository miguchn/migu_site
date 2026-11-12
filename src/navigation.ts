const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Keep navigation continuous around the full-screen journey. */
export function initNavigation() {
  const header = document.querySelector<HTMLElement>(".header");
  const journey = document.getElementById("journey");
  const contact = document.getElementById("contact");
  if (!header || !journey || !contact) return;

  const brand = header.querySelector<HTMLElement>(".brand");
  const links = [...header.querySelectorAll<HTMLAnchorElement>("a[data-scroll]")];
  const sections = ["projects", "explore", "about", "contact"]
    .map(id => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(min-width: 701px)");
  let frame = 0;

  function update() {
    frame = 0;
    const height = header!.offsetHeight;
    const rect = journey!.getBoundingClientRect();
    // Mouse clicks leave focus on language/navigation controls. Only keyboard
    // focus should hold the bar open while entering the immersive scene.
    const focused = Boolean(header!.querySelector(':focus-visible'));
    const entry = clamp((rect.top - height) / 140);
    const exit = clamp((height + 220 - rect.bottom) / 220);
    const visibility = focused || reducedMotion.matches || !desktop.matches
      ? 1
      : Math.max(entry, exit);
    const immersive = visibility < 0.05;
    const closing = contact!.getBoundingClientRect().top <= height + 1;

    header!.style.setProperty("--nav-visibility", String(visibility));
    header!.classList.toggle("is-immersive", immersive);
    header!.classList.toggle("is-closing", closing);
    header!.classList.toggle("has-brand-focus", Boolean(brand?.contains(document.activeElement)));
    header!.inert = immersive;
    if (brand) brand.inert = closing && !brand.contains(document.activeElement);

    const current = sections.filter(section => section.getBoundingClientRect().top <= height + 80).at(-1)?.id;
    for (const link of links) {
      if (!immersive && current === link.dataset.scroll) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }

  function requestUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate);
  addEventListener("pageshow", requestUpdate);
  header.addEventListener("focusin", requestUpdate);
  header.addEventListener("focusout", requestUpdate);
  reducedMotion.addEventListener("change", requestUpdate);
  desktop.addEventListener("change", requestUpdate);
  update();
}
