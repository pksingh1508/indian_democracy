import type { Metadata } from "next";
import Link from "next/link";
import { FreshnessBadge } from "@/src/components/badges";
import { Hemicycle2D } from "@/src/components/hemicycle";
import { PartyTag } from "@/src/components/party-tag";
import {
  lokSabha,
  lokSabhaPartyCounts,
  rajyaSabha,
  rajyaSabhaPartyCounts,
} from "@/src/lib/data/parliament";
import { buildChamberBlocks, generateSeats } from "@/src/lib/chamber";
import { councilOfMinisters, getConstitutionalOfficeholder } from "@/src/lib/data/executive";
import { supremeCourtJudges } from "@/src/lib/data/judiciary";
import { districtCount, states } from "@/src/lib/data/geography";
import { formatIsoDate, slugify, titleCase } from "@/src/lib/format";

export const metadata: Metadata = {
  title: null,
};

const EXECUTIVE_CARDS = [
  {
    href: "/institutions/president",
    office: "President",
    holderId: "president-of-india",
    note: "Head of State · Art. 52",
  },
  {
    href: "/institutions/vice-president",
    office: "Vice-President",
    holderId: "vice-president-of-india",
    note: "Chairs the Rajya Sabha · Art. 64",
  },
  {
    href: "/institutions/prime-minister",
    office: "Prime Minister",
    holderId: "prime-minister-of-india",
    note: "Head of government · Art. 74",
  },
] as const;

