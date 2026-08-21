import "server-only";
import {
  lokSabhaMembers,
  rajyaSabhaMembers,
} from "@/src/lib/data/parliament";
import {
  councilOfMinisters,
  getConstitutionalOfficeholder,
} from "@/src/lib/data/executive";
import {
  highCourtJurisdictions,
  supremeCourtJudges,
} from "@/src/lib/data/judiciary";
import { states, getDistrictsByStateCode } from "@/src/lib/data/geography";
import { reorderSabhaName, stripHonorific, slugify } from "@/src/lib/format";

export interface SearchEntry {
  kind:
    | "Lok Sabha member"
    | "Rajya Sabha member"
    | "Union minister"
    | "Office"
    | "Supreme Court judge"
    | "State or UT"
    | "District"
    | "High Court";
  title: string;
  subtitle: string;
  href: string;
  haystack: string;
}

let cachedIndex: SearchEntry[] | null = null;

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const m of lokSabhaMembers) {
    const display = stripHonorific(m.name);
    entries.push({
      kind: "Lok Sabha member",
      title: display,
      subtitle: `${m.partyAbbreviation ?? m.party} · ${m.constituency}, ${m.stateOrUnionTerritory}`,
      href: `/people/${m.id}`,
      haystack: [display, m.nameAsPublished, m.party, m.partyAbbreviation, m.stateOrUnionTerritory, m.constituency]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const m of rajyaSabhaMembers) {
    const { display } = reorderSabhaName(m.name);
    const place = m.nominated ? "Nominated" : m.stateOrUnionTerritory;
    entries.push({
      kind: "Rajya Sabha member",
      title: display,
      subtitle: `${m.partyAbbreviation ?? m.party} · ${place} · term ${m.term}`,
      href: `/people/${m.id}`,
      haystack: [display, m.name, m.party, m.partyAbbreviation, place, m.term]
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const m of councilOfMinisters.ministers) {
    const isPM = m.category === "Prime Minister";
    entries.push({
      kind: "Union minister",
      title: m.nameWithoutHonorific,
      subtitle: isPM ? "Prime Minister" : m.category,
      href: `/people/${m.id}`,
      haystack: [m.nameWithoutHonorific, m.name, m.category, ...m.portfolios].join(" ").toLowerCase(),
    });
  }

  for (const id of ["president-of-india", "vice-president-of-india", "prime-minister-of-india"]) {
    const o = getConstitutionalOfficeholder(id);
    if (!o) continue;
    entries.push({
      kind: "Office",
      title: o.office,
      subtitle: `Held by ${o.name}`,
      href: `/institutions/${id === "prime-minister-of-india" ? "prime-minister" : id.replace("-of-india", "")}`,
      haystack: [o.office, o.name].join(" ").toLowerCase(),
    });
  }

  for (const j of supremeCourtJudges) {
    entries.push({
      kind: "Supreme Court judge",
      title: j.name,
      subtitle: j.chiefJustice ? "Chief Justice of India" : "Judge, Supreme Court of India",
      href: `/people/${j.id}`,
      haystack: [j.name, j.title, "supreme court"].join(" ").toLowerCase(),
    });
  }

  for (const s of states) {
    entries.push({
      kind: "State or UT",
      title: s.stateName,
      subtitle: "Jurisdiction",
      href: `/states/${slugify(s.stateName)}`,
      haystack: s.stateName.toLowerCase(),
    });
    for (const d of getDistrictsByStateCode(s.stateCode)) {
      entries.push({
        kind: "District",
        title: d.districtName,
        subtitle: `District · ${s.stateName}`,
        href: `/states/${slugify(s.stateName)}#districts`,
        haystack: `${d.districtName} ${s.stateName}`.toLowerCase(),
      });
    }
  }

  for (const c of highCourtJurisdictions) {
    entries.push({
      kind: "High Court",
      title: c.name,
      subtitle: `Principal seat: ${c.principalSeat}`,
      href: `/high-courts/${c.id}`,
      haystack: [...c.statesOrUnionTerritories, c.name, c.principalSeat, ...c.benches]
        .join(" ")
        .toLowerCase(),
    });
  }

  return entries;
}

export function getSearchIndex(): SearchEntry[] {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}

export interface SearchResult extends SearchEntry {
  score: number;
}

export function searchRecords(query: string, limit = 40): SearchResult[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (q.length < 2) return [];
  const results: SearchResult[] = [];
  for (const entry of getSearchIndex()) {
    const title = entry.title.toLowerCase();
    let score = 0;
    if (title === q) score = 120;
    else if (title.startsWith(q)) score = 90;
    else if (new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(title)) score = 70;
    else if (entry.haystack.includes(q)) score = 34;
    if (score > 0) results.push({ ...entry, score });
  }
  results.sort(
    (a, b) => b.score - a.score || a.title.localeCompare(b.title),
  );
  return results.slice(0, limit);
}

export function searchIndexSize(): number {
  return getSearchIndex().length;
}
