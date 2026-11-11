/** Fixed-length legs on the monument's NE ground axis (screen y = -.5x). */
export type Point = { x: number; y: number };
export const walkBodyLift = 1.6;
export const walkStance = .75;
export const walkLegs = {
  backFar: { hip: { x: -16, y: -7.7 }, restX: -16, floor: 3, upper: 5.1, lower: 5.3, width: 3.6, paw: 1.8, phase: .25, bend: -1 },
  frontFar: { hip: { x: 4, y: -17.7 }, restX: 5, floor: -7.5, upper: 5.1, lower: 5.3, width: 3.6, paw: 1.8, phase: 0, bend: 1 },
  backNear: { hip: { x: -11, y: -5.2 }, restX: -11, floor: 5.5, upper: 5.1, lower: 5.3, width: 4.4, paw: 2.2, phase: .75, bend: -1 },
  frontNear: { hip: { x: 9, y: -15.2 }, restX: 10, floor: -5, upper: 5.1, lower: 5.3, width: 4.4, paw: 2.2, phase: .5, bend: 1 },
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
  const bob = activity * .18 * Math.sin(travel * Math.PI * 2) ** 2 + breath;
  const legs = {} as Record<LegName, LegPose>;
  for (const name of Object.keys(walkLegs) as LegName[]) {
    const leg = walkLegs[name];
    const phase = (travel + leg.phase) % 1;
    const stance = phase < walkStance;
    const u = stance ? phase / walkStance : (phase - walkStance) / (1 - walkStance);
    const reach = (stance ? 1 - 2 * smooth(u) : -1 + 2 * smooth(u)) * 1.6 * activity;
    const lift = stance ? 0 : Math.sin(u * Math.PI) ** 2 * 1.7 * activity;
    // Project the stride onto the same NE axis as the architecture. Bob is
    // compensated at the paws; this is local plane contact, not world foot-lock.
    const foot = { x: leg.restX + reach, y: leg.floor - .5 * reach + bob - lift };
    const ankle = { x: foot.x, y: foot.y - 1.8 };
    const solved = solveLeg(leg.hip, ankle, leg.upper, leg.lower, leg.bend);
    legs[name] = { hip: leg.hip, knee: solved.knee, ankle: solved.ankle, foot, lift };
  }
  return { bob, legs, nod: activity * Math.sin(travel * Math.PI * 2) * .6,
    tail: activity * Math.sin(travel * Math.PI * 2) * 2.5 };
}
export const bonePath = (a: Point, b: Point) => `M${a.x} ${a.y}L${b.x} ${b.y}`;
