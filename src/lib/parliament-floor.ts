import { lokSabha, lokSabhaMembers, lokSabhaPartyCounts } from "@/src/lib/data/parliament";
import { councilOfMinisters } from "@/src/lib/data/executive";
import { formatIsoDate, stripHonorific } from "@/src/lib/format";
import { partyColor } from "@/src/lib/parties";
import {
  GAP_HALF,
  PAD,
  PHI_MAX,
  ROW_RADII,
  type FloorPerson,
  type ParliamentFloor,
  type Side,
} from "@/src/lib/parliament-floor-geometry";

/**
 * Floor plan for the interactive Lok Sabha chamber scene.
 *
 * Conventions follow the chamber's published practice: the Speaker's chair
 * sits at the focus of the horseshoe; ruling-coalition members occupy the
 * seats to the right of the Chair and opposition members the left. With the
 * camera behind the rear benches looking toward the Chair, the treasury
 * benches appear on the left of the frame.
 *
 * Seat positions are a stylised reconstruction: the horseshoe follows the real
 * chamber's shape, but individual background seats are allocated
 * proportionally per alliance rather than from the official division-number
 * chart, which is not public data. Named members below are real roster entries
 * (ids resolve against app/data/parliament) seated at prominent positions
 * consistent with reporting.
 *
 * Geometry constants and shared DTOs live in the client-safe module
 * `parliament-floor-geometry.ts`; this server module resolves them against
 * the official roster.
 */

export {
  FOCUS_X,
  FOCUS_Z,
  GAP_HALF,
  PAD,
  PHI_MAX,
  ROW_RADII,
} from "@/src/lib/parliament-floor-geometry";
export type {
  FloorPerson,
  FloorSeat,
  ParliamentFloor,
  Side,
} from "@/src/lib/parliament-floor-geometry";

const VACANT_COLOR = "#a9adb8";

interface QueueEntry {
  key: string;
  count: number;
}

/**
 * Alliance ordering as reported for the 18th Lok Sabha. "SS" is the
 * Election-Commission-recognised Shiv Sena (NDA); "SHSUBT" is the Uddhav
 * faction (opposition). DMK sits apart from the Congress block following its
 * June 2026 request for separate seating.
 */
const TREASURY_KEYS = [
  "BJP",
  "TDP",
  "SS",
  "JD(U)",
  "LJSP(RV)",
  "JD(S)",
  "RLD",
  "AGP",
  "UPPL",
  "AJSU",
  "NCP",
  "HAM (S)",
  "Apna Dal (S)",
];

const OPPOSITION_KEYS = [
  "INC",
  "SP",
  "AITC",
  "NCPSP",
  "RJD",
  "CPI(M)",
  "JMM",
  "AAP",
  "IUML",
  "SHSUBT",
  "J&KNC",
  "CPI",
  "VCK",
  "CPI(ML)(L)",
  "JSP",
  "KEC",
  "RSP",
  "MDMK",
  "RLP",
  "SAD",
  "BAP",
  "SKM",
  "ZPM",
  "YSR Congress Party",
  "ASP (KR)",
  "Ind.",
];

const VACANT_COLOR = "#a9adb8";

interface FeaturedPlacement {
  id: string;
  row: number;
  slotFromCenter: number;
  roleOverride?: string;
}

