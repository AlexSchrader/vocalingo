import { useEffect, useRef, useState } from "react";
import { useStore } from "./useStore.js";

// Skip audio under Playwright/WebDriver so CI smoke tests stay fast and quiet.
const IS_WEBDRIVER = typeof navigator !== "undefined" && !!navigator.webdriver;

// Plays the pre-generated pronunciation clip /audio/{lang}/{id}.mp3 (ElevenLabs
// Haruki voice). Falls back to Web Speech (window.speechSynthesis) only if the
// clip is missing or fails to load — so a not-yet-generated item still says
// something instead of going silent. The clip is the real voice; Web Speech is
// the last-resort robot fallback.
export function useItemAudio(item) {
  const [active, setActive] = useState(false);
  const audioRef = useRef(null);
  // Auto-play on a new card respects the user's preference; the speaker button
  // (manual play) always plays regardless.
  const autoplay = useStore((s) => s.settings?.autoplayAudio ?? true);

  function stop() {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
  }

  function speakFallback() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(item.front);
    u.lang = "ja-JP";
    u.rate = 0.8;
    u.onstart = () => setActive(true);
    u.onend = () => setActive(false);
    u.onerror = () => setActive(false);
    window.speechSynthesis.speak(u);
  }

  function play() {
    if (IS_WEBDRIVER) return;
    stop();
    const a = new Audio(`/audio/${item.lang}/${item.id}.mp3`);
    audioRef.current = a;
    a.onplay = () => setActive(true);
    a.onended = () => { setActive(false); audioRef.current = null; };
    a.onerror = () => { setActive(false); audioRef.current = null; speakFallback(); };
    a.play().catch(() => speakFallback());
  }

  // Autoplay on mount / when the item changes — unless the user turned it off.
  useEffect(() => { if (autoplay) play(); }, [item.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => stop(), []); // cleanup on unmount

  return { play, active };
}
