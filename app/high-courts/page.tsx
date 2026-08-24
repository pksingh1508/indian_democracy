import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { PageHeader } from "@/src/components/ui";
import { StatusBadge } from "@/src/components/badges";
import {
  getBaselineForCourt,
  highCourtBaselineSummary,
  highCourtJurisdictions,
  rosterSources,
} from "@/src/lib/data/judiciary";
import { formatIsoDate } from "@/src/lib/format";
import { Reveal, Stagger, StaggerItem } from "@/src/components/motion-primitives";

export const metadata: Metadata = {
  title: "High Courts",
  description:
    "All 25 High Courts of India: jurisdiction over states and UTs, principal seats, benches, and dated judge-roster sources.",
};

export default function HighCourtsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/high-courts", label: "High Courts" }]} />
      <PageHeader
        eyebrow="Judiciary · Articles 214–231"
        title={`High Courts · ${highCourtJurisdictions.length}`}
        lede="India's constitutional courts at state level. Jurisdiction and seat data are complete for all 25 courts; sitting-judge rosters are maintained by each court, so judge names here appear only as a clearly dated central baseline."
        meta={
          <>
            <StatusBadge tone="ok">Jurisdiction complete</StatusBadge>
            <StatusBadge tone="partial">
              Judge names: dated baseline ({highCourtBaselineSummary.counts.highCourtsCovered}/25 courts)
            </StatusBadge>
          </>
        }
      />

      <Stagger as="ul" className="mt-10 grid gap-4 md:grid-cols-2" stagger={0.035}>
        {highCourtJurisdictions.map((court) => {
          const baseline = getBaselineForCourt(court.id);
          return (
            <StaggerItem key={court.id} as="li" className="record-card p-5 transition-colors hover:border-rule-strong">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/high-courts/${court.id}`} className="font-display text-lg text-indelible no-underline">
                  {court.name}
                </Link>
                <span className="shrink-0 font-mono text-xs text-faint tabular-nums">
                  {baseline ? `${baseline.judgeCount} baseline judges` : "—"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                Principal seat: <strong className="font-medium">{court.principalSeat}</strong>
                {court.benches.length > 0 && ` · benches at ${court.benches.join(", ")}`}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Serves: {court.statesOrUnionTerritories.join(" · ")}
              </p>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal className="mt-10">
        <aside className="rounded-lg border border-dashed border-rule-strong bg-paper p-5 text-sm leading-relaxed text-muted">
          <strong className="text-ink">About the dated baseline.</strong>{" "}
          The Department of Justice publishes consolidated judge-list PDFs — the
          latest collected here is dated{" "}
          {formatIsoDate(rosterSources.centralBaseline.asOn)} covering{" "}
          {highCourtBaselineSummary.counts.highCourtsCovered} of{" "}
          {highCourtBaselineSummary.counts.highCourtsInIndia} courts with{" "}
          {highCourtBaselineSummary.counts.judges.toLocaleString("en-IN")} names.
          Appointments, transfers, and retirements happen year-round, so these are
          presented strictly as a baseline, never as a current sitting roster.
          Each court page links its own official roster for verification.
        </aside>
      </Reveal>
    </div>
  );
}
