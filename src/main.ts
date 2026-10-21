import "./style.css";
import "./personality.css";
import { island, miniScene, cat } from "./scene";
import { catPortrait } from "./cat";
import { journeySection } from "./journey";
import { initMotion } from "./motion";

const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const external =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const github =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.61-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82c.85 0 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.58 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>';
const projects = [
  {
    name: "ChatLine",
    en: "A LITTLE ORDER IN THE CONVERSATION",
    description: "给 AI 对话一条时间线。让灵感、提问与回答，都有迹可循。",
    tag: "浏览器扩展",
    url: "https://github.com/miguchn/ai-chatline",
    art: "portal",
    color: "rose",
  },
  {
    name: "AI Code Review",
    en: "ANOTHER PAIR OF EYES FOR YOUR CODE",
    description: "让 AI 成为代码的另一双眼睛，把注意力留给更值得思考的事。",
    tag: "AI · 开源工具",
    url: "https://github.com/miguchn/ai-code-review",
    art: "steps",
    color: "sage",
  },
  {
    name: "Migu Skills",
    en: "SMALL SKILLS, NEW POSSIBILITIES",
    description:
      "把探索中有用的方法，变成可复用的 AI 技能。少一点重复，多一点创造。",
    tag: "Agent · 技能集",
    url: "https://github.com/miguchn/migu_skill",
    art: "orb",
    color: "sand",
  },
] as const;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <header class="header wrap">
    <a class="brand" href="/" data-scroll="home" aria-label="咪咕看见小黑，回到首页"><svg class="brand-cat" viewBox="-36 -45 72 62" aria-hidden="true">${cat}</svg><span>咪咕看见小黑<span class="brand-sub">A CURIOUS LITTLE CORNER</span></span></a>
    <nav class="desktop-nav" aria-label="主导航"><a href="/" data-scroll="explore">探索小岛</a><a href="/" data-scroll="projects">折腾的作品</a><a href="/" data-scroll="about">关于我</a></nav>
    <a class="nav-contact" href="/" data-scroll="contact">打个招呼 <span>↗</span></a>
    <button class="menu-toggle" aria-label="打开导航菜单" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button>
    <nav id="mobile-nav" class="mobile-nav" aria-label="移动端导航" hidden><a href="/" data-scroll="explore">探索小岛</a><a href="/" data-scroll="projects">折腾的作品</a><a href="/" data-scroll="about">关于我</a><a href="/" data-scroll="contact">打个招呼 ↗</a></nav>
  </header>
  <main id="main" tabindex="-1">
    <section class="hero wrap" id="home" aria-labelledby="hero-title">
      <div class="hero-copy">
        <div class="eyebrow"><span class="live-dot"></span> HELLO, FELLOW EXPLORER <span class="eyebrow-line"></span></div>
        <h1 id="hero-title">好奇心，<br/>没有<span class="title-mark">边界<svg viewBox="0 0 220 15" aria-hidden="true"><path d="M3 11Q110-3 216 6" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg></span>。</h1>
        <p class="hero-english">A curious mind. A different path.</p>
        <p class="hero-description">写代码、玩 AI，也把奇思妙想搭成“世界”。<br/>这里没有标准路线，<br class="desktop-break"/>跟着好奇心，往前走就好。</p>
        <div class="hero-actions"><a class="button button-dark" href="/" data-scroll="journey">准备好了吗 ${arrow}</a><a class="text-link" href="/" data-scroll="projects">看看作品 <span>↗</span></a></div>
        <div class="hero-note"><span class="tiny-spark">✳</span> 探索 AI 科技，分享无限乐趣</div>
      </div>
      <div class="hero-art">
        <span class="art-coordinates">IMAGINATION IS A PLACE.</span>
        <div class="scene" id="scene">${island()}</div>
        <div class="scene-label"><span class="label-dot"></span><span id="scene-caption">在不可能的地方，发现可能。</span></div>
        <div class="scene-controls" role="group" aria-label="小岛互动"><button id="cat-button" aria-label="和小黑打招呼" title="和小黑打招呼"><svg viewBox="-36 -45 72 62" aria-hidden="true">${cat}</svg></button><span></span><button id="theme-button" aria-label="切换到小岛夜景" aria-pressed="false" title="切换小岛昼夜"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button></div>
        <span class="art-caption">方向不必一样，好奇心可以同路。<span>试试右下角的小机关 ↗</span></span>
      </div>
    </section>
    <div class="below-hero wrap"><a href="/" data-scroll="journey"><span class="scroll-indicator">↓</span> 向下滑动，进入小黑的奇想世界</a><span>CODE · CREATE · WANDER</span></div>
    ${journeySection()}
    <section class="explore-section section wrap" id="explore" aria-labelledby="explore-title">
      <div class="section-heading"><div><p class="eyebrow section-number">01 / THE EXPLORATION</p><h2 id="explore-title">保持好奇，持续发生。</h2></div><p class="section-intro">世界很大，值得折腾的事情很多。<br/>这里是我的三个小小坐标。</p></div>
      <div class="explore-grid">
        <article class="explore-item"><span class="topic-icon">✳</span><span class="topic-number">01</span><h3>探索 AI 的可能</h3><p>走近新工具，也追问它能解决什么。<br/>从一次对话，到一个真正有用的应用。</p><span class="topic-label">AI EXPLORATION</span></article>
        <article class="explore-item"><span class="topic-icon icon-code">⌘</span><span class="topic-number">02</span><h3>把想法变成作品</h3><p>灵感不只留在备忘录。<br/>用代码搭起来，用起来，再慢慢打磨。</p><span class="topic-label">BUILD IN THE OPEN</span></article>
        <article class="explore-item"><span class="topic-icon icon-wander">↗</span><span class="topic-number">03</span><h3>分享路上的发现</h3><p>记录踩过的坑，也收藏偶然的惊喜。<br/>让一个人的探索，成为彼此的启发。</p><span class="topic-label">LEARN & SHARE</span></article>
      </div>
    </section>
    <section class="project-section section" id="projects" aria-labelledby="projects-title"><div class="wrap">
      <div class="section-heading"><div><p class="eyebrow section-number">02 / THINGS I'VE BUILT</p><h2 id="projects-title">一些落地的，小小想法。</h2></div><a class="text-link" href="https://github.com/miguchn" target="_blank" rel="noopener noreferrer">去 GitHub 串个门 ${external}</a></div>
      <div class="project-grid">${projects.map((p, i) => `<a class="project-card" href="${p.url}" target="_blank" rel="noopener noreferrer"><div class="project-art ${p.color}"><span class="project-index">EXPERIMENT / 0${i + 1}</span>${miniScene(p.art)}<span class="project-open">${external}</span></div><div class="project-details"><span class="project-tag">${p.tag}</span><h3>${p.name} ${external}</h3><p>${p.description}</p><span class="project-micro">${p.en}</span></div></a>`).join("")}</div>
    </div></section>
    <section class="about-section section wrap" id="about" aria-labelledby="about-title">
      <div class="about-art"><span class="about-orbit orbit-one"></span><span class="about-orbit orbit-two"></span><div class="cat-portrait"><svg viewBox="-65 -85 130 120" aria-hidden="true">${catPortrait}</svg><span>小黑 / THE CURIOUS ONE</span></div><span class="orbit-note note-one">好奇心常驻 ✳</span><span class="orbit-note note-two">灵感偶尔出没 ↗</span><span class="about-art-caption">A CURIOUS MIND IN A LITTLE BLACK CAT.</span></div>
      <div class="about-copy"><p class="eyebrow section-number">03 / THE HUMAN BEHIND</p><h2 id="about-title">认真探索，<br/>也认真好玩。</h2><p>我是小黑。这里是我在互联网搭起的一座小岛，收留那些关于 AI、代码和创造的奇思妙想。</p><p>我喜欢把复杂的东西拆开，看看里面的齿轮；也喜欢把零散的灵感拼起来，做出一点新东西。</p><p>不一定知道下一站在哪，但总想去看看。</p><div class="about-tags"><span>AI 探索者</span><span>独立创造</span><span>终身好奇</span></div></div>
    </section>
    <section class="contact-section wrap" id="contact" aria-labelledby="contact-title"><div class="contact-panel"><div class="contact-portal" aria-hidden="true"><div class="portal-sky"><span>✦</span><i>✧</i></div><div class="portal-door door-left"></div><div class="portal-door door-right"></div><span class="portal-step step-one"></span><span class="portal-step step-two"></span><span class="portal-step step-three"></span></div><p class="eyebrow">LET’S OPEN ANOTHER DOOR</p><h2 id="contact-title">有个有趣的想法？<br/>一起让它发生。</h2><p>聊 AI、聊创造，或者，只是打个招呼。<br/>内容交流与商务合作，欢迎来信。</p><div class="contact-actions"><a class="email-link" href="mailto:miguchn@gmail.com">miguchn@gmail.com ${external}</a><button id="copy-email" class="copy-email" aria-label="复制商务合作邮箱" title="复制邮箱"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="1.5"/></svg></button></div><div class="contact-socials"><a href="https://github.com/miguchn" target="_blank" rel="noopener noreferrer">${github} GitHub ${external}</a><a href="https://x.com/miguchn" target="_blank" rel="noopener noreferrer"><span class="x-icon">𝕏</span> X / Twitter ${external}</a></div></div></section>
  </main>
  <footer class="footer wrap"><a class="footer-brand" href="/" data-scroll="home">咪咕看见小黑<span>保持好奇，下次见。</span></a><span>© ${new Date().getFullYear()} MIGU · MADE WITH CURIOSITY</span><a class="back-top" href="/" data-scroll="home" aria-label="回到顶部">回到岛顶 ↑</a></footer>
  <div class="toast" role="status" aria-live="polite"></div>
