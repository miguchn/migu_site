// Original vector architecture: all scene artwork is generated locally.
const polygon = (points: string, fill: string, extra = "") =>
  `<polygon points="${points}" fill="${fill}" ${extra}/>`;
export function block(
  x: number,
  y: number,
  w: number,
  d: number,
  h: number,
  colors: string[],
) {
  return `<g>${polygon(`${x},${y} ${x + w},${y - w * 0.5} ${x + w + d},${y - w * 0.5 + d * 0.5} ${x + d},${y + d * 0.5}`, colors[0])}${polygon(`${x},${y} ${x + d},${y + d * 0.5} ${x + d},${y + d * 0.5 + h} ${x},${y + h}`, colors[1])}${polygon(`${x + d},${y + d * 0.5} ${x + w + d},${y - w * 0.5 + d * 0.5} ${x + w + d},${y - w * 0.5 + d * 0.5 + h} ${x + d},${y + d * 0.5 + h}`, colors[2])}</g>`;
}
const cream = ["#fff2d9", "#edc9a5", "#dbad92"];
const green = ["#b8cec1", "#8dab9e", "#648e82"];
const pink = ["#f4c4b4", "#dfa494", "#c8857c"];
function stairs(x: number, y: number, n = 9, size = 16, colors = cream) {
  return Array.from({ length: n }, (_, i) =>
    block(
      x + i * size,
      y - i * size * 0.5 - i * 8,
      size,
      43,
      13 + i * 8,
      colors,
    ),
  ).join("");
}
import { cat } from "./cat";
export { cat };

