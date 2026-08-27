export type Citation = {
  label: string;
  publisher: string;
  title: string;
  url: string;
  accessedOn?: string;
};

export type TimelineEvent = {
  date: string; // ISO or year or range, display as written
  dateLabel: string; // human label like "23 November 1962"
  title: string;
  description: string;
  category: "birth" | "education" | "youth" | "cooperative" | "assembly" | "parliament" | "speakership" | "social";
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

export type OmBirlaProfile = {
  id: string; // matches parliament id ls-4716
  slug: string;
  fullName: string;
  displayName: string;
  alsoKnownAs: string[];
  birth: {
    date: string; // ISO
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
  speakership: {
    firstTerm: string;
    secondTerm: string;
    predecessor: string;
    historicNotes: string[];
    reforms: string[];
    committeesAndRoles: string[];
    criticisms: string[];
  };
  citations: Record<string, Citation>;
  lastVerified: string;
  disclaimer: string;
};
