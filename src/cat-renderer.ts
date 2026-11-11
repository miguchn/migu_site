import * as THREE from "three";
import { createCatModel } from "./cat-model";
import { poseCat } from "./cat-model-pose";
import { createCatCamera } from "./cat-view";

export type CatFrame = { phase: number; activity: number; facing: number; time: number; reduced: boolean; night: number };

/** A transparent 3D viewport in SVG coordinates inherits the route, scaling and paint order. */
export function createCatRenderer(root: SVGGElement) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(140, 120);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const scene = new THREE.Scene();
  const camera = createCatCamera();
  const ambient = new THREE.HemisphereLight(0xfff4e2, 0x74776f, 2.0);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xfff3df, 3.0);
  key.position.set(-3, 6, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xdce8ec, .85);
  fill.position.set(3, 2, -4); scene.add(fill);
  const model = createCatModel(); scene.add(model.root);
  const viewport = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  viewport.setAttribute("x", "-70"); viewport.setAttribute("y", "-60");
  viewport.setAttribute("width", "140"); viewport.setAttribute("height", "120");
  viewport.setAttribute("class", "journey-cat-3d");
  viewport.style.pointerEvents = "none";
  const host = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
  host.style.cssText = "width:140px;height:120px;pointer-events:none";
  renderer.domElement.style.cssText = "display:block;width:140px;height:120px";
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.append(renderer.domElement); viewport.append(host); root.append(viewport);
  const fallback = root.querySelector<SVGGElement>(".journey-cat-pose")!;
  let lost = false;
  let previousTime: number | undefined;
  renderer.domElement.addEventListener("webglcontextlost", event => {
    event.preventDefault(); lost = true; viewport.style.display = "none"; fallback.style.display = "";
  });
  renderer.domElement.addEventListener("webglcontextrestored", () => { lost = false; });
  function paint(frame: CatFrame) {
    if (lost) return;
    const target = frame.facing > 0 ? 0 : Math.PI;
    const delta = Math.atan2(Math.sin(target - model.root.rotation.y), Math.cos(target - model.root.rotation.y));
    const dt = previousTime === undefined ? 1 : Math.min(.05, Math.max(0, frame.time - previousTime));
    previousTime = frame.time;
    model.root.rotation.y = frame.reduced || Math.abs(delta) < .015 ? target : model.root.rotation.y + delta * (1 - Math.exp(-dt / .075));
    poseCat(model, frame.phase, frame.activity, frame.time, frame.reduced);
    ambient.intensity = 2.0 - frame.night * .4;
    key.intensity = 3.0 - frame.night * 1.1;
    fill.intensity = .85 - frame.night * .2;
    renderer.render(scene, camera);
    viewport.style.display = "";
    fallback.style.display = "none";
    root.dataset.renderer = "webgl";
    root.dataset.heading = model.root.rotation.y.toFixed(5);
    if (import.meta.env.DEV) root.dataset.frameTime = String(frame.time * 1000);
  }
  function dispose() {
    viewport.remove(); fallback.style.display = "";
    renderer.dispose();
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) material.dispose();
      }
    });
  }
  if (import.meta.hot) import.meta.hot.dispose(dispose);
  const isFacing = (facing: number) => Math.cos((facing > 0 ? 0 : Math.PI) - model.root.rotation.y) > Math.cos(.015);
  return { paint, dispose, isFacing };
}
