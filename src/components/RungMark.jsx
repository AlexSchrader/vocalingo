import { C } from "../theme.js";

// The VocaLingo brand mark: a stack of rungs (a ladder) with the top rung in
// shu (vermilion). Used in the top bar and as the basis for the PWA icons.
export default function RungMark({ size = 28, bg = C.ai }) {
  const pad = size * 0.18;
  const w = size - pad * 2;
  const rungH = size * 0.12;
  const gap = size * 0.1;
  const rungs = 4;
  const totalH = rungs * rungH + (rungs - 1) * gap;
  const startY = (size - totalH) / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <rect x="0" y="0" width={size} height={size} rx={size * 0.24} fill={bg} />
      {Array.from({ length: rungs }).map((_, i) => (
        <rect
          key={i}
          x={pad}
          y={startY + i * (rungH + gap)}
          width={w}
          height={rungH}
          rx={rungH / 2}
          fill={i === 0 ? C.shu : "#FFFFFF"}
        />
      ))}
    </svg>
  );
}
