import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transformWithEsbuild } from 'vite';

const source = await readFile(new URL('../src/cat-walk-cycle.ts', import.meta.url), 'utf8');
const { code } = await transformWithEsbuild(source, 'cat-walk-cycle.ts', { loader: 'ts', format: 'esm' });
const { sampleWalk, ANKLE_HEIGHT, WALK_LIFT, WALK_SPEED, LEG_PHASES, WALK_STANCE, WALK_STRIDE, HIP_HEIGHT, LEG_UPPER, LEG_LOWER } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const near = (a, b, tolerance = 1e-9) => assert.ok(Math.abs(a - b) <= tolerance, `${a} ≠ ${b}`);
const h = 1e-6;
for (let i = 0; i <= 4000; i++) {
  const phase = i / 4000;
  let supporting = 0;
  for (let leg = 0; leg < 4; leg++) {
    const pose = sampleWalk(phase, leg);
    assert.ok(Number.isFinite(pose.x) && Number.isFinite(pose.y));
    assert.ok(pose.y >= ANKLE_HEIGHT - 1e-12 && pose.y <= ANKLE_HEIGHT + WALK_LIFT + 1e-12);
    assert.ok(Math.abs(pose.x) < WALK_STRIDE * .53, 'Paw exceeds the reachable stride');
    const hipDistance = Math.hypot(pose.x, HIP_HEIGHT - pose.y);
    assert.ok(hipDistance < LEG_UPPER + LEG_LOWER && hipDistance > Math.abs(LEG_UPPER - LEG_LOWER), 'Ankle outside two-bone reach');
    if (pose.stance) {
      supporting++;
      near(pose.y, ANKLE_HEIGHT);
      const after = sampleWalk(phase + h, leg);
      if (after.stance && Math.abs(after.x - pose.x) < .01) {
        near(after.x + (phase + h) * WALK_SPEED, pose.x + phase * WALK_SPEED, 1e-9);
      }
    }
    const repeat = sampleWalk(phase + 3, leg);
    near(repeat.x, pose.x); near(repeat.y, pose.y);
  }
  assert.ok(supporting >= 2 && supporting <= 3, 'A natural walk alternates two and three supporting paws');
}
for (let leg = 0; leg < 4; leg++) {
  for (const boundary of [0, WALK_STANCE, 1]) {
    const t = boundary - LEG_PHASES[leg];
    const before = sampleWalk(t - h, leg), at = sampleWalk(t, leg), after = sampleWalk(t + h, leg);
    near(before.x, after.x, 2 * WALK_SPEED * h + 1e-9); near(before.y, after.y, 2e-6);
    near((at.x - before.x) / h, (after.x - at.x) / h, .0002);
    near((at.y - before.y) / h, (after.y - at.y) / h, .0002);
  }
}
assert.throws(() => sampleWalk(NaN, 0), RangeError);
assert.throws(() => sampleWalk(0, 4), RangeError);
console.log('PASS: 16004 3D paw poses, reachable IK targets, two/three-foot support, world-locked stance, continuous position/velocity, periodic cycle');
