"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal, Stagger, StaggerItem } from "@/src/components/motion-primitives";
import { StatusBadge } from "@/src/components/badges";
import { SourceNote } from "@/src/components/source-note";
import { AMIT_SHAH_PROFILE } from "./profile";

const profile = AMIT_SHAH_PROFILE;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow mb-2">{children}</p>;
}

function Section({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24">
      <Reveal>
        <div className="mb-6">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h2 className="font-display text-2xl leading-tight text-ink sm:text-3xl">{title}</h2>
          {intro ? <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{intro}</p> : null}
        </div>
      </Reveal>
      {children}
    </section>
  );
}

const CATEGORY_STYLE: Record<string, { dot: string; label: string }> = {
  birth: { dot: "bg-indelible", label: "Birth" },
  education: { dot: "bg-leaf", label: "Education" },
  youth: { dot: "bg-saffron", label: "Youth" },
  cooperative: { dot: "bg-saffron", label: "Cooperative" },
  assembly: { dot: "bg-indelible", label: "Assembly" },
  parliament: { dot: "bg-indelible-strong", label: "Parliament" },
  party: { dot: "bg-saffron", label: "Party" },
  minister: { dot: "bg-indelible", label: "Minister" },
  social: { dot: "bg-leaf", label: "Social" },
};

