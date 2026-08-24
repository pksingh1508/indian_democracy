import type { Metadata } from "next";
import { PageHeader } from "@/src/components/ui";
import { StatusBadge } from "@/src/components/badges";
import { coverageReport, describeCoverageStatus } from "@/src/lib/data/sources";
import { SITE, formatSnapshotDate } from "@/src/lib/site";
import { Reveal } from "@/src/components/motion-primitives";

export const metadata: Metadata = {
  title: "Coverage report",
  description:
    "What this record covers today, what is partial or dated, and what is not yet collected.",
};

export default function CoveragePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <PageHeader
        eyebrow="Transparency"
        title="Coverage report"
        lede="Published scope is a promise about maintenance. This machine-readable report states exactly what is complete, what is partial or dated, and what has not been collected."
        meta={
          <span className="font-mono text-xs text-faint">
            Snapshot {formatSnapshotDate(coverageReport.snapshotDate)}
          </span>
        }
      />

      <Reveal className="mt-8">
        <div className="overflow-x-auto rounded-lg border border-rule bg-surface">
          <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Area</th>
              <th scope="col">Status</th>
              <th scope="col" className="num">Records</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {coverageReport.coverage.map((c) => {
              const tone = describeCoverageStatus(c.status);
              return (
                <tr key={c.area}>
                  <td className="align-top font-mono text-xs">{c.area}</td>
                  <td className="align-top">
                    <StatusBadge tone={tone.tone}>{tone.label}</StatusBadge>
                  </td>
                  <td className="num align-top font-mono tabular-nums">
                    {c.records.toLocaleString("en-IN")}
                  </td>
                  <td className="max-w-md align-top text-sm text-muted">
                    {c.notes}
                    {c.file ? (
                      <span className="mt-1 block font-mono text-[0.7rem] text-faint">
                        app/data/{c.file}
                      </span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-4" y={12}>
        <p className="text-sm leading-relaxed text-muted">
          Coverage expands only when a collection can be kept fresh. State
          legislatures and district judicial officers require state-by-state
          official source work and are deliberately not inferred from the national
          datasets. A directory of every government employee is out of scope by
          policy — see{" "}
          <span className="font-mono text-xs">{SITE.name}</span>’s methodology for
          the reasoning.
        </p>
      </Reveal>
    </div>
  );
}
