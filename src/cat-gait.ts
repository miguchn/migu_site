/** Small, fixed-length limbs. Coordinates are shared by SVG rendering and animation. */
export type Point = { x: number; y: number };
// Lift the accepted silhouette slightly while keeping all paws on the same surface.
export const walkBodyLift = 1.6;
export const walkStance = .75;
export const walkLegs = {
  backFar: { hip: { x: -4.5, y: -8.5 - walkBodyLift }, restX: -4.8, floor: -1.4, upper: 4.7, lower: 4.8, width: 3.5, paw: 2.2, phase: .25, bend: -1 },
  frontFar: { hip: { x: 9, y: -8.5 - walkBodyLift }, restX: 9.5, floor: -1.4, upper: 4.7, lower: 4.8, width: 3.4, paw: 2.2, phase: 0, bend: 1 },
  backNear: { hip: { x: -7.5, y: -7.3 - walkBodyLift }, restX: -7.8, floor: 0, upper: 4.8, lower: 5.0, width: 4.5, paw: 2.7, phase: .75, bend: -1 },
  frontNear: { hip: { x: 6, y: -7.3 - walkBodyLift }, restX: 6.6, floor: 0, upper: 4.8, lower: 5.0, width: 4.2, paw: 2.7, phase: .5, bend: 1 },
} as const;
export type LegName = keyof typeof walkLegs;
export type LegPose = { hip: Point; knee: Point; ankle: Point; foot: Point; lift: number };
const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const smooth = (x: number) => { const t = clamp(x); return t * t * (3 - 2 * t); };

/** Two-bone solve keeps every hip/knee connected and both bone lengths constant. */
export function solveLeg(hip: Point, ankle: Point, upper: number, lower: number, bend: number) {
  const dx = ankle.x - hip.x, dy = ankle.y - hip.y;
  const raw = Math.hypot(dx, dy);
  const d = clamp(raw, Math.abs(upper - lower) + .001, upper + lower - .001);
  const ux = raw > 0 ? dx / raw : 0, uy = raw > 0 ? dy / raw : 1;
  const along = (upper * upper - lower * lower + d * d) / (2 * d);
  const height = Math.sqrt(Math.max(0, upper * upper - along * along));
  return { knee: { x: hip.x + ux * along - uy * height * bend,
    y: hip.y + uy * along + ux * height * bend },
    ankle: { x: hip.x + ux * d, y: hip.y + uy * d } };
}

/** Relaxed four-beat walk: hind paw, then fore paw, with three supporting paws. */
export function sampleGait(t: number, moving: boolean, facing: number, breath = 0) {
  const time = clamp(t);
  const travel = facing > 0 ? time : 1 - time;
  const activity = moving ? smooth(time / .12) * smooth((1 - time) / .12) : 0;
  const bob = activity * .28 * Math.sin(travel * Math.PI * 2) ** 2 + breath;
  const legs = {} as Record<LegName, LegPose>;
  for (const name of Object.keys(walkLegs) as LegName[]) {
    const leg = walkLegs[name];
    const phase = (travel + leg.phase) % 1;
    const stance = phase < walkStance;
    const u = stance ? phase / walkStance : (phase - walkStance) / (1 - walkStance);
    const reach = (stance ? 1 - 2 * smooth(u) : -1 + 2 * smooth(u)) * 2.7 * activity;
    const lift = stance ? 0 : Math.sin(u * Math.PI) ** 2 * 2.2 * activity;
    // The whole body rises by bob; compensate foot targets to keep support paws down.
    const foot = { x: leg.restX + reach, y: leg.floor + bob - lift };
    const ankle = { x: foot.x, y: foot.y - 1.8 };
    const solved = solveLeg(leg.hip, ankle, leg.upper, leg.lower, leg.bend);
    legs[name] = { hip: leg.hip, knee: solved.knee, ankle: solved.ankle, foot, lift };
  }
  return { bob, legs, nod: activity * Math.sin(travel * Math.PI * 2) * 1.0,
    tail: activity * Math.sin(travel * Math.PI * 2) * 4 };
}
export const bonePath = (a: Point, b: Point) => `M${a.x} ${a.y}L${b.x} ${b.y}`;
