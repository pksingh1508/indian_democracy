import "server-only";
import lokSabhaJson from "@/app/data/parliament/lok-sabha-members.json";
import rajyaSabhaJson from "@/app/data/parliament/rajya-sabha-members.json";
import { normalizeStateName } from "@/src/lib/format";
import type {
  LokSabhaDataset,
  LokSabhaMember,
  RajyaSabhaDataset,
  RajyaSabhaMember,
} from "./types";

const lsData = lokSabhaJson as unknown as LokSabhaDataset;
const rsData = rajyaSabhaJson as unknown as RajyaSabhaDataset;

/* ------------------------------- Lok Sabha -------------------------------- */

export const lokSabha = lsData;

export const lokSabhaMembers: LokSabhaMember[] = lsData.members;
export const lokSabhaVacancies = lsData.vacancies;

export function getLokSabhaMember(id: string): LokSabhaMember | undefined {
  return lokSabhaMembers.find((m) => m.id === id);
}

export interface PartyCount {
  key: string;
  name: string;
  abbreviation: string | null;
  seats: number;
}

/** Party totals for Lok Sabha; "Independent" bucketed by full party name. */
export const lokSabhaPartyCounts: PartyCount[] = (() => {
  const map = new Map<string, PartyCount>();
  for (const m of lokSabhaMembers) {
    const abbr = m.partyAbbreviation ?? "";
    const key = abbr || m.party;
    const existing = map.get(key);
    if (existing) {
      existing.seats += 1;
    } else {
      map.set(key, {
        key,
        name: m.party,
        abbreviation: m.partyAbbreviation,
        seats: 1,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.seats - a.seats || a.name.localeCompare(b.name));
})();

/* ------------------------------- Rajya Sabha ------------------------------ */

export const rajyaSabha = rsData;

export const rajyaSabhaMembers: RajyaSabhaMember[] = rsData.members;

export function getRajyaSabhaMember(id: string): RajyaSabhaMember | undefined {
  return rajyaSabhaMembers.find((m) => m.id === id);
}

export const rajyaSabhaPartyCounts: PartyCount[] = (() => {
  const map = new Map<string, PartyCount>();
  for (const m of rajyaSabhaMembers) {
    const abbr = m.partyAbbreviation ?? "";
    const key = abbr || m.party;
    const existing = map.get(key);
    if (existing) {
      existing.seats += 1;
    } else {
      map.set(key, {
        key,
        name: m.party,
        abbreviation: m.partyAbbreviation,
        seats: 1,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.seats - a.seats || a.name.localeCompare(b.name));
})();

/** Term-expiry buckets for Rajya Sabha ("2021-2027" style). */
export const rajyaSabhaTermBuckets: { term: string; count: number }[] = (() => {
  const map = new Map<string, number>();
  for (const m of rajyaSabhaMembers) {
    map.set(m.term, (map.get(m.term) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => a.term.localeCompare(b.term));
})();

/* --------------------------- Cross-house lookups -------------------------- */

export function lokSabhaMembersByState(stateName: string): LokSabhaMember[] {
  const target = normalizeStateName(stateName);
  return lokSabhaMembers
    .filter((m) => normalizeStateName(m.stateOrUnionTerritory) === target)
    .sort((a, b) => a.constituency.localeCompare(b.constituency));
}

export function rajyaSabhaMembersByState(stateName: string): RajyaSabhaMember[] {
  const target = normalizeStateName(stateName);
  return rajyaSabhaMembers.filter((m) => normalizeStateName(m.stateOrUnionTerritory) === target);
}

export const uniquePartyOptions = (
  counts: PartyCount[],
): { value: string; label: string }[] =>
  counts.map((p) => ({
    value: p.key,
    label: p.abbreviation ? `${p.abbreviation} — ${p.name}` : p.name,
  }));
