import type { PartyCount } from "@/src/lib/data/parliament";

export interface ChamberBlock {
  key: string;
  label: string;
  shortLabel: string;
  count: number;
  kind: "party" | "independent" | "vacant";
}

/**
 * Ordered, mutually exclusive seat buckets: assigned blocks (parties,
 * independents) followed by named vacancies. Their counts must always sum
 * to the sanctioned house size — that arithmetic is displayed on the page.
 */
export function buildChamberBlocks(
  counts: PartyCount[],
  vacancies: number,
): ChamberBlock[] {
  const blocks: ChamberBlock[] = counts.map((p) => ({
    key: p.key,
    label: p.name,
    shortLabel: p.abbreviation ?? p.name,
    count: p.seats,
    kind: p.key === "Ind." ? "independent" : "party",
  }));
  // Sort assigned blocks: parties by size, independents kept last among assigned.
  const parties = blocks
    .filter((b) => b.kind === "party")
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  const independents = blocks.filter((b) => b.kind === "independent");
  const ordered = [...parties, ...independents];
  if (vacancies > 0) {
    ordered.push({
      key: "__vacant",
      label: "Vacant",
      shortLabel: "Vacant",
      count: vacancies,
      kind: "vacant",
    });
  }
  return ordered;
}

export interface SeatPosition {
  index: number;
  blockKey: string;
  blockLabel: string;
  /** Normalized SVG-space coordinates (viewBox 0 0 width height). */
  x: number;
  y: number;
  rowIndex: number;
}

interface HemicycleGeometry {
  width: number;
  height: number;
  seatRadius: number;
}

const GEOMETRY: HemicycleGeometry = { width: 960, height: 480, seatRadius: 6 };

/**
 * Deterministic hemicycle ("chamber-style") layout. Seats are distributed
 * across concentric arc rows using a largest-remainder allocation weighted
 * by arc length, filled innermost-row first, left to right. Purely derived
 * from totals — this is a conceptual composition view, not physical seating.
 */
export function generateSeats(blocks: ChamberBlock[]): {
  seats: SeatPosition[];
  geometry: HemicycleGeometry;
} {
  const total = blocks.reduce((sum, b) => sum + b.count, 0);
  const { width } = GEOMETRY;

  if (total === 0) {
    return { seats: [], geometry: { width, height: 240, seatRadius: 6 } };
  }

  const rowCount =
    total <= 1 ? 1 : Math.max(2, Math.min(14, Math.round(Math.sqrt(total) / 1.95)));

  const margin = 34;
  const rInner = Math.min(width / 2 - margin, 150 + total * 0.35);
  const rOuter = width / 2 - margin;
  const radii =
    rowCount === 1
      ? [rOuter]
      : Array.from({ length: rowCount }, (_, i) => rInner + ((rOuter - rInner) * i) / (rowCount - 1));

  // Largest-remainder allocation of seats per row, proportional to arc length.
  const weightSum = radii.reduce((s, r) => s + r, 0);
  const quotas = radii.map((r) => (total * r) / weightSum);
  const perRow = quotas.map((q) => Math.max(1, Math.floor(q)));
  let allocated = perRow.reduce((s, n) => s + n, 0);
  const remainders = quotas
    .map((q, i) => ({ i, frac: q - Math.floor(q) }))
    .sort((a, b) => b.frac - a.frac);
  let ri = 0;
  while (allocated < total && remainders.length > 0) {
    perRow[remainders[ri % remainders.length].i] += 1;
    allocated += 1;
    ri += 1;
  }
  // Trim any overshoot from the outermost rows inward.
  let ti = perRow.length - 1;
  while (allocated > total && ti >= 0) {
    const excess = Math.min(perRow[ti] - 1, allocated - total);
    perRow[ti] -= excess;
    allocated -= excess;
    ti -= 1;
  }

  const angularPad = 0.055;
  const rowSpacings = radii.map((r, i) =>
    perRow[i] <= 1 ? Infinity : ((Math.PI - 2 * angularPad) * r) / (perRow[i] - 1),
  );
  const seatSpacing = Math.min(...rowSpacings);
  const seatRadius = Math.max(2.2, Math.min(9, seatSpacing * 0.36));
  const height = rOuter + seatRadius + margin;

  const cx = width / 2;
  const cy = height - margin * 0.55;

  // Expand blocks into an ordered list of seat descriptors.
  const queue: { blockKey: string; blockLabel: string }[] = [];
  for (const block of blocks) {
    for (let n = 0; n < block.count; n++) {
      queue.push({ blockKey: block.key, blockLabel: block.shortLabel });
    }
  }

  const seats: SeatPosition[] = [];
  let cursor = 0;
  for (let row = 0; row < rowCount; row++) {
    const count = perRow[row];
    if (count <= 0 || cursor >= queue.length) break;
    const radius = radii[row];
    const startTheta = Math.PI - angularPad; // left edge
    const endTheta = angularPad; // right edge
    const step = count === 1 ? 0 : (startTheta - endTheta) / (count - 1);
    for (let s = 0; s < count && cursor < queue.length; s++, cursor++) {
      const theta = startTheta - step * s;
      const x = cx - Math.cos(theta) * radius;
      const y = cy - Math.sin(theta) * radius;
      const seat = queue[cursor];
      seats.push({
        index: cursor,
        blockKey: seat.blockKey,
        blockLabel: seat.blockLabel,
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
        rowIndex: row,
      });
    }
  }

  return { seats, geometry: { width, height, seatRadius } };
}

/** Seat DTO consumed by the opt-in 3D view. */
export interface Seat3D {
  x: number;
  z: number;
  blockKey: string;
  label: string;
}

const THREE_SCALE = 1 / 60;

export function toSeats3D(seats: SeatPosition[], geometry: HemicycleGeometry): Seat3D[] {
  return seats.map((s) => ({
    x: (s.x - geometry.width / 2) * THREE_SCALE,
    z: (geometry.height - s.y) * THREE_SCALE,
    blockKey: s.blockKey,
    label: s.blockLabel,
  }));
}
