import { MathUtils } from "three";
import type { createCatModel } from "./cat-model";
import { sampleWalk, LEG_UPPER, LEG_LOWER, HIP_HEIGHT, ANKLE_HEIGHT } from "./cat-walk-cycle";

import { shapeLegSurface } from "./cat-leg-surface";

export type CatModel = ReturnType<typeof createCatModel>;

/** Two-bone IK with level soles. All distances are in the mesh's world units. */
export function poseCat(model: CatModel, phase: number, activity: number, time: number, reduced = false) {
  const idleBreath = reduced ? 0 : Math.sin(time * 1.8) * .004;
  const stepBob = reduced ? 0 : Math.sin(phase * Math.PI * 4) * .009 * activity;
  const bob = idleBreath + stepBob;
  model.body.position.y = bob;
  model.body.rotation.x = reduced ? 0 : Math.sin(phase * Math.PI * 2) * .012 * activity;
  model.head.rotation.z = reduced ? 0 : Math.sin(time * 1.3) * .009 + Math.sin(phase * Math.PI * 2) * .014 * activity;
  model.tail.rotation.x = reduced ? 0 : Math.sin(time * 1.5) * .045;
  model.tail.rotation.z = reduced ? 0 : Math.sin(phase * Math.PI * 2) * .04 * activity;
  const blink = time % 5.7;
  const open = !reduced && blink > 5.4 ? Math.max(.08, Math.abs((blink - 5.55) / .15)) : 1;
  model.head.traverse(object => { if (object.name === "eye") object.scale.y = open; });
  for (const leg of model.legs) {
    const step = sampleWalk(phase, (leg.front ? 0 : 2) + (leg.side > 0 ? 0 : 1));
    const x = step.x * activity;
    const y = ANKLE_HEIGHT + (step.y - ANKLE_HEIGHT) * activity;
    leg.pivot.position.y = HIP_HEIGHT + bob;
    const dy = y - leg.pivot.position.y;
    const upper = LEG_UPPER, lower = LEG_LOWER;
    const distance = Math.min(upper + lower - .00001, Math.hypot(x, dy));
    const alpha = Math.acos(MathUtils.clamp((upper ** 2 + distance ** 2 - lower ** 2) / (2 * upper * distance), -1, 1));
    const angle = Math.atan2(x, -dy) + (leg.front ? -1 : 1) * alpha;
    const kneeX = Math.sin(angle) * upper, kneeY = -Math.cos(angle) * upper;
    const shin = Math.atan2(x - kneeX, -(dy - kneeY));
    leg.upper.rotation.z = angle;
    leg.lower.rotation.z = shin - angle;
    leg.foot.rotation.z = -shin;
    shapeLegSurface(leg.surface, leg.front, kneeX, kneeY, x, dy);
  }
  model.root.updateMatrixWorld(true);
}
