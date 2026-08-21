import Link from "next/link";

type Tone = "ok" | "partial" | "missing" | "excluded" | "neutral";

const TONE_STYLES: Record<Tone, string> = {
  ok: "border-leaf/40 text-leaf",
  partial: "border-saffron/50 text-saffron",
  missing: "border-rule-strong text-muted",
  excluded: "border-rule-strong text-faint",
  neutral: "border-indelible/40 text-indelible",
};

export function StatusBadge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] ${TONE_STYLES[tone]}`}
    >
      {children}
    </span>
  );
}

export function FreshnessBadge({ snapshotDate }: { snapshotDate: string }) {
  return (
    <Link
      href="/coverage"
      className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-paper px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted no-underline hover:border-indelible hover:text-indelible"
    >
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-leaf" />
      verified {snapshotDate}
    </Link>
  );
}
