/**
 * Original Xiaōhēi character artwork. All shapes are local vector paths;
 * there are no shared SVG IDs, so the character can appear more than once.
 * The small character stands on y = 0 and fits x = -28…25, y = -44…1.
 */
export const cat = `<g class="cat-body">
  <g class="cat-tail">
    <path d="M-8-3C-22 1-29-6-24-16C-21-22-15-18-18-14" fill="none" stroke="#22232c" stroke-width="5.1" stroke-linecap="round"/>
    <path d="M-22-5C-27-9-26-14-23-17" fill="none" stroke="#42434d" stroke-width="1.1" stroke-linecap="round" opacity=".65"/>
  </g>
  <path d="M-10-18C-13-13-15-6-12-2C-9 2 8 2 12-2C15-6 11-15 8-19Z" fill="#20212a"/>
  <path d="M5-16C11-13 13-5 10-2C8 0 3 0 1-2C5-5 6-11 5-16Z" fill="#2d2e38"/>
  <path d="M-6-15C-9-9-8-3-7-1" fill="none" stroke="#42434c" stroke-width="1" stroke-linecap="round" opacity=".65"/>
  <path d="M-3-13C-2-10-2-5-3-2" fill="none" stroke="#11121a" stroke-width="1.2" stroke-linecap="round"/>
  <g class="cat-paw">
    <path d="M-8-5C-12-5-13-1-10 .1C-8 1-4 1-3-.4C-2-2-4-5-8-5Z" fill="#30313b"/>
    <path d="M-9-1.7V0M-6.8-1.8V.3" stroke="#54545e" stroke-width=".55" stroke-linecap="round"/>
  </g>
  <path d="M5-4.5C1-4.5 0-.6 3 .3C5 1 10 .7 10.7-.8C11.5-2.7 8.5-4.5 5-4.5Z" fill="#33343e"/>
  <path d="M4.1-1.5V.3M6.5-1.5V.4" stroke="#5a5963" stroke-width=".55" stroke-linecap="round"/>
  <g class="cat-head">
    <path d="M-13-30C-15-34-15.3-41.4-13.5-43C-12.5-43.9-6.4-39.1-4.1-36.9C-.7-37.8 3.2-37.5 6-36.4C9-39.7 13-43.9 14.4-42.5C16-40.4 15.6-33.4 14-29.8C18.2-22.4 12-15.9 1-15.8C-9.9-15.7-18.4-21.4-13-30Z" fill="#252630"/>
    <path d="M-13.5-40.6L-11.9-31.9L-6.8-35.4Z" fill="#63515e"/>
    <path d="M13.6-40.3L7.8-35.2L12.3-31.7Z" fill="#705a66"/>
    <path d="M-12.7-40L-11.8-35.4M12.7-39.8L10.5-36.5" stroke="#aa7e85" stroke-width=".7" stroke-linecap="round" opacity=".7"/>
    <path d="M-10.5-31.9C-8-35.3-3.9-36.4.1-35.9" fill="none" stroke="#4b4b56" stroke-width="1.25" stroke-linecap="round" opacity=".7"/>
    <path d="M13.7-28.5C15.8-23.1 10.9-18.3 5.9-18" fill="none" stroke="#383944" stroke-width="1.2" stroke-linecap="round"/>
    <g class="cat-eyes">
      <path d="M-11-28.1C-8.6-31.2-4.3-30.7-2.3-27.5C-4.3-24.1-8.8-24.4-11-28.1Z" fill="#e8bd62"/>
      <path d="M3.4-27.5C5.4-30.7 9.7-31.2 12-28.1C9.9-24.4 5.3-24.1 3.4-27.5Z" fill="#e8bd62"/>
      <path d="M-10.3-28.1C-8-29.8-4.8-29.8-2.9-27.6M4-27.6C6-29.8 9.2-29.8 11.4-28.1" fill="none" stroke="#f6d989" stroke-width=".65"/>
      <ellipse cx="-6.5" cy="-27.6" rx="1.1" ry="2.7" fill="#14151d"/>
      <ellipse cx="7.6" cy="-27.6" rx="1.1" ry="2.7" fill="#14151d"/>
      <circle cx="-7.3" cy="-28.6" r=".65" fill="#fff4d3"/>
      <circle cx="6.8" cy="-28.6" r=".65" fill="#fff4d3"/>
      <path d="M-11.5-28.6C-8.5-31.8-4.1-31-1.8-28M2.9-28C5.1-31 9.6-31.8 12.5-28.6" fill="none" stroke="#171820" stroke-width="1.25" stroke-linecap="round"/>
    </g>
    <path d="M-2-22.9Q.6-24.1 3.2-22.9L.6-20.9Z" fill="#b18790"/>
    <path d="M.6-20.9V-19.8M.6-19.8Q-1.2-18.7-2.2-20M.6-19.8Q2.5-18.7 3.5-20" fill="none" stroke="#64616c" stroke-width=".7" stroke-linecap="round"/>
    <g fill="none" stroke="#9c94a1" stroke-width=".5" stroke-linecap="round" opacity=".65">
      <path d="M-5-22.1L-15.5-23.4M-5.4-20.5L-15.2-19.4M6-22.1L16.5-23.4M6.4-20.5L16.2-19.4"/>
    </g>
  </g>
</g>`;

/** Place inside <svg viewBox="-65 -85 130 120">. */
export const catPortrait = `<g class="portrait-art">
  <ellipse cx="0" cy="19" rx="34" ry="5" fill="#29272f" opacity=".12"/>
  <path d="M-45-31C-50-51-34-70-19-71M29-66C42-61 49-49 48-39" fill="none" stroke="currentColor" stroke-width=".6" opacity=".17"/>
  <g transform="translate(0 16) scale(2)">${cat}</g>
  <g fill="none" stroke="#c3a26a" stroke-width=".8" stroke-linecap="round">
    <path d="M-43-54V-62M-47-58H-39M40-13V-21M36-17H44"/>
    <circle cx="37" cy="-56" r="1.5"/>
    <circle cx="-40" cy="-13" r="1"/>
  </g>
</g>`;
