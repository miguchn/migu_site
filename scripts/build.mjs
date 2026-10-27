import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { build, createServer } from "vite";

// Use the same template for static HTML and development, without an SSR runtime.
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: "custom",
});
let markup;
try {
  const { renderPage } = await server.ssrLoadModule("/src/page.ts");
  markup = renderPage();
} finally {
  await server.close();
}
await build();
const htmlPath = new URL("../dist/index.html", import.meta.url);
const html = await readFile(htmlPath, "utf8");
const placeholder = '<div id="app"></div>';
if (!html.includes(placeholder)) throw new Error("Missing prerender placeholder");
await writeFile(htmlPath, html.replace(placeholder, () => `<div id="app">${markup}</div>`));

// Authorize only the non-executable JSON-LD block, keeping script-src restrictive.
const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
if (!schema) throw new Error("Missing site structured data");
const hash = createHash("sha256").update(schema).digest("base64");
const headersPath = new URL("../dist/_headers", import.meta.url);
const headers = await readFile(headersPath, "utf8");
if (!headers.includes("script-src 'self';")) throw new Error("Unexpected script CSP");
await writeFile(headersPath, headers.replace("script-src 'self';", `script-src 'self' 'sha256-${hash}';`));
