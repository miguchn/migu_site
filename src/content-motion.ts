/** Reversible viewport reveals; the HTML stays readable without this enhancement. */
export function initContentMotion() {
  if (!("IntersectionObserver" in window)) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const elements = [...document.querySelectorAll<HTMLElement>(
    ".section-heading, .explore-item, .project-card, .about-copy, .contact-panel",
  )];
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      // Keyboard focus must never disappear when its card crosses the viewport edge.
      entry.target.classList.toggle("revealed", entry.isIntersecting || entry.target.contains(document.activeElement));
    }
  }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
  function sync() {
    observer.disconnect();
    for (const element of elements) {
      if (reduced.matches) {
        element.classList.remove("reveal", "revealed");
      } else {
        // Show the current viewport immediately before enabling animation.
        const rect = element.getBoundingClientRect();
        element.classList.toggle("revealed", rect.bottom > 0 && rect.top < innerHeight);
        element.classList.add("reveal");
        observer.observe(element);
      }
    }
  }
  document.addEventListener("focusin", (event) => {
    if (event.target instanceof Element) event.target.closest(".reveal")?.classList.add("revealed");
  });
  reduced.addEventListener("change", sync);
  sync();
}
