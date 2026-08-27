import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { PageHeader } from "@/src/components/ui";
import { StatusBadge } from "@/src/components/badges";
import { PartyTag } from "@/src/components/party-tag";
import { SourceNote } from "@/src/components/source-note";
import {
  getLokSabhaMember,
  getRajyaSabhaMember,
  lokSabha,
  lokSabhaMembers,
  rajyaSabha,
  rajyaSabhaMembers,
} from "@/src/lib/data/parliament";
import {
  councilOfMinisters,
  getConstitutionalOfficeholder,
  getUnionMinister,
} from "@/src/lib/data/executive";
import {
  getSupremeCourtJudge,
  supremeCourt,
  supremeCourtJudges,
} from "@/src/lib/data/judiciary";
import {
  formatDdMmYyyy,
  formatIsoDate,
  formatTermOfOffice,
  reorderSabhaName,
  slugify,
  stripHonorific,
} from "@/src/lib/format";
import { OmBirlaProfile } from "@/src/om-birla";

const CONSTITUTIONAL_IDS = [
  "president-of-india",
  "vice-president-of-india",
  "prime-minister-of-india",
];

const CONSTITUTIONAL_TITLES: Record<string, string> = {
  "president-of-india": "President of India",
  "vice-president-of-india": "Vice-President of India",
  "prime-minister-of-india": "Prime Minister of India",
};

type PersonKind = "lok-sabha" | "rajya-sabha" | "minister" | "judge" | "constitutional";

function resolveKind(id: string): PersonKind | null {
  if (getLokSabhaMember(id)) return "lok-sabha";
  if (getRajyaSabhaMember(id)) return "rajya-sabha";
  if (getUnionMinister(id)) return "minister";
  if (getSupremeCourtJudge(id)) return "judge";
  if (CONSTITUTIONAL_IDS.includes(id)) return "constitutional";
  return null;
}

export function generateStaticParams() {
  const ids: string[] = [
    ...lokSabhaMembers.map((m) => m.id),
    ...rajyaSabhaMembers.map((m) => m.id),
    ...councilOfMinisters.ministers.map((m) => m.id),
    ...supremeCourtJudges.map((j) => j.id),
    ...CONSTITUTIONAL_IDS,
  ];
  return ids.map((id) => ({ id }));
}

export async function generateMetadata(
  props: PageProps<"/people/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  switch (resolveKind(id)) {
    case "lok-sabha": {
      const m = getLokSabhaMember(id)!;
      return {
        title: stripHonorific(m.name),
        description: `${stripHonorific(m.name)}, ${m.partyAbbreviation ?? m.party} member of the Lok Sabha representing ${m.constituency}, ${m.stateOrUnionTerritory}.`,
      };
    }
    case "rajya-sabha": {
      const m = getRajyaSabhaMember(id)!;
      const display = reorderSabhaName(m.name).display;
      return {
        title: display,
        description: `${display}, ${m.partyAbbreviation ?? m.party} member of the Rajya Sabha${m.nominated ? " (nominated)" : ` from ${m.stateOrUnionTerritory}`}, term ${m.term}.`,
      };
    }
    case "minister": {
      const m = getUnionMinister(id)!;
      return {
        title: m.nameWithoutHonorific,
        description: `${m.nameWithoutHonorific} — ${m.category === "Prime Minister" ? "Prime Minister of India" : m.category.replace(/s$/, "")} in the Union Council of Ministers.`,
      };
    }
    case "judge": {
      const j = getSupremeCourtJudge(id)!;
      return {
        title: j.title,
        description: `${j.title}${j.chiefJustice ? ", Chief Justice of India" : ", Judge, Supreme Court of India"}${j.termOfOffice ? `; term ${j.termOfOffice}.` : "."}`,
      };
    }
    case "constitutional":
      return { title: CONSTITUTIONAL_TITLES[id] };
    default:
      return {};
  }
}

function FactRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-sm text-muted">{term}</dt>
      <dd className="text-sm">{children}</dd>
    </>
  );
}

/** Map roster state names to this site's state-page slugs. */
const STATE_PAGE_ALIASES: Record<string, string> = {
  "NCT of Delhi": "Delhi",
};

