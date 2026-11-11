/** Ground-relative ankle trajectory for a slow four-beat walk along +X.
 * Phase is measured in cycles. A supporting paw moves back at WALK_SPEED units/cycle
 * relative to the hip; translate the body forward at that speed to lock it in
 * world space, or move a treadmill at the opposite speed for an in-place view.
 */
export const LEG_UPPER = .43;
export const LEG_LOWER = .41;
export const HIP_HEIGHT = .82;

export const WALK_STANCE = .72;
export const WALK_STRIDE = .54;
export const WALK_SPEED = WALK_STRIDE / WALK_STANCE;
export const ANKLE_HEIGHT = .08;
export const WALK_LIFT = .065;
// Index order: front +Z, front -Z, rear +Z, rear -Z.
// Four distinct beats, with two or three paws supporting the body.
export const LEG_PHASES = [0, .5, .25, .75] as const;

export function sampleWalk(phase: number, legIndex: number) {
  if (!Number.isFinite(phase)) throw new RangeError('Walk phase must be finite');
  if (!Number.isInteger(legIndex) || legIndex < 0 || legIndex > 3) {
    throw new RangeError('Leg index must be an integer from 0 to 3');
  }
  const p = ((phase + LEG_PHASES[legIndex]) % 1 + 1) % 1;
  const stance = p < WALK_STANCE;
  if (stance) return { x: WALK_STRIDE / 2 - WALK_SPEED * p, y: ANKLE_HEIGHT, stance };
  const u = (p - WALK_STANCE) / (1 - WALK_STANCE);
  // Hermite return keeps the same horizontal velocity at liftoff/touchdown.
  // A small overshoot is intentional; the paw slows only after leaving ground.
  const half = WALK_STRIDE / 2;
  const tangent = -WALK_SPEED * (1 - WALK_STANCE);
  const x = -half + tangent * u + (6 * half - 3 * tangent) * u * u + (2 * tangent - 4 * half) * u * u * u;
  const y = ANKLE_HEIGHT + WALK_LIFT * Math.sin(Math.PI * u) ** 2;
  return { x, y, stance };
}
