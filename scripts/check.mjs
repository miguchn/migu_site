import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import vm from "node:vm";
import { transformWithEsbuild } from "vite";

// Check the actual deployment artifact, including its script policy.
const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
for (const content of ["我是小黑", "ChatLine", "AI Code Review", "Migu Skills", "CHAPTER 01", "CHAPTER 02", "CHAPTER 03"]) {
  assert.ok(html.includes(content), `Missing prerendered content: ${content}`);
}
assert.equal((html.match(/<main\b/g) || []).length, 1);
assert.equal((html.match(/<h1\b/g) || []).length, 1);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(ids).size, ids.length, "Duplicate IDs");
const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
assert.deepEqual(JSON.parse(schema)["@graph"].map((item) => item["@type"]), ["Person", "WebSite"]);
const headers = await readFile(new URL("../dist/_headers", import.meta.url), "utf8");
assert.ok(headers.includes(`'sha256-${createHash("sha256").update(schema).digest("base64")}'`));
assert.ok(!headers.match(/script-src[^;]*'unsafe-inline'/));
assert.ok(!html.match(/class="chapter-copy"[^>]*aria-hidden="true"/));
console.log("PASS: initial HTML, unique IDs, structured data and CSP hash");

// Exercise input and timer behavior deterministically, without waiting on wall time.
class Element {
  attributes = new Map();
  handlers = new Map();
  dataset = {};
  textContent = "";
  title = "";
  classes = new Set();
  classList = {
    contains: (name) => this.classes.has(name),
    add: (name) => this.classes.add(name),
    remove: (name) => this.classes.delete(name),
    toggle: (name, force = !this.classes.has(name)) => {
      if (force) this.classes.add(name); else this.classes.delete(name);
      return force;
    },
  };
  setAttribute(name, value) { this.attributes.set(name, value); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  addEventListener(name, handler) { this.handlers.set(name, handler); }
  closest() { return hero; }
  fire(name, fields = {}) {
    const event = { prevented: false, preventDefault() { this.prevented = true; }, ...fields };
    this.handlers.get(name)?.(event);
    return event;
  }
}
const hero = new Element();
const elements = new Map(["#scene", "#scene-cat", "#island-door", "#cat-speech", "#theme-button", "#scene-caption", "#cat-button", "#door-button", "#island-feedback"].map((id) => [id, new Element()]));
const timers = new Map();
let timerId = 0;
const reduced = { matches: false };
const mobile = { matches: false, handlers: new Map(),
  addEventListener(name, handler) { this.handlers.set(name, handler); },
  change(matches) { this.matches = matches; this.handlers.get("change")?.(); },
};
const source = await readFile(new URL("../src/island-interactions.ts", import.meta.url), "utf8");
const { code } = await transformWithEsbuild(source, "island-interactions.ts", { loader: "ts", format: "cjs" });
const sandbox = {
  exports: {}, module: { exports: {} },
  require: () => ({ translate: (message) => message }),
  document: { querySelector: (selector) => elements.get(selector) },
  matchMedia: (query) => query.includes("max-width") ? mobile : reduced,
  setTimeout: (fn, delay) => { timers.set(++timerId, { fn, delay }); return timerId; },
  clearTimeout: (id) => timers.delete(id),
};
vm.runInNewContext(code, sandbox);
const notifications = [];
sandbox.module.exports.initIslandInteractions((message) => notifications.push(message));
const get = (id) => elements.get(id);
const flush = () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(({ fn }) => fn()); };
const cat = get("#scene-cat");
cat.fire("click");
assert.equal(cat.dataset.pose, "wave");
cat.fire("click");
assert.equal(cat.dataset.pose, "wave", "Repeated input should not interrupt a pose");
flush();
assert.equal(cat.dataset.pose, undefined);
assert.equal(get("#cat-speech").textContent, "");
assert.ok(cat.fire("keydown", { key: " ", repeat: false }).prevented);
assert.equal(cat.dataset.pose, "tilt");
flush();
cat.fire("keydown", { key: "Enter", repeat: true });
assert.equal(cat.dataset.pose, undefined, "Held key should not retrigger a pose");
get("#cat-button").fire("click");
assert.equal(cat.dataset.pose, "stretch");
flush();
const door = get("#island-door");
door.fire("keydown", { key: "Enter" });
assert.equal(door.getAttribute("aria-pressed"), "true");
assert.ok(get("#scene").classes.has("door-open"));
door.fire("keydown", { key: " " });
assert.equal(door.getAttribute("aria-pressed"), "false");
assert.equal(notifications.length, 2);
const theme = get("#theme-button");
theme.fire("click");
theme.fire("click");
flush();
assert.ok(!get("#scene").classes.has("night"));
assert.ok(!get("#scene").classes.has("cat-stargazing"), "Cancelled night timer must not apply in daytime");
assert.equal(theme.getAttribute("aria-pressed"), "false");
reduced.matches = true;
theme.fire("click");
assert.ok([...timers.values()].some(({ delay }) => delay === 0));
flush();
assert.ok(get("#scene").classes.has("night"));
assert.equal(theme.getAttribute("aria-label"), "切换到小岛日景");
console.log("PASS: three cat responses, cleanup, repeated input, keyboard, door state and rapid day/night toggles");

