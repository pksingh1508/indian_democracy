export interface PartyMeta {
  color: string;
}

/**
 * Curated colors for parties with significant representation, following
 * widely used conventions. Unknown parties get a deterministic fallback.
 * Color never carries meaning alone: labels always sit beside the swatch.
 */
const CURATED: Record<string, string> = {
  BJP: "#e8842c",
  INC: "#2196c9",
  SP: "#c8402f",
  AITC: "#d95f2b",
  DMK: "#cf3339",
  TDP: "#e3bf3c",
  SS: "#e2571b",
  "JD(U)": "#3a8a4d",
  NCPSP: "#3f7fae",
  "NCP": "#5b9bc4",
  "Ind.": "#8d919b",
  "LJSP(RV)": "#4f7ecb",
  RJD: "#2f7f56",
  "YSR Congress Party": "#2e5fa3",
  "CPI(M)": "#d0342c",
  IUML: "#2e9e5b",
  AAP: "#e9b23a",
  SHSUBT: "#7d64b8",
  JMM: "#54452e",
  "J&KNC": "#c2543a",
  "JD(S)": "#5da052",
  RLD: "#3f8f74",
  CPI: "#b02a24",
  VCK: "#4a55a0",
  "CPI(ML)(L)": "#a01f1a",
  JSP: "#4c86ad",
  SAD: "#c99a2e",
  AIMIM: "#3f7a46",
  "Apna Dal (S)": "#b56a35",
};

const FALLBACK = [
  "#6f5aa8", "#3f8f74", "#b06a35", "#4c86ad", "#8d5ba0",
  "#5d8f3f", "#a85a72", "#5a7ea8", "#8f7a3f", "#7a4f8f",
];

/** Resolve a display color for a party key (abbreviation preferred). */
export function partyColor(key: string | null | undefined): string {
  if (!key) return "#8d919b";
  const curated = CURATED[key];
  if (curated) return curated;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return FALLBACK[hash % FALLBACK.length];
}
