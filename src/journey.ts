import { block, cat } from "./scene";

const stone = ["#ffeed9", "#e5b8a0", "#c68c7d"];
const sage = ["#bfceb6", "#8fab98", "#688f81"];
const rose = ["#f4c4b9", "#d99c94", "#b97e7d"];
const build = (content: string, start: number, end: number, x = 0, y = 150) =>
  `<g class="journey-piece" data-build="${start},${end},${x},${y}">${content}</g>`;

function arch(
  x: number,
  y: number,
  w: number,
  h: number,
  depth: number,
  colors: string[],
) {
  const pad = w * 0.23;
  const radius = (w - pad * 2) / 2;
  return `<g transform="translate(${x} ${y})">
    <path d="M${w} 0 ${w + depth} ${-depth * 0.5}V${-h - depth * 0.5}L${w} ${-h}Z" fill="${colors[2]}"/>
    <path d="M0 ${-h} ${depth} ${-h - depth * 0.5} ${w + depth} ${-h - depth * 0.5} ${w} ${-h}Z" fill="${colors[0]}"/>
    <g transform="skewY(26.565)"><path d="M0 0V${-h}H${w}V0Z M${pad} 0V${-h * 0.58}a${radius} ${radius} 0 0 1 ${radius * 2} 0V0Z" fill="${colors[1]}" fill-rule="evenodd"/><path d="M${pad} 0V${-h * 0.58}a${radius} ${radius} 0 0 1 ${radius * 2} 0" stroke="${colors[0]}" stroke-width="4"/></g>
  </g>`;
}

export function journeyScene() {
  const steps = Array.from({ length: 10 }, (_, i) =>
    build(
      block(144 + i * 21, 530 - i * 16, 21, 65, 20 + i * 5, stone),
      0.015 + i * 0.019,
      0.17 + i * 0.019,
      -70 + i * 8,
      110 + i * 8,
    ),
  ).join("");
  const upperSteps = Array.from({ length: 7 }, (_, i) =>
    build(
      block(587 + i * 18, 346 - i * 15, 18, 54, 22 + i * 4, sage),
      0.48 + i * 0.025,
      0.65 + i * 0.025,
      80,
      130,
    ),
  ).join("");
  return `<svg class="journey-svg" viewBox="0 0 1050 840" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="journey-water" x1="170" y1="450" x2="760" y2="650" gradientUnits="userSpaceOnUse"><stop stop-color="#b0d0c7"/><stop offset="1" stop-color="#d3ddbb"/></linearGradient><radialGradient id="journey-shadow"><stop stop-color="#3e5b52" stop-opacity=".22"/><stop offset="1" stop-color="#3e5b52" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="531" cy="770" rx="370" ry="54" fill="url(#journey-shadow)"/>
    <g class="journey-cloud cloud-a" fill="#fff8e9"><ellipse cx="150" cy="255" rx="85" ry="17"/><ellipse cx="130" cy="240" rx="35" ry="25"/><ellipse cx="169" cy="227" rx="32" ry="40"/></g>
    <g class="journey-cloud cloud-b" fill="#fff8e9"><ellipse cx="901" cy="420" rx="79" ry="17"/><ellipse cx="872" cy="404" rx="34" ry="28"/><ellipse cx="917" cy="393" rx="36" ry="43"/></g>
    <g class="journey-platform">${block(100, 571, 520, 275, 45, ["#e8e8c9", "#adbea5", "#75988a"])}<path d="m117 570 501-250 243 122-502 251Z" fill="url(#journey-water)"/><g stroke="#f5f0d9" opacity=".6"><path d="m230 591 64 32m-35-49 64 32m337-127 45 22m-7 19 34 17m-216 84 28 14"/></g></g>
    ${build(block(358, 454, 223, 106, 34, sage), 0.08, 0.32, 0, 100)}
    ${steps}
    ${build(arch(331, 386, 76, 139, 43, stone), 0.1, 0.33, -110, -110)}
    ${build(block(326, 242, 83, 48, 12, stone), 0.17, 0.39, -90, -180)}
    <g class="journey-bridge-pivot"><g class="journey-bridge">${block(399, 379, 220, 44, 23, stone)}<path d="m410 375 191-95" stroke="#fff8e6" stroke-width="2" opacity=".7"/></g><circle cx="419" cy="389" r="8" fill="#dfb294"/><circle cx="419" cy="389" r="3" fill="#ad826f"/></g>
    ${build(block(600, 362, 124, 104, 27, rose), 0.36, 0.58, 90, 120)}
    ${upperSteps}
    ${build(block(716, 245, 60, 65, 122, stone), 0.54, 0.75, 0, 200)}
    ${build(arch(716, 255, 60, 116, 65, stone), 0.6, 0.81, 0, 140)}
    ${build(block(709, 129, 74, 78, 15, stone), 0.67, 0.86, 0, -170)}
    ${build(`<path d="m705 119 53-53 103 51-79 39Z" fill="#b6c5a9"/><path d="m758 66 25 90 78-39-51-51Z" fill="#7c9d86"/><path d="M781 107V24" stroke="#53776c" stroke-width="3"/><path class="flag" d="m782 24 45 13-45 13Z" fill="#c67f75"/>`, 0.76, 0.96, 0, -150)}
    <g class="journey-garden">${build(`<path d="M222 601v-63" stroke="#6b8b75" stroke-width="5"/><ellipse cx="222" cy="516" rx="28" ry="43" fill="#83a58a"/><path d="M222 546v-53m0 30-12-15m12 2 13-16" stroke="#648872" stroke-width="2"/>`, 0.06, 0.26, -30, 50)}${build(`<path d="M800 460v-62" stroke="#6b8b75" stroke-width="5"/><ellipse cx="800" cy="379" rx="25" ry="42" fill="#93af91"/><path d="M800 420v-61" stroke="#648872" stroke-width="2"/>`, 0.42, 0.64, 50, 80)}</g>
    <g class="journey-cat" transform="translate(174 513) scale(1.25)">${cat}</g>
    <g class="journey-satellite">${block(835, 594, 36, 38, 35, rose)}</g>
    <g class="journey-satellite satellite-two">${block(130, 380, 26, 27, 26, sage)}</g>
    <path d="m545 643 18 9 18-9-18-9Z" fill="#f9e9cc"/><path d="m580 625 11 5 11-5-11-5Z" fill="#f9e9cc"/>
  </svg>`;
}

