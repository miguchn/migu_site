/** Xiaōhēi's head, torso and limbs keep the proportions of the owner's references.
 * Coordinates are shared by the sitting and walking rigs; y=0 is the ground.
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
export const catWalk = `<g class="cat-body cat-walking">
  <g class="cat-tail"><path d="M-13-17C-25-19-18-28-24-32" fill="none" stroke="#262628" stroke-width="4.8" stroke-linecap="round"/></g>
  <g class="cat-leg cat-leg-back-far" data-leg="back-far"><path d="M-7-18C-11-14-11-8-8-4C-6-2-2-2 1-3L.5-6C-2-6-3-7-3-10C-3-13-1-16 0-18Z" fill="#464649"/></g>
  <g class="cat-leg cat-leg-front-far" data-leg="front-far"><path d="M10-18C11-13 12-8 13-4C14-2 19-2 22-3L21.5-6C19-6 18-7 18-10L18-18Z" fill="#464649"/></g>
  <g class="cat-walk-torso">
    <path d="M-16-15C-19-23-13-28-5-28H8C16-28 20-23 17-14C10-9-3-9-11-12Z" fill="#262628"/>
    <g transform="translate(8 -8) rotate(-10) scale(.72)">${collar}</g>
    <g transform="translate(8 -8) scale(.72)">${catFace}</g>
  </g>
  <g class="cat-leg cat-leg-back" data-leg="back-near"><path d="M-12-17C-17-13-18-7-15-2C-13 1-7 1-3 0L-3.5-4C-7-4-8-5-8-8C-8-11-5-14-3-16Z" fill="#262628"/><path d="M-11-3Q-10-1.5-11 .2" fill="none" stroke="#56565a" stroke-width=".6" stroke-linecap="round"/></g>
  <g class="cat-leg cat-leg-front" data-leg="front-near"><path d="M7-18C7-13 8-7 9-3C10 0 16 1 20 0L19.5-4C16-4 15-5 15-8L16-17Z" fill="#262628"/><path d="M16-3Q15-1.5 16 .2" fill="none" stroke="#56565a" stroke-width=".6" stroke-linecap="round"/></g>
</g>`;
export const catPortrait = `<g class="portrait-art">
  <ellipse cx="1" cy="20" rx="27" ry="3.5" fill="#29272f" opacity=".1"/>
  <g transform="translate(-2 18) scale(1.4)">${cat}</g>
</g>`;
