import { walkLegs, type LegName, type LegPose, type Point, type sampleGait } from "./cat-gait";

/** Shared by the static SVG and its animated poses; no separate preview model. */
export const walkPalette = {
  top: "#536266",
  side: "#303d40",
  shade: "#222f33",
  eye: "#e3d8b5",
  collar: "#ba8872",
};

const xy = ({ x, y }: Point) => `${x.toFixed(4)} ${y.toFixed(4)}`;
const polygon = (points: Point[]) => `M${points.map(xy).join("L")}Z`;
export type CatPoint = { u: number; v: number; h: number };
/** Longitudinal, depth and height are projected separately, so a turn never shears the head. */
export const projectCatPoint = ({ u, v, h }: CatPoint, facing = 1): Point => ({
  x: u * facing + v, y: -.5 * u * facing + .5 * v - h,
});
export function catPlane(points: CatPoint[], facing: number, radius = 0) {
  const projected = points.map((point) => projectCatPoint(point, facing));
  if (!radius) return polygon(projected);
  const corners = projected.map((point, i) => {
    const before = projected[(i + projected.length - 1) % projected.length], after = projected[(i + 1) % projected.length];
    const toward = (other: Point) => {
      const d = Math.hypot(other.x - point.x, other.y - point.y);
      const t = Math.min(.3, radius / (d || 1));
      return { x: point.x + (other.x - point.x) * t, y: point.y + (other.y - point.y) * t };
    };
    return { before: toward(before), point, after: toward(after) };
  });
  return `M${xy(corners[0].after)}${corners.slice(1).map((c) => `L${xy(c.before)}Q${xy(c.point)} ${xy(c.after)}`).join("")}L${xy(corners[0].before)}Q${xy(corners[0].point)} ${xy(corners[0].after)}Z`;
}
export function projectLegPose(pose: LegPose, name: LegName, facing: number): LegPose {
  const depth = name.endsWith("Far") ? -5 : 0;
  const project = ({ x, y }: Point) => projectCatPoint({ u: x - depth, v: depth, h: -.5 * x + depth - y }, facing);
  return { hip: project(pose.hip), knee: project(pose.knee), ankle: project(pose.ankle), foot: project(pose.foot), lift: pose.lift };
}
const offset = (p: Point, n: Point, width: number): Point => ({ x: p.x + n.x * width, y: p.y + n.y * width });
const normal = (a: Point, b: Point): Point => {
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: (b.y - a.y) / length, y: (a.x - b.x) / length };
};

/** A continuous tapered limb surrounds the two bones, with the hip hidden in the body. */
export function legShape(pose: LegPose, name: LegName) {
  const width = walkLegs[name].width;
  const upper = normal(pose.hip, pose.knee), lower = normal(pose.knee, pose.ankle);
  const points = [
    offset(pose.hip, upper, -width * .5),
    offset(pose.knee, upper, -width * .39),
    offset(pose.knee, lower, -width * .35),
    offset(pose.ankle, lower, -width * .28),
    offset(pose.ankle, lower, width * .28),
    offset(pose.knee, lower, width * .35),
    offset(pose.knee, upper, width * .39),
    offset(pose.hip, upper, width * .5),
  ];
  // The knee guides a continuous contour; it is not an exposed mechanical joint.
  const outline = `M${xy(points[0])}C${xy(points[1])} ${xy(points[2])} ${xy(points[3])}Q${xy(pose.ankle)} ${xy(points[4])}C${xy(points[5])} ${xy(points[6])} ${xy(points[7])}Z`;
  return { outline, facet: "", vertices: [...points, pose.ankle] };
}

/** A small rounded paw keeps its sole on the architectural ground plane. */
export function pawShape(name: LegName, facing = 1) {
  const half = walkLegs[name].paw * .82;
  const points = [
    { u: -half, v: 0, h: .35 },
    { u: -half, v: 0, h: 2.2 },
    { u: half * .6, v: 0, h: 2.2 },
    { u: half, v: 0, h: .55 },
    { u: half, v: 0, h: 0 },
    { u: half * .45, v: 0, h: 0 },
    { u: -half * .65, v: 0, h: 0 },
  ].map((point) => projectCatPoint(point, facing));
  const top = `M${xy(points[0])}C${xy(points[1])} ${xy(points[2])} ${xy(points[3])}Q${xy(points[4])} ${xy(points[5])}L${xy(points[6])}Q${xy(points[0])} ${xy(points[0])}Z`;
  return { top, side: "", vertices: points };
}

export type WalkingPose = ReturnType<typeof sampleGait>;

/** Bind once, then use the exact same pose painter on the website and the design bench. */
export function createWalkingRig(root: SVGGElement) {
  const body = root.querySelector<SVGGElement>(".cat-walking")!;
  const views = [1, -1].map((direction) => {
    const view = root.querySelector<SVGGElement>(`[data-cat-view="${direction}"]`)!;
    return { direction, view,
      head: view.querySelector<SVGGElement>(".cat-head")!, tail: view.querySelector<SVGGElement>(".cat-tail")!,
      limbs: (Object.keys(walkLegs) as LegName[]).map((name) => ({ name,
        shape: view.querySelector<SVGPathElement>(`[data-leg="${name}"] .cat-leg-shape`)!,
        facet: view.querySelector<SVGPathElement>(`[data-leg="${name}"] .cat-leg-facet`)!,
        paw: view.querySelector<SVGGElement>(`[data-paw="${name}"]`)!,
      })),
    };
  });
  return (gait: WalkingPose, facing = 1) => {
    body.setAttribute("transform", `translate(0 ${-gait.bob})`);
    for (const view of views) view.view.style.display = view.direction === facing ? "" : "none";
    const view = views.find((item) => item.direction === facing)!;
    const tailPivot = projectCatPoint({ u: -15, v: -1, h: 13 }, facing);
    view.head.setAttribute("transform", `rotate(${gait.nod * facing} 0 6)`);
    view.tail.setAttribute("transform", `rotate(${gait.tail * facing} ${xy(tailPivot)})`);
    for (const limb of view.limbs) {
      const pose = projectLegPose(gait.legs[limb.name], limb.name, facing), art = legShape(pose, limb.name);
      limb.shape.setAttribute("d", art.outline);
      limb.facet.setAttribute("d", art.facet);
      limb.paw.setAttribute("transform", `translate(${pose.foot.x} ${pose.foot.y})`);
    }
  };
}
