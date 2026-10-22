import { block } from "./scene";
import { catWalk } from "./cat";

const stone = ["#ffeed9", "#e5b8a0", "#c68c7d"];
const sage = ["#bfceb6", "#8fab98", "#688f81"];
const rose = ["#f4c4b9", "#d99c94", "#b97e7d"];
const build = (content: string, start: number, end: number, x = 0, y = 40) =>
  `<g class="journey-piece" data-build="${start},${end},${x},${y}">${content}</g>`;

// The same coordinates generate the architecture and the foot-contact route.
// For block(x,y,w,d), the top-face centre is (x+(w+d)/2, y+(d-w)/4).
export const lowerStairs = Array.from({ length: 10 }, (_, i) => ({
  x: 144 + i * 21, y: 530 - i * 16, w: 21, d: 65,
}));
export const upperStairs = Array.from({ length: 11 }, (_, i) => ({
  x: 605 + i * 18, y: 271 - i * 15, w: 18, d: 54,
}));
export const topCenter = ({ x, y, w, d }: { x: number; y: number; w: number; d: number }) =>
  ({ x: x + (w + d) / 2, y: y + (d - w) / 4 });
export const roofLanding = { x: 780, y: 133, w: 32, d: 24 };
export const bridgeLanding = { x: 386, y: 385.5, w: 26, d: 44 };
export const bridgeStart = { x: 421, y: 390 };
export const bridgeEnd = { x: 641, y: 280 };
export type JourneyStop = { at: number; x: number; y: number; lift: number };
export const journeyStops: JourneyStop[] = [
  { at: 0, ...topCenter(lowerStairs[0]), lift: 0 },
  { at: 0.055, ...topCenter(lowerStairs[0]), lift: 0 },
  ...lowerStairs.slice(1).map((step, i) => ({ at: 0.08 + i * 0.027, ...topCenter(step), lift: 5 })),
  { at: 0.335, ...topCenter(bridgeLanding), lift: 4 },
  { at: 0.44, ...bridgeStart, lift: 0 },
  ...Array.from({ length: 7 }, (_, i) => {
    const t = (i + 1) / 7;
    return { at: 0.44 + t * 0.2, x: bridgeStart.x + (bridgeEnd.x - bridgeStart.x) * t,
      y: bridgeStart.y + (bridgeEnd.y - bridgeStart.y) * t, lift: 1.1 };
  }),
  // upperStairs[0] is the bridge's receiving platform, at exactly bridgeEnd.
  ...upperStairs.slice(1).map((step, i) => ({ at: 0.665 + i * 0.027, ...topCenter(step), lift: 4.5 })),
  { at: 0.947, ...topCenter(roofLanding), lift: 2 },
  { at: 1, ...topCenter(roofLanding), lift: 0 },
];

function arch(x: number, y: number, w: number, h: number, depth: number, colors: string[]) {
  const pad = w * 0.23;
  const radius = (w - pad * 2) / 2;
  return `<g transform="translate(${x} ${y})">
    <path d="M${w} 0 ${w + depth} ${-depth * 0.5}V${-h - depth * 0.5}L${w} ${-h}Z" fill="${colors[2]}"/>
    <path d="M0 ${-h} ${depth} ${-h - depth * 0.5} ${w + depth} ${-h - depth * 0.5} ${w} ${-h}Z" fill="${colors[0]}"/>
    <g transform="skewY(26.565)"><path d="M0 0V${-h}H${w}V0Z M${pad} 0V${-h * 0.58}a${radius} ${radius} 0 0 1 ${radius * 2} 0V0Z" fill="${colors[1]}" fill-rule="evenodd"/><path d="M${pad} 0V${-h * 0.58}a${radius} ${radius} 0 0 1 ${radius * 2} 0" stroke="${colors[0]}" stroke-width="4"/></g>
  </g>`;
}

