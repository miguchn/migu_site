const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const animations = new Map<HTMLElement, Animation>();
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) for (const animation of animations.values()) animation.cancel();
});

/** Announce new text immediately, with a brief emphasis on the changed value. */
export function updateFeedback(element: HTMLElement, text: string) {
  if (element.textContent === text) return;
  const previous = animations.get(element);
  const start = previous ? Number(getComputedStyle(element).opacity) : .75;
  previous?.cancel();
  element.textContent = text;
  if (reducedMotion.matches || !element.getClientRects().length) return;

  const tokens = getComputedStyle(document.documentElement);
  const animation = element.animate([{ opacity: start }, { opacity: 1 }], {
    duration: parseFloat(tokens.getPropertyValue("--motion-fast")),
    easing: tokens.getPropertyValue("--motion-ease").trim(),
  });
  animations.set(element, animation);
  animation.onfinish = animation.oncancel = () => {
    if (animations.get(element) === animation) animations.delete(element);
  };
}
