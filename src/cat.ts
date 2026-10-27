import { walkLegs, walkBodyLift, sampleGait, bonePath, type LegName } from "./cat-gait";

/** Sitting Xiaōhēi keeps the proportions of the owner's references.
 * The walking rig is a separate model. Both use y=0 as the ground.
 * No shared IDs, so the artwork can appear repeatedly in the page.
 */
const face = `<path d="M-20-47C-21-53-19-62-16-64C-12-66-6-59-3-56C3-58 10-56 14-53C19-55 25-57 26-54C28-50 23-43 22-41C26-35 23-31 22-30L23-28L20-29C18-25 11-23 3-23C-8-23-19-27-22-32L-24-31L-23-35L-25-34Q-26-39-22-42L-25-41Q-25-45-20-47Z" fill="#262628"/>
  <g class="cat-eyes">
    <circle cx="-10" cy="-41" r="5.9" fill="#d9dc87"/>
    <circle cx="10.5" cy="-37.5" r="5.6" fill="#d9dc87"/>
    <circle cx="-9.4" cy="-41.7" r="4" fill="#131416"/>
    <circle cx="11" cy="-38.2" r="3.8" fill="#131416"/>
    <circle cx="-10.8" cy="-43.4" r="1.15" fill="#fff9e9"/>
    <circle cx="9.6" cy="-39.7" r="1.1" fill="#fff9e9"/>
  </g>
  <path d="m-.8-33.9 3.2.7q.8.2.2.8L.8-30.5Z" fill="#737376"/>
  <path d="M.8-30.5q-.6 3.1-3.8 1.4M.8-30.5q.6 3.4 3.7 2.2" fill="none" stroke="#737376" stroke-width=".85" stroke-linecap="round"/>`;
export const catFace = `<g class="cat-head">${face}</g>`;
const collar = `<path d="M-11-26Q0-20 12-24L9-21Q0-17.8-10-23Z" fill="#ce8b72"/>
  <g class="cat-bell"><circle cx="1" cy="-20.5" r="1.1" fill="none" stroke="#dcc274" stroke-width=".7"/><circle cx="1" cy="-17.8" r="2.6" fill="#e2c675"/><path d="M1-17.5v1.7" stroke="#4c4838" stroke-width=".65"/><circle cx="1" cy="-17.9" r=".6" fill="#4c4838"/></g>`;