const FEATURED_TREASURY: FeaturedPlacement[] = [
  // Front row, centre aisle outward: PM holds the first seat right of the Chair.
  { id: "ls-4589", row: 0, slotFromCenter: 0 }, // Narendra Modi — Prime Minister
  { id: "ls-5021", row: 0, slotFromCenter: 1 }, // Amit Shah
  { id: "ls-4268", row: 0, slotFromCenter: 2 }, // Rajnath Singh
  { id: "ls-4923", row: 0, slotFromCenter: 3 }, // Nitin Gadkari
  { id: "ls-96", row: 0, slotFromCenter: 4 }, // Shivraj Singh Chouhan
  { id: "ls-5792", row: 0, slotFromCenter: 5 }, // Manohar Lal
  { id: "ls-3958", row: 0, slotFromCenter: 6 }, // Jyotiraditya Scindia
  { id: "ls-3972", row: 0, slotFromCenter: 7 }, // Kiren Rijiju
  { id: "ls-4163", row: 0, slotFromCenter: 8 }, // Sarbananda Sonowal
  { id: "ls-5084", row: 0, slotFromCenter: 9 }, // G Kishan Reddy
  { id: "ls-4771", row: 1, slotFromCenter: 0 }, // Kinjarapu Rammohan Naidu
  { id: "ls-4777", row: 1, slotFromCenter: 1 }, // Chirag Paswan
  { id: "ls-3711", row: 1, slotFromCenter: 2 }, // H D Kumaraswamy
  { id: "ls-5558", row: 1, slotFromCenter: 3 }, // Jitan Ram Manjhi
  { id: "ls-4134", row: 1, slotFromCenter: 4 }, // Rajiv Ranjan Singh (Lalan)
  { id: "ls-4399", row: 1, slotFromCenter: 5 }, // Arjun Ram Meghwal
  { id: "ls-5561", row: 1, slotFromCenter: 6, roleOverride: "Former Chief Minister of Karnataka" },
  { id: "ls-5731", row: 1, slotFromCenter: 7 }, // Eatala Rajender
  { id: "ls-5625", row: 1, slotFromCenter: 8 }, // V Somanna
  { id: "ls-5076", row: 1, slotFromCenter: 9 }, // Bandi Sanjay Kumar
  { id: "ls-4065", row: 2, slotFromCenter: 0 }, // Jitin Prasada
  { id: "ls-4625", row: 2, slotFromCenter: 1 }, // Nityanand Rai
  { id: "ls-3479", row: 2, slotFromCenter: 2 }, // Pankaj Choudhary
  { id: "ls-5035", row: 2, slotFromCenter: 3 }, // Sukanta Majumdar
  { id: "ls-4249", row: 2, slotFromCenter: 4 }, // Anurag Singh Thakur
];

const FEATURED_OPPOSITION: FeaturedPlacement[] = [
  { id: "ls-4074", row: 0, slotFromCenter: 0, roleOverride: "Leader of the Opposition" },
  { id: "ls-5836", row: 0, slotFromCenter: 1 }, // Priyanka Gandhi Vadra
  { id: "ls-564", row: 0, slotFromCenter: 2, roleOverride: "Samajwadi Party national president" },
  { id: "ls-4580", row: 0, slotFromCenter: 3 }, // Dimple Yadav
  { id: "ls-4843", row: 0, slotFromCenter: 4 }, // Abhishek Banerjee
  { id: "ls-4091", row: 0, slotFromCenter: 5, roleOverride: "AIMIM president" },
  { id: "ls-4788", row: 0, slotFromCenter: 6 }, // Gaurav Gogoi
  { id: "ls-4567", row: 0, slotFromCenter: 7 }, // K C Venugopal
  { id: "ls-3589", row: 0, slotFromCenter: 8 }, // Kumari Selja
  // Outer edge of the front row: DMK sits apart from the Congress block but
  // its leader keeps a prominent position.
  { id: "ls-26", row: 0, slotFromCenter: 9, roleOverride: "DMK parliamentary party leader, Lok Sabha" },
  { id: "ls-4569", row: 1, slotFromCenter: 0 }, // Shashi Tharoor
  { id: "ls-5049", row: 1, slotFromCenter: 1 }, // Mahua Moitra
  { id: "ls-4392", row: 1, slotFromCenter: 2 }, // Supriya Sule
  { id: "ls-4206", row: 1, slotFromCenter: 3 }, // Dharmendra Yadav
  { id: "ls-5589", row: 1, slotFromCenter: 4 }, // Imran Masood
  { id: "ls-5125", row: 1, slotFromCenter: 5 }, // Hibi Eden
  { id: "ls-4552", row: 1, slotFromCenter: 6 }, // Manickam Tagore
  { id: "ls-38", row: 1, slotFromCenter: 7 }, // Sudip Bandyopadhyay
  { id: "ls-4498", row: 1, slotFromCenter: 8 }, // Kalyan Banerjee
  { id: "ls-4144", row: 1, slotFromCenter: 9 }, // Dayanidhi Maran
  { id: "ls-5750", row: 2, slotFromCenter: 0 }, // Charanjit Singh Channi
  { id: "ls-5747", row: 2, slotFromCenter: 1 }, // Amrinder Singh Raja Warring
  { id: "ls-5788", row: 2, slotFromCenter: 2 }, // Angomcha Bimol Akoijam
  { id: "ls-5647", row: 2, slotFromCenter: 3, roleOverride: "Azad Samaj Party national president" },
  { id: "ls-5830", row: 2, slotFromCenter: 4 }, // Abdul Rashid Sheikh
];

