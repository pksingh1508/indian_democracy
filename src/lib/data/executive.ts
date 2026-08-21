import "server-only";
import constitutionalJson from "@/app/data/executive/constitutional-officeholders.json";
import ministersJson from "@/app/data/executive/union-council-of-ministers.json";
import type {
  ConstitutionalOfficeholder,
  ConstitutionalOfficeholdersDataset,
  CouncilOfMinistersDataset,
  MinisterCategory,
  UnionMinister,
} from "./types";

const officeholdersData = constitutionalJson as unknown as ConstitutionalOfficeholdersDataset;
const ministersData = ministersJson as unknown as CouncilOfMinistersDataset;

export const constitutionalSnapshot = {
  snapshotDate: officeholdersData.snapshotDate,
  retrievedAt: officeholdersData.retrievedAt,
  sourcePolicy: officeholdersData.sourcePolicy,
};

export function getConstitutionalOfficeholder(id: string): ConstitutionalOfficeholder | undefined {
  return officeholdersData.officeholders.find((o) => o.id === id);
}

export const councilOfMinisters = ministersData;

export const MINISTER_CATEGORY_ORDER: MinisterCategory[] = [
  "Prime Minister",
  "Cabinet Ministers",
  "Ministers of State (Independent Charge)",
  "Ministers of State",
];

export const ministersByCategory: { category: MinisterCategory; ministers: UnionMinister[] }[] =
  MINISTER_CATEGORY_ORDER.map((category) => ({
    category,
    ministers: ministersData.ministers.filter((m) => m.category === category),
  }));

export function getUnionMinister(id: string): UnionMinister | undefined {
  return ministersData.ministers.find((m) => m.id === id);
}

export const primeMinisterRecord: UnionMinister | undefined =
  ministersData.ministers.find((m) => m.category === "Prime Minister");