export const cat = `<g class="cat-body">
  <g class="cat-tail"><path d="M13-3C25-4 22-15 24-22Q25-27 28-30" fill="none" stroke="#262628" stroke-width="5.5" stroke-linecap="round"/></g>
  <path d="M-9-29Q-14-24-14-18C-22-14-23-5-17-2Q-13 .5-6-1H9Q19 1 20-6C21-12 16-17 14-18Q13-25 8-29Z" fill="#262628"/>
  <path d="M-12-18Q-9-10-7-3M-5-18Q0-14 0-3M7-18Q2-14 2-3M13-18Q11-10 8-3" fill="none" stroke="#505052" stroke-width=".75"/>
  ${collar}
  <g class="cat-paw"><ellipse cx="-4" cy="-1.9" rx="4.8" ry="1.9" fill="#29292b"/><path d="M-6-3Q-7-1.8-6-.3" fill="none" stroke="#505052" stroke-width=".65"/></g>
  <g class="cat-paw-right"><ellipse cx="5" cy="-1.9" rx="4.8" ry="1.9" fill="#29292b"/><path d="M7-3Q8-1.8 7-.3" fill="none" stroke="#505052" stroke-width=".65"/></g>
  ${catFace}
</g>`;
/** Chibi walking Xiaōhēi: broad round head, compact body, short planted paws. */
const restingLegs = sampleGait(0, false, 1).legs;
const legClasses = { backFar: "back-far", frontFar: "front-far", backNear: "back", frontNear: "front" } as const;
function walkingPaw(name: LegName) {
  const leg = walkLegs[name], pose = restingLegs[name];
  const color = name.endsWith("Far") ? "#414644" : "#3a413e";
  return `<ellipse class="cat-foot" data-paw="${name}" cx="${pose.foot.x}" cy="${pose.foot.y - 1.4}" rx="${leg.paw}" ry="1.4" fill="${color}"/>`;
}
function walkingLeg(name: LegName) {
  const leg = walkLegs[name], pose = restingLegs[name];
  const far = name.endsWith("Far"), color = far ? "#414644" : "#292d2f";
  return `<g class="cat-leg cat-leg-${legClasses[name]}" data-leg="${name}">
    <path class="cat-leg-upper" d="${bonePath(pose.hip, pose.knee)}" stroke="${color}" stroke-width="${leg.width}" stroke-linecap="round"/>
    <path class="cat-leg-lower" d="${bonePath(pose.knee, pose.ankle)}" stroke="${color}" stroke-width="${leg.width * .75}" stroke-linecap="round"/>
    ${far ? walkingPaw(name) : ""}
  </g>`;
}
export const catWalk = `<g class="cat-body cat-walking">
  <g transform="translate(0 ${-walkBodyLift})"><g class="cat-tail"><path d="M-10-9C-19-8-24-13-21-21C-20-24-17-23-18-21C-20-16-17-13-10-13Z" fill="#343a37"/></g></g>
  ${walkingLeg("backFar")}${walkingLeg("frontFar")}${walkingLeg("backNear")}${walkingLeg("frontNear")}
  <g class="cat-walk-torso" transform="translate(0 ${-walkBodyLift})">
    <path d="M-12-5C-17-10-14-18-9-20C-4-23 4-21 8-17C12-13 12-5 6-3Q-4-1-12-5Z" fill="#292d2f"/>
    <path d="M-11-15Q-9-20-4-20Q-7-19-9-15Z" fill="#4d5750" opacity=".25"/>
    <path d="M0-17Q7-14 6-8Q3-4-2-5Q2-9 0-17Z" fill="#24282a" opacity=".5"/>
    <path d="M0-16Q7-12 15-17" stroke="#c58f7e" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <g class="cat-bell"><circle cx="7" cy="-13.4" r="1.75" fill="#dac38b"/><path d="M7-13.6v1.1" stroke="#826d45" stroke-width=".5" stroke-linecap="round"/></g>
    <g class="cat-head">
      <path d="M-7-30C-10-33-10-38-8-39Q-6-40 0-34Q7-37 14-34L20-38Q23-40 23-35L22-30C26-26 23-20 18-17C11-12 2-13-4-17C-10-20-12-26-7-30Z" fill="#303537"/>
      <path d="m-7-35 2 2 2-1m21 .1 2-2-.5 3" fill="#b89189" opacity=".45"/>
      <path d="M-4-29Q-2-34 5-33Q9-33 11-31Q2-33-4-27Z" fill="#465047" opacity=".28"/>
      <g class="cat-eyes">
        <ellipse cx="1.2" cy="-25.5" rx="3.5" ry="4.1" fill="#c4cea2"/>
        <ellipse cx="13.8" cy="-24.8" rx="4.1" ry="4.5" fill="#c4cea2"/>
        <ellipse cx="1.9" cy="-25.4" rx="2.35" ry="2.95" fill="#1c2324"/>
        <ellipse cx="14.5" cy="-24.7" rx="2.8" ry="3.3" fill="#1c2324"/>
        <circle cx="1" cy="-26.9" r=".8" fill="#fff5df"/>
        <circle cx="13.4" cy="-26.3" r=".95" fill="#fff5df"/>
      </g>
      <path d="m7.3-21.2 2.8.3-1.5 1.3Z" fill="#b99b94"/>
      <path d="M8.6-19.6q-.7 1.6-2.6.8m2.6-.8q.5 1.7 2.3 1" stroke="#929d93" stroke-width=".65" stroke-linecap="round" fill="none"/>
    </g>
  </g>
  ${walkingPaw("backNear")}${walkingPaw("frontNear")}
</g>`;
export const catPortrait = `<g class="portrait-art">
  <ellipse cx="1" cy="20" rx="27" ry="3.5" fill="#29272f" opacity=".1"/>
  <g transform="translate(-2 18) scale(1.4)">${cat}</g>
</g>`;