const SPEAKER_ID = "ls-4716"; // Shri Om Birla

function buildRowCounts(total: number): number[] {
  const weightSum = ROW_RADII.reduce((s, r) => s + r, 0);
  const quotas = ROW_RADII.map((r) => (total * r) / weightSum);
  const counts = quotas.map((q) => Math.floor(q));
  let allocated = counts.reduce((s, n) => s + n, 0);
  const order = quotas
    .map((q, i) => ({ i, frac: q - Math.floor(q) }))
    .sort((a, b) => b.frac - a.frac);
  let k = 0;
  while (allocated < total && order.length > 0) {
    counts[order[k % order.length].i] += 1;
    allocated += 1;
    k += 1;
  }
  return counts;
}

function splitSides(count: number, row: number): { treasury: number; opposition: number } {
  const base = Math.floor(count / 2);
  // Alternate which side receives the odd seat so both wings read evenly.
  const treasuryExtra = count % 2 === (row % 2 === 0 ? 1 : 0) ? 1 : 0;
  return { treasury: base + treasuryExtra, opposition: count - base - treasuryExtra };
}

function slotAngles(count: number): number[] {
  if (count <= 0) return [];
  const start = GAP_HALF + PAD;
  const end = PHI_MAX - PAD;
  if (count === 1) return [(start + end) / 2];
  const step = (end - start) / (count - 1);
  return Array.from({ length: count }, (_, j) => start + j * step);
}

function pickQueue(keys: string[]): QueueEntry[] {
  const byKey = new Map<string, number>();
  for (const p of lokSabhaPartyCounts) byKey.set(p.key, p.seats);
  return keys
    .map((key) => ({ key, count: byKey.get(key) ?? 0 }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count);
}

/**
 * Scale party blocks so their sum fills exactly the slots left over after
 * named-member reservations. Overflow is trimmed from the smallest blocks so
 * large parties stay intact.
 */
function normalizeToCapacity(queue: QueueEntry[], capacity: number): QueueEntry[] {
  const total = queue.reduce((s, e) => s + e.count, 0);
  if (capacity <= 0 || total === 0) return [];
  if (total <= capacity) return queue.map((e) => ({ ...e }));
  const scale = capacity / total;
  const scaled = queue.map((e) => ({ ...e, count: Math.max(1, Math.round(e.count * scale)) }));
  let sum = scaled.reduce((s, e) => s + e.count, 0);
  let idx = scaled.length - 1;
  while (sum > capacity && idx >= 0) {
    const removable = Math.min(scaled[idx].count - 1, sum - capacity);
    scaled[idx].count -= removable;
    sum -= removable;
    idx -= 1;
  }
  return scaled;
}

function ministerRoleLookup(): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of councilOfMinisters.ministers) {
    if (m.category === "Prime Minister") {
      map.set(m.nameWithoutHonorific, "Prime Minister");
      continue;
    }
    const first = m.portfolios[0]?.replace(/;\s*(and)?\s*$/i, "").trim();
    if (first) map.set(m.nameWithoutHonorific, first);
  }
  return map;
}

function personFromRoster(
  member: (typeof lokSabhaMembers)[number],
  role: string | null,
  side: Side | "chair",
  x: number,
  z: number,
  yawDeg: number,
): FloorPerson {
  return {
    id: member.id,
    name: member.name,
    display: stripHonorific(member.name),
    partyAbbr: member.partyAbbreviation ?? member.party,
    partyName: member.party,
    constituency: member.constituency,
    stateOrUT: member.stateOrUnionTerritory,
    role,
    side,
    x,
    z,
    yawDeg,
  };
}

/**
 * Build the full serialisable floor description consumed by the client-side
 * Three.js scene. Pure and deterministic — safe during SSR.
 */
