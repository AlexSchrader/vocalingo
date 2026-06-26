// Vercel serverless function: mint a short-lived signed WebSocket URL for the
// ElevenLabs Conversational AI agent (Haruki). The ELEVENLABS_API_KEY lives in
// the server environment and NEVER reaches the browser — the client only ever
// receives the expiring signed URL. Mirror endpoint for the agent-audio brief
// (Phase 6.5).
//
// GET /api/convai-session?lang=ja  ->  { signedUrl }
import { getCompanion } from "../server/companions.js";

export default async function handler(req, res) {
  const lang = (req.query && req.query.lang) || "ja";
  const companion = getCompanion(lang);
  const agentId = companion && companion.agentId;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!agentId) {
    res.status(404).json({ error: `No conversational agent configured for "${lang}".` });
    return;
  }
  if (!apiKey) {
    res.status(500).json({ error: "ELEVENLABS_API_KEY is not set in the server environment." });
    return;
  }

  try {
    const r = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      { headers: { "xi-api-key": apiKey } }
    );
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      res.status(502).json({ error: `ElevenLabs ${r.status}`, detail: detail.slice(0, 200) });
      return;
    }
    const data = await r.json();
    // No caching — signed URLs expire (~15 min) and are minted per session.
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ signedUrl: data.signed_url });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to reach ElevenLabs." });
  }
}
