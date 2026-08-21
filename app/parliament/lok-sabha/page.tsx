import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { PageHeader, SectionHeading, Pagination } from "@/src/components/ui";
import { FreshnessBadge } from "@/src/components/badges";
import { PartyTag } from "@/src/components/party-tag";
import { Hemicycle2D, ChamberLegend } from "@/src/components/hemicycle";
import { MemberFilters, applyMemberFilters } from "@/src/components/member-filters";
import { ChamberExplorer } from "@/src/components/chamber-explorer";
import { SourceNote } from "@/src/components/source-note";
import {
  lokSabha,
  lokSabhaMembers,
  lokSabhaPartyCounts,
  lokSabhaVacancies,
} from "@/src/lib/data/parliament";
import { buildChamberBlocks, generateSeats, toSeats3D } from "@/src/lib/chamber";
import { formatIsoDate, stripHonorific } from "@/src/lib/format";

export const metadata: Metadata = {
  title: "Lok Sabha — composition & members",
  description:
    "Current composition of the Lok Sabha (18th Lok Sabha): party totals, vacancies, and the full member roster with official sources.",
};

const PAGE_SIZE = 50;

export default async function LokSabhaPage(
  props: PageProps<"/parliament/lok-sabha">,
) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const party = typeof searchParams.party === "string" ? searchParams.party : undefined;
  const state = typeof searchParams.state === "string" ? searchParams.state : undefined;
  const pageParam = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;

  const blocks = buildChamberBlocks(lokSabhaPartyCounts, lokSabha.counts.officialVacancies);
  const { seats, geometry } = generateSeats(blocks);

  // Release-blocking reconciliation: buckets must sum to the sanctioned house.
  const assignedTotal = blocks.filter((b) => b.kind !== "vacant").reduce((s, b) => s + b.count, 0);
  const vacantTotal = blocks.find((b) => b.kind === "vacant")?.count ?? 0;
  const reconciles =
    assignedTotal + vacantTotal === lokSabha.house.sanctionedSeats &&
    seats.length === lokSabha.house.sanctionedSeats;

  const stateNames = [...new Set(lokSabhaMembers.map((m) => m.stateOrUnionTerritory))].sort();

  const filtered = applyMemberFilters(lokSabhaMembers, { q, party, state }, (m) => ({
    haystack: `${m.name} ${m.nameAsPublished} ${m.constituency} ${m.stateOrUnionTerritory} ${m.party}`.toLowerCase(),
    partyKey: m.partyAbbreviation ?? m.party,
    state: m.stateOrUnionTerritory,
  })).sort((a, b) => a.constituency.localeCompare(b.constituency));

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (party) params.set("party", party);
    if (state) params.set("state", state);
    if (p > 1) params.set("page", String(p));
    params.set("page_anchor_removed", "");
    params.delete("page_anchor_removed");
    const qs = params.toString();
    return `/parliament/lok-sabha${qs ? `?${qs}` : ""}#members`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/parliament", label: "Parliament" },
          { href: "/parliament/lok-sabha", label: "Lok Sabha" },
        ]}
      />
      <PageHeader
        eyebrow="House of the People · direct election · five-year term"
        title="Lok Sabha"
        lede={`The ${lokSabha.house.term}th Lok Sabha. Members are elected directly from single-member territorial constituencies; seats are reserved for Scheduled Castes and Scheduled Tribes. The Speaker presides.`}
        meta={<FreshnessBadge snapshotDate={formatIsoDate(lokSabha.snapshotDate)} />}
      />

      {/* Composition summary */}
      <section aria-labelledby="composition" className="mt-10">
        <h2 id="composition" className="font-display text-2xl text-ink">Composition</h2>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm tabular-nums">
          <span>{assignedTotal.toLocaleString("en-IN")} sitting members</span>
          <span aria-hidden className="text-faint">+</span>
          <span>{vacantTotal} vacant</span>
          <span aria-hidden className="text-faint">=</span>
          <span className="font-medium">{lokSabha.house.sanctionedSeats} sanctioned seats</span>
          <span
            role="status"
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] ${
              reconciles ? "border-leaf/40 text-leaf" : "border-saffron text-saffron"
            }`}
          >
            {reconciles ? "reconciled ✓" : "reconciliation failed"}
          </span>
        </div>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
          <figure>
            <Hemicycle2D
              seats={seats}
              geometry={geometry}
              summaryLabel={`Chamber-style composition of the Lok Sabha: ${blocks.map((b) => `${b.shortLabel} ${b.count}`).join(", ")}. Conceptual layout, not physical seating.`}
              className="w-full"
            />
            <figcaption className="mt-2 text-center text-xs text-faint">
              Chamber-style view · conceptual arrangement, not physical seating
            </figcaption>
          </figure>

          <div>
            <SectionHeading title="Party totals" aside={`${blocks.length} groups`} />
            <div className="overflow-x-auto rounded-lg border border-rule bg-surface">
              <table className="data-table">
                <caption className="sr-only">
                  Lok Sabha party composition; the authoritative accessible interface for the chamber view.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Party / group</th>
                    <th scope="col" className="num">Seats</th>
                    <th scope="col" className="num">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((b) => (
                    <tr key={b.key}>
                      <td>
                        {b.kind === "vacant" ? (
                          <span className="text-muted italic">Vacant</span>
                        ) : (
                          <Link href={`/parliament/lok-sabha?party=${encodeURIComponent(b.key)}#members`} className="text-link">
                            {b.shortLabel === b.label ? (
                              b.label
                            ) : (
                              <>
                                <span className="font-medium">{b.shortLabel}</span>{" "}
                                <span className="text-faint">{b.label}</span>
                              </>
                            )}
                          </Link>
                        )}
                      </td>
                      <td className="num tabular-nums">{b.count}</td>
                      <td className="num font-mono text-xs text-faint tabular-nums">
                        {((b.count / lokSabha.house.sanctionedSeats) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-rule-strong">
                    <td className="font-medium">Total house</td>
                    <td className="num font-medium tabular-nums">{lokSabha.house.sanctionedSeats}</td>
                    <td className="num font-mono text-xs text-faint">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <ChamberLegend blocks={blocks.slice(0, 8)} />
            </div>
          </div>
        </div>
      </section>

      {/* 3D explorer */}
      <section className="mt-12">
        <ChamberExplorer
          houseName="Lok Sabha"
          points={toSeats3D(seats, geometry)}
          blockKeys={blocks.map((b) => b.key)}
        />
      </section>

      {/* Members */}
      <section id="members" className="mt-14 scroll-mt-24">
        <SectionHeading
          eyebrow="Digital Sansad current roster · checked snapshot day"
          title="Members"
          aside={
            <Link href="/people" className="text-link">
              Browse all rosters →
            </Link>
          }
        />
        <div className="mt-4">
          <MemberFilters
            action="/parliament/lok-sabha"
            partyCounts={lokSabhaPartyCounts}
            stateNames={stateNames}
            current={{ q, party, state }}
          />
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg border border-rule bg-surface">
          <table className="data-table">
            <caption className="px-4 pt-4">
              {filtered.length.toLocaleString("en-IN")} matching members
              {totalPages > 1 && ` · page ${page} of ${totalPages}`}
            </caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Member</th>
                <th scope="col">Party</th>
                <th scope="col">State / UT</th>
                <th scope="col">Constituency</th>
                <th scope="col">Terms</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((m, i) => (
                <tr key={m.id}>
                  <td className="num font-mono text-xs text-faint tabular-nums">
                    {(page - 1) * PAGE_SIZE + i + 1}
                  </td>
                  <td className="font-medium">
                    <Link href={`/people/${m.id}`} className="text-link">
                      {stripHonorific(m.name)}
                    </Link>
                  </td>
                  <td><PartyTag name={m.party} abbreviation={m.partyAbbreviation} /></td>
                  <td className="text-muted">{m.stateOrUnionTerritory}</td>
                  <td>
                    {m.constituency}
                    {m.constituencyCategory ? (
                      <span className="ml-1 font-mono text-[0.7rem] text-faint">
                        {m.constituencyCategory}
                      </span>
                    ) : null}
                  </td>
                  <td className="font-mono text-xs text-faint tabular-nums">
                    {m.lokSabhaTerms.split(",").map((t) => t.trim()).join("·")}
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted">
                    No members match these filters.{" "}
                    <Link href="/parliament/lok-sabha#members" className="text-link">
                      Clear filters
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} buildHref={buildHref} />
        </div>
      </section>

      {/* Vacancies */}
      <section className="mt-12">
        <SectionHeading
          eyebrow="Official vacancy notices"
          title={`Vacant seats · ${lokSabhaVacancies.length}`}
        />
        {lokSabhaVacancies.length > 0 ? (
          <ul className="grid max-w-xl gap-3 sm:grid-cols-3">
            {lokSabhaVacancies.map((v) => (
              <li key={v.constituency} className="record-card p-4">
                <p className="font-medium">{v.constituency}</p>
                <p className="mt-1 text-sm text-muted">Seat vacant per the official roster.</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No vacancies recorded.</p>
        )}
      </section>

      <SourceNote
        className="mt-12"
        publisher={lokSabha.source.publisher}
        title={lokSabha.source.title}
        url={lokSabha.source.url}
        retrievedAt={lokSabha.retrievedAt}
        authorityTier={lokSabha.source.authorityTier}
        notes={lokSabha.source.notes}
      />
    </div>
  );
}
