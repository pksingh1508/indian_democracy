import type { Metadata } from "next";
import Link from "next/link";
import {
  AnimatedHemicycle,
  CtaLink,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/src/components/motion-primitives";
import { PartyTag } from "@/src/components/party-tag";
import {
  lokSabha,
  lokSabhaPartyCounts,
  rajyaSabha,
  rajyaSabhaPartyCounts,
} from "@/src/lib/data/parliament";
import { buildChamberBlocks, generateSeats } from "@/src/lib/chamber";
import { buildParliamentFloor } from "@/src/lib/parliament-floor";
import type { LegendEntry } from "@/src/components/landingPage";
import { LandingPage } from "@/src/components/landingPage";
import { partyColor } from "@/src/lib/parties";
import { councilOfMinisters, getConstitutionalOfficeholder } from "@/src/lib/data/executive";
import { states } from "@/src/lib/data/geography";
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
  const floor = buildParliamentFloor();
  const legend: LegendEntry[] = [
    ...lokSabhaPartyCounts
      .filter((p) => p.key !== "DMK")
      .sort((a, b) => b.seats - a.seats)
      .slice(0, 9)
      .map((p) => ({
        label: p.abbreviation ?? p.name,
        color: partyColor(p.key),
        count: p.seats,
      })),
    ...(lokSabhaPartyCounts.find((p) => p.key === "DMK")
      ? [
          {
            label: "DMK",
            color: partyColor("DMK"),
            count: lokSabhaPartyCounts.find((p) => p.key === "DMK")!.seats,
          },
        ]
      : []),
  ];
  const lsBlocks = buildChamberBlocks(lokSabhaPartyCounts, lokSabha.counts.officialVacancies);
  const rsBlocks = buildChamberBlocks(rajyaSabhaPartyCounts, rajyaSabha.counts.officialVacancies);
  const lsView = generateSeats(lsBlocks);
  const rsView = generateSeats(rsBlocks);

  return (
    <>
      {/* Hero — interactive Lok Sabha chamber */}
      <LandingPage floor={floor} legend={legend} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Union executive */}
        <section className="mt-14">
          <Reveal>
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6">
              <h2 className="font-display text-2xl text-ink">Union executive</h2>
              <p className="font-mono text-[0.7rem] uppercase tracking-wide text-faint">
                Record · verified against secretariat pages
              </p>
            </div>
          </Reveal>
          <Stagger as="ul" stagger={0.09} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXECUTIVE_CARDS.map((card) => {
              const o = getConstitutionalOfficeholder(card.holderId);
              if (!o) return null;
              return (
                <StaggerItem key={card.href} as="li">
                  <Link href={card.href} className="record-card block h-full p-5 no-underline transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-rule-strong">
                    <p className="eyebrow mb-2">{card.office}</p>
                    <p className="font-display text-xl leading-snug text-indelible">{o.name}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{card.note}</p>
                    {"termStart" in o && o.termStart ? (
                      <p className="mt-2 font-mono text-xs text-faint">
                        since {formatIsoDate(o.termStart)}
                      </p>
                    ) : null}
                  </Link>
                </StaggerItem>
              );
            })}
            <StaggerItem as="li">
              <Link href="/institutions/union-council-of-ministers" className="record-card block h-full p-5 no-underline transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-rule-strong">
                <p className="eyebrow mb-2">Council of Ministers</p>
                <p className="font-display text-xl leading-snug text-indelible">
                  {councilOfMinisters.ministers.length} ministers
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  Cabinet, MoS (Independent Charge) and MoS, with portfolios as on{" "}
                  25 July 2026
                </p>
              </Link>
            </StaggerItem>
          </Stagger>
        </section>

        {/* Chambers */}
        <section className="mt-16">
          <Reveal>
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6">
              <h2 className="font-display text-2xl text-ink">The two Houses</h2>
              <Link href="/parliament" className="text-link text-sm">How they differ →</Link>
            </div>
          </Reveal>
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
                delay: 0,
              },
              {
                href: "/parliament/rajya-sabha",
                name: "Rajya Sabha",
                tagline: "Council of States · permanent house",
                view: rsView,
                blocks: rsBlocks.slice(0, 3),
                counts: rajyaSabha.counts,
                sanctioned: rajyaSabha.house.sanctionedSeats,
                delay: 0.12,
              },
            ].map((ch) => (
              <Reveal key={ch.href} delay={ch.delay}>
                <Link href={ch.href} className="record-card group block h-full p-6 no-underline transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-rule-strong">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl text-ink transition-colors duration-200 group-hover:text-indelible">{ch.name}</h3>
                    <span className="font-mono text-xs text-faint tabular-nums">
                      {ch.sanctioned} seats
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">{ch.tagline}</p>
                  <AnimatedHemicycle
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
              </Reveal>
            ))}
          </div>
        </section>

        {/* States & UTs */}
        <section className="mt-16">
          <Reveal>
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6">
              <h2 className="font-display text-2xl text-ink">States &amp; UTs</h2>
              <Link href="/states" className="text-link text-sm">Full table →</Link>
            </div>
          </Reveal>
          <Stagger as="ul" stagger={0.02} className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {states.map((s) => (
              <StaggerItem key={s.stateCode} as="li" y={10}>
                <Link
                  href={`/states/${slugify(s.stateName)}`}
                  className="block rounded-md border border-rule bg-surface px-3 py-2 text-[0.82rem] leading-snug text-muted no-underline transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-indelible hover:text-indelible"
                >
                  {titleCase(s.stateName)}
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Trust strip */}
        <Reveal className="my-16">
          <section className="rounded-lg border border-rule bg-surface p-8 transition-shadow duration-300 hover:shadow-md">
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
                <CtaLink href="/methodology">Methodology</CtaLink>
                <CtaLink href="/sources" secondary>Source registry</CtaLink>
                <CtaLink href="/corrections" secondary>Report an error</CtaLink>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
