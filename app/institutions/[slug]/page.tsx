import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { PageHeader, SectionHeading } from "@/src/components/ui";
import { StatusBadge } from "@/src/components/badges";
import { SourceNote } from "@/src/components/source-note";
import {
  councilOfMinisters,
  ministersByCategory,
  getConstitutionalOfficeholder,
} from "@/src/lib/data/executive";
import { supremeCourt } from "@/src/lib/data/judiciary";
import {
  formatIsoDate,
  formatTermOfOffice,
  stripHonorific,
} from "@/src/lib/format";

interface ExplainerSection {

interface ExplainerSection {
  heading: string;
  body: string;
}

interface InstitutionDefinition {
  title: string;
  eyebrow: string;
  lede: string;
  basis: string;
  status: { label: string; tone: "ok" | "partial" | "missing" };
  sections: ExplainerSection[];
}

const DEFINITIONS: Record<string, InstitutionDefinition> = {
  president: {
    title: "President of India",
    eyebrow: "Union executive · Articles 52–62",
    lede: "Head of State and first citizen. Every Union executive action, ordinance, and act of Parliament takes effect in the President's name.",
    basis: "Constitution of India, Articles 52–62",
    status: { label: "Current holder verified", tone: "ok" },
    sections: [
      {
        heading: "Selection",
        body: "An Electoral College of elected members of both Houses of Parliament and elected members of all state Legislative Assemblies (plus elected Delhi and Puducherry MLAs) elects the President by proportional representation through a single transferable vote.",
      },
      {
        heading: "Term and removal",
        body: "Five years from the date of entering office, renewable by re-election. Removal requires impeachment under Article 61 for violation of the Constitution — a process requiring special majorities in both Houses.",
      },
      {
        heading: "Role in the record",
        body: "This site records who holds the office, how entry occurred, and the official source. It does not editorialize about the holder's decisions.",
      },
    ],
  },
  "vice-president": {
    title: "Vice-President of India",
    eyebrow: "Union executive · Articles 63–71",
    lede: "Second-highest constitutional office and ex officio Chairman of the Rajya Sabha.",
    basis: "Constitution of India, Articles 63–71",
    status: { label: "Current holder verified", tone: "ok" },
    sections: [
      {
        heading: "Selection",
        body: "Elected by members of both Houses of Parliament — elected and nominated alike — through a single transferable vote secret ballot. No state legislatures participate.",
      },
      {
        heading: "Term and removal",
        body: "Five years, renewable. Removal differs from impeachment: a Rajya Sabha resolution passed by an effective majority and agreed to by the Lok Sabha, with fourteen days' notice stating the grounds.",
      },
    ],
  },
  "prime-minister": {
    title: "Prime Minister of India",
    eyebrow: "Union executive · Articles 74–75",
    lede: "Head of government and leader of the Council of Ministers, which is collectively responsible to the Lok Sabha.",
    basis: "Constitution of India, Articles 74–75",
    status: { label: "Current holder verified", tone: "ok" },
    sections: [
      {
        heading: "Selection",
        body: "Not directly elected to the office. The President appoints as Prime Minister the member of Parliament best able to command a majority in the Lok Sabha — in practice, the leader of the majority party or coalition.",
      },
      {
        heading: "Responsibility",
        body: "Under Article 75(3) the Union Council of Ministers is collectively responsible to the Lok Sabha and must resign if it loses the House's confidence. The PM advises the President on ministerial appointments and holds key portfolios personally.",
      },
    ],
  },
  "union-council-of-ministers": {
    title: "Union Council of Ministers",
    eyebrow: "Union executive · Article 77 · portfolio allocation",
    lede: "The ministry that runs the Government of India: the Prime Minister, Cabinet Ministers, Ministers of State (Independent Charge), and Ministers of State.",
    basis: "Constitution of India, Articles 74–78, 91st Amendment cap on ministerial strength",
    status: { label: "Complete portfolio snapshot", tone: "ok" },
    sections: [
      {
        heading: "Composition",
        body: "The Council comprises the Prime Minister and up to fifteen percent of Lok Sabha's sanctioned strength in total ministers. Cabinet Ministers head ministries; Ministers of State may hold independent charge or assist Cabinet colleagues.",
      },
      {
        heading: "Portfolios are dated facts",
        body: "Portfolio allocations change through government reshuffles. The record here carries the PMO's stated 'as on' date separately from when we checked the source, so a reader can always tell which allocation snapshot they are seeing.",
      },
    ],
  },
  "supreme-court": {
    title: "Supreme Court of India",
    eyebrow: "Judiciary · Articles 124–147",
    lede: "India's highest judicial forum and final court of appeal, with power of judicial review over Union and state action.",
    basis: "Constitution of India, Articles 124–147",
    status: { label: "Complete current roster", tone: "ok" },
    sections: [
      {
        heading: "Composition",
        body: "The Chief Justice of India and a maximum of thirty-three other judges — thirty-four in all. Judges sit in benches of two or more; constitutional benches of five or more decide substantial questions of constitutional law under Article 143.",
      },
      {
        heading: "Appointment and tenure",
        body: "The President appoints judges recommended through the collegium process. A judge holds office until sixty-five years of age. Retirement dates shown in the roster below are projected dates published by the Court until the term ends.",
      },
      {
        heading: "Jurisdiction",
        body: "Original jurisdiction over Centre–state disputes under Article 131; appellate jurisdiction over High Courts under Articles 132–136 including special leave petitions; advisory jurisdiction under Article 143.",
      },
    ],
  },
  "election-commission": {
    title: "Election Commission of India",
    eyebrow: "Independent institution · Article 324",
    lede: "Autonomous constitutional authority responsible for superintendence, direction, and control of elections to Parliament, state legislatures, and the offices of President and Vice-President.",
    basis: "Constitution of India, Articles 324–329",
    status: { label: "Roster not yet collected", tone: "missing" },
    sections: [
      {
        heading: "Composition and appointment",
        body: "A Chief Election Commissioner and Election Commissioners, appointed by the President following the procedure established by the Chief Election Commissioner and Other Election Commissioners (Appointment, Conditions of Service and Term of Office) Act, 2023, based on a selection committee's recommendation.",
      },
      {
        heading: "Coverage boundary",
        body: "This site has not yet collected a dated, source-linked roster of current commissioners. Rather than publish unsourced names, the gap stays open until collection meets the same standard as every other dataset here.",
      },
    ],
  },
  "comptroller-and-auditor-general": {
    title: "Comptroller and Auditor-General of India",
    eyebrow: "Independent institution · Articles 148–151",
    lede: "Guardian of the public purse: audits the accounts of the Union and the states and reports to their legislatures.",
    basis: "Constitution of India, Articles 148–151; CAG's (Duties, Powers and Conditions of Service) Act, 1971",
    status: { label: "Roster not yet collected", tone: "missing" },
    sections: [
      {
        heading: "Appointment and tenure",
        body: "Appointed by the President by warrant under hand and seal; holds office for six years or until sixty-five years of age, whichever is earlier. Removal mirrors a Supreme Court judge's — on proved misbehaviour or incapacity after a special-majority address by both Houses.",
      },
      {
        heading: "Coverage boundary",
        body: "No dated incumbent record has been collected yet for this office. The gap is deliberate and tracked on the coverage report.",
      },
    ],
  },
  "union-public-service-commission": {
    title: "Union Public Service Commission",
    eyebrow: "Independent institution · Articles 315–323",
    lede: "Central recruiting agency for appointments to the All-India Services and higher civil services of the Union.",
    basis: "Constitution of India, Articles 315–323",
    status: { label: "Roster not yet collected", tone: "missing" },
    sections: [
      {
        heading: "Composition",
        body: "A Chairman and such other members as the President determines, appointed by the President; half the Commission's members must have at least ten years of service under the Government of India or a state government.",
      },
      {
        heading: "Coverage boundary",
        body: "The current member roster is not yet collected here. Explanations of the institution's role are provided while collection work continues.",
      },
    ],
  },
  "state-executive-and-legislatures": {
    title: "State executives & legislatures",
    eyebrow: "The states · Articles 153–212",
    lede: "Every state has a Governor, a Council of Ministers headed by a Chief Minister, and a Legislative Assembly; some also have a Legislative Council.",
    basis: "Constitution of India, Articles 153–212",
    status: { label: "Not yet collected", tone: "missing" },
    sections: [
      {
        heading: "Structure",
        body: "The Governor is the state's constitutional head, appointed by the President. Real executive power rests with the Council of Ministers led by the Chief Minister, collectively responsible to the Legislative Assembly under Article 164. Union Territories are administered through the President, several with their own Administrators or Lieutenant Governors and some with legislatures.",
      },
      {
        heading: "Why no rosters appear here",
        body: "State legislature and state ministry rosters require official state-by-state source collection with its own review cadence — roughly thirty assemblies and two councils. Publishing them without that workflow would create exactly the staleness risk this project exists to avoid. Expansion proceeds jurisdiction by jurisdiction once each source adapter is proven.",
      },
    ],
  },
  "local-government": {
    title: "Local government structure",
    eyebrow: "Grassroots tier · Parts IX and IXA · 73rd and 74th Amendments",
    lede: "Panchayati Raj Institutions in rural areas and Municipalities in urban areas form the third tier of Indian democracy.",
    basis: "Constitution of India, Parts IX and IXA (Articles 243–243ZG)",
    status: { label: "Geography complete · officeholders out of scope", tone: "partial" },
    sections: [
      {
        heading: "Structure",
        body: "The 73rd Amendment created a three-tier panchayat system (village, intermediate, district); the 74th Amendment created municipal bodies. Both provide reservations for Scheduled Castes, Scheduled Tribes, and women, and require State Election Commissions to conduct direct elections every five years.",
      },
      {
        heading: "What appears in this record",
        body: "The Local Government Directory supplies the official list of states, UTs, and districts used throughout this site — 36 jurisdictions and 784 districts. Individual sarpanch, councillor, and mayor records are a separate future collection with its own privacy assessment, and are intentionally absent today.",
      },
    ],
  },
};

const SLUGS = Object.keys(DEFINITIONS);

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/institutions/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const def = DEFINITIONS[slug];
  if (!def) return {};
  return { title: def.title, description: def.lede };
}

