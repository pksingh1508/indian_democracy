export interface SourceCitation {
  publisher: string;
  title?: string;
  url: string;
  dataUrl?: string;
  profileUrl?: string;
  pageLastUpdated?: string;
  publisherAsOn?: string;
  authorityTier: string;
  notes?: string;
}

/* ------------------------------- Geography -------------------------------- */

export interface StateEntry {
  stateCode: number;
  stateName: string;
}

export interface DistrictEntry {
  stateCode: number;
  stateName: string;
  districtCode: number;
  districtName: string;
}

export interface GeographyDataset {
  schemaVersion: string;
  dataset: string;
  snapshotDate: string;
  retrievedAt: string;
  source: SourceCitation & { access: string };
  states: StateEntry[];
  districts: DistrictEntry[];
}

/* ------------------------------- Parliament ------------------------------- */

export interface LokSabhaMember {
  id: string;
  name: string;
  nameAsPublished: string;
  party: string;
  partyAbbreviation: string | null;
  stateOrUnionTerritory: string;
  constituency: string;
  constituencyCategory: string | null;
  membershipStatus: string;
  lokSabhaTerms: string;
  sourceRecordUpdatedAt: string;
}

export interface LokSabhaDataset {
  schemaVersion: string;
  dataset: string;
  snapshotDate: string;
  retrievedAt: string;
  source: SourceCitation;
  house: { name: string; term: number; sanctionedSeats: number };
  counts: { sittingMembers: number; officialVacancies: number };
  vacancies: { constituency: string }[];
  members: LokSabhaMember[];
}

export interface RajyaSabhaMember {
  id: string;
  name: string;
  party: string;
  partyAbbreviation: string | null;
  stateOrUnionTerritory: string;
  term: string;
  termCount: number;
  membershipStatus: string;
  notificationDate: string | null;
  expirationDate: string | null;
  nominated: boolean;
}

export interface RajyaSabhaDataset {
  schemaVersion: string;
  dataset: string;
  snapshotDate: string;
  retrievedAt: string;
  source: SourceCitation;
  house: { name: string; sanctionedSeats: number };
  counts: { sittingMembers: number; officialVacancies: number };
  members: RajyaSabhaMember[];
}

/* ------------------------------- Executive -------------------------------- */

export interface ConstitutionalOfficeholder {
  id: string;
  office: string;
  name: string;
  ordinal?: number;
  termStart?: string;
  selectionMethod?: string;
  source: SourceCitation;
}

export interface ConstitutionalOfficeholdersDataset {
  schemaVersion: string;
  dataset: string;
  snapshotDate: string;
  retrievedAt: string;
  sourcePolicy: string;
  officeholders: ConstitutionalOfficeholder[];
}

export type MinisterCategory =
  | "Prime Minister"
  | "Cabinet Ministers"
  | "Ministers of State (Independent Charge)"
  | "Ministers of State";

export interface UnionMinister {
  id: string;
  name: string;
  nameWithoutHonorific: string;
  category: MinisterCategory;
  portfolios: string[];
}

export interface CouncilOfMinistersDataset {
  schemaVersion: string;
  dataset: string;
  snapshotDate: string;
  retrievedAt: string;
  source: SourceCitation;
  ministers: UnionMinister[];
}

/* ------------------------------- Judiciary -------------------------------- */

export interface SupremeCourtJudge {
  id: string;
  name: string;
  title: string;
  dateOfBirth: string | null;
  termOfOffice: string | null;
  chiefJustice: boolean;
}

export interface SupremeCourtDataset {
  schemaVersion: string;
  dataset: string;
  snapshotDate: string;
  retrievedAt: string;
  source: SourceCitation;
  court: string;
  judges: SupremeCourtJudge[];
}

export interface HighCourtJurisdiction {
  id: string;
  name: string;
  statesOrUnionTerritories: string[];
  principalSeat: string;
  benches: string[];
  officialDirectory: string;
}

export interface HighCourtJurisdictionsDataset {
  schemaVersion: string;
  dataset: string;
  snapshotDate: string;
  retrievedAt: string;
  source: SourceCitation & { urls: string[] };
  highCourts: HighCourtJurisdiction[];
}

/** DOJ baseline judge — two published shapes (bar-appointed and service-appointed). */
export interface HighCourtBaselineJudge {
  name: string;
  sourceCategory?: string;
  appointmentAsAdditionalJudge?: string;
  appointmentAsPermanentJudge?: string;
  projectedRetirement?: string;
  baselineListNumber?: number;
  judgeType?: string;
  initialAppointment?: string;
  termExpiry?: string;
  dateOfBirth?: string | null;
}

export interface HighCourtBaselineCourt {
  highCourtId: string;
  publishedCourtName: string;
  judgeCount: number;
  sourceAsOn: string;
  sourceUrl: string;
  judges: HighCourtBaselineJudge[];
}

export interface HighCourtJudgesBaselineDataset {
  schemaVersion: string;
  dataset: string;
  snapshotDate: string;
  retrievedAt: string;
  coverageStatus: string;
  sourcePolicy: string;
  counts: { highCourtsCovered: number; highCourtsInIndia: number; judges: number };
  courts: HighCourtBaselineCourt[];
}

export interface HighCourtRosterSourcesDataset {
  schemaVersion: string;
  dataset: string;
  snapshotDate: string;
  retrievedAt: string;
  coverageStatus: string;
  source: SourceCitation;
  centralBaseline: {
    asOn: string;
    status: string;
    knownPdfSources: { highCourtId: string; url: string }[];
  };
  currentRosterSources: {
    directory: string;
    notes: string;
  };
}

/* --------------------------- Registry / coverage -------------------------- */

export interface SourceRegistryEntry {
  id: string;
  publisher: string;
  title: string;
  url: string;
  authorityTier: string;
  usedFor: string[];
  asOf: string;
  notes?: string;
}

export interface SourceRegistryDataset {
  schemaVersion: string;
  dataset: string;
  snapshotDate: string;
  sources: SourceRegistryEntry[];
}

export interface CoverageEntry {
  area: string;
  status: string;
  records: number;
  file?: string;
  notes?: string;
}

export interface CoverageDataset {
  schemaVersion: string;
  dataset: string;
  snapshotDate: string;
  coverage: CoverageEntry[];
}