export function journeySection() {
  return `<section class="journey-section" id="journey" aria-label="跟小黑走过一座不可能的小岛">
    <div class="journey-stage">
      <div class="journey-wash wash-dawn"></div><div class="journey-wash wash-dusk"></div><div class="journey-wash wash-night"></div>
      <div class="journey-orb"></div><div class="journey-stars" aria-hidden="true">✦ <span>✧</span> · <i>✦</i></div>
      <div class="journey-topline"><span>A WALK THROUGH THE IMPOSSIBLE</span><span>小黑的奇想漫游 / <b class="journey-percent">00</b>%</span></div>
      <div class="journey-copy">
        <article class="chapter-copy" data-copy="0"><p class="chapter-kicker">CHAPTER 01 — 保持好奇</p><h2>还没有路，<br/>那就<span>搭一条。</span></h2><p>每个有趣的东西，都从一个「要不试试」开始。<br/>继续向下，让散落的灵感长成阶梯。</p></article>
        <article class="chapter-copy" data-copy="1" aria-hidden="true"><p class="chapter-kicker">CHAPTER 02 — 换个角度</p><h2>转个方向，<br/>就有<span>新可能。</span></h2><p>转动的不是世界，是看世界的方式。<br/>让好奇心，连接两个不可能的地方。</p></article>
        <article class="chapter-copy" data-copy="2" aria-hidden="true"><p class="chapter-kicker">CHAPTER 03 — 让想法发生</p><h2>让不可能，<br/><span>变成作品。</span></h2><p>从第一块积木，到一座自己的小岛。<br/>我在这里，继续探索 AI 与创造的边界。</p></article>
      </div>
      <div class="journey-perspective"><div class="journey-world">${journeyScene()}</div></div>
      <div class="journey-bottom"><span class="journey-scroll-hint"><span>↓</span> 向下滚动，世界随你而动</span><div class="journey-chapters" role="group" aria-label="漫游章节"><button class="active" data-chapter="0" aria-pressed="true"><span>01</span> 起点</button><button data-chapter="1" aria-pressed="false"><span>02</span> 转念</button><button data-chapter="2" aria-pressed="false"><span>03</span> 创造</button></div></div>
      <div class="journey-progress" aria-hidden="true"><span></span></div>
    </div>
  </section>`;
}
