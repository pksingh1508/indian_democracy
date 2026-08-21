/**
 * Client-safe geometry constants and DTOs shared between the server-side
 * floor builder (src/lib/parliament-floor.ts) and the client-side Three.js
 * scene. No data-set imports may live here — this module is bundled for the
 * browser.
 */

export const FOCUS_X = 0;
export const FOCUS_Z = 0;

/** Row radii (metres) from the focus — front row first. */
export const ROW_RADII = [3.05, 3.77, 4.49, 5.21, 5.93, 6.65, 7.37, 8.09] as const;

/** Half-angle of the horseshoe sweep (radians) measured from the axis. */
export const PHI_MAX = 1.98;
/** Half-width of the central aisle gap (radians) at φ≈0. */
export const GAP_HALF = 0.07;
/** Edge padding inside each row segment (radians). */
export const PAD = 0.035;

export type Side = "treasury" | "opposition";

export interface FloorSeat {
  x: number;
  z: number;
  yawDeg: number;
  color: string;
  vacant: boolean;
}

export interface FloorPerson {
  id: string;
  /** Full roster name, e.g. "Shri Narendra Modi". */
  name: string;
  display: string;
  partyAbbr: string;
  partyName: string;
  constituency: string;
  stateOrUT: string;
  role: string | null;
  side: Side | "chair";
  x: number;
  z: number;
  yawDeg: number;
}

export interface ParliamentFloor {
  seats: FloorSeat[];
  persons: FloorPerson[];
  speaker: FloorPerson;
  sittingMembers: number;
  vacancies: number;
  snapshotLabel: string;
}
