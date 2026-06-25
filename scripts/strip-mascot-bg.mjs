#!/usr/bin/env node
/**
 * Strip the baked-in transparency checkerboard from the lingua-* mascot PNGs.
 *
 * The mascot art shipped RGBA but with every pixel opaque — the "transparent"
 * checkerboard is real pixels. This makes the background actually transparent by
 * flood-filling from the border (guaranteed background) inward, clearing pixels
 * that match the sampled background palette. The panda's dark outline stops the
 * fill, so the art (and its interior whites) is preserved.
 *
 * Usage: node scripts/strip-mascot-bg.mjs
 * Idempotent-ish: skips files whose corners are already transparent.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const PUB = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const TOL = 38; // colour distance (max per-channel) that still counts as background

// --- decode ---------------------------------------------------------------
function decodePNG(buf) {
  let off = 8, w, h, bitDepth, colorType, idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.slice(off + 8, off + 8 + len);
    if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; }
    else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
    off += 12 + len;
  }
  if (colorType !== 6 || bitDepth !== 8) throw new Error(`unsupported PNG (colorType ${colorType}, depth ${bitDepth})`);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = 4, stride = w * bpp;
  const out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const ft = raw[y * (stride + 1)];
    const rs = y * (stride + 1) + 1;
    for (let x = 0; x < stride; x++) {
      const rv = raw[rs + x];
      const a = x >= bpp ? out[y * stride + x - bpp] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = x >= bpp && y > 0 ? out[(y - 1) * stride + x - bpp] : 0;
      let v;
      if (ft === 0) v = rv;
      else if (ft === 1) v = rv + a;
      else if (ft === 2) v = rv + b;
      else if (ft === 3) v = rv + ((a + b) >> 1);
      else { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v = rv + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); }
      out[y * stride + x] = v & 255;
    }
  }
  return { w, h, rgba: out };
}

// --- encode ---------------------------------------------------------------
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const stride = w * 4;
  const raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride); }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
    const tb = Buffer.from(type, "ascii");
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(Buffer.concat([tb, data])) >>> 0, 0);
    return Buffer.concat([len, tb, data, crc]);
  };
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

// --- strip ----------------------------------------------------------------
function stripBackground(w, h, rgba) {
  const stride = w * 4;
  const at = (x, y) => (y * stride + x * 4);
  // Build a background palette from the 2px border ring (guaranteed bg).
  const palette = [];
  const addSample = (i) => {
    const r = rgba[i], g = rgba[i + 1], b = rgba[i + 2];
    for (const p of palette) if (Math.abs(p[0] - r) <= 10 && Math.abs(p[1] - g) <= 10 && Math.abs(p[2] - b) <= 10) return;
    palette.push([r, g, b]);
  };
  for (let x = 0; x < w; x++) { addSample(at(x, 0)); addSample(at(x, h - 1)); }
  for (let y = 0; y < h; y++) { addSample(at(0, y)); addSample(at(w - 1, y)); }
  const isBg = (i) => {
    const r = rgba[i], g = rgba[i + 1], b = rgba[i + 2];
    // Light/mid low-saturation gray catches both the checker AND the soft drop
    // shadow (which also dims the checker beneath it, sealing pockets). The
    // panda's own light areas are interior — sealed behind black fur, so the
    // border flood-fill never reaches them. Coloured bits (medal, stars) are
    // saturated and excluded.
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx - mn <= 32 && mn >= 80) return true;
    for (const p of palette) if (Math.abs(p[0] - r) <= TOL && Math.abs(p[1] - g) <= TOL && Math.abs(p[2] - b) <= TOL) return true;
    return false;
  };
  // Flood-fill from every border pixel.
  const seen = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => { const k = y * w + x; if (!seen[k]) { seen[k] = 1; stack.push(x, y); } };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  let cleared = 0;
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    const i = at(x, y);
    if (!isBg(i)) continue;
    rgba[i + 3] = 0; cleared++;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }
  return cleared;
}

// --- run ------------------------------------------------------------------
const files = readdirSync(PUB).filter((f) => /^lingua-.*\.png$/.test(f));
console.log(`Found ${files.length} mascot PNGs\n`);
for (const f of files) {
  const path = join(PUB, f);
  const buf = readFileSync(path);
  try {
    const { w, h, rgba } = decodePNG(buf);
    if (rgba[3] === 0) { console.log(`  skip   ${f} (already transparent)`); continue; }
    const cleared = stripBackground(w, h, rgba);
    writeFileSync(path, encodePNG(w, h, rgba));
    console.log(`  strip  ${f}  ${w}x${h}  cleared ${cleared} px (${((cleared / (w * h)) * 100).toFixed(0)}%)`);
  } catch (e) {
    console.error(`  ERROR  ${f}: ${e.message}`);
  }
}