function OfficeholderCard({
  id,
}: {
  id: "president-of-india" | "vice-president-of-india" | "prime-minister-of-india";
}) {
  const o = getConstitutionalOfficeholder(id);
  if (!o) return null;
  return (
    <div className="record-card p-6">
      <p className="eyebrow mb-2">Current holder</p>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-display text-2xl text-ink">{o.name}</h3>
        <StatusBadge tone="ok">Confirmed current</StatusBadge>
      </div>
      <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[10rem_1fr]">
        {o.termStart ? (
          <>
            <dt className="text-muted">Term began</dt>
            <dd>{formatIsoDate(o.termStart)}</dd>
          </>
        ) : null}
        <dt className="text-muted">Method of entry</dt>
        <dd>{o.selectionMethod ?? "See institution explanation"}</dd>
        {o.ordinal ? (
          <>
            <dt className="text-muted">Ordinal</dt>
            <dd>
              {o.ordinal}
              {o.ordinal === 15 ? "th" : o.ordinal === 1 ? "st" : o.ordinal === 2 ? "nd" : o.ordinal === 3 ? "rd" : "th"}{" "}
              holder of the office
            </dd>
          </>
        ) : null}
      </dl>
      <SourceNote
        className="mt-5"
        publisher={o.source.publisher}
        url={o.source.url}
        retrievedAt={o.source.pageLastUpdated ? undefined : undefined}
        authorityTier={o.source.authorityTier}
        notes={o.source.notes}
      />
      {o.termStart ? null : null}
    </div>
  );
}