export default async function PersonPage(props: PageProps<"/people/[id]">) {
  const { id } = await props.params;
  const kind = resolveKind(id);
  if (!kind) notFound();

  let eyebrow = "";
  let displayTitle: string;
  let asPublished: string | null = null;
  let facts: React.ReactNode = null;
  let extra: React.ReactNode = null;
  let citation: React.ReactNode = null;
  let jobTitle = "";
  let backLink: { href: string; label: string } | null = null;

  if (kind === "lok-sabha") {
    const m = getLokSabhaMember(id)!;
    displayTitle = stripHonorific(m.name);
    eyebrow = `Lok Sabha member · House term ${m.lokSabhaTerms.split(",").pop()?.trim()}`;
    asPublished = m.nameAsPublished;
    jobTitle = `Member of Parliament, Lok Sabha (${m.partyAbbreviation ?? m.party})`;
    backLink = { href: "/parliament/lok-sabha#members", label: "Lok Sabha roster" };
    facts = (
      <>
        <FactRow term="House">
          Lok Sabha — {lokSabha.house.sanctionedSeats}-seat house, term {lokSabha.house.term}
        </FactRow>
        <FactRow term="Party">
          <PartyTag name={m.party} abbreviation={m.partyAbbreviation} />
          <span className="block pt-0.5 text-xs text-faint">{m.party}</span>
        </FactRow>
        <FactRow term="State / UT">
          <Link
            href={`/states/${slugify(STATE_PAGE_ALIASES[m.stateOrUnionTerritory] ?? m.stateOrUnionTerritory)}`}
            className="text-link"
          >
            {m.stateOrUnionTerritory}
          </Link>
        </FactRow>
        <FactRow term="Constituency">
          {m.constituency}
          {m.constituencyCategory ? (
            <span className="ml-2 rounded border border-rule px-1.5 py-0.5 font-mono text-[0.65rem] text-faint">
              reserved {m.constituencyCategory.replace(/[()]/g, "")}
            </span>
          ) : null}
        </FactRow>
        <FactRow term="Entry method">
          Direct election (first past the post)
        </FactRow>
        <FactRow term="Membership status">{m.membershipStatus}</FactRow>
        <FactRow term="Lok Sabha terms served">
          <span className="font-mono text-xs tabular-nums">
            {m.lokSabhaTerms.split(",").map((t) => t.trim()).join(" · ")}
          </span>
        </FactRow>
      </>
    );
    citation = (
      <SourceNote
        publisher={lokSabha.source.publisher}
        title={lokSabha.source.title}
        url={lokSabha.source.url}
        retrievedAt={lokSabha.retrievedAt}
        authorityTier={lokSabha.source.authorityTier}
        notes={`Source record last updated ${m.sourceRecordUpdatedAt.split(" ")[0]}.`}
      />
    );
  } else if (kind === "rajya-sabha") {
    const m = getRajyaSabhaMember(id)!;
    const { display, asPublished: pub } = reorderSabhaName(m.name);
    displayTitle = display;
    asPublished = pub;
    eyebrow = m.nominated
      ? "Rajya Sabha member · nominated"
      : `Rajya Sabha member · ${m.stateOrUnionTerritory}`;
    jobTitle = `Member of Parliament, Rajya Sabha (${m.partyAbbreviation ?? m.party})`;
    backLink = { href: "/parliament/rajya-sabha#members", label: "Rajya Sabha roster" };
    facts = (
      <>
        <FactRow term="House">
          Rajya Sabha — {rajyaSabha.house.sanctionedSeats}-seat house
        </FactRow>
        <FactRow term="Party">
          <PartyTag name={m.party} abbreviation={m.partyAbbreviation} />
          <span className="block pt-0.5 text-xs text-faint">{m.party}</span>
        </FactRow>
        <FactRow term="Representation">
          {m.nominated
            ? "Nominated by the President"
            : `Elected by the ${STATE_PAGE_ALIASES[m.stateOrUnionTerritory] ?? m.stateOrUnionTerritory} Legislative Assembly`}
        </FactRow>
        <FactRow term="Term window">
          <span className="font-mono text-xs tabular-nums">
            {m.term}
            {m.expirationDate ? ` · expires ${formatDdMmYyyy(m.expirationDate)}` : ""}
          </span>
        </FactRow>
        {m.notificationDate ? (
          <FactRow term="Notification date">
            {formatDdMmYyyy(m.notificationDate)}
          </FactRow>
        ) : null}
        <FactRow term="Rajya Sabha terms served">{m.termCount}</FactRow>
        <FactRow term="Membership status">{m.membershipStatus}</FactRow>
      </>
    );
    citation = (
      <SourceNote
        publisher={rajyaSabha.source.publisher}
        title={rajyaSabha.source.title}
        url={rajyaSabha.source.url}
        retrievedAt={rajyaSabha.retrievedAt}
        authorityTier={rajyaSabha.source.authorityTier}
      />
    );
  } else if (kind === "minister") {
    const m = getUnionMinister(id)!;
    const isPM = m.category === "Prime Minister";
    displayTitle = m.nameWithoutHonorific;
    asPublished = m.name;
    eyebrow = `Union executive · ${isPM ? "Prime Minister" : m.category}`;
    jobTitle = isPM ? "Prime Minister of India" : m.category.replace(/s$/, "");
    backLink = {
      href: "/institutions/union-council-of-ministers",
      label: "Council of Ministers",
    };
    facts = (
      <>
        <FactRow term="Role">{jobTitle}</FactRow>
        <FactRow term="Entry method">
          Appointed by the President on the advice of the Prime Minister; the
          Council is collectively responsible to the Lok Sabha (Article 75(3))
        </FactRow>
      </>
    );
    extra = (
      <div className="mt-6">
        <p className="eyebrow mb-2">Portfolio allocation</p>
        <ul className="space-y-1.5 text-sm">
          {m.portfolios.map((p, i) => (
            <li key={`${m.id}-${i}`} className="border-b border-rule/70 pb-1.5">
              {p.replace(/;\s*$/, "").replace(/\s*and\s*$/i, "") || "—"}
            </li>
          ))}
        </ul>
        <p className="mt-2 font-mono text-xs text-faint">
          As allocated in the PMO portfolio notification.
        </p>
      </div>
    );
    citation = (
      <SourceNote
        publisher="Prime Minister's Office, Government of India"
        title="Portfolios of the Union Council of Ministers"
        url="https://www.pmindia.gov.in/en/news_updates/portfolios-of-the-union-council-of-ministers-2/"
        authorityTier="Tier 1"
      />
    );
  } else if (kind === "judge") {
    const j = getSupremeCourtJudge(id)!;
    const term = formatTermOfOffice(j.termOfOffice);
    displayTitle = j.title;
    eyebrow = j.chiefJustice
      ? "Judiciary · Chief Justice of India"
      : "Judiciary · Supreme Court judge";
    jobTitle = j.chiefJustice ? "Chief Justice of India" : "Judge, Supreme Court of India";
    facts = (
      <>
        <FactRow term="Court">Supreme Court of India</FactRow>
        <FactRow term="Term of office">
          {term ? `Judge since ${term.start} · projected end ${term.end}` : j.termOfOffice}
        </FactRow>
        <FactRow term="Tenure rule">
          Holds office until sixty-five years of age (Article 124(2)(b))
        </FactRow>
        <FactRow term="Status">
          {j.chiefJustice ? "Chief Justice of India" : "Sitting judge"}
        </FactRow>
      </>
    );
    citation = (
      <SourceNote
        publisher={supremeCourt.source.publisher}
        title={supremeCourt.source.title}
        url={supremeCourt.source.url}
        retrievedAt={supremeCourt.retrievedAt}
        authorityTier={supremeCourt.source.authorityTier}
        notes="End dates are projected until the term ends."
      />
    );
  } else {
    const o = getConstitutionalOfficeholder(id)!;
    displayTitle = o.name;
    eyebrow = "Union executive · constitutional officeholder";
    jobTitle = CONSTITUTIONAL_TITLES[id];
    facts = (
      <>
        <FactRow term="Office">{CONSTITUTIONAL_TITLES[id]}</FactRow>
        {o.ordinal ? <FactRow term="Ordinal">{o.ordinal}th holder of this office</FactRow> : null}
        {o.termStart ? (
          <FactRow term="Term began">{formatIsoDate(o.termStart)}</FactRow>
        ) : null}
        <FactRow term="Method of entry">
          {o.selectionMethod ?? "See institution explanation"}
        </FactRow>
      </>
    );
    citation = (
      <SourceNote
        publisher={o.source.publisher}
        url={o.source.url}
        authorityTier={o.source.authorityTier}
        notes={o.source.notes}
      />
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name:
      kind === "minister"
        ? getUnionMinister(id)!.nameWithoutHonorific
        : kind === "judge"
          ? getSupremeCourtJudge(id)!.name
          : displayTitle,
    jobTitle,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/people", label: "People" },
          { href: `/people/${id}`, label: displayTitle },
        ]}
      />
      <PageHeader
        eyebrow={eyebrow}
        title={displayTitle}
        meta={
          <>
            <StatusBadge tone="ok">Confirmed current</StatusBadge>
            {backLink && (
              <Link href={backLink.href} className="text-link text-sm">
                ← {backLink.label}
              </Link>
            )}
          </>
        }
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div>
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-[11rem_1fr]">{facts}</dl>
          {extra}
        </div>
        <div className="space-y-6">
          {citation}
          {asPublished && asPublished !== displayTitle ? (
            <p className="font-mono text-xs leading-relaxed text-faint">
              Name as published in the official roster: “{asPublished}”.
            </p>
          ) : null}
          {id === "ls-4716" ? (
            <p className="rounded-md border border-leaf/30 bg-leaf/[0.06] px-3 py-2 text-xs leading-relaxed text-leaf">
              Enriched dossier below — a sourced birth-to-present record maintained in{" "}
              <code className="rounded bg-white px-1 py-0.5 font-mono text-[0.7rem]">src/om-birla/</code>. All facts are citation-linked.
            </p>
          ) : null}
          <p className="text-xs leading-relaxed text-muted">
            This page records one public-office roster entry. {id === "ls-4716" ? "For this member an extended, sourced biography is provided below; still, the official roster remains the controlling source for current status." : "It does not claim to describe every office held by the same natural person — see the "}
            {id !== "ls-4716" ? (
              <Link href="/methodology" className="text-link !text-muted">
                identity policy
              </Link>
            ) : null}
            {id === "ls-4716" ? (
              <>
                {" "}
                See <Link href="/methodology" className="text-link !text-muted">methodology</Link>.
              </>
            ) : null}
            {id !== "ls-4716" ? ". Dates of birth are not displayed by design." : " Birth details below are public-record facts with citations."}
          </p>
        </div>
      </div>

      {id === "ls-4716" && kind === "lok-sabha" ? (
        <>
          <div className="my-12 h-px bg-gradient-to-r from-transparent via-rule-strong to-transparent" aria-hidden />
          <OmBirlaProfile />
        </>
      ) : null}
    </div>
  );
}