export default function HomePage() {
  const lsBlocks = buildChamberBlocks(lokSabhaPartyCounts, lokSabha.counts.officialVacancies);
  const rsBlocks = buildChamberBlocks(rajyaSabhaPartyCounts, rajyaSabha.counts.officialVacancies);
  const lsView = generateSeats(lsBlocks);
  const rsView = generateSeats(rsBlocks);

  return (
    <>
      {/* Hero — thesis + the signature composition arc */}
      <section className="border-b border-rule bg-surface">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[7fr_5fr] lg:py-20">
          <div>
            <p className="eyebrow mb-4">
              Independent · Non-partisan · Source-linked
            </p>
            <h1 className="font-display text-[2.6rem] leading-[1.08] text-ink sm:text-6xl">
              Who holds public office.
              <br />
              <span className="text-indelible">What the record says.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              A register of India&apos;s democratic institutions — the Union
              executive, both Houses of Parliament, the courts, and all{" "}
              {states.length} states and Union Territories. Every current-office
              fact carries its official source and the day it was checked.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/parliament" className="button">Explore Parliament</Link>
              <Link href="/states" className="button secondary">Find your state</Link>
              <FreshnessBadge snapshotDate={formatIsoDate(lokSabha.snapshotDate)} />
            </div>

            {/* Ledger stats */}
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-rule pt-6 sm:grid-cols-3">
              {[
                { n: lokSabha.house.sanctionedSeats.toLocaleString("en-IN"), label: "Lok Sabha seats" },
                { n: rajyaSabha.house.sanctionedSeats.toLocaleString("en-IN"), label: "Rajya Sabha seats" },
                { n: councilOfMinisters.ministers.length.toLocaleString("en-IN"), label: "Union ministers" },
                { n: supremeCourtJudges.length.toLocaleString("en-IN"), label: "Supreme Court judges" },
                { n: states.length.toString(), label: "States & UTs" },
                { n: districtCount.toLocaleString("en-IN"), label: "Districts mapped" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="order-2 mt-0.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-faint">
                    {s.label}
                  </dt>
                  <dd className="font-display text-2xl tabular-nums">{s.n}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure aria-hidden={false}>
            <Link href="/parliament/lok-sabha" className="block no-underline">
              <Hemicycle2D
                seats={lsView.seats}
                geometry={lsView.geometry}
                summaryLabel={`Lok Sabha chamber-style composition, ${lokSabha.counts.sittingMembers} members and ${lokSabha.counts.officialVacancies} vacancies`}
                className="w-full"
              />
              <figcaption className="mt-2 flex items-baseline justify-between font-mono text-xs text-faint">
                <span>18th Lok Sabha · computed from the official roster</span>
                <span className="text-indelible">Open →</span>
              </figcaption>
            </Link>
          </figure>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Union executive */}
        <section className="mt-14">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6">
            <h2 className="font-display text-2xl text-ink">Union executive</h2>
            <p className="font-mono text-[0.7rem] uppercase tracking-wide text-faint">
              Record · verified against secretariat pages
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXECUTIVE_CARDS.map((card) => {
              const o = getConstitutionalOfficeholder(card.holderId);
              if (!o) return null;
              return (
                <li key={card.href}>
                  <Link href={card.href} className="record-card block h-full p-5 no-underline transition-colors hover:border-rule-strong">
                    <p className="eyebrow mb-2">{card.office}</p>
                    <p className="font-display text-xl leading-snug text-indelible">{o.name}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{card.note}</p>
                    {"termStart" in o && o.termStart ? (
                      <p className="mt-2 font-mono text-xs text-faint">
                        since {formatIsoDate(o.termStart)}
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/institutions/union-council-of-ministers" className="record-card block h-full p-5 no-underline transition-colors hover:border-rule-strong">
                <p className="eyebrow mb-2">Council of Ministers</p>
                <p className="font-display text-xl leading-snug text-indelible">
                  {councilOfMinisters.ministers.length} ministers
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  Cabinet, MoS (Independent Charge) and MoS, with portfolios as on{" "}
                  25 July 2026
                </p>
              </Link>
            </li>
          </ul>
        </section>

        {/* Chambers */}
        <section className="mt-16">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6">
            <h2 className="font-display text-2xl text-ink">The two Houses</h2>
            <Link href="/parliament" className="text-link text-sm">How they differ →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                href: "/parliament/lok-sabha",
                name: "Lok Sabha",
                tagline: `House of the People · term ${lokSabha.house.term}`,
                view: lsView,
                blocks: lsBlocks.slice(0, 3),
                counts: lokSabha.counts,
                sanctioned: lokSabha.house.sanctionedSeats,
              },
              {
                href: "/parliament/rajya-sabha",
                name: "Rajya Sabha",
                tagline: "Council of States · permanent house",
                view: rsView,
                blocks: rsBlocks.slice(0, 3),
                counts: rajyaSabha.counts,
                sanctioned: rajyaSabha.house.sanctionedSeats,
              },
            ].map((ch) => (
              <Link key={ch.href} href={ch.href} className="record-card group p-6 no-underline transition-colors hover:border-rule-strong">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl text-ink group-hover:text-indelible">{ch.name}</h3>
                  <span className="font-mono text-xs text-faint tabular-nums">
                    {ch.sanctioned} seats
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted">{ch.tagline}</p>
                <Hemicycle2D
                  seats={ch.view.seats}
                  geometry={ch.view.geometry}
                  summaryLabel={`${ch.name} composition`}
                  className="mt-4 w-full"
                />
                <ul className="mt-3 space-y-1 text-sm">
                  {ch.blocks.map((b) => (
                    <li key={b.key} className="flex items-baseline justify-between gap-3">
                      <PartyTag name={b.label} abbreviation={b.shortLabel === b.label ? null : b.shortLabel} />
                      <span className="font-mono text-xs tabular-nums text-muted">{b.count}</span>
                    </li>
                  ))}
                  {ch.counts.officialVacancies > 0 && (
                    <li className="flex items-baseline justify-between gap-3">
                      <span className="text-sm italic text-faint">Vacant</span>
                      <span className="font-mono text-xs tabular-nums text-faint">
                        {ch.counts.officialVacancies}
                      </span>
                    </li>
                  )}
                </ul>
              </Link>
            ))}
          </div>
        </section>

        {/* States & UTs */}
        <section className="mt-16">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6">
            <h2 className="font-display text-2xl text-ink">States &amp; UTs</h2>
            <Link href="/states" className="text-link text-sm">Full table →</Link>
          </div>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {states.map((s) => (
              <li key={s.stateCode}>
                <Link
                  href={`/states/${slugify(s.stateName)}`}
                  className="block rounded-md border border-rule bg-surface px-3 py-2 text-[0.82rem] leading-snug text-muted no-underline transition-colors hover:border-indelible hover:text-indelible"
                >
                  {titleCase(s.stateName)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Trust strip */}
        <section className="my-16 rounded-lg border border-rule bg-surface p-8">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-2xl text-ink">How this data is verified</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                Datasets are collected from official public services — Digital
                Sansad, the secretariats, the Supreme Court, the Department of
                Justice, and the Local Government Directory — reviewed as a diff,
                then published with citations beside every fact. Gaps are labelled,
                never filled silently.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/methodology" className="button">Methodology</Link>
              <Link href="/sources" className="button secondary">Source registry</Link>
              <Link href="/corrections" className="button secondary">Report an error</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
