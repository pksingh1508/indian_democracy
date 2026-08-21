const HONORIFICS = new Set([
  "shri", "smt", "smt.", "shrimati", "dr", "dr.", "prof", "prof.",
  "md", "md.", "maulana", "ch", "ch.", "kumari", "ms", "ms.",
  "mr", "mr.", "mrs", "mrs.", "adv", "adv.", "syed", "miyan",
]);

/** Strip a leading honorific ("Shri Narendra Modi" -> "Narendra Modi"). */
export function stripHonorific(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1 && HONORIFICS.has(parts[0].toLowerCase())) {
    return parts.slice(1).join(" ");
  }
  return name;
}

/**
 * Rajya Sabha publishes names as "Surname, Shri Given". Reorder to
 * "Shri Surname Given" for display and return the clean base name.
 */
export function reorderSabhaName(rawName: string): { display: string; asPublished: string } {
  const match = rawName.match(/^(.+),\s*([A-Za-z. ]+)$/);
  if (match && HONORIFICS.has(match[2].trim().toLowerCase())) {
    return {
      display: stripHonorific(`${match[2].trim()} ${match[1].trim()}`),
      asPublished: rawName,
    };
  }
  return { display: stripHonorific(rawName), asPublished: rawName };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Normalize state/UT names across datasets ("Jammu & Kashmir" vs "Jammu And Kashmir", "NCT of Delhi", leading "The"). */
const STATE_ALIASES: Record<string, string> = {
  nctofdelhi: "delhi",
  nationalcapitalterritoryofdelhi: "delhi",
};

export function normalizeStateName(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z]+/g, "");
  return STATE_ALIASES[normalized] ?? normalized;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthName(m: number): string | null {
  return m >= 1 && m <= 12 ? MONTHS[m - 1] : null;
}

function daySuffix(d: number): string {
  if (d >= 11 && d <= 13) return "th";
  switch (d % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

/** ISO yyyy-mm-dd -> "25 July 2022". Returns the input when not parseable. */
export function formatIsoDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const [, y, mm, dd] = m;
  const month = monthName(Number(mm));
  if (!month) return iso;
  return `${Number(dd)} ${month} ${y}`;
}

/** dd-mm-yyyy or dd/mm/yyyy -> "24 May 2019". Returns input when not parseable. */
export function formatDdMmYyyy(value: string): string {
  const m = value.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (!m) return value;
  const month = monthName(Number(m[2]));
  if (!month) return value;
  return `${Number(m[1])} ${month} ${m[3]}`;
}

/** Format an SC-style term "24-05-2019 to 09-02-2027" with projected-end caveat. */
export function formatTermOfOffice(term: string): { start: string; end: string } | null {
  const parts = term.split(/\s*to\s*/i).map((p) => p.trim()).filter(Boolean);
  if (parts.length !== 2) return null;
  return { start: formatDdMmYyyy(parts[0]), end: formatDdMmYyyy(parts[1]) };
}

export function formatRetrievedAt(isoTimestamp: string): string {
  const datePart = isoTimestamp.split("T")[0];
  return formatIsoDate(datePart);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return `${count.toLocaleString("en-IN")} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}

export function titleCase(value: string): string {
  return value.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}