export function journeyScene() {
  const steps = lowerStairs.map((s, i) => {
    const art = block(s.x, s.y, s.w, s.d, 20 + i * 5, stone);
    return i === 0 ? art : build(art, 0.004 + (i - 1) * 0.016, 0.028 + (i - 1) * 0.016, -12, 28);
  }).join("");
  const upperSteps = upperStairs.map((s, i) =>
    build(block(s.x, s.y, s.w, s.d, 22 + i * 2, sage), 0.34 + i * 0.014, 0.40 + i * 0.014, 15, 35),
  ).join("");
  const start = journeyStops[0];
  return `<svg class="journey-svg" viewBox="0 0 1050 840" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><linearGradient id="journey-water" x1="170" y1="450" x2="760" y2="650" gradientUnits="userSpaceOnUse"><stop stop-color="#b0d0c7"/><stop offset="1" stop-color="#d3ddbb"/></linearGradient><radialGradient id="journey-shadow"><stop stop-color="#3e5b52" stop-opacity=".22"/><stop offset="1" stop-color="#3e5b52" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="531" cy="770" rx="370" ry="54" fill="url(#journey-shadow)"/>
    <g class="journey-cloud cloud-a" fill="#fff8e9"><ellipse cx="150" cy="255" rx="85" ry="17"/><ellipse cx="130" cy="240" rx="35" ry="25"/><ellipse cx="169" cy="227" rx="32" ry="40"/></g>
    <g class="journey-cloud cloud-b" fill="#fff8e9"><ellipse cx="901" cy="420" rx="79" ry="17"/><ellipse cx="872" cy="404" rx="34" ry="28"/><ellipse cx="917" cy="393" rx="36" ry="43"/></g>
    <g class="journey-platform">${block(100, 571, 520, 275, 45, ["#e8e8c9", "#adbea5", "#75988a"])}<path d="m117 570 501-250 243 122-502 251Z" fill="url(#journey-water)"/><g stroke="#f5f0d9" opacity=".6"><path d="m230 591 64 32m-35-49 64 32m337-127 45 22m-7 19 34 17m-216 84 28 14"/></g></g>
    ${build(block(358, 454, 223, 106, 34, sage), 0.02, 0.13, 0, 35)}
    ${build(arch(331, 386, 76, 139, 43, stone), 0.04, 0.19, -20, 30)}
    ${build(block(326, 242, 83, 48, 12, stone), 0.10, 0.22, 0, -35)}
    ${steps}
    ${build(block(bridgeLanding.x, bridgeLanding.y, bridgeLanding.w, bridgeLanding.d, 28, stone), 0.12, 0.22, 0, 25)}
    <g class="journey-bridge-pivot"><g class="journey-bridge">${block(399, 379, 220, 44, 23, stone)}<path d="m410 375 191-95" stroke="#fff8e6" stroke-width="2" opacity=".7"/></g><circle cx="419" cy="389" r="8" fill="#dfb294"/><circle cx="419" cy="389" r="3" fill="#ad826f"/></g>
    ${build(block(600, 362, 124, 104, 27, rose), 0.24, 0.37, 20, 35)}
    ${build(block(716, 245, 60, 65, 122, stone), 0.36, 0.51, 0, 45)}
    ${build(arch(716, 255, 60, 116, 65, stone), 0.40, 0.56, 0, 40)}
    ${build(block(709, 129, 74, 78, 15, stone), 0.43, 0.59, 0, -35)}
    ${build(`<path d="m705 119 53-53 103 51-79 39Z" fill="#b6c5a9"/><path d="m758 66 25 90 78-39-51-51Z" fill="#7c9d86"/><path d="M781 107V24" stroke="#53776c" stroke-width="3"/><path class="flag" d="m782 24 45 13-45 13Z" fill="#c67f75"/>`, 0.48, 0.63, 0, -40)}
    ${upperSteps}
    ${build(block(roofLanding.x, roofLanding.y, roofLanding.w, roofLanding.d, 6, stone), 0.51, 0.64, 0, -20)}
    <g class="journey-garden">${build(`<path d="M222 601v-63" stroke="#6b8b75" stroke-width="5"/><ellipse cx="222" cy="516" rx="28" ry="43" fill="#83a58a"/><path d="M222 546v-53m0 30-12-15m12 2 13-16" stroke="#648872" stroke-width="2"/>`, 0.02, 0.18, -12, 20)}${build(`<path d="M855 460v-62" stroke="#6b8b75" stroke-width="5"/><ellipse cx="855" cy="379" rx="25" ry="42" fill="#93af91"/><path d="M855 420v-61" stroke="#648872" stroke-width="2"/>`, 0.28, 0.46, 12, 25)}</g>
    <ellipse class="journey-cat-shadow" cx="0" cy="1" rx="20" ry="4" fill="#314c46" opacity=".18" transform="translate(${start.x} ${start.y})"/>
    <g class="journey-cat" transform="translate(${start.x} ${start.y}) scale(1.05)"><g class="journey-cat-pose">${catWalk}</g></g>
    <g class="journey-satellite">${block(835, 594, 36, 38, 35, rose)}</g>
    <g class="journey-satellite satellite-two">${block(130, 380, 26, 27, 26, sage)}</g>
    <path d="m545 643 18 9 18-9-18-9Z" fill="#f9e9cc"/><path d="m580 625 11 5 11-5-11-5Z" fill="#f9e9cc"/>
  </svg>`;
}

export function journeySection() {
  return `<section class="journey-section" id="journey" aria-label="陪小黑走到楼顶">
    <div class="journey-stage">
      <div class="journey-wash wash-dawn"></div><div class="journey-wash wash-dusk"></div><div class="journey-wash wash-night"></div>
      <div class="journey-orb"></div><div class="journey-stars" aria-hidden="true">✦ <span>✧</span> · <i>✦</i></div>
      <div class="journey-topline"><span>A WALK THROUGH THE IMPOSSIBLE</span><span>小黑的奇想漫游 / <b class="journey-percent">00</b>%</span></div>
      <div class="journey-copy">
        <article class="chapter-copy" data-copy="0"><p class="chapter-kicker">CHAPTER 01 — 保持好奇</p><h2>还没有路，<br/>那就<span>搭一条。</span></h2><p>每个有趣的东西，都从一个「要不试试」开始。<br/>继续向下，让散落的灵感长成阶梯。</p></article>
        <article class="chapter-copy" data-copy="1" aria-hidden="true"><p class="chapter-kicker">CHAPTER 02 — 换个角度</p><h2>转个方向，<br/>就有<span>新可能。</span></h2><p>转动的不是世界，是看世界的方式。<br/>让好奇心，连接两个不可能的地方。</p></article>
        <article class="chapter-copy" data-copy="2" aria-hidden="true"><p class="chapter-kicker">CHAPTER 03 — 创造与分享</p><h2>让不可能，<br/><span>变成作品。</span></h2><p>从一次尝试，到一个真正可用的作品。<br/>把路上的发现留下，也分享给下一个好奇的人。</p></article>
      </div>
      <div class="journey-perspective"><div class="journey-world">${journeyScene()}</div></div>
      <div class="journey-bottom"><span class="journey-scroll-hint"><span>↓</span> 向下滚动，世界随你而动</span><div class="journey-chapters" role="group" aria-label="漫游章节"><button class="active" data-chapter="0" aria-pressed="true"><span>01</span> 起点</button><button data-chapter="1" aria-pressed="false"><span>02</span> 转念</button><button data-chapter="2" aria-pressed="false"><span>03</span> 创造</button></div></div>
      <div class="journey-progress" aria-hidden="true"><span></span></div>
    </div>
  </section>`;
}
