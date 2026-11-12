import { island, miniScene, cat } from "./scene";
import { catPortrait } from "./cat";
import { journeySection } from "./journey";
import { brandIntroMarkup } from "./brand-intro";

const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const external =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const xLogo = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-7.4L5.6 22H2.4l7.3-8.4L1.8 2h6.4l4.5 6.8L18.9 2Zm-1.1 18h1.7L7.2 3.9H5.4L17.8 20Z"/></svg>';
const backTopIcon = '<svg viewBox="0 0 40 44" fill="none" aria-hidden="true"><path d="M8 36h24v-5H13v-5h14v-5H18v-5h5M20 23V4m-5 5 5-5 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const github =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.61-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82c.85 0 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.58 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>';
const projects = [
  {
    name: "ChatLine",
    en: "A LITTLE ORDER IN THE CONVERSATION",
    description: "给 AI 长对话加一条时间线，方便快速定位和回看关键内容。",
    tag: "浏览器扩展",
    url: "https://github.com/miguchn/ai-chatline",
    art: "portal",
    color: "rose",
  },
  {
    name: "AI Code Review",
    en: "ANOTHER PAIR OF EYES FOR YOUR CODE",
    description: "使用 AI 检查代码改动，帮助发现潜在问题并生成审查建议。",
    tag: "AI · 开源工具",
    url: "https://github.com/miguchn/ai-code-review",
    art: "steps",
    color: "sage",
  },
  {
    name: "Migu Skills",
    en: "SMALL SKILLS, NEW POSSIBILITIES",
    description:
      "整理和维护可复用的 AI 技能，减少重复操作，提高开发效率。",
    tag: "Agent · 技能集",
    url: "https://github.com/miguchn/migu_skill",
    art: "orb",
    color: "sand",
  },
] as const;
const topicIcon = (path: string) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function renderPage() {
  return `
  ${brandIntroMarkup()}
  <header class="header wrap">
    <a class="brand" href="#home" data-scroll="home" aria-label="咪咕看见小黑，回到首页"><img class="brand-mark" src="/logo.svg" width="48" height="48" alt="" /><span>咪咕看见小黑<span class="brand-sub">A CURIOUS LITTLE CORNER</span></span></a>
    <nav class="desktop-nav" aria-label="主导航"><a href="#projects" data-scroll="projects">我的作品</a><a href="#explore" data-scroll="explore">探索方向</a><a href="#about" data-scroll="about">关于我</a></nav>
    <div class="language-switch" role="group" aria-label="Language / 语言"><button type="button" data-locale="zh" lang="zh-CN" aria-label="切换到中文" aria-pressed="true">中文</button><span aria-hidden="true">/</span><button type="button" data-locale="en" lang="en" aria-label="Switch to English" aria-pressed="false">EN</button></div>
    <a class="nav-contact" href="#contact" data-scroll="contact">打个招呼</a>
    <button class="menu-toggle" aria-label="打开导航菜单" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button>
    <nav id="mobile-nav" class="mobile-nav" aria-label="移动端导航" hidden><a href="#projects" data-scroll="projects">我的作品</a><a href="#explore" data-scroll="explore">探索方向</a><a href="#about" data-scroll="about">关于我</a><a href="#contact" data-scroll="contact">打个招呼</a></nav>
  </header>
  <main id="main" tabindex="-1">
    <section class="hero wrap" id="home" aria-labelledby="hero-title">
      <div class="hero-copy">
        <div class="eyebrow"><span class="live-dot"></span> HELLO, FELLOW EXPLORER <span class="eyebrow-line"></span></div>
        <h1 id="hero-title"><span class="hero-title-line">好奇心，</span><span class="hero-title-line">没有<span class="title-mark">边界<svg viewBox="0 0 220 15" aria-hidden="true"><path d="M3 11Q110-3 216 6" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg></span>。</span></h1>
        <p class="hero-english">探索 AI 科技，分享 AI 乐趣。</p>
        <p class="hero-description">我是小黑，一名喜欢探索 AI 的个人开发者。<br/>这里展示我的项目，也分享一些开发中的发现。</p>
        <div class="hero-actions"><a class="button button-dark" href="#journey" data-scroll="journey">开始漫游 ${arrow}</a><a class="text-link" href="#projects" data-scroll="projects">看看作品</a></div>
      </div>
      <div class="hero-art">
        <div class="scene" id="scene">${island()}</div>
        <span id="scene-caption" class="sr-only">在不可能的地方，发现可能。</span>
        <div class="scene-controls" role="group" aria-label="小岛互动"><button id="cat-button" aria-label="和小黑打招呼" title="和小黑打招呼"><svg viewBox="-34 -68 68 72" aria-hidden="true">${cat}</svg></button><span></span><button id="door-button" class="door-control" aria-label="打开小岛的门" aria-pressed="false" aria-controls="island-door-art" title="打开小岛的门"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 21V10a7 7 0 0 1 14 0v11H5Z" stroke="currentColor" stroke-width="1.4"/><path d="M9 20V9l7-2v13M12.5 13v1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button><button id="theme-button" aria-label="切换到小岛夜景" aria-pressed="false" title="切换小岛昼夜"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button></div>
        <p id="island-feedback" class="island-feedback" role="status" aria-live="polite" aria-atomic="true">点点小黑，或试试开门和昼夜。</p>
        <span class="art-caption" aria-hidden="true">EXPLORE · BUILD · SHARE</span>
      </div>
    </section>
    <div class="below-hero wrap"><a href="#journey" data-scroll="journey"><span class="scroll-indicator" aria-hidden="true">↓</span><span>继续向下浏览</span></a><span aria-hidden="true">CODE · CREATE · WANDER</span></div>
    ${journeySection()}
    <section class="project-section section" id="projects" aria-labelledby="projects-title"><div class="wrap">
      <div class="section-heading"><div><p class="eyebrow section-number">01 / THINGS I'VE BUILT</p><h2 id="projects-title">把想法，做成作品。</h2></div><a class="text-link" href="https://github.com/miguchn" target="_blank" rel="noopener noreferrer">去 GitHub 串个门 ${external}</a></div>
      <div class="project-grid">${projects.map((p, i) => `<a class="project-card" href="${p.url}" target="_blank" rel="noopener noreferrer"><div class="project-art ${p.color}"><span class="project-index" aria-hidden="true">PROJECT / 0${i + 1}</span>${miniScene(p.art)}</div><div class="project-details"><span class="project-tag">${p.tag}</span><h3>${p.name} ${external}</h3><p>${p.description}</p><span class="project-micro">查看开源项目</span></div></a>`).join("")}</div>
    </div></section>
    <section class="explore-section section wrap" id="explore" aria-labelledby="explore-title">
      <div class="section-heading"><div><p class="eyebrow section-number">02 / THE EXPLORATION</p><h2 id="explore-title">保持好奇，让想法发生。</h2></div><p class="section-intro">世界很大，值得探索的事情很多。<br/>我从三个方向出发：探索 AI、动手创造、分享发现。</p></div>
      <div class="explore-grid">
        <article class="explore-item"><span class="topic-icon">${topicIcon('M12 2v20M2 12h20M5 5l14 14M5 19 19 5')}</span><span class="topic-number">01</span><h3>探索 AI 的可能</h3><p>走近新工具，也追问它能解决什么。<br/>从一次对话，到一个真正有用的应用。</p><span class="topic-label">AI EXPLORATION</span></article>
        <article class="explore-item"><span class="topic-icon">${topicIcon('m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18')}</span><span class="topic-number">02</span><h3>把想法变成作品</h3><p>灵感不只留在备忘录。<br/>用代码搭起来，用起来，再慢慢打磨。</p><span class="topic-label">BUILD IN THE OPEN</span></article>
        <article class="explore-item"><span class="topic-icon">${topicIcon('m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z')}</span><span class="topic-number">03</span><h3>分享路上的发现</h3><p>记录踩过的坑，也收藏偶然的惊喜。<br/>让一个人的探索，成为彼此的启发。</p><span class="topic-label">LEARN & SHARE</span></article>
      </div>
    </section>
    <div class="about-band">
    <section class="about-section section wrap" id="about" aria-labelledby="about-title">
      <div class="about-art"><span class="about-orbit orbit-one"></span><span class="about-orbit orbit-two"></span><div class="cat-portrait"><svg viewBox="-65 -85 130 120" aria-hidden="true">${catPortrait}</svg><span>小黑 / XIAOHEI</span></div><span class="orbit-note note-one">好奇心常驻 ✳</span><span class="orbit-note note-two">灵感偶尔出没</span><span class="about-art-caption">PERSONAL DEVELOPER · AI ENTHUSIAST</span></div>
      <div class="about-copy"><p class="eyebrow section-number">03 / THE HUMAN BEHIND</p><h2 id="about-title">认真探索，<br/>也认真好玩。</h2><p>平时喜欢研究新的 AI 产品和开发工具，遇到感兴趣的想法，就动手做出来试试。</p><p>我喜欢把复杂的东西拆开，看看里面的齿轮；也喜欢把零散的灵感拼起来，做出一点新东西。</p><div class="about-tags"><span>AI 探索者</span><span>独立创造</span><span>终身好奇</span></div><div class="wechat-card"><img src="/wechat-avatar.jpg" width="72" height="72" loading="lazy" decoding="async" alt="别动生产库公众号头像"><div class="wechat-info"><span class="wechat-label">我的微信公众号</span><h3>别动生产库</h3><p>欢迎在微信里搜索关注。</p></div><button id="copy-wechat" class="wechat-copy" type="button" aria-label="复制公众号名称">复制名称</button><span class="wechat-status" role="status" aria-live="polite"></span></div></div>
    </section>
    </div>
  </main>
  <footer class="contact-band footer" aria-labelledby="contact-title"><div class="contact-section wrap" id="contact">
    <div class="closing-top"><div><p class="closing-kicker">GET IN TOUCH</p><h2 id="contact-title"><a class="closing-brand" href="#home" data-scroll="home"><img src="/logo.svg" width="56" height="56" alt="">咪咕看见小黑</a></h2><p class="closing-description">探索 AI 科技，分享 AI 乐趣。</p><p class="closing-invitation">创意交流、项目合作、开发需求或工作机会，欢迎联系。</p></div><div class="closing-email"><p>交流 · 项目 · 合作</p><a href="mailto:miguchn@gmail.com">miguchn@gmail.com</a><button id="copy-email" class="copy-email" type="button" aria-label="复制商务合作邮箱" title="复制邮箱"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="1.5"/></svg></button></div></div>
    <nav class="closing-nav" aria-label="页脚导航"><a href="#projects" data-scroll="projects">我的作品</a><a href="#explore" data-scroll="explore">探索方向</a><a href="#about" data-scroll="about">关于我</a><a href="https://github.com/miguchn" target="_blank" rel="noopener noreferrer">${github} GitHub</a><a href="https://x.com/miguchn" target="_blank" rel="noopener noreferrer">${xLogo} X / Twitter</a></nav>
    <div class="closing-meta"><span>© ${new Date().getFullYear()} MIGU · MADE WITH CURIOSITY</span><a href="#home" data-scroll="home">回到顶部 ${backTopIcon}</a></div><div class="closing-art"><img class="closing-mark" src="/logo.svg" width="1100" height="1100" alt="" aria-hidden="true"></div>
  </div></footer>
  <a class="summit-link" href="#home" data-scroll="home" aria-label="回到顶部" hidden><svg viewBox="0 0 40 44" fill="none" aria-hidden="true"><path d="M8 36h24v-5H13v-5h14v-5H18v-5h5" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path class="summit-arrow" d="M20 23V4m-5 5 5-5 5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>回到顶部</span></a>
  <div class="toast" role="status" aria-live="polite"></div>
`;

}
