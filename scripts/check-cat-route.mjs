import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { createServer } from 'vite';

const near = (actual, expected, label, tolerance = 1e-7) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} versus ${expected}`);
const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' });
try {
  const { createCatCamera, CAT_PIXELS_PER_UNIT } = await server.ssrLoadModule('/src/cat-view.ts');
  const { createCatModel } = await server.ssrLoadModule('/src/cat-model.ts');
  const { poseCat } = await server.ssrLoadModule('/src/cat-model-pose.ts');
  const { sampleWalk, WALK_SPEED } = await server.ssrLoadModule('/src/cat-walk-cycle.ts');
  const { advanceCatProgress, sampleJourney, CAT_WALK_CADENCE } = await server.ssrLoadModule('/src/motion.ts');
  const { journeyStops, bridgeStart, bridgeEnd } = await server.ssrLoadModule('/src/journey.ts');
  const camera = createCatCamera();
  camera.updateMatrixWorld(true);
  const screen = point => {
    const projected = point.clone().project(camera);
    return { x: projected.x * 70, y: -projected.y * 60 };
  };
  const origin = screen(new Vector3());
  const bridge = { x: bridgeEnd.x - bridgeStart.x, y: bridgeEnd.y - bridgeStart.y };
  const model = createCatModel();
  for (const direction of [1, -1]) {
    model.root.rotation.y = direction > 0 ? 0 : Math.PI;
    model.root.position.set(0, 0, 0);
    model.root.updateMatrixWorld(true);
    const forward = screen(new Vector3(1, 0, 0).applyMatrix4(model.root.matrixWorld));
    const delta = { x: forward.x - origin.x, y: forward.y - origin.y };
    near(delta.x * bridge.y - delta.y * bridge.x, 0, 'Projected forward axis must align with the actual bridge');
    assert.ok(direction * (delta.x * bridge.x + delta.y * bridge.y) > 0, 'Projected head points in travel direction');
    near(Math.abs(delta.x), CAT_PIXELS_PER_UNIT / Math.sqrt(2), 'Route phase uses the actual projection scale');
  }
  let locked = 0;
  const epsilon = 1e-4;
  for (const direction of [1, -1]) {
    model.root.rotation.y = direction > 0 ? 0 : Math.PI;
    for (let i = 0; i <= 400; i++) {
      const phase = i / 400;
      const positions = [];
      for (const current of [phase, phase + epsilon]) {
        // Follow the bridge at the speed required by the production stance curve.
        model.root.position.x = direction * WALK_SPEED * current;
        poseCat(model, current, 1, current * 13.7);
        positions.push(model.legs.map(leg => {
          const paw = leg.foot.children.find(object => object.isMesh);
          assert.ok(paw, 'Read the actual paw mesh');
          const attribute = paw.geometry.getAttribute('position');
          return Array.from({ length: attribute.count }, (_, vertex) =>
            screen(new Vector3().fromBufferAttribute(attribute, vertex).applyMatrix4(paw.matrixWorld)));
        }));
      }
      for (let legIndex = 0; legIndex < model.legs.length; legIndex++) {
        const leg = model.legs[legIndex];
        const index = (leg.front ? 0 : 2) + (leg.side > 0 ? 0 : 1);
        const before = sampleWalk(phase, index), after = sampleWalk(phase + epsilon, index);
        // Skip the phase wrap, where a different support placement begins.
        if (!before.stance || !after.stance || Math.abs(after.x - before.x) > .01) continue;
        for (let vertex = 0; vertex < positions[0][legIndex].length; vertex++) {
          near(positions[0][legIndex][vertex].x, positions[1][legIndex][vertex].x, 'Supporting paw world-screen x is locked');
          near(positions[0][legIndex][vertex].y, positions[1][legIndex][vertex].y, 'Supporting paw world-screen y is locked');
        }
        locked++;
      }
    }
  }
  // A sudden chapter jump must retain the same pace at different frame rates,
  // on mobile, and in reverse. Check the actual eased route, including pauses.
  for (const scale of [1.05, 1.16]) for (const dt of [1000 / 120, 1000 / 60, 50]) {
    for (const [start, target] of [[0, 1], [1, 0], [.24, .54], [.70, .13]]) {
      let progress = start;
      for (let frame = 0; frame < 300000 / dt && Math.abs(target - progress) > 1e-7; frame++) {
        const next = advanceCatProgress(progress, target, dt, scale);
        assert.ok((next - progress) * (target - progress) >= 0, 'Travel never reverses while catching up');
        assert.ok(Math.abs(next - progress) <= Math.abs(target - progress), 'No target overshoot');
        const travel = Math.abs(sampleJourney(next).x - sampleJourney(progress).x);
        const limit = CAT_PIXELS_PER_UNIT / Math.sqrt(2) * scale * WALK_SPEED * CAT_WALK_CADENCE * dt / 1000;
        assert.ok(travel <= limit + 1e-7, 'Actual travel exceeds the relaxed cadence');
        progress = next;
      }
      near(progress, target, 'Even a full chapter jump eventually settles', 1e-7);
    }
  }
  let movingSegments = 0;
  for (let i = 1; i < journeyStops.length; i++) {
    const a = journeyStops[i - 1], b = journeyStops[i];
    const dx = b.x - a.x, dy = b.y - a.y;
    if (Math.hypot(dx, dy) <= .1) continue;
    assert.ok(dx > 0, `Forward route reverses at ${a.at}–${b.at}: (${dx}, ${dy})`);
    movingSegments++;
  }
  console.log(`PASS: real camera aligns both headings with the bridge, ${locked} mesh-level supporting-paw screen locks and ${movingSegments} forward route segments`);
} finally {
  await server.close();
}
