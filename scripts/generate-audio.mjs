#!/usr/bin/env node
/**
 * Generate MP3 pronunciation clips for every item in Unit 1.
 *
 * Usage:
 *   npm run generate:audio
 *
 * Reads ELEVENLABS_API_KEY from .env.local or the environment.
 * Writes to: public/audio/ja/{item.id}.mp3
 * Re-running is safe — existing files are skipped.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");

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
const { UNIT1 } = await import("../src/data/ja/unit1.js");

const VOICE_ID = COMPANIONS.ja.voiceId;
const OUT_DIR = join(ROOT, "public", "audio", "ja");
mkdirSync(OUT_DIR, { recursive: true });

const items = UNIT1.lessons
  .filter((l) => Array.isArray(l.items))
  .flatMap((l) => l.items);

console.log(`Generating audio for ${items.length} items  voice: ${VOICE_ID}\n`);

let done = 0, skipped = 0, errors = 0;

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const out = join(OUT_DIR, `${item.id}.mp3`);
  const tag = `[${String(i + 1).padStart(2)}/${items.length}] ${item.id}`;

  // Kana items → send romaji. "ka", "shi", "tsu" etc. are unambiguous in any
  // language. Two vowels need phonetic overrides: bare "i" is read as the
  // English pronoun "I" (eye sound); bare "u" triggers a verbal filler.
  // "ee" and "oo" give the correct Japanese vowel sounds without language_code.
  // Vocab items → send full Japanese text; multi-character words are fine as-is.
  const ROMAJI_FIX = { i: "ee", u: "oo" };
  const text = item.type === "kana"
    ? (ROMAJI_FIX[item.reading] ?? item.reading)
    : item.front;

  if (existsSync(out)) {
    console.log(`  skip   ${tag}`);
    skipped++;
    continue;
  }

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.35,
          similarity_boost: 0.80,
          style: 0.25,
          use_speaker_boost: true,
        },
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      console.error(`  ERROR  ${tag}: ${res.status} ${msg.slice(0, 120)}`);
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