mobile.change(true);
assert.equal(door.getAttribute("tabindex"), "-1");
assert.equal(door.getAttribute("aria-hidden"), "true");
const wasOpen = door.getAttribute("aria-pressed");
door.fire("click");
assert.equal(door.getAttribute("aria-pressed"), wasOpen, "Phone SVG door must not steal the cat's touch target");
cat.fire("click");
assert.equal(get("#cat-speech").textContent, "", "Phone feedback stays out of the SVG");
assert.ok(get("#island-feedback").textContent.includes("喵"));
get("#door-button").fire("click");
assert.equal(door.getAttribute("aria-pressed"), get("#door-button").getAttribute("aria-pressed"));
assert.ok(get("#island-feedback").textContent.includes("门"));
assert.equal(notifications.length, 2, "Phone interaction must not also raise a bottom toast");
// A stale cat completion may finish the pose, but must not replace newer door feedback.
for (const [id, timer] of [...timers]) if (timer.delay === 2600) { timers.delete(id); timer.fn(); }
assert.ok(get("#island-feedback").textContent.includes("门"));
flush();
assert.equal(get("#island-feedback").textContent, "晚安，宇宙。好奇心还醒着。");
cat.fire("click");
theme.fire("click");
assert.equal(get("#island-feedback").textContent, "在不可能的地方，发现可能。");
flush();
assert.equal(get("#island-feedback").textContent, "点点小黑，或试试开门和昼夜。");
mobile.change(false);
assert.equal(door.getAttribute("tabindex"), "0");
assert.equal(door.getAttribute("aria-hidden"), "false");
assert.equal(get("#cat-speech").textContent, "");
console.log("PASS: mobile feedback races, restoration, synchronized door controls and viewport changes");


