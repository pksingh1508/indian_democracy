import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import { PageHeader } from "@/src/components/ui";
import { StatusBadge } from "@/src/components/badges";
import { councilOfMinisters, getConstitutionalOfficeholder } from "@/src/lib/data/executive";
import { lokSabha, rajyaSabha } from "@/src/lib/data/parliament";
import { supremeCourt } from "@/src/lib/data/judiciary";
import { Reveal, Stagger, StaggerItem } from "@/src/components/motion-primitives";

export const metadata: Metadata = {
  title: "People",
  description:
    "Browse the public-office rosters: members of Parliament, Union ministers, and judges of the Supreme Court.",
};

const ROSTERS = [
  {
    href: "/parliament/lok-sabha#members",
    title: "Lok Sabha members",
    count: `${lokSabha.counts.sittingMembers.toLocaleString("en-IN")} sitting · ${lokSabha.counts.officialVacancies} vacancies`,
    detail: `Term ${lokSabha.house.term} of the House of the People, ${lokSabha.house.sanctionedSeats} sanctioned seats. Filterable by party, state, and constituency.`,
  },
  {
    href: "/parliament/rajya-sabha#members",
    title: "Rajya Sabha members",
    count: `${rajyaSabha.counts.sittingMembers} sitting · ${rajyaSabha.counts.officialVacancies} vacancy`,
    detail: "Council of States with 245 sanctioned seats, including nominated members. Sortable roster with term expiry windows.",
  },
  {
    href: "/institutions/union-council-of-ministers",
    title: "Union Council of Ministers",
    count: `${councilOfMinisters.ministers.length} ministers`,
    detail: "The Prime Minister, Cabinet Ministers, Ministers of State (Independent Charge), and Ministers of State with their dated portfolio allocation.",
  },
  {
    href: "/institutions/supreme-court",
    title: "Supreme Court judges",
    count: `${supremeCourt.judges.length} serving`,
    detail: "The Chief Justice of India and judges of the Supreme Court with terms as displayed by the Court.",
  },
];

export default function PeopleIndexPage() {
  const president = getConstitutionalOfficeholder("president-of-india");
  const vicePresident = getConstitutionalOfficeholder("vice-president-of-india");
  const primeMinister = getConstitutionalOfficeholder("prime-minister-of-india");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/people", label: "People" }]} />
      <PageHeader
        eyebrow="Public offices"
        title="People in this record"
        lede="Each person page is one official roster record — an office held, its jurisdiction, its dates, and its source. Records are never merged automatically across rosters by name similarity."
      />

      <Reveal className="mt-8" y={14}>
        <form action="/search" method="GET" className="flex max-w-xl gap-2">
          <label htmlFor="person-search" className="sr-only">
            Search people, offices, constituencies, parties
          </label>
          <input
            id="person-search"
            type="search"
            name="q"
            placeholder="Search a name, constituency, party…"
            className="input flex-1"
          />
          <button type="submit" className="button">Search</button>
        </form>
      </Reveal>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Constitutional officeholders</h2>
        <Stagger as="ul" className="mt-4 grid gap-4 sm:grid-cols-3" stagger={0.09}>
          {[president, vicePresident, primeMinister].map((o) =>
            o ? (
              <StaggerItem key={o.id} as="li" className="record-card p-5">
                <p className="eyebrow mb-1">{o.office.replace(" of India", "")}</p>
                <Link href={`/institutions/${o.id === "prime-minister-of-india" ? "prime-minister" : o.id.replace("-of-india", "")}`} className="font-display text-lg text-indelible no-underline">
                  {o.name}
                </Link>
                <p className="mt-1 text-sm text-muted">{o.selectionMethod}</p>
              </StaggerItem>
            ) : null,
          )}
        </Stagger>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Rosters</h2>
        <Stagger as="ul" className="mt-4 grid gap-4 sm:grid-cols-2" stagger={0.08}>
          {ROSTERS.map((r) => (
            <StaggerItem key={r.href} as="li" className="record-card p-5 transition-colors hover:border-rule-strong">
              <Link href={r.href} className="block no-underline">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg text-indelible">{r.title}</h3>
                  <span className="font-mono text-xs text-faint tabular-nums">{r.count}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.detail}</p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Reveal className="mt-10">
        <aside className="flex flex-wrap items-center gap-3 rounded-lg border border-rule bg-paper p-5 text-sm text-muted">
          <StatusBadge tone="neutral">Identity policy</StatusBadge>
          <span className="max-w-2xl leading-relaxed">
            Where one natural person appears in multiple official rosters, each
            record keeps its own page and citation. We do not merge identities by
            name matching — see{" "}
            <Link href="/methodology" className="text-link">methodology</Link>.
          </span>
        </aside>
      </Reveal>
    </div>
  );
}