function Modal({
  open,
  onClose,
  eyebrow,
  title,
  intro,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6" aria-modal="true" role="dialog">
      <button aria-label="Close modal" onClick={onClose} className="fixed inset-0 bg-ink/60 backdrop-blur-[2px]" />
      <div className="relative z-10 my-6 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-rule bg-surface shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-rule bg-surface px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
              <h3 className="font-display text-xl leading-tight text-ink sm:text-2xl">{title}</h3>
              {intro ? <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{intro}</p> : null}
            </div>
            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-rule bg-paper text-muted hover:border-indelible hover:text-indelible"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="overflow-y-auto px-6 py-6 sm:px-8">{children}</div>
        <div className="border-t border-rule bg-paper px-6 py-3 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xs text-faint">Press Esc or click outside to close · All facts are citation-linked.</p>
            <button onClick={onClose} className="button secondary text-xs">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalTrigger({
  eyebrow,
  title,
  description,
  meta,
  accent = "indelible",
  onClick,
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  accent?: "indelible" | "leaf" | "saffron";
  onClick: () => void;
}) {
  const accentMap = {
    indelible: "from-indelible/90 to-indelible-strong",
    leaf: "from-leaf to-indelible",
    saffron: "from-saffron to-indelible",
  } as const;
  return (
    <button
      onClick={onClick}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-rule bg-surface p-6 text-left transition-all hover:-translate-y-1 hover:border-indelible/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indelible"
    >
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentMap[accent]}`} aria-hidden />
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="mt-1 font-display text-lg leading-snug text-ink group-hover:text-indelible">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{description}</p>
      {meta ? <p className="mt-3 font-mono text-xs text-faint">{meta}</p> : null}
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indelible">
        Open details <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </button>
  );
}

export function AmitShahProfile() {
  const [open, setOpen] = useState<null | string>(null);

  return (
    <div className="mt-14 space-y-16">
      {/* At a glance */}
      <Section
        eyebrow="From birth to Home Ministry · a sourced record"
        title="At a glance"
        intro="A concise dossier drawn only from official rosters (Lok Sabha, MHA, ECI affidavits) and attributed reporting. Tap any card below to open its full, citation-linked detail — the page stays scannable."
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="record-card overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-indelible via-indelible-strong to-leaf" aria-hidden />
              <div className="p-6 sm:p-7">
                <div className="flex gap-5">
                  <div className="hidden h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border border-rule bg-paper text-xl font-display text-indelible shadow-sm sm:flex" aria-hidden>
                    AS
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl text-ink">Amit Shah</h3>
                    <p className="mt-1 text-sm text-muted">
                      Union Home Minister + Minister of Cooperation (since 2019/2021) · MP, Gandhinagar (17th, 18th Lok Sabha) · Ex-BJP President (2014–2020) · 5-term Gujarat MLA (1997–2017) · Architect of 2014 & 2019 mandates
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusBadge tone="ok">Confirmed current — Cabinet Minister</StatusBadge>
                      <span className="inline-flex items-center rounded-full border border-indelible/30 bg-indelible-tint px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-indelible">
                        BJP · Gandhinagar
                      </span>
                      <span className="inline-flex items-center rounded-full border border-rule px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-faint">
                        ID ls-5021 · union-minister-3
                      </span>
                    </div>
                  </div>
                </div>

                <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <div className="border-t border-rule pt-3">
                    <dt className="eyebrow !mb-1 !text-[0.64rem]">Born</dt>
                    <dd className="text-ink">{profile.birth.displayDate} · {profile.birth.place}</dd>
                    <dd className="mt-1 text-xs leading-relaxed text-muted">
                      Son of {profile.birth.parents.father} and {profile.birth.parents.mother}. {profile.birth.familyBackground}
                    </dd>
                  </div>
                  <div className="border-t border-rule pt-3">
                    <dt className="eyebrow !mb-1 !text-[0.64rem]">Family</dt>
                    <dd className="text-ink">{profile.personal.spouse} · {profile.personal.children}</dd>
                    <dd className="mt-1 text-xs leading-relaxed text-muted">{profile.personal.childrenNote}</dd>
                  </div>
                  <div className="border-t border-rule pt-3">
                    <dt className="eyebrow !mb-1 !text-[0.64rem]">Education</dt>
                    <dd className="text-ink">B.Sc. Biochemistry — SY B.Sc. (affidavit says “12th Pass”)</dd>
                    <dd className="mt-1 text-xs leading-relaxed text-muted">
                      C. U. Shah Science College, Ahmedabad · Gujarat University
                      <br />
                      <span className="font-mono text-[0.7rem] text-faint">Affidavit header: “12th Pass” (ECI) vs biography: “B.Sc. Biochemistry” — variation noted.</span>
                    </dd>
                  </div>
                  <div className="border-t border-rule pt-3">
                    <dt className="eyebrow !mb-1 !text-[0.64rem]">Profession & party</dt>
                    <dd className="text-ink">{profile.personal.profession.join(" · ")}</dd>
                    <dd className="mt-1 text-xs leading-relaxed text-muted">
                      {profile.personal.party} ({profile.personal.partyAbbreviation}) ·{" "}
                      <a href={profile.personal.website} target="_blank" rel="noreferrer" className="text-link">
                        amitshah.co.in
                      </a>
                    </dd>
                  </div>
                </dl>

                <p className="mt-5 rounded-md bg-paper px-3 py-2 font-mono text-xs leading-relaxed text-faint">
                  Roster: Gandhinagar, Gujarat · Lok Sabha terms 17, 18 · Sitting. Portfolios: Home Affairs + Cooperation (Cabinet Committee on Security).
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="record-card p-6">
              <Eyebrow>Ledger — key dates</Eyebrow>
              <ul className="space-y-3 text-sm">
                {[
                  { k: "RSS → ABVP → BJP", v: "1980 → 1982–83 → 1987" },
                  { k: "MLA Sarkhej → Naranpura", v: "Feb 1997–2012 → 2012–2017 (5 terms)" },
                  { k: "Gujarat MoS Home + 11 portfolios", v: "2002–2010 (youngest minister)" },
                  { k: "National GS + UP in-charge", v: "2013 → NDA 73/80 in 2014" },
                  { k: "BJP President (youngest at 49)", v: "Jul 2014–Jan 2020 (10 crore members)" },
                  { k: "Rajya Sabha → Lok Sabha Gandhinagar", v: "19 Aug 2017–2019 → 2019–present (8.88L, 10.10L votes)" },
                  { k: "Home Minister + Cooperation", v: "1 Jun 2019–present (re-sworn 9 Jun 2024)" },
                  { k: "Last verified", v: profile.lastVerified },
                ].map((r) => (
                  <li key={r.k} className="flex gap-3 border-b border-rule/60 pb-3 last:border-0 last:pb-0">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indelible" aria-hidden />
                    <span className="min-w-0">
                      <span className="block font-medium text-ink">{r.k}</span>
                      <span className="block font-mono text-xs text-muted">{r.v}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-md bg-indelible-tint px-3 py-2.5 text-xs leading-relaxed text-indelible">
                <strong className="font-semibold">How to browse:</strong> Tap any card below for full tables. For current status,{" "}
                <a href="https://sansad.in/ls/members" target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  sansad.in/ls/members
                </a>{" "}
                +{" "}
                <a href="https://www.mha.gov.in/en/about-us/meet-the-minister/union-home-minister" target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  mha.gov.in
                </a>{" "}
                govern.
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Modal triggers grid */}
      <Section
        eyebrow="Deep dives — tap to open"
        title="Everything about the office-holder, by theme"
        intro="The page stays compact. Each heading opens a modal with tables, timelines and citations — including salaries per post, affidavit net-worth, news-making work (praised and criticised), and every allegation with its judicial outcome."
      >
        <Stagger as="div" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          <StaggerItem>
            <ModalTrigger
              eyebrow="Posts, tenures & pay"
              title="His All Post Details"
              description="Every office — Sarkhej/Naranpura, MoS Home (12 portfolios), BJP President, Rajya Sabha, Gandhinagar, Home + Cooperation — with jurisdiction, term, entry method, predecessor/successor, and the exact salary & allowances for that post."
              meta="12 posts · salary law for each · honorary to Cabinet scale"
              accent="indelible"
              onClick={() => setOpen("posts")}
            />
          </StaggerItem>
          <StaggerItem>
            <ModalTrigger
              eyebrow="Money & declarations"
              title="Net Worth & Assets"
              description="Affidavit timeline 2007 → 2024: total assets, movable/immovable split, liabilities, incomes, bank FDs, shares (Bharti Airtel etc.), jewellery, land — with valuation notes."
              meta="₹5.57 Cr (2007) → ₹65.67 Cr (2024) · 3 cases in 2024"
              accent="leaf"
              onClick={() => setOpen("networth")}
            />
          </StaggerItem>
          <StaggerItem>
            <ModalTrigger
              eyebrow="In the news"
              title="Work That Made News"
              description="Article 370 abrogation, new criminal codes, CAA, BJP expansion — and the CAA-NRC chronology, Assam NRC, Valley lockdown critiques — labelled good / mixed / critical."
              meta="8 items · positive, mixed & critical · with source"
              accent="saffron"
              onClick={() => setOpen("work")}
            />
          </StaggerItem>
          <StaggerItem>
            <ModalTrigger
              eyebrow="Scrutiny"
              title="Allegations & Controversies"
              description="Every allegation on record — Sohrabuddin/Ishrat encounter cases (arrest → discharge/clean chit → acquittal upheld), Snoop-gate, asset scrutiny — with context and outcome."
              meta="5 records · allegation → context → response → outcome"
              accent="saffron"
              onClick={() => setOpen("allegations")}
            />
          </StaggerItem>
          <StaggerItem>
            <ModalTrigger
              eyebrow="Chronology"
              title="Complete Timeline"
              description="Birth to longest-serving Home Minister — 22+ dated events from 1964, 1980 RSS to 2025-26 longest tenure — with per-event citations."
              meta="1964 → 2025 · birth, youth, assembly, party, minister"
              accent="indelible"
              onClick={() => setOpen("timeline")}
            />
          </StaggerItem>
          <StaggerItem>
            <ModalTrigger
              eyebrow="Gandhinagar & beyond"
              title="Social Work & Constituency"
              description="AUDA-funded Sarkhej development, cooperative-bank revival, Public Undertakings Committee, Somnath trusteeship, Gujarat Cricket Association."
              meta="5 initiatives · with start year & sources"
              accent="leaf"
              onClick={() => setOpen("social")}
            />
          </StaggerItem>
        </Stagger>
      </Section>

      {/* Quick inline teasers */}
      <Section eyebrow="Quick look" title="At a glance — inside the modals">
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="record-card p-6">
              <h3 className="font-display text-base text-ink">Salary snapshot (current law)</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indelible" aria-hidden /><span><strong className="text-ink">MP (Gandhinagar):</strong> ₹1,24,000 pm salary (1 Apr 2023) + ₹87k constituency + ₹70k office + ₹2,500 daily → ~₹2.81L pm.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indelible" aria-hidden /><span><strong className="text-ink">Cabinet (Home + Cooperation):</strong> Same MP salary + sumptuary ₹3,000 + furnished residence (Art.97 + Ministers Act).</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indelible" aria-hidden /><span><strong className="text-ink">Gujarat MLA (historic):</strong> Illustrative ~₹1.47L pm total (basic ₹40k from 2019; earlier basic lower).</span></li>
              </ul>
              <button onClick={() => setOpen("posts")} className="text-link mt-3 text-sm">See all 12 posts with tenure & pay →</button>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="record-card p-6">
              <h3 className="font-display text-base text-ink">Net-worth snapshot</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Self-declared: <strong className="text-ink">₹5.57 Cr (2007)</strong> → <strong className="text-ink">₹65.67 Cr (2024)</strong> (+63% vs 2019). Movable ₹42.80 Cr (shares ~₹17.46 Cr, bank ~₹3 Cr), immovable ₹22.86 Cr (inherited Shilaj ₹6 Cr), liabilities <strong className="text-muted">₹42L</strong>, cases <strong className="text-saffron">3 in 2024</strong> (down from 4).
              </p>
              <button onClick={() => setOpen("networth")} className="text-link mt-3 text-sm">Open affidavit timeline →</button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ============ MODALS ============ */}

      <Modal open={open === "posts"} onClose={() => setOpen(null)} eyebrow="Posts, tenures & pay — 1980 → present" title="His All Post Details" intro="Every post with when he served, how he entered it, and what that office pays — with the law that sets the pay.">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-rule">
            <div className="overflow-x-auto">
              <table className="data-table min-w-[820px]">
                <thead><tr><th>Office</th><th>Period</th><th>Salary</th><th>Allowances</th><th>Total approx.</th></tr></thead>
                <tbody>
                  {profile.salaries.map((s, i) => (
                    <tr key={i}>
                      <td className="max-w-[20rem]">
                        <span className="font-medium text-ink">{s.office}</span>
                        <span className="mt-1 block font-mono text-xs text-faint">{s.legalBasis}</span>
                        {s.notes ? <span className="mt-1 block text-xs leading-relaxed text-muted">{s.notes}</span> : null}
                        <span className="mt-1 block font-mono text-xs text-faint">Sources: {s.citationIds.map((c, idx) => (<span key={c}>{idx ? ", " : ""}<a href={profile.citations[c]?.url} target="_blank" rel="noreferrer" className="underline">{profile.citations[c]?.label ?? c}</a></span>))}</span>
                      </td>
                      <td className="whitespace-nowrap font-mono text-xs text-muted">{s.period}</td>
                      <td className="max-w-[16rem] text-xs leading-relaxed text-muted">{s.salary}</td>
                      <td className="max-w-[16rem] text-xs leading-relaxed text-muted">{s.allowances}</td>
                      <td className="max-w-[14rem] text-xs leading-relaxed text-ink">{s.totalApprox}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-lg border border-indelible/20 bg-indelible-tint px-4 py-3">
            <p className="font-display text-sm text-indelible">How to read pay</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">RSS/ABVP/BJP-organiser posts were honorary party work — no exchequer salary. Gujarat MLA pay uses the Gujarat Act (pattern as Rajasthan Act 1956, basic ₹40k from 2019, ~₹1.47L total). MP pay is unified nationwide (G.S.R.188(E)). Home + Cooperation is a Cabinet portfolio — salary pegged to MP + sumptuary/residence under Art.97 + Officers/Ministers Acts.</p>
          </div>
          <div>
            <h4 className="eyebrow">Offices held — full list</h4>
            <div className="mt-3 overflow-hidden rounded-lg border border-rule">
              <table className="data-table min-w-[700px]">
                <thead><tr><th>Office</th><th>Jurisdiction</th><th>Term</th><th>Entry</th></tr></thead>
                <tbody>
                  {profile.officesHeld.map((o, i) => (
                    <tr key={i}>
                      <td className="max-w-[22rem]"><span className="font-medium text-ink">{o.office}</span>{o.predecessor || o.successor ? <span className="mt-1 block font-mono text-xs text-faint">{o.predecessor ? `Pre: ${o.predecessor}` : ""}{o.predecessor && o.successor ? " · " : ""}{o.successor ? `Succ: ${o.successor}` : ""}</span> : null}{o.notes ? <span className="mt-1 block text-xs text-muted">{o.notes}</span> : null}</td>
                      <td className="whitespace-nowrap text-muted">{o.jurisdiction}</td>
                      <td className="whitespace-nowrap font-mono text-xs text-muted">{o.term}</td>
                      <td className="max-w-[14rem] text-xs text-muted">{o.entryMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={open === "networth"} onClose={() => setOpen(null)} eyebrow="Money & declarations — ECI affidavits via ADR/Myneta" title="Net Worth & Assets" intro="Self-declared affidavits — the only comparable money record. Market-value rule for immovable (2019 filing) inflates the 2019→2024 jump.">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-rule">
            <div className="overflow-x-auto">
              <table className="data-table min-w-[900px]">
                <thead><tr><th>Election / Year</th><th>Total assets</th><th>Movable</th><th>Immovable</th><th>Liabilities / Cases</th><th>Income (self / spouse)</th></tr></thead>
                <tbody>
                  {profile.netWorthTimeline.map((n) => (
                    <tr key={n.election}>
                      <td><span className="font-medium text-ink">{n.election}</span><span className="block font-mono text-xs text-faint">{n.year}</span><span className="mt-1 block font-mono text-xs text-faint">{n.citationIds.map((c, idx) => (<span key={c}>{idx ? ", " : ""}<a href={profile.citations[c]?.url} target="_blank" rel="noreferrer" className="underline">{profile.citations[c]?.label ?? c}</a></span>))}</span></td>
                      <td className="font-mono text-xs font-medium text-ink">{n.totalAssets}</td>
                      <td className="max-w-[16rem] text-xs leading-relaxed text-muted">{n.movable}</td>
                      <td className="max-w-[16rem] text-xs leading-relaxed text-muted">{n.immovable}</td>
                      <td className="max-w-[14rem] text-xs leading-relaxed text-muted"><span className="block">{n.liabilities}</span><span className="block font-mono text-xs text-faint">{n.cases}</span></td>
                      <td className="font-mono text-xs text-muted">{n.incomeSelf ? <span className="block">Self: {n.incomeSelf}</span> : null}{n.incomeSpouse ? <span className="block">Spouse: {n.incomeSpouse}</span> : null}{!n.incomeSelf && !n.incomeSpouse ? <span className="text-faint">—</span> : null}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ul className="space-y-2">
            {profile.netWorthNotes.map((note) => (
              <li key={note} className="flex gap-2 text-sm leading-relaxed text-muted"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden /><span>{note}</span></li>
            ))}
          </ul>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-rule bg-paper p-4"><p className="font-mono text-xs uppercase tracking-wide text-faint">Movable jump</p><p className="mt-1 font-display text-lg text-ink">₹23.55 Cr → ₹42.80 Cr</p><p className="mt-1 text-xs text-muted">Listed shares (inherited) + bank FDs at ADC/Kotak/HDFC — annexure A2 Scribd PDF is the line-item source.</p></div>
            <div className="rounded-lg border border-rule bg-paper p-4"><p className="font-mono text-xs uppercase tracking-wide text-faint">Immovable</p><p className="mt-1 font-display text-lg text-ink">Shilaj 49,461 sq ft ₹6 Cr (inherited)</p><p className="mt-1 text-xs text-muted">Karbatiya 11.885 acres (40% joint), Mansa plots — market-value vs old purchase-value effect.</p></div>
            <div className="rounded-lg border border-rule bg-paper p-4"><p className="font-mono text-xs uppercase tracking-wide text-faint">Vehicle & liabilities</p><p className="mt-1 font-display text-lg text-ink">No vehicle disclosed</p><p className="mt-1 text-xs text-muted">2019 & 2024 both: “does not own any vehicle” (ToI); liabilities ₹47.69L → ₹42.09L.</p></div>
          </div>
        </div>
      </Modal>

      <Modal open={open === "work"} onClose={() => setOpen(null)} eyebrow="In the news — praised, contested and mixed" title="Work That Made News" intro="Every item is labelled positive / mixed / critical and source-tagged — not a score, but a balanced press record.">
        <div className="space-y-4">
          {profile.workHighlights.map((w) => (
            <div key={w.title} className="record-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="font-mono text-xs uppercase tracking-wide text-faint">{w.date} · {w.sourceLabel}</p><h4 className="mt-1 font-display text-base text-ink">{w.title}</h4></div>
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[0.64rem] uppercase tracking-wide ${w.kind === "positive" ? "border-leaf/40 text-leaf bg-leaf/[0.06]" : w.kind === "critical" ? "border-saffron/40 text-saffron bg-saffron/[0.06]" : "border-rule-strong text-muted bg-paper"}`}>{w.kind}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.summary}</p>
              <p className="mt-2 font-mono text-xs text-faint">Source: <a href={profile.citations[w.citationId]?.url} target="_blank" rel="noreferrer" className="underline">{profile.citations[w.citationId]?.label ?? w.citationId}</a></p>
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={open === "allegations"} onClose={() => setOpen(null)} eyebrow="Scrutiny — with context and outcome" title="Allegations & Controversies" intro="Each allegation is shown with its context, the response on record, and the outcome where a court has pronounced — neutral, citation-linked, and updateable.">
        <div className="space-y-5">
          {profile.allegations.map((a) => (
            <div key={a.title} className="record-card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-saffron/70 via-rule-strong to-indelible/30" aria-hidden />
              <div className="p-5">
                <p className="font-mono text-xs uppercase tracking-wide text-faint">{a.date}</p>
                <h4 className="mt-1 font-display text-base text-ink">{a.title}</h4>
                <div className="mt-4 grid gap-4 text-sm leading-relaxed">
                  <div><p className="eyebrow !mb-1 !text-[0.64rem]">Allegation</p><p className="text-muted">{a.allegation}</p></div>
                  <div><p className="eyebrow !mb-1 !text-[0.64rem]">Context</p><p className="text-muted">{a.context}</p></div>
                  <div><p className="eyebrow !mb-1 !text-[0.64rem]">Response / Status</p><p className="text-muted">{a.responseOrStatus}</p></div>
                  {a.outcome ? <div className="rounded-md bg-indelible-tint px-3 py-2"><p className="eyebrow !mb-1 !text-[0.64rem]">Outcome</p><p className="text-sm text-indelible">{a.outcome}</p></div> : null}
                </div>
                <p className="mt-3 font-mono text-xs text-faint">Sources: {a.citationIds.map((c, idx) => (<span key={c}>{idx ? ", " : ""}<a href={profile.citations[c]?.url} target="_blank" rel="noreferrer" className="underline">{profile.citations[c]?.label ?? c}</a></span>))}</p>
              </div>
            </div>
          ))}
          <p className="font-mono text-xs leading-relaxed text-faint">Affidavit cases are counted in the header, not convictions — “Cases where Convicted — No Cases” where clean. Court outcomes above are as pronounced; “alleged” reflects the pronounced stage.</p>
        </div>
      </Modal>

      <Modal open={open === "timeline"} onClose={() => setOpen(null)} eyebrow="1964 → present · birth to the Cabinet" title="Complete Timeline" intro="Where two reputable sources differ, the entry notes the alternative rather than choosing silently.">
        <div className="relative">
          <div className="pointer-events-none absolute bottom-0 left-[11px] top-2 hidden w-px bg-rule sm:block" aria-hidden />
          <ol className="space-y-6">
            {profile.timeline.map((ev) => {
              const cat = CATEGORY_STYLE[ev.category] ?? CATEGORY_STYLE.parliament;
              return (
                <li key={ev.date + ev.title} className="flex gap-4">
                  <span className={`mt-1 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white shadow-sm sm:flex ${cat.dot}`} aria-hidden><span className="h-2 w-2 rounded-full bg-white" /></span>
                  <div className="record-card flex-1 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs uppercase tracking-wide text-faint">{ev.dateLabel} · {cat.label}</p><h3 className="mt-1 font-display text-base leading-snug text-ink">{ev.title}</h3></div><span className="inline-flex rounded-full border border-rule bg-paper px-2 py-0.5 font-mono text-[0.64rem] uppercase tracking-wide text-faint">{ev.category}</span></div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{ev.description}</p>
                    <p className="mt-2 font-mono text-xs text-faint">Sources: {ev.citationIds.map((c, idx) => (<span key={c}>{idx ? ", " : ""}<a href={profile.citations[c]?.url} target="_blank" rel="noreferrer" className="underline decoration-rule underline-offset-2 hover:decoration-indelible">{profile.citations[c]?.label ?? c}</a></span>))}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Modal>

      <Modal open={open === "social"} onClose={() => setOpen(null)} eyebrow="Gandhinagar & beyond" title="Social Work & Constituency Initiatives" intro="Programmes reported under his name — AUDA development, cooperative revival and institutional trusteeship.">
        <ul className="grid gap-4 sm:grid-cols-2">
          {profile.socialInitiatives.map((s) => (
            <li key={s.name} className="record-card flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-3"><h3 className="font-display text-base leading-snug text-ink">{s.name}</h3><span className="shrink-0 rounded-full border border-rule bg-paper px-2 py-0.5 font-mono text-[0.64rem] uppercase tracking-wide text-faint">{s.since}</span></div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.description}</p>
              <p className="mt-3 font-mono text-xs text-faint">Sources: {s.citationIds.map((c, idx) => (<span key={c}>{idx ? ", " : ""}<a href={profile.citations[c]?.url} target="_blank" rel="noreferrer" className="underline decoration-rule underline-offset-2">{profile.citations[c]?.label ?? c}</a></span>))}</p>
            </li>
          ))}
        </ul>
      </Modal>

      {/* Compact ministerial summary — stays inline */}
      <Section eyebrow="The Cabinet — summary" title="Home + Cooperation — two portfolios">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="record-card p-6">
              <h3 className="font-display text-lg text-ink">Historic notes</h3>
              <ul className="mt-4 space-y-2">
                {profile.ministerial.historicNotes.map((n) => (
                  <li key={n} className="flex gap-2 text-sm leading-relaxed text-muted"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indelible" aria-hidden /><span>{n}</span></li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => setOpen("timeline")} className="text-link text-sm">Full timeline →</button><span className="text-faint">·</span><button onClick={() => setOpen("posts")} className="text-link text-sm">Posts & pay →</button></div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="record-card p-6">
              <h3 className="font-display text-lg text-ink">Reforms & major decisions</h3>
              <ul className="mt-4 space-y-2">
                {profile.ministerial.reforms.map((r) => (
                  <li key={r} className="flex gap-2 text-sm leading-relaxed text-muted"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden /><span>{r}</span></li>
                ))}
              </ul>
              <ul className="mt-4 space-y-2">
                {profile.ministerial.majorDecisions.slice(0, 1).map((c) => (
                  <li key={c} className="flex gap-2 text-sm leading-relaxed text-muted"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" aria-hidden /><span className="line-clamp-3">{c}</span></li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => setOpen("work")} className="text-link text-sm">All news that made headlines →</button><span className="text-faint">·</span><button onClick={() => setOpen("allegations")} className="text-link text-sm">Allegations →</button></div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="Constituency" title="Gandhinagar — the seat behind the Cabinet">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="record-card p-6">
              <h3 className="font-display text-lg text-ink">Gandhinagar · Gujarat</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">A general (unreserved) Lok Sabha constituency previously held by A. B. Vajpayee and L. K. Advani. Shah has represented it since 2019 — Gandhinagar is the political extension of his Sarkhej/Naranpura MLA base.</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { e: "17th", v: "8,88,210", n: "69.76% — margin 5,57,014 vs C.J. Chavda (INC)" },
                  { e: "18th", v: "10,10,972", n: "76.5% — margin 7,44,716 vs Sonal Patel (INC)" },
                ].map((b) => (
                  <div key={b.e} className="rounded-md border border-rule bg-paper px-3 py-3 text-center">
                    <p className="font-mono text-xs uppercase tracking-wide text-faint">{b.e} · 2019/2024</p>
                    <p className="mt-1 font-display text-lg text-indelible">{b.v}</p>
                    <p className="mt-1 text-xs leading-snug text-muted">{b.n}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 font-mono text-xs text-faint">Margins per ECI affidavits/secondary summaries; official result sheets are authoritative for exact tallies.</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="record-card p-6">
              <h3 className="font-display text-lg text-ink">What the record shows</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">Longest-serving Home Minister (6+ years, 1 Jun 2019–present) — Article 370, CAA, new criminal codes. Also BJP&apos;s election strategist: UP 73/80 (2014), 303 seats (2019), and cooperative ministry since 2021.</p>
              <div className="mt-4 rounded-md bg-paper px-3 py-3">
                <p className="font-mono text-xs uppercase tracking-wide text-faint">By the numbers</p>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  <li>• 5-term Gujarat MLA (1997–2017) — record margins 1.58L & 2.32L in Sarkhej</li>
                  <li>• BJP President Jul 2014–Jan 2020 — 10 crore members</li>
                  <li>• Gandhinagar 2019 69.76% → 2024 76.5%</li>
                </ul>
              </div>
              <Link href="/parliament/lok-sabha" className="text-link mt-4 inline-block text-sm">Explore the Lok Sabha composition →</Link>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="Provenance" title="Sources" intro="Primary is the official roster/affidavit; secondary provides biographical and judicial context. Every card above links back to at least one source below.">
        <Stagger as="ul" className="grid gap-3 sm:grid-cols-2" stagger={0.05}>
          {Object.values(profile.citations).map((c) => (
            <StaggerItem key={c.label} as="li" y={10}>
              <a href={c.url} target="_blank" rel="noreferrer" className="record-card block h-full p-4 no-underline transition-colors hover:border-indelible/30">
                <p className="font-mono text-xs uppercase tracking-wide text-faint">{c.label}</p>
                <p className="mt-1 font-display text-sm leading-snug text-indelible">{c.title}</p>
                <p className="mt-1 text-xs text-muted">{c.publisher}</p>
                <p className="mt-2 break-all font-mono text-[0.7rem] text-faint">{c.url}</p>
                {c.accessedOn ? <p className="mt-1 font-mono text-xs text-faint">Accessed {c.accessedOn}</p> : null}
              </a>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-6">
          <div className="rounded-lg border border-indelible/20 bg-indelible-tint px-5 py-4">
            <p className="font-display text-sm text-indelible">How this dossier treats the public record</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">Official Lok Sabha/MHA/PIB/ECI data are Tier-1; biographical and judicial detail draws on attributed secondary reporting (Indian Express, BBC, ToI, Wire, Scroll, etc.) plus subject site. Where sources diverge (education “12th Pass” vs “B.Sc.”, Mumbai vs Mansa phrasing), variation is noted. Court outcomes are as pronounced — Sohrabuddin discharged 2014, Ishrat clean chit 2014, acquittal upheld 2026 — “alleged” reflects that stage. Pay is governed by distinct Acts (MP Act 1954/G.S.R.188(E), Gujarat/Rajasthan Act, Officers/Ministers Acts, Art.97). Net-worth is ECI-affidavit via ADR/Myneta.</p>
          </div>
        </Reveal>
        <Reveal className="mt-6">
          <SourceNote publisher="Lok Sabha Secretariat, Parliament of India" title="List of Members / current Lok Sabha member service (ls-5021)" url="https://sansad.in/ls/members" retrievedAt="2025-08-15T14:09:37.975701Z" authorityTier="Tier 1" notes="Official roster — Gandhinagar, BJP, terms 17,18, Sitting." />
        </Reveal>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <SourceNote publisher="Ministry of Home Affairs, Government of India" title="Union Home Minister — Meet the Minister" url="https://www.mha.gov.in/en/about-us/meet-the-minister/union-home-minister" authorityTier="Tier 1" notes="Home + Cooperation portfolios, longest-serving note." />
          <SourceNote publisher="ECI via ADR — MyNeta" title="Amit Shah — Lok Sabha 2024, Gandhinagar — Affidavit" url="https://www.myneta.info/LokSabha2024/candidate.php?candidate_id=4427" authorityTier="Tier 1 — self-declared affidavit" notes="₹65.67 Cr total, 3 cases, 12th Pass header, 1.1 Cr income, no vehicle." />
          <SourceNote publisher="Press Information Bureau" title="Shri Amit Shah assumes charge as Union Home Minister (1 Jun 2019)" url="https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1573071" authorityTier="Tier 1" notes="Five-term MLA, MoS Home 2002–2010, Rajya Sabha 2017–19." />
        </div>
        <p className="mt-6 font-mono text-xs leading-relaxed text-faint">Dossier last verified {profile.lastVerified}. {profile.disclaimer}</p>
        <p className="mt-2 flex flex-wrap gap-2 text-xs"><Link href="/methodology" className="text-link">Methodology</Link><span className="text-faint">·</span><Link href="/sources" className="text-link">Source registry</Link><span className="text-faint">·</span><Link href="/corrections" className="text-link">Report a correction</Link><span className="text-faint">·</span><a href="https://sansad.in/ls/members" target="_blank" rel="noreferrer" className="text-link">Official roster →</a></p>
      </Section>
    </div>
  );
}
