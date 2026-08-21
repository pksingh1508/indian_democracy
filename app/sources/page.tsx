import type { Metadata } from "next";
import { PageHeader } from "@/src/components/ui";
import { sourceRegistry } from "@/src/lib/data/sources";
import { formatIsoDate } from "@/src/lib/format";

export const metadata: Metadata = {
  title: "Source registry",
  description:
    "Every official publisher and service this record is built from, with authority tier and as-of dates.",
};

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageHeader
        eyebrow="Provenance"
        title="Source registry"
        lede="Each dataset keeps its own source metadata. This registry lists the official publishers behind them, what they are used for, and how fresh each was at collection time."
      />

      <div className="mt-8 overflow-x-auto rounded-lg border border-rule bg-surface">
        <table className="data-table">
          <caption className="px-4 pt-4">
            All sources are official public services (authority Tier 1 unless noted).
          </caption>
          <thead>
            <tr>
              <th scope="col">Source</th>
              <th scope="col">Publisher</th>
              <th scope="col">Used for</th>
              <th scope="col" className="num">As of</th>
            </tr>
          </thead>
          <tbody>
            {sourceRegistry.sources.map((s) => (
              <tr key={s.id}>
                <td className="align-top">
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-link">
                    {s.title}
                  </a>
                  {s.notes ? (
                    <p className="mt-1 max-w-md text-xs leading-relaxed text-faint">{s.notes}</p>
                  ) : null}
                </td>
                <td className="align-top text-muted">{s.publisher}</td>
                <td className="align-top">
                  <ul className="space-y-0.5 font-mono text-xs text-muted">
                    {s.usedFor.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </td>
                <td className="num align-top font-mono text-xs">{formatIsoDate(s.asOf)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        Authority tiers follow a simple order: gazettes and formal orders first,
        then current rosters maintained by the responsible institution, then
        official profiles and press releases. Reputable secondary reporting is
        used only as a lead, never as the sole support for a current-office
        claim — and never on this site's collected datasets.
      </p>
    </div>
  );
}
