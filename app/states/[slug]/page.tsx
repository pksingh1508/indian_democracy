import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { PageHeader, SectionHeading } from "@/src/components/ui";
import { StatusBadge } from "@/src/components/badges";
import { PartyTag } from "@/src/components/party-tag";
import {
  getDistrictsByStateCode,
  getStateByCode,
  states,
} from "@/src/lib/data/geography";
import {
  lokSabhaMembersByState,
  lokSabhaVacancies,
  rajyaSabhaMembersByState,
} from "@/src/lib/data/parliament";
import {
  highCourtsServingState,
} from "@/src/lib/data/judiciary";
import { normalizeStateName, reorderSabhaName, slugify, stripHonorific } from "@/src/lib/format";

const UT_NORMALIZED = new Set([
  "andamanandnicobarislands",
  "chandigarh",
  "dadraandnagarhavelianddamananddiu",
  "delhi",
  "jammuandkashmir",
  "ladakh",
  "lakshadweep",
  "puducherry",
]);

export function generateStaticParams() {
  return states.map((s) => ({ slug: slugify(s.stateName) }));
}

export async function generateMetadata(
  props: PageProps<"/states/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const state = states.find((s) => slugify(s.stateName) === slug);
  if (!state) return {};
  return {
    title: state.stateName,
    description: `Lok Sabha and Rajya Sabha representation, High Court, and districts of ${state.stateName}.`,
  };
}

export default async function StatePage(props: PageProps<"/states/[slug]">) {
  const { slug } = await props.params;
  const state = states.find((s) => slugify(s.stateName) === slug);
  if (!state) notFound();

  const type = UT_NORMALIZED.has(normalizeStateName(state.stateName))
    ? "Union Territory"
    : "State";
  const districts = getDistrictsByStateCode(state.stateCode);
  const lsMembers = lokSabhaMembersByState(state.stateName);
  const rsMembers = rajyaSabhaMembersByState(state.stateName);
  const courts = highCourtsServingState(state.stateName);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/states", label: "States & UTs" },
          { href: `/states/${slug}`, label: state.stateName },
        ]}
      />
      <PageHeader
        eyebrow={`${type} · LGD code ${state.stateCode}`}
        title={state.stateName}
        lede={
          type === "Union Territory"
            ? `A Union Territory administered through the Union government${normalizeStateName(state.stateName) === "delhi" || normalizeStateName(state.stateName) === "jammuandkashmir" || normalizeStateName(state.stateName) === "puducherry" ? " with its own legislature" : ""}. Its parliamentary representation, High Court relationship, and districts are recorded below.`
            : "A constituent state of the Indian Union. Its parliamentary representation, High Court relationship, and official districts are recorded below."
        }
        meta={
          <>
            <StatusBadge tone="ok">Geography complete</StatusBadge>
            <StatusBadge tone="missing">State executive not yet collected</StatusBadge>
          </>
        }
      />

      {/* Parliamentary representation */}
      <section className="mt-12">
        <SectionHeading
          id="parliament"
          eyebrow="Parliament of India · current rosters"
          title="Parliamentary representation"
          aside={`${lsMembers.length} Lok Sabha ${lsMembers.length === 1 ? "member" : "members"} · ${rsMembers.length} Rajya Sabha`}
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-muted">
              Lok Sabha — constituencies &amp; members
            </h3>
            {lsMembers.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-rule bg-surface">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Constituency</th>
                      <th scope="col">Member</th>
                      <th scope="col">Party</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lsMembers.map((m) => (
                      <tr key={m.id}>
                        <td className="align-top">
                          {m.constituency}
                          {m.constituencyCategory ? (
                            <span className="ml-1 font-mono text-[0.7rem] text-faint">
                              {m.constituencyCategory}
                            </span>
                          ) : null}
                        </td>
                        <td className="align-top">
                          <Link href={`/people/${m.id}`} className="text-link">
                            {stripHonorific(m.name)}
                          </Link>
                        </td>
                        <td className="align-top text-sm">
                          <PartyTag name={m.party} abbreviation={m.partyAbbreviation} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-rule-strong bg-paper p-4 text-sm text-muted">
                No sitting Lok Sabha members recorded for this jurisdiction in the
                current roster.
              </p>
            )}
          </div>

          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.1em] text-muted">
              Rajya Sabha — elected &amp; nominated members
            </h3>
            {rsMembers.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-rule bg-surface">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Member</th>
                      <th scope="col">Party</th>
                      <th scope="col">Term</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsMembers.map((m) => {
                      const { display } = reorderSabhaName(m.name);
                      return (
                        <tr key={m.id}>
                          <td className="align-top">
                            <Link href={`/people/${m.id}`} className="text-link">
                              {display}
                            </Link>
                          </td>
                          <td className="align-top text-sm">
                            <PartyTag name={m.party} abbreviation={m.partyAbbreviation} />
                          </td>
                          <td className="align-top font-mono text-xs text-muted tabular-nums">
                            {m.term}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-rule-strong bg-paper p-4 text-sm text-muted">
                No Rajya Sabha seats are allocated to this jurisdiction (or its
                members fall under “Nominated”).
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Judiciary */}
      <section className="mt-14">
        <SectionHeading
          id="judiciary"
          eyebrow="High Courts · e-Courts directory"
          title="Judiciary relationship"
        />
        {courts.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {courts.map((court) => (
              <li key={court.id} className="record-card p-5">
                <Link href={`/high-courts/${court.id}`} className="font-display text-lg text-indelible no-underline">
                  {court.name}
                </Link>
                <p className="mt-1 text-sm text-muted">
                  Principal seat: {court.principalSeat}
                  {court.benches.length > 0 && ` · benches at ${court.benches.join(", ")}`}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-rule-strong bg-paper p-4 text-sm text-muted">
            No High Court lists this jurisdiction within its recorded territory.
          </p>
        )}
      </section>

      {/* Districts */}
      <section className="mt-14">
        <SectionHeading
          id="districts"
          eyebrow="Local Government Directory"
          title={`Districts · ${districts.length}`}
          aside={
            <span className="font-mono text-xs text-faint">
              LGD district codes shown
            </span>
          }
        />
        <div className="rounded-lg border border-rule bg-surface p-5">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3 lg:grid-cols-4">
            {districts.map((d) => (
              <li key={d.districtCode} className="flex items-baseline justify-between gap-2 border-b border-rule/60 pb-1">
                <span>{d.districtName}</span>
                <span className="font-mono text-[0.7rem] text-faint tabular-nums">
                  {d.districtCode}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <aside className="mt-12 rounded-lg border border-dashed border-rule-strong bg-paper p-5 text-sm leading-relaxed text-muted">
        <strong className="text-ink">Not yet in coverage:</strong> this
        jurisdiction's Governor/Lieutenant Governor, Chief Minister, Council of
        Ministers, and legislators require the state-by-state collection that is
        tracked openly on the{" "}
        <Link href="/coverage" className="text-link">coverage report</Link>. The three
        national vacancy records ({lokSabhaVacancies.map((v) => v.constituency).join(", ")})
        belong to other jurisdictions' Lok Sabha maps and are shown on their
        chamber pages.
      </aside>
    </div>
  );
}

