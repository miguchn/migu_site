import { OrthographicCamera } from "three";

export const CAT_PIXELS_PER_UNIT = 20;

export function createCatCamera() {
  const camera = new OrthographicCamera(-3.5, 3.5, 3, -3, .1, 50);
  // The camera looks along +X: the cat's +X forward axis must recede toward
  // screen upper-right, along the monument's (1, -.5) ground direction.
  camera.position.set(-4, Math.sqrt(32 / 3), 4);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  return camera;
}
