import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { PageHeader } from "@/src/components/ui";
import { StatusBadge } from "@/src/components/badges";
import {
  councilOfMinisters,
  getConstitutionalOfficeholder,
} from "@/src/lib/data/executive";
import {
  highCourtBaselineSummary,
  highCourtJurisdictions,
  supremeCourtJudges,
} from "@/src/lib/data/judiciary";
import { lokSabha, rajyaSabha } from "@/src/lib/data/parliament";
import { Reveal, Stagger, StaggerItem } from "@/src/components/motion-primitives";

export const metadata: Metadata = {
  title: "Institutions",
  description:
    "Union executive, Parliament, courts, and independent constitutional institutions — what each is, who serves in it, and the official source.",
};

type Tone = "ok" | "partial" | "missing";

interface InstitutionCard {
  href?: string;
  title: string;
  role: string;
  detail: string;
  status: { label: string; tone: Tone };
}

const GROUPS: { heading: string; note: string; items: InstitutionCard[] }[] = [
  {
    heading: "Union executive",
    note: "Articles 52–75 · President, Vice-President, Prime Minister and Council of Ministers",
    items: [
      {
        href: "/institutions/president",
        title: "President of India",
        role: "Head of State",
        detail: getConstitutionalOfficeholder("president-of-india")?.name ?? "",
        status: { label: "Complete", tone: "ok" },
      },
      {
        href: "/institutions/vice-president",
        title: "Vice-President of India",
        role: "Chairman, Rajya Sabha (ex officio)",
        detail: getConstitutionalOfficeholder("vice-president-of-india")?.name ?? "",
        status: { label: "Complete", tone: "ok" },
      },
      {
        href: "/institutions/prime-minister",
        title: "Prime Minister of India",
        role: "Head of government",
        detail: getConstitutionalOfficeholder("prime-minister-of-india")?.name ?? "",
        status: { label: "Complete", tone: "ok" },
      },
      {
        href: "/institutions/union-council-of-ministers",
        title: "Union Council of Ministers",
        role: `${councilOfMinisters.ministers.length} ministers with portfolios`,
        detail: "Cabinet, Ministers of State (Independent Charge) and Ministers of State",
        status: { label: "Complete", tone: "ok" },
      },
    ],
  },
  {
    heading: "Parliament",
    note: "Articles 79–122 · President, Lok Sabha and Rajya Sabha",
    items: [
      {
        href: "/parliament/lok-sabha",
        title: "Lok Sabha",
        role: `House of the People · term ${lokSabha.house.term}`,
        detail: `${lokSabha.counts.sittingMembers} sitting members · ${lokSabha.counts.officialVacancies} vacancies · ${lokSabha.house.sanctionedSeats} seats`,
        status: { label: "Complete snapshot", tone: "ok" },
      },
      {
        href: "/parliament/rajya-sabha",
        title: "Rajya Sabha",
        role: "Council of States · permanent house",
        detail: `${rajyaSabha.counts.sittingMembers} sitting members · ${rajyaSabha.counts.officialVacancies} vacancy · ${rajyaSabha.house.sanctionedSeats} seats`,
        status: { label: "Complete snapshot", tone: "ok" },
      },
    ],
  },
  {
    heading: "Judiciary",
    note: "Articles 124–147 and 214–232 · Supreme Court and High Courts",
    items: [
      {
        href: "/institutions/supreme-court",
        title: "Supreme Court of India",
        role: `${supremeCourtJudges.length} judges incl. the Chief Justice`,
        detail: "Current roster from sci.gov.in",
        status: { label: "Complete snapshot", tone: "ok" },
      },
      {
        href: "/high-courts",
        title: "High Courts",
        role: `${highCourtJurisdictions.length} courts · jurisdiction map`,
        detail: `${highCourtBaselineSummary.counts.judges} judge names in a dated ${highCourtBaselineSummary.counts.highCourtsCovered}-of-25 central baseline (1 April 2026)`,
        status: { label: "Jurisdiction complete · rosters dated", tone: "partial" },
      },
    ],
  },
  {
    heading: "Independent institutions",
    note: "Constitutional bodies whose current rosters are not yet in this record's coverage",
    items: [
      {
        href: "/institutions/election-commission",
        title: "Election Commission of India",
        role: "Articles 324–329 · superintendence of elections",
        detail: "Explainer available; commissioner roster not yet collected",
        status: { label: "Roster not yet collected", tone: "missing" },
      },
      {
        href: "/institutions/comptroller-and-auditor-general",
        title: "Comptroller and Auditor-General",
        role: "Articles 148–151 · audit of Union and states",
        detail: "Explainer available; incumbent roster not yet collected",
        status: { label: "Roster not yet collected", tone: "missing" },
      },
      {
        href: "/institutions/union-public-service-commission",
        title: "Union Public Service Commission",
        role: "Articles 315–323 · recruitment to Union services",
        detail: "Explainer available; member roster not yet collected",
        status: { label: "Roster not yet collected", tone: "missing" },
      },
      {
        href: "/institutions/state-executive-and-legislatures",
        title: "State executives & legislatures",
        role: "Governors, Chief Ministers, Assemblies and Councils",
        detail: "Requires state-by-state official source collection",
        status: { label: "Not yet collected", tone: "missing" },
      },
    ],
  },
];

export default function InstitutionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/institutions", label: "Institutions" }]} />
      <PageHeader
        eyebrow="Reference"
        title="Institutions"
        lede="What each institution is, how its members are chosen, who currently serves within this record's coverage boundary, and which official source says so."
      />

      <div className="mt-10 space-y-12">
        {GROUPS.map((group) => (
          <section key={group.heading}>
            <Reveal y={14}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-6">
                <h2 className="font-display text-2xl text-ink">{group.heading}</h2>
                <p className="font-mono text-[0.7rem] uppercase tracking-wide text-faint">
                  {group.note}
                </p>
              </div>
            </Reveal>
            <Stagger as="ul" className="mt-4 grid gap-4 sm:grid-cols-2" stagger={0.07}>
              {group.items.map((item) => {
                const inner = (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg leading-snug text-indelible">
                        {item.title}
                      </h3>
                      <StatusBadge tone={item.status.tone}>{item.status.label}</StatusBadge>
                    </div>
                    <p className="mt-1 text-sm font-medium text-muted">{item.role}</p>
                    <p className="mt-1 text-sm text-muted">{item.detail}</p>
                  </>
                );
                return (
                  <StaggerItem key={item.title} as="li" className="record-card p-5 transition-colors hover:border-rule-strong">
                    {item.href ? (
                      <Link href={item.href} className="block no-underline">
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                  </StaggerItem>
                );
              })}
            </Stagger>
          </section>
        ))}
      </div>
    </div>
  );
}