export function island() {
  return `<svg class="island-svg" viewBox="0 0 760 690" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="halo" x1="380" y1="50" x2="380" y2="660" gradientUnits="userSpaceOnUse"><stop stop-color="#f1e3d6"/><stop offset="1" stop-color="#f6eee4" stop-opacity="0"/></linearGradient>
    <linearGradient id="water" x1="250" y1="440" x2="500" y2="560" gradientUnits="userSpaceOnUse"><stop stop-color="#a7c6bf"/><stop offset="1" stop-color="#d5e0d3"/></linearGradient>
    <radialGradient id="island-shadow"><stop stop-color="#7d8b78" stop-opacity=".19"/><stop offset="1" stop-color="#7d8b78" stop-opacity="0"/></radialGradient>
  </defs>
  <circle cx="390" cy="335" r="278" fill="url(#halo)"/>
  <circle class="scene-sun" cx="572" cy="158" r="44" fill="#e7ad8d"/>
  <g class="scene-moon"><circle cx="572" cy="158" r="38" fill="#f9e6bb"/><circle cx="587" cy="145" r="32" fill="#2b3d4e"/></g>
  <g stroke="#b5b9a7" stroke-width="1"><path d="M147 201v14m-7-7h14M620 330v12m-6-6h12M510 78v12m-6-6h12"/><circle cx="214" cy="125" r="3"/><circle cx="647" cy="251" r="2"/><circle cx="110" cy="383" r="2"/></g>
  <g class="cloud cloud-back" fill="#fffdf7"><ellipse cx="580" cy="290" rx="58" ry="13"/><ellipse cx="558" cy="280" rx="25" ry="17"/><ellipse cx="588" cy="269" rx="29" ry="28"/></g>
  <ellipse cx="382" cy="634" rx="248" ry="38" fill="url(#island-shadow)"/>
  <g class="floating-island">
  ${block(135, 444, 300, 222, 48, ["#dedfbd", "#a8b397", "#809c8c"])}
  ${polygon("155,446 428,309 626,408 354,545", "url(#water)")}
  <g stroke="#e9eee0" stroke-width="1.5" opacity=".6"><path d="m168 457 76 38m-29-53 64 32m183-85 91 45m-38 8 53 26m-228 43 41 20"/></g>
  ${block(217, 394, 174, 131, 37, cream)}
  ${block(249, 379, 100, 67, 16, ["#faf1d8", "#ead4b7", "#cdb59b"])}
  ${block(291, 316, 72, 70, 81, pink)}
  ${block(289, 308, 76, 74, 12, cream)}
  <g transform="translate(364 322) skewY(-26.565)"><path d="M0 58V21a16 16 0 0 1 32 0v37Z" fill="#8a6360"/><path d="M5 58V23a11 11 0 0 1 22 0v35" fill="#b48272"/></g>
  ${stairs(188, 402, 8, 15)}
  <path class="stair-light" d="M217 409l15-7.5v-8l15-7.5v-8l15-7.5v-8l15-7.5v-8l15-7.5v-8l15-7.5v-8l15-7.5v-8" pathLength="260" stroke="#fff8d5" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 250" opacity="0"/>
  ${block(177, 321, 43, 43, 20, green)}
  ${block(179, 218, 38, 38, 107, cream)}
  <g transform="translate(217 224) skewY(-26.565)"><path d="M0 63V26a14 14 0 0 1 28 0v37Z" fill="#a47867"/><path d="M5 63V28a9 9 0 0 1 18 0v35" fill="#d5a88e"/></g>
  ${block(172, 208, 51, 51, 14, cream)}
  ${block(169, 200, 57, 57, 8, ["#b6c6ac", "#8eab94", "#6c9181"])}
  ${block(211, 202, 180, 30, 16, cream)}
  ${block(385, 149, 57, 55, 159, cream)}
  <g transform="translate(440 157) skewY(-26.565)"><path d="M0 92V29a20 20 0 0 1 40 0v63Z" fill="#9c786b"/><path d="M6 92V31a14 14 0 0 1 28 0v61Z" fill="#c1a288"/><path d="M13 92V34a9 9 0 0 1 18-1v59Z" fill="#78998b"/></g>
  ${block(379, 139, 69, 67, 14, cream)}
  ${block(375, 129, 77, 75, 10, green)}
  ${polygon("375,129 413,87 452,91 527,128 452,166", "#b4c9b5")}
  ${polygon("375,129 413,87 452,107 452,166", "#a3bba6")}
  ${polygon("452,107 452,166 527,128 490,89", "#789d8a")}
  <path d="M451 109v-45" stroke="#748c78" stroke-width="2"/><path class="flag" d="m452 64 30 9-30 11Z" fill="#dc8b78"/>
  ${stairs(372, 364, 7, 16, green)}
  ${block(463, 304, 58, 38, 20, cream)}
  ${block(485, 236, 28, 28, 71, pink)}
  ${block(481, 227, 36, 36, 11, cream)}
  <g transform="translate(508 224)"><path d="M-9 0V-15a9 9 0 0 1 18 0V0Z" fill="#e8b195"/><ellipse cy="-15" rx="9" ry="4" fill="#f7d7ae"/></g>
  <g class="scene-tree" transform="translate(531 389)"><path d="M0 0v-44" stroke="#6c8270" stroke-width="4"/><ellipse cy="-54" rx="19" ry="34" fill="#759c83"/><path d="M0-22v-42m0 24 10-12m-10-1-9-10" stroke="#527965" stroke-width="1.5"/></g>
  <g transform="translate(276 482)"><path d="M0 0v-30" stroke="#789181" stroke-width="3"/><circle cy="-36" r="18" fill="#aec1a0"/><circle cx="-6" cy="-44" r="14" fill="#bdd0ad"/></g>
  <g transform="translate(398 441)"><ellipse rx="21" ry="7" fill="#92b1a4"/><path d="M0 0v-16m0 5-9-7m9 3 8-10" stroke="#6a907c" stroke-width="2"/><path d="M-1-16q-17 0-11-9 12-2 11 9m2-7q-1-15 10-13 6 10-10 13" fill="#73977f"/></g>
  <g id="scene-cat" transform="translate(340 373) scale(1.35)">${cat}</g>
  <g fill="#f2e6cf"><ellipse cx="436" cy="487" rx="15" ry="7"/><ellipse cx="464" cy="473" rx="8" ry="4"/><ellipse cx="164" cy="458" rx="8" ry="4"/></g>
  <g stroke="#698f80" opacity=".6"><path d="m240 518 12 6m-2-12 12 6m277-82 13 6"/></g>
  </g>
  <g class="cloud cloud-front" fill="#fffdf7"><ellipse cx="151" cy="513" rx="73" ry="15"/><ellipse cx="124" cy="503" rx="28" ry="19"/><ellipse cx="160" cy="491" rx="31" ry="31"/><ellipse cx="192" cy="505" rx="21" ry="18"/></g>
  <g class="floating-block">${block(570, 489, 33, 33, 26, pink)}</g>
  <g class="floating-block block-two">${block(144, 307, 19, 19, 19, green)}</g>
  <path d="m585 558 10 5 10-5-10-5Z" stroke="#acb5a2"/>
  </svg>`;
}
export function miniScene(kind: "portal" | "steps" | "orb") {
  let art = "";
  if (kind === "portal")
    art = `${block(80, 153, 90, 75, 20, green)}${block(101, 109, 44, 40, 48, pink)}<g transform="translate(141 112) skewY(-26.565)"><path d="M0 35V13a13 13 0 0 1 26 0v22Z" fill="#7d685f"/><path d="M5 35V15a8 8 0 0 1 16 0v20" fill="#e7c8a3"/></g>${block(97, 100, 52, 48, 10, cream)}<circle cx="211" cy="74" r="21" fill="#e8b68f"/><path d="m73 89 6 3 6-3-6-3Z" fill="#9caf94"/>`;
  if (kind === "steps")
    art = `${block(75, 159, 93, 65, 18, green)}${stairs(89, 148, 5, 15)}${block(161, 75, 27, 29, 15, pink)}<g transform="translate(187 69) scale(.5)">${cat}</g><path d="M218 117v14m-7-7h14" stroke="#8ca58d"/><circle cx="84" cy="74" r="4" fill="#d5ab91"/>`;
  if (kind === "orb")
    art = `${block(85, 154, 80, 70, 20, pink)}${block(113, 116, 28, 28, 45, cream)}<circle cx="141" cy="93" r="28" fill="#b5c5aa"/><ellipse cx="141" cy="93" rx="43" ry="10" transform="rotate(-25 141 93)" stroke="#6d8f7c" stroke-width="3"/><path d="M210 67v12m-6-6h12M76 113v10m-5-5h10" stroke="#b8a786"/>`;
  return `<svg viewBox="0 0 300 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><ellipse cx="150" cy="190" rx="80" ry="12" fill="#647d61" opacity=".06"/><g class="mini-sculpture">${art}</g></svg>`;
}
