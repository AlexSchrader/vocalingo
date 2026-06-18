// Generates the PWA icons (192 + 512) for the rung mark with no image deps:
// ai-indigo background, white rungs, top rung in shu. Writes RGBA PNGs.
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public");
mkdirSync(OUT, { recursive: true });

const BG = [42, 74, 123, 255]; // #2A4A7B
const WHITE = [255, 255, 255, 255];
const SHU = [194, 80, 46, 255]; // #C2502E

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function makePng(size) {
  const px = (x, y) => {
    // background everywhere by default
    let c = BG;
    const pad = Math.round(size * 0.2);
    const w = size - pad * 2;
    const rungs = 4;
    const rungH = Math.round(size * 0.12);
    const gap = Math.round(size * 0.1);
    const totalH = rungs * rungH + (rungs - 1) * gap;
    const startY = Math.round((size - totalH) / 2);
    for (let i = 0; i < rungs; i++) {
      const y0 = startY + i * (rungH + gap);
      if (x >= pad && x < pad + w && y >= y0 && y < y0 + rungH) {
        c = i === 0 ? SHU : WHITE;
      }
    }
    return c;
  };

  // Raw image data with per-row filter byte (0 = none).
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = px(x, y);
      const o = y * (stride + 1) + 1 + x * 4;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
      raw[o + 3] = a;
    }
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const idat = deflateSync(raw);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const size of [192, 512]) {
  const png = makePng(size);
  writeFileSync(resolve(OUT, `icon-${size}.png`), png);
  console.log(`wrote public/icon-${size}.png (${png.length} bytes)`);
}