export function buildParliamentFloor(): ParliamentFloor {
  const totalSeats = lokSabha.counts.sittingMembers + lokSabha.counts.officialVacancies;
  const rowCounts = buildRowCounts(totalSeats);

  // Reserve featured slots so the background allocation skips them.
  const reserved = new Set<string>();
  const placements = new Map<string, { placement: FeaturedPlacement; side: Side }>();
  const reserve = (fp: FeaturedPlacement, side: Side) => {
    const key = `${fp.row}:${side}:${fp.slotFromCenter}`;
    reserved.add(key);
    placements.set(key, { placement: fp, side });
  };
  FEATURED_TREASURY.forEach((fp) => reserve(fp, "treasury"));
  FEATURED_OPPOSITION.forEach((fp) => reserve(fp, "opposition"));

  const ministers = ministerRoleLookup();

  // Background queues: proportional fill per alliance; a two-slot visual gap
  // separates DMK from the other opposition blocks; vacancies sit at the tail.
  const dmkCount = lokSabhaPartyCounts.find((p) => p.key === "DMK")?.seats ?? 0;
  const queues: Record<Side, QueueEntry[]> = {
    treasury: pickQueue(TREASURY_KEYS),
    opposition: [
      ...pickQueue(OPPOSITION_KEYS),
      { key: "__gap", count: 2 },
      ...(dmkCount > 0 ? [{ key: "DMK", count: dmkCount }] : []),
      { key: "__vacant", count: lokSabha.counts.officialVacancies },
    ],
  };

  const seats: FloorSeat[] = [];

  for (let row = 0; row < ROW_RADII.length; row++) {
    const radius = ROW_RADII[row];
    for (const side of ["treasury", "opposition"] as Side[]) {
      const count = splitSides(rowCounts[row], row)[side];
      // Slots consumed by named members in this row/side.
      let reservedHere = 0;
      for (const key of reserved) {
        if (key.startsWith(`${row}:${side}:`)) reservedHere += 1;
      }
      // Gap + vacancy entries consume slots too.
      const fixedConsumers =
        side === "opposition"
          ? 2 + lokSabha.counts.officialVacancies
          : 0;
      const queue = normalizeToCapacity(
        queues[side],
        Math.max(0, count - reservedHere - fixedConsumers),
      );
      const angles = slotAngles(count);
      const sign = side === "treasury" ? -1 : 1;
      let idx = 0;
      for (let slot = 0; slot < count; slot++) {
        if (reserved.has(`${row}:${side}:${slot}`)) continue;
        while (idx < queue.length && queue[idx].count <= 0) idx += 1;
        const entry = queue[idx];
        if (!entry) break;
        if (entry.key === "__gap") {
          entry.count -= 1;
          continue;
        }
        const phi = sign * angles[slot];
        const x = radius * Math.sin(phi);
        const z = radius * Math.cos(phi);
        seats.push({
          x,
          z,
          yawDeg: (Math.atan2(-x, -z) * 180) / Math.PI,
          color: entry.key === "__vacant" ? VACANT_COLOR : partyColor(entry.key),
          vacant: entry.key === "__vacant",
        });
        entry.count -= 1;
        if (entry.count <= 0) idx += 1;
      }
    }
  }

  // Named members at their reserved positions.
  const persons: FloorPerson[] = [];
  for (const [key, { placement, side }] of placements) {
    const [rowStr, , slotStr] = key.split(":");
    const row = Number(rowStr);
    const slot = Number(slotStr);
    const member = lokSabhaMembers.find((m) => m.id === placement.id);
    if (!member) continue;
    const count = splitSides(rowCounts[row], row)[side];
    const angles = slotAngles(count);
    const sign = side === "treasury" ? -1 : 1;
    const phi = sign * angles[Math.min(slot, angles.length - 1)];
    const radius = ROW_RADII[row];
    const x = radius * Math.sin(phi);
    const z = radius * Math.cos(phi);
    const role = placement.roleOverride ?? ministers.get(stripHonorific(member.name)) ?? null;
    persons.push(
      personFromRoster(member, role, side, x, z, (Math.atan2(-x, -z) * 180) / Math.PI),
    );
  }

  const speakerMember = lokSabhaMembers.find((m) => m.id === SPEAKER_ID);
  const speaker: FloorPerson = speakerMember
    ? personFromRoster(speakerMember, "Speaker", "chair", 0, -0.62, 0)
    : {
        id: SPEAKER_ID,
        name: "Shri Om Birla",
        display: "Om Birla",
        partyAbbr: "BJP",
        partyName: "Bharatiya Janata Party",
        constituency: "Kota",
        stateOrUT: "Rajasthan",
        role: "Speaker",
        side: "chair",
        x: 0,
        z: -0.62,
        yawDeg: 0,
      };

  return {
    seats,
    persons,
    speaker,
    sittingMembers: lokSabha.counts.sittingMembers,
    vacancies: lokSabha.counts.officialVacancies,
    snapshotLabel: formatIsoDate(lokSabha.snapshotDate),
  };
}
