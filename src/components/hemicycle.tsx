import { partyColor } from "@/src/lib/parties";
import type { ChamberBlock, SeatPosition } from "@/src/lib/chamber";

/**
 * Server-rendered 2D "chamber-style" composition view.
 * The party table beside it remains the authoritative accessible interface;
 * this SVG mirrors exactly the same computed snapshot.
 */
export function Hemicycle2D({
  seats,
  geometry,
  summaryLabel,
  className = "",
}: {
  seats: SeatPosition[];
  geometry: { width: number; height: number; seatRadius: number };
  summaryLabel: string;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      role="img"
      aria-label={summaryLabel}
      className={className}
    >
      {seats.map((seat) => {
        const vacant = seat.blockKey === "__vacant";
        const fill = vacant ? "var(--seat-track)" : partyColor(seat.blockKey);
        return (
          <circle
            key={seat.index}
            cx={seat.x}
            cy={seat.y}
            r={geometry.seatRadius}
            fill={fill}
            stroke={vacant ? "var(--rule-strong)" : "rgba(0,0,0,0.14)"}
            strokeWidth={vacant ? 1 : 0.5}
            strokeDasharray={vacant ? "2 1.6" : undefined}
          >
            {!vacant && <title>{seat.blockLabel}</title>}
          </circle>
        );
      })}
    </svg>
  );
}

export function ChamberLegend({
  blocks,
  colorFor,
}: {
  blocks: ChamberBlock[];
  colorFor?: (key: string) => string;
}) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {blocks.map((b) => (
        <li key={b.key} className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className={`inline-block h-3 w-3 shrink-0 rounded-full border ${
              b.kind === "vacant"
                ? "border-rule-strong bg-[var(--seat-track)] [background-image:repeating-linear-gradient(45deg,transparent_0_2px,var(--rule-strong)_2px_3px)]"
                : "border-black/10"
            }`}
            style={
              b.kind === "vacant"
                ? undefined
                : { backgroundColor: colorFor ? colorFor(b.key) : partyColor(b.key) }
            }
          />
          <span className="text-muted">{b.label}</span>
          <span className="font-mono text-xs text-faint tabular-nums">{b.count}</span>
        </li>
      ))}
    </ul>
  );
}
