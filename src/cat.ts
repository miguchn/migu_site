import { sampleGait, type LegName } from "./cat-gait";
import { legShape, pawShape, projectLegPose, walkPalette as ink } from "./cat-walk-rig";

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
/** A carved cat projected from longitudinal / depth / height coordinates.
 * Each direction has its own visible faces, rather than mirroring a flat drawing.
 */
const restingLegs = sampleGait(0, false, 1).legs;
const legClasses = { backFar: "back-far", frontFar: "front-far", backNear: "back", frontNear: "front" } as const;
function walkingPaw(name: LegName, facing: number) {
  const art = pawShape(name, facing), pose = projectLegPose(restingLegs[name], name, facing);
  return `<g class="cat-foot" data-paw="${name}" transform="translate(${pose.foot.x} ${pose.foot.y})"><path d="${art.side}" fill="${ink.shade}"/><path d="${art.top}" fill="${name.endsWith("Far") ? ink.shade : ink.side}"/></g>`;
}
function walkingLeg(name: LegName, facing: number) {
  const art = legShape(projectLegPose(restingLegs[name], name, facing), name);
  return `<g class="cat-leg cat-leg-${legClasses[name]}" data-leg="${name}">
    <path class="cat-leg-shape" d="${art.outline}" fill="${name.endsWith("Far") ? ink.shade : ink.side}"/>
    <path class="cat-leg-facet" d="${art.facet}" fill="${ink.shade}"/>
    ${name.endsWith("Far") ? walkingPaw(name, facing) : ""}
  </g>`;
}
function walkingView(facing: number) {
  // Volumes stay round in screen space. Only their centres follow the ground plane.
  const headX = 11 * facing, headY = -22 - 5 * facing;
  return `<g data-cat-view="${facing}"${facing < 0 ? ' style="display:none"' : ''}>
    <g class="cat-tail"><g transform="translate(${-13 * facing} ${-12 + 6 * facing})"><path d="M0 0 C${-13 * facing} 2 ${-17 * facing} -9 ${-14 * facing} -18 Q${-12 * facing} -23 ${-9 * facing} -20" stroke="${ink.side}" stroke-width="4.6" stroke-linecap="butt" fill="none"/></g></g>
    ${walkingLeg("backFar", facing)}${walkingLeg("frontFar", facing)}
    ${walkingLeg("backNear", facing)}${walkingLeg("frontNear", facing)}
    <g class="cat-walk-torso">
      <path d="M${-20 * facing}-12L${-13 * facing}-22L${6 * facing}-25L${16 * facing}-18L${12 * facing}-7L${-10 * facing}-4Z" fill="${ink.side}"/>
      <path d="M${-20 * facing}-12L${-13 * facing}-22L${6 * facing}-25L${14 * facing}-19L${-4 * facing}-15Z" fill="${ink.top}" opacity=".48"/>
      <path d="M${5 * facing}-24L${16 * facing}-18L${12 * facing}-7L${7 * facing}-9Z" fill="${ink.shade}" opacity=".32"/>
      <g transform="translate(${headX} ${headY})">
        <g class="cat-head">
          <path d="M-10-3L-10-11L-3-8L1-9L9-12L10-3L13 2L7 8L-2 10L-10 5Z" fill="${ink.side}"/>
          <path d="M-10-11L-3-8L1-9L9-12L8-7L0-5L-8-6Z" fill="${ink.top}" opacity=".55"/>
          <g class="cat-eyes" fill="${ink.eye}">
            <ellipse cx="-3.7" cy=".2" rx="1.1" ry="1.45"/><ellipse cx="4.6" cy=".2" rx="1.1" ry="1.45"/>
            <ellipse cx="${-3.7 + facing * .25}" cy=".3" rx=".55" ry="1.1" fill="${ink.shade}"/><ellipse cx="${4.6 + facing * .25}" cy=".3" rx=".55" ry="1.1" fill="${ink.shade}"/>
          </g>
          <path d="M-.4 3.3L.5 4.2L1.4 3.3" fill="none" stroke="${ink.top}" stroke-width=".6" stroke-linecap="round"/>
        </g>
      </g>
    </g>
    ${walkingPaw("backNear", facing)}${walkingPaw("frontNear", facing)}
  </g>`;
}
export const catWalk = `<g class="cat-body cat-walking">${walkingView(1)}${walkingView(-1)}</g>`;
export const catPortrait = `<g class="portrait-art">
  <ellipse cx="1" cy="20" rx="27" ry="3.5" fill="#29272f" opacity=".1"/>
  <g transform="translate(-2 18) scale(1.4)">${cat}</g>
</g>`;
