import { translate } from "./i18n";
/** Small discoveries, with a single predictable feedback location on phones. */
export function initIslandInteractions(notify: (message: string) => void) {
  const scene = document.querySelector<HTMLElement>("#scene")!;
  const cat = document.querySelector<SVGGElement>("#scene-cat")!;
  const door = document.querySelector<SVGGElement>("#island-door")!;
  const doorButton = document.querySelector<HTMLButtonElement>("#door-button")!;
  const speech = document.querySelector<HTMLElement>("#cat-speech")!;
  const feedback = document.querySelector<HTMLElement>("#island-feedback")!;
  const themeButton = document.querySelector<HTMLButtonElement>("#theme-button")!;
  const caption = document.querySelector<HTMLElement>("#scene-caption")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = matchMedia("(max-width: 700px)");
  const greetings = [
    { pose: "wave", text: "喵，发现你了。" },
    { pose: "tilt", text: "你也在找有趣的东西吗？" },
    { pose: "stretch", text: "伸个懒腰，再逛一会儿。" },
  ] as const;
  let greetingIndex = 0;
  let greetingTimer: ReturnType<typeof setTimeout> | undefined;
  let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
  let nightTimer: ReturnType<typeof setTimeout> | undefined;

  function defaultFeedback() {
    return scene.classList.contains("night")
      ? "晚安，宇宙。好奇心还醒着。"
      : "点点小黑，或试试开门和昼夜。";
  }
  function showFeedback(message: string) {
    clearTimeout(feedbackTimer);
    feedback.textContent = translate(message);
    feedbackTimer = setTimeout(() => { feedback.textContent = translate(defaultFeedback()); }, 3000);
  }
  function clearGreeting() {
    delete cat.dataset.pose;
    scene.closest(".hero-art")!.classList.remove("is-greeting");
    speech.textContent = "";
  }
  function greet() {
    if (cat.dataset.pose) return; // Let the current gesture finish before a new one.
    const greeting = greetings[greetingIndex++ % greetings.length];
    cat.dataset.pose = greeting.pose;
    scene.closest(".hero-art")!.classList.add("is-greeting");
    speech.textContent = mobile.matches ? "" : translate(greeting.text);
    showFeedback(greeting.text);
    clearTimeout(greetingTimer);
    greetingTimer = setTimeout(clearGreeting, 2600);
  }
  function activateWithKeyboard(element: SVGElement, action: () => void) {
    element.addEventListener("click", action);
    element.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (!event.repeat) action();
    });
  }
  function toggleDoor() {
    const open = door.getAttribute("aria-pressed") !== "true";
    scene.classList.toggle("door-open", open);
    const label = translate(open ? "关上小岛的门" : "打开小岛的门");
    for (const control of [door, doorButton]) {
      control.setAttribute("aria-pressed", String(open));
      control.setAttribute("aria-label", label);
    }
    doorButton.title = label;
    const message = open ? "门里亮着灯，欢迎好奇的人。" : "轻轻关门，留住一点暖光。";
    showFeedback(message);
    if (!mobile.matches) notify(message);
  }
  function syncLayout() {
    door.setAttribute("tabindex", mobile.matches ? "-1" : "0");
    door.setAttribute("aria-hidden", String(mobile.matches));
    speech.textContent = "";
    clearTimeout(feedbackTimer);
    feedback.textContent = translate(defaultFeedback());
  }
  activateWithKeyboard(cat, greet);
  document.querySelector<HTMLButtonElement>("#cat-button")!.addEventListener("click", greet);
  activateWithKeyboard(door, () => { if (!mobile.matches) toggleDoor(); });
  doorButton.addEventListener("click", toggleDoor);
  mobile.addEventListener("change", syncLayout);
  syncLayout();

  themeButton.addEventListener("click", () => {
    const night = scene.classList.toggle("night");
    themeButton.setAttribute("aria-pressed", String(night));
    const label = translate(night ? "切换到小岛日景" : "切换到小岛夜景");
    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
    caption.textContent = translate(night ? "晚安，宇宙。好奇心还醒着。" : "在不可能的地方，发现可能。");
    speech.textContent = "";
    showFeedback(caption.textContent!);
    clearTimeout(nightTimer);
    scene.classList.remove("cat-stargazing");
    if (night) nightTimer = setTimeout(() => scene.classList.add("cat-stargazing"), reduced.matches ? 0 : 850);
  });
}