// Tread contacts and reverse scrolling must remain valid after a visual gait change.
const { createServer } = await import("vite");
const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: "custom" });
try {
  const { translate } = await server.ssrLoadModule("/src/i18n.ts");
  const { renderPage } = await server.ssrLoadModule("/src/page.ts");
  const english = translate(renderPage(), "en");
  const remaining = english.replace(/<div class="language-switch"[\s\S]*?<\/div>/, "").match(/[\u3400-\u9fff]+/g);
  assert.equal(remaining, null, `Untranslated page text: ${remaining}`);
  assert.ok(english.includes("Curiosity"));
  assert.ok(english.includes("I’m Xiaohei"));
  console.log("PASS: English coverage for page, chapters, SVG labels and controls");
  const { journeyStops } = await server.ssrLoadModule("/src/journey.ts");
  const { sampleJourney, sampleGait, restingProgress } = await server.ssrLoadModule("/src/motion.ts");
  for (const stop of journeyStops) {
    const sample = sampleJourney(stop.at);
    assert.ok(Math.abs(sample.x - stop.x) < 1e-7 && Math.abs(sample.y - stop.y) < 1e-7);
    assert.ok(Math.abs(sample.hop) < 1e-7, "Paws should return to the tread at every stop");
  }
  for (let i = 0; i <= 1000; i++) {
    const p = i / 1000;
    const sample = sampleJourney(p);
    assert.ok([sample.x, sample.y, sample.hop].every(Number.isFinite));
    assert.ok(sample.hop >= 0 && sample.hop <= 1.9, "Keep stair travel grounded");
    assert.ok(restingProgress(p, 1) >= p - 1e-7);
    assert.ok(restingProgress(p, -1) <= p + 1e-7);
  }
  const { walkLegs, walkStance, solveLeg } = await server.ssrLoadModule("/src/cat-gait.ts");
  const near = (actual, expected, label, tolerance = 1e-7) =>
    assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} versus ${expected}`);
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const points = ["hip", "knee", "ankle", "foot"];
  const samePose = (a, b, label, tolerance = 1e-7) => {
    for (const field of ["bob", "nod", "tail"]) near(a[field], b[field], `${label}/${field}`, tolerance);
    for (const name of Object.keys(walkLegs)) {
      for (const point of points) {
        near(a.legs[name][point].x, b.legs[name][point].x, `${label}/${name}/${point}/x`, tolerance);
        near(a.legs[name][point].y, b.legs[name][point].y, `${label}/${name}/${point}/y`, tolerance);
      }
      near(a.legs[name].lift, b.legs[name].lift, `${label}/${name}/lift`, tolerance);
    }
  };
  for (const direction of [-1, 1]) {
    for (const breath of [-.08, 0, .08]) {
      const rest = sampleGait(0, false, direction, breath);
      for (const t of [0, 1]) samePose(sampleGait(t, true, direction, breath), rest, "Tread endpoint must settle");
      let previous;
      for (let i = 0; i <= 1000; i++) {
        const t = i / 1000;
        const pose = sampleGait(t, true, direction, breath);
        assert.ok([pose.bob, pose.nod, pose.tail].every(Number.isFinite));
        assert.ok(Math.abs(pose.bob) < 1, "Body rise should stay subtle");
        let planted = 0;
        for (const [name, leg] of Object.entries(pose.legs)) {
          const cfg = walkLegs[name];
          for (const point of points) assert.ok([leg[point].x, leg[point].y].every(Number.isFinite), `Nonfinite ${name}/${point}`);
          near(distance(leg.hip, leg.knee), cfg.upper, `${name} upper bone length`);
          near(distance(leg.knee, leg.ankle), cfg.lower, `${name} lower bone length`);
          // A reachable target must join the rendered lower leg to the rendered paw.
          near(leg.ankle.x, leg.foot.x, `${name} ankle/paw attachment x`);
          near(leg.ankle.y, leg.foot.y - 1.8, `${name} ankle/paw attachment y`);
          near(leg.hip.x, cfg.hip.x, `${name} hip anchor x`);
          near(leg.hip.y, cfg.hip.y, `${name} hip anchor y`);
          const groundGap = cfg.floor - (leg.foot.y - pose.bob);
          assert.ok(groundGap >= -1e-7, `${name} paw penetrates its contact plane`);
          // Round caps extend beyond the centerline: include their full radius.
          const upperEdge = Math.max(leg.hip.y, leg.knee.y) + cfg.width / 2 - pose.bob;
          const lowerEdge = Math.max(leg.knee.y, leg.ankle.y) + cfg.width * .75 / 2 - pose.bob;
          assert.ok(leg.knee.y - pose.bob <= cfg.floor + 1e-7, `${name} knee penetrates its contact plane`);
          assert.ok(leg.ankle.y - pose.bob <= cfg.floor + 1e-7, `${name} ankle penetrates its contact plane`);
          assert.ok(upperEdge <= cfg.floor + 1e-7, `${name} upper-leg stroke penetrates its contact plane`);
          assert.ok(lowerEdge <= cfg.floor + 1e-7, `${name} lower-leg stroke penetrates its contact plane`);
          assert.ok(leg.lift >= 0 && Number.isFinite(leg.lift));
          near(groundGap, leg.lift, `${name} body-bob compensation`);
          const travel = direction > 0 ? t : 1 - t;
          if ((travel + cfg.phase) % 1 < walkStance) {
            near(groundGap, 0, `${name} support phase must stay grounded`);
            planted++;
          }
          if (previous) for (const point of points) {
            assert.ok(distance(leg[point], previous.legs[name][point]) < .1, `${name}/${point} discontinuity`);
          }
        }
        assert.ok(planted >= 3, "A relaxed walk must retain at least three supporting paws");
        samePose(sampleGait(t, false, direction, breath), rest, "Idle/reduced-motion pose");
        samePose(pose, sampleGait(1 - t, true, -direction, breath), "Reverse-time symmetry");
        previous = pose;
      }
      for (const t of [.12, .25, .5, .75, .88]) {
        samePose(sampleGait(t - 1e-6, true, direction, breath), sampleGait(t + 1e-6, true, direction, breath), "Stance/swing boundary", 1e-4);
      }
    }
  }
  // A four-beat walk lifts one paw at a time: hind, then fore, on each side.
  const order = ["backNear", "frontNear", "backFar", "frontFar"];
  for (const direction of [-1, 1]) {
    for (let i = 0; i < order.length; i++) {
      const progress = (i + .5) / 4;
      const pose = sampleGait(direction > 0 ? progress : 1 - progress, true, direction);
      const lifted = Object.entries(pose.legs).filter(([, leg]) => leg.lift > 1e-7).map(([name]) => name);
      assert.deepEqual(lifted, [order[i]], `Four-beat paw order at quarter ${i}, direction ${direction}`);
      for (const [name, leg] of Object.entries(pose.legs)) {
        if (name !== order[i]) near(leg.foot.y - pose.bob, walkLegs[name].floor, `${name} three-paw support`);
      }
    }
  }
  // The solver must preserve lengths even when a future foot target needs clamping.
  for (const target of [{ x: 0, y: 0 }, { x: .01, y: 0 }, { x: 0, y: 8.9 }, { x: 30, y: -20 }]) {
    for (const bend of [-1, 1]) {
      const hip = { x: 0, y: 0 }, solved = solveLeg(hip, target, 4.4, 4.5, bend);
      assert.ok([...Object.values(solved.knee), ...Object.values(solved.ankle)].every(Number.isFinite));
      near(distance(hip, solved.knee), 4.4, "Clamped upper bone length");
      near(distance(solved.knee, solved.ankle), 4.5, "Clamped lower bone length");
    }
  }
  console.log(`PASS: ${journeyStops.length} route contacts, 1001 path samples and reverse settling`);
  console.log("PASS: 6006 IK poses, fixed bone lengths, planted paws, stroke clearance, three-paw support, four-beat order, breath compensation and continuous reverse gait");

} finally {
  await server.close();
}
