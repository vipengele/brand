#!/usr/bin/env node
// biome-ignore-all lint/correctness/noNodejsModules: node build tooling, run by hand and by the build — it never ships to a browser, which is the rule's concern.
// biome-ignore-all lint/correctness/noProcessGlobal: same — this is a CLI script; argv and exit codes are how it talks to its caller.
/**
 * build-png.js
 *
 * Renders the published raster set from dist/svg into dist/png.
 *
 * The manifest below is the whole contract: a context that needs a raster
 * (a favicon, a store icon, a social card) gets a size named here rather
 * than rasterizing on demand, because the set that ships has to be the set
 * the package promises in its exports.
 *
 * Input is always dist/svg — the outlined vectors. The src/ files carry live
 * <text> and render wrongly wherever Poppins is not installed.
 *
 * Usage:
 *   node assets/tools/build-png.js
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let Resvg;
try {
  ({ Resvg } = await import("@resvg/resvg-js"));
} catch {
  console.error("\n  Missing dep — run: pnpm install\n");
  process.exit(1);
}

const SVG_DIR = path.resolve(__dirname, "..", "..", "dist", "svg");
const PNG_DIR = path.resolve(__dirname, "..", "..", "dist", "png");

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

// Square icons, rendered at their own edge length.
const ICONS = [
  ["vipengele-icon.svg", "icon", [16, 32, 48, 64, 128, 180, 256, 512, 1024]],
  ["vipengele-icon-dark.svg", "icon-dark", [256, 512, 1024]],
  // The mark's three faces stop separating below 16px, so anything favicon-sized
  // takes the tight cut — less padding, more ink in the same box.
  ["vipengele-icon-tight.svg", "favicon", [16, 32, 48]],
];

// One-off square renders whose name does not follow the <stem>-<size> pattern.
const PLATES = [
  ["vipengele-icon-light-plate.svg", "apple-touch-icon-180.png", 180],
  ["vipengele-icon-light-plate.svg", "app-icon-light-512.png", 512],
  ["vipengele-icon-dark-plate.svg", "app-icon-dark-512.png", 512],
];

// Lockups at 2x their intrinsic size, for embedding where a vector is awkward.
const LOCKUPS_2X = ["vipengele-logo.svg", "vipengele-logo-dark.svg", "vipengele-logo-horizontal.svg", "vipengele-logo-horizontal-dark.svg"];

// Social cards: a lockup centred on a solid ground at the size the platforms crop to.
const OG = [
  ["vipengele-logo-horizontal.svg", "og-light-1200x630.png", "#FFFFFF"],
  ["vipengele-logo-horizontal-dark.svg", "og-dark-1200x630.png", "#0B1220"],
];
const OG_W = 1200;
const OG_H = 630;
// The lockup spans this fraction of the card's width, unless that would push it
// past OG_MAX_H of the height — a wide lockup is limited by width, a tall one by height.
const OG_WIDTH_FRACTION = 0.62;
const OG_MAX_H = 0.55;

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function read(name) {
  const p = path.join(SVG_DIR, name);
  if (!fs.existsSync(p)) {
    console.error(`\n  Missing ${path.relative(process.cwd(), p)} — run build-svg.js first\n`);
    process.exit(1);
  }
  return fs.readFileSync(p, "utf8");
}

function intrinsic(svg) {
  const vb = svg.match(/viewBox="([-\d.\s]+)"/);
  if (!vb) throw new Error("no viewBox");
  const [x, y, w, h] = vb[1].trim().split(/\s+/).map(Number);
  return { x, y, w, h };
}

function renderWidth(svg, width) {
  return new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
}

const written = [];
function write(file, buf) {
  fs.writeFileSync(path.join(PNG_DIR, file), buf);
  written.push(file);
  console.log(`  ✓ ${file}`);
}

// A social card is a wrapper SVG rather than a composite of rendered pixels:
// the lockup's own markup (gradients included) is inlined under a transform, so
// the whole card rasterizes in one pass at full resolution.
function socialCard(svg, background) {
  const { x, y, w, h } = intrinsic(svg);
  let tw = OG_W * OG_WIDTH_FRACTION;
  let th = (tw * h) / w;
  if (th > OG_H * OG_MAX_H) {
    th = OG_H * OG_MAX_H;
    tw = (th * w) / h;
  }
  const s = tw / w;
  const tx = (OG_W - tw) / 2;
  const ty = (OG_H - th) / 2;
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}">` +
    `<rect width="${OG_W}" height="${OG_H}" fill="${background}"/>` +
    `<g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${s.toFixed(6)}) translate(${-x} ${-y})">` +
    `${inner}</g></svg>`
  );
}

// A PNG-embedded ICO: a 6-byte header, one 16-byte directory entry per image,
// then the PNG payloads. resvg emits PNG only, and this is the one format a
// .ico may wrap verbatim — so no re-encoding, and no raster dependency.
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = [];
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    // 0 means 256 in this field; every size here is smaller, but the encoding
    // is the format's, not ours.
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette entries
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

fs.mkdirSync(PNG_DIR, { recursive: true });
console.log("\nvipengele · rasterizing dist/svg → dist/png\n");

try {
  const faviconPngs = [];

  for (const [file, stem, sizes] of ICONS) {
    const svg = read(file);
    for (const size of sizes) {
      const data = renderWidth(svg, size);
      write(`${stem}-${size}.png`, data);
      if (stem === "favicon") faviconPngs.push({ size, data });
    }
  }

  for (const [file, out, size] of PLATES) {
    write(out, renderWidth(read(file), size));
  }

  for (const file of LOCKUPS_2X) {
    const svg = read(file);
    write(`${path.basename(file, ".svg")}@2x.png`, renderWidth(svg, Math.round(intrinsic(svg).w * 2)));
  }

  for (const [file, out, background] of OG) {
    write(out, renderWidth(socialCard(read(file), background), OG_W));
  }

  fs.writeFileSync(path.join(PNG_DIR, "favicon.ico"), ico(faviconPngs));
  written.push("favicon.ico");
  console.log("  ✓ favicon.ico");

  console.log(`\nDone. ${written.length} file(s) written to dist/png/\n`);
} catch (e) {
  console.error(`\n  ERROR: ${e?.message || e}\n`);
  process.exit(1);
}
