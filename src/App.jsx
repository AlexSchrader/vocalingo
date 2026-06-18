import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import Today from "./screens/Today.jsx";
import Ladder from "./screens/Ladder.jsx";
import Haruki from "./screens/Haruki.jsx";
import Stats from "./screens/Stats.jsx";
import Lesson from "./screens/Lesson.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Today />} />
        <Route path="ladder" element={<Ladder />} />
        <Route path="haruki" element={<Haruki />} />
        <Route path="stats" element={<Stats />} />
      </Route>
      <Route path="lesson/:lessonId" element={<Lesson />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
