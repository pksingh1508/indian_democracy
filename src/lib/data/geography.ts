import "server-only";
import geographyJson from "@/app/data/geography/states-and-districts.json";
import type { DistrictEntry, GeographyDataset, StateEntry } from "./types";

const data = geographyJson as unknown as GeographyDataset;

export const geography = {
  snapshotDate: data.snapshotDate,
  retrievedAt: data.retrievedAt,
  source: data.source,
};

export const states: StateEntry[] = [...data.states].sort((a, b) =>
  a.stateName.localeCompare(b.stateName),
);

export const districtCount: number = data.districts.length;

export function getStateByCode(code: number): StateEntry | undefined {
  return states.find((s) => s.stateCode === code);
}

export function getDistrictsByStateCode(code: number): DistrictEntry[] {
  return data.districts
    .filter((d) => d.stateCode === code)
    .sort((a, b) => a.districtName.localeCompare(b.districtName));
}
