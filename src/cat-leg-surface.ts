import * as THREE from 'three';

// One connected eight-sided surface, rather than two independently rotated blocks.
const sections = [-.12, 0, .24, .48, .70, .90, 1.035];
export function createLegSurface(material: THREE.Material, front: boolean) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(sections.length * 8 * 3), 3));
  const indices: number[] = [];
  for (let ring = 0; ring < sections.length - 1; ring++) for (let side = 0; side < 8; side++) {
    const a = ring * 8 + side, b = ring * 8 + (side + 1) % 8;
    indices.push(a, b, b + 8, a, b + 8, a + 8);
  }
  geometry.setIndex(indices);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = front ? 'Continuous foreleg' : 'Continuous haunch';
  mesh.castShadow = mesh.receiveShadow = true;
  // The geometry moves each frame; avoid stale rest-pose bounds.
  mesh.frustumCulled = false;
  shapeLegSurface(mesh, front, 0, -.5, 0, -.92);
  return mesh;
}

export function shapeLegSurface(mesh: THREE.Mesh, front: boolean, kneeX: number, kneeY: number, ankleX: number, ankleY: number) {
  const position = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
  // The sculpture suggests the joint through a continuous sweep. Its visible
  // contour stays much quieter than the underlying two-bone control chain.
  const bendX = (kneeX - ankleX / 2) * (front ? .28 : .75);
  const bendY = (kneeY - ankleY / 2) * .5;
  const widths = front ? [.17, .18, .16, .115, .087, .075, .073] : [.205, .21, .18, .125, .09, .076, .073];
  for (let ring = 0; ring < sections.length; ring++) {
    const t = sections[ring], arc = Math.sin(Math.PI * t);
    const cx = ankleX * t + bendX * arc;
    const cy = ankleY * t + bendY * arc;
    const tx = ankleX + bendX * Math.PI * Math.cos(Math.PI * t);
    const ty = ankleY + bendY * Math.PI * Math.cos(Math.PI * t);
    const length = Math.hypot(tx, ty), nx = -ty / length, ny = tx / length;
    const radius = widths[ring];
    for (let side = 0; side < 8; side++) {
      const angle = Math.PI / 8 + side * Math.PI / 4;
      const across = Math.cos(angle) * radius;
      position.setXYZ(ring * 8 + side, cx + nx * across, cy + ny * across, Math.sin(angle) * radius * .85);
    }
  }
  position.needsUpdate = true;
  mesh.geometry.computeVertexNormals();
}
