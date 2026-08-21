import "server-only";
import coverageJson from "@/app/data/coverage.json";
import registryJson from "@/app/data/sources/source-registry.json";
import type { CoverageDataset, SourceRegistryDataset } from "./types";

const coverageData = coverageJson as unknown as CoverageDataset;
const registryData = registryJson as unknown as SourceRegistryDataset;

export const sourceRegistry = registryData;

export const coverageReport = coverageData;

/** Status label mapping for display. */
export function describeCoverageStatus(status: string): {
  label: string;
  tone: "ok" | "partial" | "missing" | "excluded";
} {
  if (status.startsWith("complete") || status === "complete-current-snapshot") {
    return { label: "Complete", tone: "ok" };
  }
  if (status.startsWith("partial")) {
    return { label: "Partial", tone: "partial" };
  }
  if (status.startsWith("not-yet-collected")) {
    return { label: "Not yet collected", tone: "missing" };
  }
  if (status.startsWith("out-of-scope")) {
    return { label: "Out of scope", tone: "excluded" };
  }
  return { label: status, tone: "partial" };
}