`;

const toast = document.querySelector<HTMLDivElement>(".toast")!;
let toastTimer: ReturnType<typeof setTimeout>;
function notify(message: string) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3000);
}
const scene = document.querySelector<HTMLDivElement>("#scene")!;
const themeButton = document.querySelector<HTMLButtonElement>("#theme-button")!;
themeButton.addEventListener("click", () => {
  const night = scene.classList.toggle("night");
  themeButton.setAttribute("aria-pressed", String(night));
  themeButton.setAttribute(
    "aria-label",
    night ? "切换到小岛日景" : "切换到小岛夜景",
  );
  document.querySelector("#scene-caption")!.textContent = night
    ? "晚安，宇宙。好奇心还醒着。"
    : "在不可能的地方，发现可能。";
});
let catTimer: ReturnType<typeof setTimeout>;
document.querySelector("#cat-button")!.addEventListener("click", () => {
  const sceneCat = document.querySelector("#scene-cat")!;
  sceneCat.classList.add("greeting");
  clearTimeout(catTimer);
  catTimer = setTimeout(() => sceneCat.classList.remove("greeting"), 1600);
  notify("喵～欢迎来到小黑的奇想世界。");
});
document.querySelector("#copy-email")!.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("miguchn@gmail.com");
    notify("邮箱已复制，期待你的来信。");
  } catch {
    notify("请手动复制邮箱：miguchn@gmail.com");
  }
});
const menuButton = document.querySelector<HTMLButtonElement>(".menu-toggle")!;
const mobileNav = document.querySelector<HTMLElement>("#mobile-nav")!;
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "打开导航菜单");
}
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(expanded));
  menuButton.setAttribute(
    "aria-label",
    expanded ? "关闭导航菜单" : "打开导航菜单",
  );
  mobileNav.hidden = !expanded;
});
mobileNav
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (e) => {
  if (!(e.target as Element).closest(".header")) closeMenu();
});
window.matchMedia("(min-width: 701px)").addEventListener("change", (e) => {
  if (e.matches) closeMenu();
});

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(
      ".section-heading, .explore-item, .project-card, .about-copy, .contact-panel",
    )
    .forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
}

initMotion();
