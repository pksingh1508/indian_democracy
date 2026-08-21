import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { PageHeader, SectionHeading } from "@/src/components/ui";
import { StatusBadge } from "@/src/components/badges";
import { SourceNote } from "@/src/components/source-note";
import {
  getBaselineForCourt,
  getHighCourt,
  highCourtJurisdictions,
} from "@/src/lib/data/judiciary";
import {
  formatDdMmYyyy,
  formatIsoDate,
  slugify,
  titleCase,
} from "@/src/lib/format";

export function generateStaticParams() {
  return highCourtJurisdictions.map((c) => ({ slug: c.id }));
}

export async function generateMetadata(
  props: PageProps<"/high-courts/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const court = getHighCourt(slug);
  if (!court) return {};
  return {
    title: court.name,
    description: `${court.name}: jurisdiction over ${court.statesOrUnionTerritories.join(", ")}, principal seat at ${court.principalSeat}, and judge roster sources.`,
  };
}

export default async function HighCourtPage(props: PageProps<"/high-courts/[slug]">) {
  const { slug } = await props.params;
  const court = getHighCourt(slug);
  if (!court) notFound();
  const baseline = getBaselineForCourt(court.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/high-courts", label: "High Courts" },
          { href: `/high-courts/${slug}`, label: court.name },
        ]}
      />
      <PageHeader
        eyebrow="Constitutional court"
        title={court.name}
        lede={`Serves ${court.statesOrUnionTerritories.join(", ")}. Principal seat at ${court.principalSeat}${court.benches.length > 0 ? `, with benches at ${court.benches.join(", ")}` : ""}.`}
        meta={
          baseline ? (
            <StatusBadge tone="partial">
              Judge names: DOJ baseline dated {formatIsoDate(baseline.sourceAsOn)}
            </StatusBadge>
          ) : (
            <StatusBadge tone="missing">Judge roster not in baseline coverage</StatusBadge>
          )
        }
      />

      {/* Jurisdiction */}
      <section className="mt-12">
        <SectionHeading eyebrow="Territory · e-Courts directory" title="Jurisdiction" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {court.statesOrUnionTerritories.map((name) => (
            <li key={name}>
              <Link
                href={`/states/${slugify(name)}`}
                className="record-card block p-4 no-underline transition-colors hover:border-rule-strong"
              >
                <span className="font-medium text-indelible">{titleCase(name)}</span>
                <span className="block pt-0.5 text-xs text-faint">State / UT page →</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Shared jurisdictions are explicit: several states and Union Territories
          fall under a single High Court (for example, this court&apos;s territory as listed above).
        </p>
      </section>

      {/* Judge roster status */}
      <section className="mt-12">
        <SectionHeading
          eyebrow="Sitting judges"
          title="Judge roster"
          aside={
            <a href={court.officialDirectory} target="_blank" rel="noreferrer" className="text-link">
              Official current roster ↗
            </a>
          }
        />
        {baseline ? (
          <>
            <p className="max-w-3xl rounded-lg border border-dashed border-saffron/50 bg-paper p-4 text-sm leading-relaxed text-muted">
              <strong className="text-ink">Dated baseline — not a current roster.</strong>{" "}
              The {baseline.judgeCount} names below come from the Department of
              Justice consolidated list dated {formatIsoDate(baseline.sourceAsOn)}.
              Judges may since have been appointed, transferred, sworn in as
              additional judges, or retired. Verify against the{" "}
              <a href={court.officialDirectory} target="_blank" rel="noreferrer" className="text-link">
                court&apos;s own roster
              </a>
              .
            </p>
            <div className="mt-5 overflow-x-auto rounded-lg border border-rule bg-surface">
              <table className="data-table">
                <caption className="px-4 pt-4">
                  Baseline list order preserved ({baseline.publishedCourtName}).
                </caption>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Judge</th>
                    <th scope="col">Appointed (additional)</th>
                    <th scope="col">Permanent</th>
                    <th scope="col">Projected retirement</th>
                  </tr>
                </thead>
                <tbody>
                  {baseline.judges.map((j, i) => (
                    <tr key={`${j.name}-${i}`}>
                      <td className="num font-mono text-xs text-faint tabular-nums">{j.baselineListNumber ?? i + 1}</td>
                      <td className="font-medium">{titleCase(j.name.toLowerCase())}</td>
                      {j.appointmentAsAdditionalJudge ? (
                        <>
                          <td>{formatDdMmYyyy(j.appointmentAsAdditionalJudge)}</td>
                          <td>
                            {j.appointmentAsPermanentJudge
                              ? formatDdMmYyyy(j.appointmentAsPermanentJudge)
                              : "—"}
                          </td>
                          <td>{formatDdMmYyyy(j.projectedRetirement ?? "")}</td>
                        </>
                      ) : (
                        <>
                          <td colSpan={2}>
                            {j.judgeType ? (
                              <span className="font-mono text-xs uppercase tracking-wide text-muted">
                                {j.judgeType}
                                {j.initialAppointment ? ` · from ${formatDdMmYyyy(j.initialAppointment)}` : ""}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td>{j.termExpiry ? formatDdMmYyyy(j.termExpiry) : "—"}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SourceNote
              className="mt-4"
              publisher="Department of Justice, Ministry of Law and Justice"
              title="List of High Court Judges (consolidated PDF)"
              url={baseline.sourceUrl}
              authorityTier="Tier 1"
              notes={`Source states the list is “as on” ${formatIsoDate(baseline.sourceAsOn)}.`}
            />
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-rule-strong bg-paper p-5 text-sm leading-relaxed text-muted">
            This court was not covered by the central Department of Justice
            baseline collected for this record. Its current roster lives on the
            court&apos;s official site — linked above — and will be integrated
            through the court-level collection workflow.
          </div>
        )}
      </section>

      <SourceNote
        className="mt-12"
        publisher="Supreme Court of India / eCommittee"
        title="Jurisdiction and Seat of High Courts"
        url={court.officialDirectory}
        authorityTier="Tier 1"
        notes="Official directory entry for this court."
      />
    </div>
  );
}
