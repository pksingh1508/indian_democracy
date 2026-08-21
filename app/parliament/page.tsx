import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { PageHeader } from "@/src/components/ui";
import { StatusBadge } from "@/src/components/badges";
import {
  lokSabha,
  lokSabhaPartyCounts,
  rajyaSabha,
  rajyaSabhaPartyCounts,
} from "@/src/lib/data/parliament";
import { buildChamberBlocks } from "@/src/lib/chamber";

export const metadata: Metadata = {
  title: "Parliament",
  description:
    "The Parliament of India: Lok Sabha and Rajya Sabha composition, presiding officers, and current membership.",
};

function ChamberCard({
  href,
  name,
  hindi,
  role,
  sitting,
  vacancies,
  sanctioned,
  topBlocks,
}: {
  href: string;
  name: string;
  hindi: string;
  role: string;
  sitting: number;
  vacancies: number;
  sanctioned: number;
  topBlocks: string[];
}) {
  return (
    <Link href={href} className="record-card block p-6 no-underline transition-colors hover:border-rule-strong">
      <p className="eyebrow mb-2">{hindi}</p>
      <h2 className="font-display text-2xl text-indelible">{name}</h2>
      <p className="mt-1 text-sm text-muted">{role}</p>
      <p className="mt-4 font-mono text-sm tabular-nums">
        {sitting} sitting + {vacancies} vacant = {sanctioned} seats
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Largest groups: {topBlocks.join(" · ")}
      </p>
    </Link>
  );
}

export default function ParliamentPage() {
  const lsBlocks = buildChamberBlocks(lokSabhaPartyCounts, lokSabha.counts.officialVacancies);
  const rsBlocks = buildChamberBlocks(rajyaSabhaPartyCounts, rajyaSabha.counts.officialVacancies);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/parliament", label: "Parliament" }]} />
      <PageHeader
        eyebrow="Union legislature · Articles 79–122"
        title="Parliament of India"
        lede="The Union legislature has two Houses. The Lok Sabha is directly elected by voters; the Rajya Sabha is elected by state legislative assemblies and includes Presidential nominees. Both rosters below are complete current snapshots."
        meta={
          <>
            <StatusBadge tone="ok">Lok Sabha snapshot</StatusBadge>
            <StatusBadge tone="ok">Rajya Sabha snapshot</StatusBadge>
          </>
        }
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <ChamberCard
          href="/parliament/lok-sabha"
          name="Lok Sabha"
          hindi="House of the People"
          role={`Term ${lokSabha.house.term} · five-year house, dissolved for general elections`}
          sitting={lokSabha.counts.sittingMembers}
          vacancies={lokSabha.counts.officialVacancies}
          sanctioned={lokSabha.house.sanctionedSeats}
          topBlocks={lsBlocks.slice(0, 3).map((b) => `${b.shortLabel} ${b.count}`)}
        />
        <ChamberCard
          href="/parliament/rajya-sabha"
          name="Rajya Sabha"
          hindi="Council of States"
          role="Permanent house · one-third of members retire every two years"
          sitting={rajyaSabha.counts.sittingMembers}
          vacancies={rajyaSabha.counts.officialVacancies}
          sanctioned={rajyaSabha.house.sanctionedSeats}
          topBlocks={rsBlocks.slice(0, 3).map((b) => `${b.shortLabel} ${b.count}`)}
        />
      </div>

      <section className="mt-14 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-ink">How the two Houses differ</h2>
          <table className="data-table mt-4">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Lok Sabha</th>
                <th scope="col">Rajya Sabha</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="font-normal text-muted">Election</th>
                <td>Direct, by universal adult franchise</td>
                <td>Indirect, by state/UT assemblies; 12 nominated</td>
              </tr>
              <tr>
                <th scope="row" className="font-normal text-muted">Term</th>
                <td>Five years, dissolvable</td>
                <td>Permanent; staggered six-year terms</td>
              </tr>
              <tr>
                <th scope="row" className="font-normal text-muted">Presiding officer</th>
                <td>Speaker (elected by the House)</td>
                <td>Vice-President ex officio</td>
              </tr>
              <tr>
                <th scope="row" className="font-normal text-muted">Money bills</th>
                <td>Origin and final say</td>
                <td>Recommendations only, must respond in 14 days</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="font-display text-xl text-ink">Reading the composition views</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Each chamber page shows the same computed snapshot three ways: an
            accessible party table, a conceptual 2D hemicycle, and an optional 3D
            view. The arithmetic is always explicit — assigned seats plus named
            vacancies must equal the sanctioned house size, and every view is
            generated from that single reconciled dataset.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Seat positions are stylistic, not physical: no official source
            publishes seating assignments, so the views are labelled{" "}
            <em>chamber-style composition views</em>.
          </p>
        </div>
      </section>
    </div>
  );
}
