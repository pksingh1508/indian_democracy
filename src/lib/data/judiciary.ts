import "server-only";
import baselineJson from "@/app/data/judiciary/high-court-judges-baseline.json";
import jurisdictionsJson from "@/app/data/judiciary/high-court-jurisdictions.json";
import rosterSourcesJson from "@/app/data/judiciary/high-court-judge-roster-sources.json";
import supremeCourtJson from "@/app/data/judiciary/supreme-court-judges.json";
import { normalizeStateName } from "@/src/lib/format";
import type {
  HighCourtBaselineCourt,
  HighCourtJurisdiction,
  HighCourtJudgesBaselineDataset,
  HighCourtRosterSourcesDataset,
  SupremeCourtDataset,
} from "./types";

const scData = supremeCourtJson as unknown as SupremeCourtDataset;
const jurisdictionData = jurisdictionsJson as unknown as HighCourtJurisdictionsDataset;
const baselineData = baselineJson as unknown as HighCourtJudgesBaselineDataset;
const rosterSourcesData = rosterSourcesJson as unknown as HighCourtRosterSourcesDataset;

/* ------------------------------ Supreme Court ----------------------------- */

export const supremeCourt = scData;

export const supremeCourtJudges = scData.judges;

export function getSupremeCourtJudge(id: string) {
  return scData.judges.find((j) => j.id === id);
}

/* ------------------------------ High Courts ------------------------------- */

export const highCourtJurisdictions: HighCourtJurisdiction[] = [...jurisdictionData.highCourts].sort(
  (a, b) => a.name.localeCompare(b.name),
);

export const highCourtSnapshot = {
  jurisdictionsSnapshot: jurisdictionData.snapshotDate,
  jurisdictionsRetrievedAt: jurisdictionData.retrievedAt,
  jurisdictionsSource: jurisdictionData.source,
};

export function getHighCourt(id: string): HighCourtJurisdiction | undefined {
  return jurisdictionData.highCourts.find((c) => c.id === id);
}

/** States/UTs served by a given High Court (normalized comparison). */
export function statesServedByHighCourt(courtId: string): string[] {
  const court = getHighCourt(courtId);
  return court ? court.statesOrUnionTerritories : [];
}

/** The High Court(s) serving a state/UT name (normalized across datasets). */
export function highCourtsServingState(stateName: string): HighCourtJurisdiction[] {
  const target = normalizeStateName(stateName);
  return highCourtJurisdictions.filter((court) =>
    court.statesOrUnionTerritories.some(
      (name) => normalizeStateName(name) === target,
    ),
  );
}

export const rosterSources = rosterSourcesData;

export function getKnownPdfForCourt(courtId: string): string | undefined {
  return rosterSourcesData.centralBaseline.knownPdfSources.find(
    (s) => s.highCourtId === courtId,
  )?.url;
}

/** Dated DOJ baseline for a court; undefined when the court was not covered. */
export function getBaselineForCourt(courtId: string): HighCourtBaselineCourt | undefined {
  return baselineData.courts.find((c) => c.highCourtId === courtId);
}

export const highCourtBaselineSummary = {
  coverageStatus: baselineData.coverageStatus,
  sourcePolicy: baselineData.sourcePolicy,
  counts: baselineData.counts,
};
