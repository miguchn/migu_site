import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { createServer } from 'vite';

const near = (actual, expected, label, tolerance = 1e-7) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} versus ${expected}`);
const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' });
try {
  const { createCatModel } = await server.ssrLoadModule('/src/cat-model.ts');
  const { poseCat } = await server.ssrLoadModule('/src/cat-model-pose.ts');
  const { sampleWalk, ANKLE_HEIGHT, LEG_UPPER, LEG_LOWER } = await server.ssrLoadModule('/src/cat-walk-cycle.ts');
  const model = createCatModel();
  assert.equal(model.legs.length, 4, 'The cat must have four independent leg chains');
  assert.equal(new Set(model.legs.map(leg => `${leg.front}/${leg.side}`)).size, 4);
  let meshes = 0;
  model.root.traverse(object => {
    if (!object.isMesh) return;
    meshes++;
    for (const name of ['position', 'normal']) {
      const attribute = object.geometry.getAttribute(name);
      assert.ok(attribute?.count > 0, `${object.name || 'Mesh'} has no ${name}`);
      assert.ok(Array.from(attribute.array).every(Number.isFinite), `Nonfinite mesh ${name}`);
    }
  });
  assert.ok(meshes >= 16, 'Expected a volumetric body, head, ears, tail and articulated limbs');
  let poses = 0;
  for (const facing of [1, -1]) {
    model.root.rotation.y = facing === 1 ? 0 : Math.PI;
    assert.ok(model.root.scale.x > 0 && model.root.scale.y > 0 && model.root.scale.z > 0, 'Turn by rotation, preserving handedness');
    for (const reduced of [false, true]) {
      for (const activity of [0, .35, 1]) {
        for (let i = 0; i <= 400; i++) {
          const phase = i / 400;
          poseCat(model, phase, activity, phase * 19.1, reduced);
          near(model.root.matrixWorld.determinant(), 1, 'Direction is a rigid rotation');
          const forward = new Vector3(1, 0, 0).transformDirection(model.root.matrixWorld);
          near(forward.x, facing, 'Model heading');
          let supporting = 0;
          for (const leg of model.legs) {
            const index = (leg.front ? 0 : 2) + (leg.side > 0 ? 0 : 1);
            const step = sampleWalk(phase, index);
            const hip = leg.pivot.getWorldPosition(new Vector3());
            const knee = leg.lower.getWorldPosition(new Vector3());
            const ankle = leg.foot.getWorldPosition(new Vector3());
            near(hip.distanceTo(knee), LEG_UPPER, 'Actual upper bone length');
            near(knee.distanceTo(ankle), LEG_LOWER, 'Actual lower bone length');
            near(ankle.y, ANKLE_HEIGHT + (step.y - ANKLE_HEIGHT) * activity, 'IK ankle target');
            const skinPositions = leg.surface.geometry.getAttribute('position');
            for (let vertex = 0; vertex < skinPositions.count; vertex++) {
              const point = new Vector3().fromBufferAttribute(skinPositions, vertex).applyMatrix4(leg.surface.matrixWorld);
              assert.ok([point.x, point.y, point.z].every(Number.isFinite), 'Continuous leg surface remains finite');
              assert.ok(point.y >= -1e-7, 'Continuous leg surface stays above the ground');
            }
            const sole = leg.foot.children.find(object => object.isMesh);
            assert.ok(sole, 'Each foot must carry its actual paw mesh');
            const positions = sole.geometry.getAttribute('position');
            let minimum = Infinity;
            for (let vertex = 0; vertex < positions.count; vertex++) {
              const point = new Vector3().fromBufferAttribute(positions, vertex).applyMatrix4(sole.matrixWorld);
              assert.ok([point.x, point.y, point.z].every(Number.isFinite));
              minimum = Math.min(minimum, point.y);
            }
            assert.ok(minimum >= -1e-7, `Paw mesh penetrates ground: ${minimum}, phase ${phase}`);
            near(minimum, (step.y - ANKLE_HEIGHT) * activity, 'Actual sole elevation');
            const footX = new Vector3(1, 0, 0).transformDirection(sole.matrixWorld);
            const footZ = new Vector3(0, 0, 1).transformDirection(sole.matrixWorld);
            near(footX.y, 0, 'Paw longitudinal axis stays level');
            near(footZ.y, 0, 'Paw lateral axis stays level');
            if (step.stance || activity === 0) {
              supporting++;
              near(minimum, 0, 'Supporting paw mesh contacts ground');
            }
          }
          assert.ok(supporting >= 2, 'Keep at least two supporting paws during the four-beat walk');
          poses++;
        }
      }
    }
  }
  console.log(`PASS: ${meshes} finite 3D meshes, ${poses} actual rig poses, four independent limbs, both rigid headings, fixed bones, horizontal soles and mesh-level ground contact`);
} finally {
  await server.close();
}
