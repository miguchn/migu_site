/** Reveal each off-screen content group once, leaving initial content readable. */
export function initChapterReveal() {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
  const elements = [...document.querySelectorAll<HTMLElement>(
    ".section-heading, .project-card, .explore-item, .about-art, .about-copy, .closing-top, .closing-nav, .closing-meta",
  )];
  const pending = new Set<HTMLElement>();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      reveal(entry.target as HTMLElement);
    }
  }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

  function reveal(element: HTMLElement) {
    element.classList.add("chapter-visible");
    pending.delete(element);
    observer.unobserve(element);
  }

  for (const [index, element] of elements.entries()) {
    // Do not conceal visible content, including restored deep-link destinations.
    if (element.getBoundingClientRect().top < innerHeight) continue;
    element.classList.add("chapter-reveal");
    element.style.setProperty("--reveal-delay", `${element.matches(".project-card, .explore-item") ? (index % 3) * 65 : 0}ms`);
    pending.add(element);
    observer.observe(element);
    // Keyboard users must never land on an invisible control during its delay.
    element.addEventListener("focusin", () => reveal(element), { once: true });
  }

  reducedMotion.addEventListener("change", () => {
    if (!reducedMotion.matches) return;
    for (const element of pending) reveal(element);
    observer.disconnect();
  });
  addEventListener("pageshow", () => {
    for (const element of pending) {
      const rect = element.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) reveal(element);
    }
  });
}
