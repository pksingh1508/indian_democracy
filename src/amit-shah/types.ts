export type Citation = {
  label: string;
  publisher: string;
  title: string;
  url: string;
  accessedOn?: string;
};

export type TimelineEvent = {
  date: string;
  dateLabel: string;
  title: string;
  description: string;
  category: "birth" | "education" | "youth" | "cooperative" | "assembly" | "parliament" | "party" | "minister" | "social";
  citationIds: string[];
};

export type OfficeRecord = {
  office: string;
  jurisdiction: string;
  term: string;
  entryMethod: string;
  predecessor?: string;
  successor?: string;
  notes?: string;
};

export type EducationRecord = {
  degree: string;
  institution: string;
  university: string;
  year?: string;
  field?: string;
};

export type SocialInitiative = {
  name: string;
  since: string;
  description: string;
  citationIds: string[];
};

export type SalaryRecord = {
  office: string;
  period: string;
  salary: string;
  allowances: string;
  totalApprox: string;
  legalBasis: string;
  notes?: string;
  citationIds: string[];
};

export type NetWorthSnapshot = {
  election: string;
  year: string;
  totalAssets: string;
  movable: string;
  immovable: string;
  liabilities: string;
  cases: string;
  incomeSelf?: string;
  incomeSpouse?: string;
  citationIds: string[];
};

export type WorkNewsItem = {
  title: string;
  date: string;
  kind: "positive" | "mixed" | "critical";
  summary: string;
  sourceLabel: string;
  citationId: string;
};

export type AllegationRecord = {
  title: string;
  date: string;
  allegation: string;
  context: string;
  responseOrStatus: string;
  outcome?: string;
  citationIds: string[];
};

export type AmitShahProfile = {
  id: string;
  slug: string;
  fullName: string;
  displayName: string;
  alsoKnownAs: string[];
  birth: {
    date: string;
    displayDate: string;
    place: string;
    parents: { father: string; mother: string };
    familyBackground: string;
  };
  personal: {
    spouse: string;
    marriageYear: string;
    children: string;
    childrenNote?: string;
    profession: string[];
    website: string;
    party: string;
    partyAbbreviation: string;
  };
  education: EducationRecord[];
  officesHeld: OfficeRecord[];
  timeline: TimelineEvent[];
  socialInitiatives: SocialInitiative[];
  ministerial: {
    portfolios: string[];
    firstOath: string;
    historicNotes: string[];
    reforms: string[];
    majorDecisions: string[];
    criticisms: string[];
  };
  salaries: SalaryRecord[];
  netWorthTimeline: NetWorthSnapshot[];
  netWorthNotes: string[];
  workHighlights: WorkNewsItem[];
  allegations: AllegationRecord[];
  citations: Record<string, Citation>;
  lastVerified: string;
  disclaimer: string;
};
