#!/usr/bin/env node
/**
 * Generate MP3 pronunciation clips for every item across all units.
 *
 * Usage:
 *   npm run generate:audio          # generate any missing clips
 *   npm run generate:audio -- --force   # regenerate everything
 *
 * Reads ELEVENLABS_API_KEY from .env.local or the environment.
 * Writes to: public/audio/{lang}/{item.id}.mp3
 *
 * Voice: Haruki (server/companions.js). Model: eleven_v3.
 *
 * IMPORTANT — bare call only. Send the RAW character/word as text with just the
 * model. Do NOT add language_code, do NOT convert kana→katakana, do NOT pass
 * custom voice_settings. Those extras wreck isolated-kana pronunciation (rounds
 * #15–#18 chased that dead end). eleven_v3 + a plain call pronounces single kana
 * and words correctly with the voice's own defaults.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const FORCE = process.argv.includes("--force");

// Load .env.local into process.env (Vite reads it automatically; Node scripts don't)
try {
  const lines = readFileSync(join(ROOT, ".env.local"), "utf8").split("\n");
  for (const line of lines) {
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (k && !process.env[k]) process.env[k] = v;
  }
} catch {}

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("Missing ELEVENLABS_API_KEY — add it to .env.local");
  process.exit(1);
}

const { COMPANIONS } = await import("../server/companions.js");
const { UNITS } = await import("../src/data/index.js");

const MODEL_ID = "eleven_v3";

// Flatten every playable item across all units, stamping its language.
const items = UNITS.flatMap((unit) =>
  unit.lessons
    .filter((l) => Array.isArray(l.items))
    .flatMap((l) => l.items.map((it) => ({ ...it, lang: unit.lang })))
);

console.log(`Generating audio for ${items.length} items  model: ${MODEL_ID}\n`);

let done = 0, skipped = 0, errors = 0;

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const voiceId = COMPANIONS[item.lang]?.voiceId;
  if (!voiceId) {
    console.error(`  ERROR  ${item.id}: no companion voice for lang "${item.lang}"`);
    errors++;
    continue;
  }

  const outDir = join(ROOT, "public", "audio", item.lang);
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, `${item.id}.mp3`);
  const tag = `[${String(i + 1).padStart(3)}/${items.length}] ${item.id}`;

  if (existsSync(out) && !FORCE) {
    skipped++;
    continue;
  }

  // Bare call: raw text + model only. No language_code, no katakana, no voice_settings.
  const text = item.front;

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({ text, model_id: MODEL_ID }),
    });

    if (!res.ok) {
      const msg = await res.text();
      console.error(`  ERROR  ${tag}: ${res.status} ${msg.slice(0, 140)}`);
      errors++;
      continue;
    }

    writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    console.log(`  gen    ${tag}  "${text}"`);
    done++;
  } catch (err) {
    console.error(`  ERROR  ${tag}: ${err.message}`);
    errors++;
  }

  // Brief pause — polite to the API, avoids rate-limit 429s
  if (i < items.length - 1) await new Promise((r) => setTimeout(r, 500));
}

console.log(`\n${done} generated   ${skipped} skipped   ${errors} errors`);
if (errors > 0) process.exit(1);
