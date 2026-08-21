export const SITE = {
  name: "Lokkosh",
  tagline: "Who serves in India's public offices — and what the official record says",
  description:
    "An independent, non-partisan record of India's democratic institutions: the Union executive, Parliament, the judiciary, and every state and Union Territory, with a dated official source behind each fact.",
  snapshotDate: "2026-08-21",
  collectedOn: "21 August 2026",
} as const;

export function formatSnapshotDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
