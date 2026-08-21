import { formatRetrievedAt } from "@/src/lib/format";

export interface CitationProps {
  publisher: string;
  title?: string;
  url: string;
  retrievedAt?: string;
  asOn?: string;
  authorityTier?: string;
  notes?: string;
  className?: string;
}

/**
 * The visible citation block that accompanies every dataset section.
 * Publisher, linked source, retrieval/as-on date and authority tier.
 */
export function SourceNote({
  publisher,
  title,
  url,
  retrievedAt,
  asOn,
  authorityTier,
  notes,
  className = "",
}: CitationProps) {
  return (
    <aside
      className={`rounded-lg border border-rule bg-paper px-4 py-3 text-[0.8125rem] leading-relaxed text-muted ${className}`}
      aria-label="Source citation"
    >
      <span className="eyebrow mb-1.5 block">Source</span>
      <p>
        <a href={url} target="_blank" rel="noreferrer" className="text-link">
          {title ?? url}
        </a>
        {" — "}
        {publisher}
        {authorityTier ? (
          <span className="ml-2 rounded border border-rule px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-faint">
            {authorityTier}
          </span>
        ) : null}
      </p>
      {(retrievedAt || asOn) && (
        <p className="mt-1 font-mono text-xs text-faint">
          {retrievedAt ? `Checked ${formatRetrievedAt(retrievedAt)}` : null}
          {retrievedAt && asOn ? " · " : null}
          {asOn ? `Source states “as on ${asOn}”` : null}
        </p>
      )}
      {notes ? <p className="mt-1 italic text-faint">{notes}</p> : null}
    </aside>
  );
}

export function DatasetNote({
  snapshotDate,
  children,
}: {
  snapshotDate: string;
  children?: React.ReactNode;
}) {
  return (
    <p className="font-mono text-xs leading-relaxed text-faint">
      Record snapshot {snapshotDate}. {children}
    </p>
  );
}
