import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import Today from "./screens/Today.jsx";
import Ladder from "./screens/Ladder.jsx";
import Stats from "./screens/Stats.jsx";
import Settings from "./screens/Settings.jsx";
import Lesson from "./screens/Lesson.jsx";
import Review from "./screens/Review.jsx";

// Lazy-loaded: the ElevenLabs voice SDK is heavy (~500KiB) and only needed on
// the Haruki tab, so keep it out of the main bundle until the user opens it.
const Haruki = lazy(() => import("./screens/Haruki.jsx"));

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Today />} />
        <Route path="ladder" element={<Ladder />} />
        <Route path="haruki" element={<Suspense fallback={null}><Haruki /></Suspense>} />
        <Route path="stats" element={<Stats />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="review" element={<Review />} />
      <Route path="lesson/:lessonId" element={<Lesson />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