function CouncilOfMinistersBlock() {
  const pmRecord = councilOfMinisters.ministers.find(
    (m) => m.category === "Prime Minister",
  );
  return (
    <div className="mt-8 space-y-8">
      {pmRecord && (
        <div className="record-card border-indelible/30 p-6">
          <p className="eyebrow mb-2">Prime Minister</p>
          <h3 className="font-display text-2xl text-ink">
            {stripHonorific(pmRecord.name)}
          </h3>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {pmRecord.portfolios.map((p) => (
              <li key={p}>{p.replace(/;\s*$/, "").replace(/\s*and\s*$/i, "")}</li>
            ))}
          </ul>
        </div>
      )}
      {ministersByCategory
        .filter((g) => g.category !== "Prime Minister")
        .map((group) => (
          <div key={group.category}>
            <SectionHeading
              title={group.category}
              aside={`${group.ministers.length}`}
            />
            <div className="overflow-x-auto rounded-lg border border-rule bg-surface">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Minister</th>
                    <th scope="col">Portfolios</th>
                    <th scope="col" className="num">#</th>
                  </tr>
                </thead>
                <tbody>
                  {group.ministers.map((m, i) => (
                    <tr key={m.id}>
                      <td className="align-top font-medium">
                        <Link href={`/people/${m.id}`} className="text-link">
                          {m.nameWithoutHonorific}
                        </Link>
                      </td>
                      <td className="align-top text-muted">
                        <ul className="space-y-0.5">
                          {m.portfolios.map((p, pi) => (
                            <li key={`${m.id}-${pi}`}>
                              {p.replace(/;\s*$/, "").replace(/\s*and\s*$/i, "")}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="num align-top font-mono text-xs text-faint tabular-nums">
                        {i + 1}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      <SourceNote
        publisher={councilOfMinisters.source.publisher}
        title={councilOfMinisters.source.title}
        url={councilOfMinisters.source.url}
        asOn={councilOfMinisters.source.publisherAsOn}
        authorityTier={councilOfMinisters.source.authorityTier}
        notes={councilOfMinisters.source.notes}
      />
    </div>
  );
}

function SupremeCourtBlock() {
  const cji = supremeCourt.judges.find((j) => j.chiefJustice);
  const others = supremeCourt.judges.filter((j) => !j.chiefJustice);
  return (
    <div className="mt-8 space-y-8">
      {cji && (
        <div className="record-card border-indelible/30 p-6">
          <p className="eyebrow mb-2">Chief Justice of India</p>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="font-display text-2xl text-ink">{cji.name}</h3>
            <Link href={`/people/${cji.id}`} className="text-link text-sm">
              Full record →
            </Link>
          </div>
          {(() => {
            const t = formatTermOfOffice(cji.termOfOffice);
            return t ? (
              <p className="mt-2 text-sm text-muted">
                Judge since {t.start} · projected end of term {t.end}
              </p>
            ) : null;
          })()}
        </div>
      )}
      <div>
        <SectionHeading
          title="Judges of the Supreme Court"
          aside={`${supremeCourt.judges.length} serving`}
        />
        <div className="overflow-x-auto rounded-lg border border-rule bg-surface">
          <table className="data-table">
            <caption className="px-4 pt-4">
              Terms as displayed by the Court; end dates are projected until reached.
            </caption>
            <thead>
              <tr>
                <th scope="col">Judge</th>
                <th scope="col">Term of office</th>
                <th scope="col" className="num">#</th>
              </tr>
            </thead>
            <tbody>
              {[...others].map((j, i) => {
                const t = formatTermOfOffice(j.termOfOffice);
                return (
                  <tr key={j.id}>
                    <td className="align-top font-medium">
                      <Link href={`/people/${j.id}`} className="text-link">
                        {j.name}
                      </Link>
                    </td>
                    <td className="align-top text-muted">
                      {t ? `${t.start} – ${t.end}` : j.termOfOffice}
                    </td>
                    <td className="num align-top font-mono text-xs text-faint tabular-nums">
                      {i + 2}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <SourceNote
        publisher={supremeCourt.source.publisher}
        title={supremeCourt.source.title}
        url={supremeCourt.source.url}
        retrievedAt={supremeCourt.retrievedAt}
        authorityTier={supremeCourt.source.authorityTier}
        notes={supremeCourt.source.notes}
      />
    </div>
  );
}

function CoverageGapNotice() {
  return (
    <div className="mt-8 rounded-lg border border-dashed border-rule-strong bg-paper p-6">
      <div className="flex items-start gap-4">
        <StatusBadge tone="missing">Not in coverage</StatusBadge>
        <p className="text-sm leading-relaxed text-muted">
          This institution's current roster is not yet part of the collected
          record. Names will appear only when an official, dated source meets
          the standard applied across this site. Follow progress on the{" "}
          <Link href="/coverage" className="text-link">coverage report</Link>.
        </p>
      </div>
    </div>
  );
}

export default async function InstitutionPage(props: PageProps<"/institutions/[slug]">) {
  const { slug } = await props.params;
  const def = DEFINITIONS[slug];
  if (!def) notFound();

  const crumbLabel =
    slug === "state-executive-and-legislatures" ? "States" : def.title;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/institutions", label: "Institutions" },
          { href: `/institutions/${slug}`, label: crumbLabel },
        ]}
      />
      <PageHeader
        eyebrow={def.eyebrow}
        title={def.title}
        lede={def.lede}
        meta={
          <>
            <StatusBadge tone={def.status.tone}>{def.status.label}</StatusBadge>
            <span className="font-mono text-xs text-faint">{def.basis}</span>
          </>
        }
      />

      <section className="mt-10 grid gap-8 sm:grid-cols-2">
        {def.sections.map((s) => (
          <div key={s.heading}>
            <h2 className="font-display text-xl text-ink">{s.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </div>
        ))}
      </section>

      <hr className="my-12 border-rule" />

      {slug === "president" && <OfficeholderCard id="president-of-india" />}
      {slug === "vice-president" && <OfficeholderCard id="vice-president-of-india" />}
      {slug === "prime-minister" && (
        <>
          <OfficeholderCard id="prime-minister-of-india" />
          <p className="mt-6 text-sm text-muted">
            Portfolio detail for the Prime Minister and all other ministers:{" "}
            <Link href="/institutions/union-council-of-ministers" className="text-link">
              Union Council of Ministers
            </Link>
            .
          </p>
        </>
      )}
      {slug === "union-council-of-ministers" && <CouncilOfMinistersBlock />}
      {slug === "supreme-court" && <SupremeCourtBlock />}
      {(slug === "election-commission" ||
        slug === "comptroller-and-auditor-general" ||
        slug === "union-public-service-commission") && <CoverageGapNotice />}
      {slug === "state-executive-and-legislatures" && (
        <CoverageGapNotice />
      )}

      {slug !== "supreme-court" && slug !== "union-council-of-ministers" && (
        <p className="mt-12 font-mono text-xs leading-relaxed text-faint">
          Every fact on this page carries its official source in the citation
          blocks above · see the{" "}
          <Link href="/sources" className="text-link !text-faint hover:!text-indelible">
            source registry
          </Link>{" "}
          for retrieval metadata.
        </p>
      )}
    </div>
  );
}
