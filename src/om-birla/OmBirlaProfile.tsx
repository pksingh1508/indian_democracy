"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal, Stagger, StaggerItem } from "@/src/components/motion-primitives";
import { StatusBadge } from "@/src/components/badges";
import { SourceNote } from "@/src/components/source-note";
import { OM_BIRLA_PROFILE } from "./profile";

const profile = OM_BIRLA_PROFILE;

/* ---------- helpers ---------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow mb-2">{children}</p>;
}

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
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
  youth: { dot: "bg-saffron", label: "Youth & Organisation" },
  cooperative: { dot: "bg-saffron", label: "Cooperative" },
  assembly: { dot: "bg-indelible", label: "Assembly" },
  parliament: { dot: "bg-indelible-strong", label: "Parliament" },
  speakership: { dot: "bg-indelible", label: "Speakership" },
  social: { dot: "bg-leaf", label: "Social work" },
};

/* ---------- generic modal ---------- */

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
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="fixed inset-0 bg-ink/60 backdrop-blur-[2px]"
      />
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

/* ---------- modal card trigger ---------- */

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

/* ---------- exported enriched profile ---------- */

export function OmBirlaProfile() {
  const [open, setOpen] = useState<null | string>(null);

  return (
    <div className="mt-14 space-y-16">
      {/* At a glance — stays inline, not in a modal */}
      <Section
        eyebrow="From birth to the Chair · a sourced record"
        title="At a glance"
        intro="A concise dossier drawn only from official rosters and attributed reporting. Every detail behind the cards below lives in a modal — so the page stays scannable and citation-linked."
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left — identity card */}
          <Reveal>
            <div className="record-card overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-indelible via-indelible-strong to-leaf" aria-hidden />
              <div className="p-6 sm:p-7">
                <div className="flex gap-5">
                  <div
                    className="hidden h-[88px] w-[88px] shrink-0 items-center justify-center rounded-full border border-rule bg-paper text-xl font-display text-indelible shadow-sm sm:flex"
                    aria-hidden
                  >
                    OB
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl text-ink">Om Birla</h3>
                    <p className="mt-1 text-sm text-muted">
                      Speaker of the Lok Sabha · 17th (2019–2024) &amp; 18th (26 June 2024 – present) · MP, Kota (Kota-Bundi), Rajasthan since 2014 · MLA, Kota South 2003–2014
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <StatusBadge tone="ok">Confirmed current — Speaker</StatusBadge>
                      <span className="inline-flex items-center rounded-full border border-indelible/30 bg-indelible-tint px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-indelible">
                        BJP · Kota
                      </span>
                      <span className="inline-flex items-center rounded-full border border-rule px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-faint">
                        ID ls-4716
                      </span>
                    </div>
                  </div>
                </div>

                <dl className="mt-6 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <div className="border-t border-rule pt-3">
                    <dt className="eyebrow !mb-1 !text-[0.64rem]">Born</dt>
                    <dd className="text-ink">
                      {profile.birth.displayDate} · {profile.birth.place}
                    </dd>
                    <dd className="mt-1 text-xs leading-relaxed text-muted">
                      Son of {profile.birth.parents.father} and {profile.birth.parents.mother}. {profile.birth.familyBackground}
                    </dd>
                  </div>
                  <div className="border-t border-rule pt-3">
                    <dt className="eyebrow !mb-1 !text-[0.64rem]">Family</dt>
                    <dd className="text-ink">{profile.personal.spouse}</dd>
                    <dd className="mt-1 text-xs leading-relaxed text-muted">{profile.personal.children}</dd>
                  </div>
                  <div className="border-t border-rule pt-3">
                    <dt className="eyebrow !mb-1 !text-[0.64rem]">Education</dt>
                    <dd className="text-ink">M.Com. — Commerce</dd>
                    <dd className="mt-1 text-xs leading-relaxed text-muted">
                      Govt. Commerce College, Kota · Maharshi Dayanand Saraswati University, Ajmer
                      <br />
                      <span className="font-mono text-[0.7rem] text-faint">Graduation 1985 · Post-graduation 1987</span>
                    </dd>
                  </div>
                  <div className="border-t border-rule pt-3">
                    <dt className="eyebrow !mb-1 !text-[0.64rem]">Profession &amp; party</dt>
                    <dd className="text-ink">{profile.personal.profession.join(" · ")}</dd>
                    <dd className="mt-1 text-xs leading-relaxed text-muted">
                      {profile.personal.party} ({profile.personal.partyAbbreviation}) ·{" "}
                      <a href={profile.personal.website} target="_blank" rel="noreferrer" className="text-link">
                        ombirla.in
                      </a>
                    </dd>
                  </div>
                </dl>

                <p className="mt-5 rounded-md bg-paper px-3 py-2 font-mono text-xs leading-relaxed text-faint">
                  Roster entry: Kota, Rajasthan · Lok Sabha terms 16, 17, 18 · Membership status: Sitting. House: 543 sanctioned seats, term 18.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right — key dates ledger */}
          <Reveal delay={0.08}>
            <div className="record-card p-6">
              <Eyebrow>Ledger — key dates</Eyebrow>
              <ul className="space-y-3 text-sm">
                {[
                  { k: "First electoral win", v: "1979 · Students' Union, Gumanpura (age 17)" },
                  { k: "BJYM Kota → Rajasthan → National", v: "1987–1991 → 1991–1997 → 1997–2003" },
                  { k: "CONFED Chairman", v: "June 1992 – June 1995" },
                  { k: "MLA Kota South", v: "Dec 2003 – May 2014 · 3 terms" },
                  { k: "MP Kota", v: "2014 – present · 16th, 17th, 18th Lok Sabha" },
                  { k: "Speaker — 17th Lok Sabha", v: "19 June 2019 – 24 June 2024 · unanimous" },
                  { k: "Speaker — 18th Lok Sabha", v: "26 June 2024 – present · voice vote" },
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
                <strong className="font-semibold">How to browse:</strong> Tap any card below to open its full, citation-linked detail in a modal. For current status, the official roster at{" "}
                <a href="https://sansad.in/ls/members" target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  sansad.in/ls/members
                </a>{" "}
                governs.
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------- Modal triggers grid ---------- */}
      <Section
        eyebrow="Deep dives — tap to open"
        title="Everything about the office-holder, by theme"
        intro="The page stays compact. Each heading opens a modal with tables, timelines and citations — including salaries per post, net-worth affidavits, news-making work (praised and criticised), and every allegation on record with its response."
      >
        <Stagger as="div" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          <StaggerItem>
            <ModalTrigger
              eyebrow="Posts, tenures & pay"
              title="His All Post Details"
              description="Every office — student union to the Chair — with jurisdiction, term, entry method, predecessor/successor, and the exact salary & allowances for that post."
              meta="9 posts · salary law for each · from honorary to Cabinet scale"
              accent="indelible"
              onClick={() => setOpen("posts")}
            />
          </StaggerItem>
          <StaggerItem>
            <ModalTrigger
              eyebrow="Money & declarations"
              title="Net Worth & Assets"
              description="Affidavit timeline 2008 → 2024: total assets, movable/immovable split, liabilities, incomes, bank deposits, jewellery, land — with valuation notes."
              meta="₹1.19 Cr (2008) → ₹10.62 Cr (2024) · +311% · 0 cases in 2024"
              accent="leaf"
              onClick={() => setOpen("networth")}
            />
          </StaggerItem>
          <StaggerItem>
            <ModalTrigger
              eyebrow="In the news"
              title="Work That Made News"
              description="Paperless House, Hindi push, productivity claims — and the suspensions, bill-timing and mic/camera critiques — all attributed and labelled good / mixed / critical."
              meta="9 items · positive, mixed & critical · with source"
              accent="saffron"
              onClick={() => setOpen("work")}
            />
          </StaggerItem>
          <StaggerItem>
            <ModalTrigger
              eyebrow="Scrutiny"
              title="Allegations & Controversies"
              description="Every allegation on the public record — criminal-case affidavits, the ‘partisan Speaker’ no-confidence, Deputy-Speaker vacancy, Mahua Moitra context — with context and outcome."
              meta="5 records · allegation → context → response → outcome"
              accent="saffron"
              onClick={() => setOpen("allegations")}
            />
          </StaggerItem>
          <StaggerItem>
            <ModalTrigger
              eyebrow="Chronology"
              title="Complete Timeline"
              description="Birth to present — 20+ dated events from 1962, 1979 school union to the Mar 2026 no-confidence defeat — with per-event citations."
              meta="1962 → 2026 · birth, youth, assembly, parliament, speakership"
              accent="indelible"
              onClick={() => setOpen("timeline")}
            />
          </StaggerItem>
          <StaggerItem>
            <ModalTrigger
              eyebrow="Kota & beyond"
              title="Social Work & Constituency"
              description="Medicine Bank, Prasadam, Paridhan, Meri Paathshala, Suposhit Maa, Rain Baseras, Green Kota — the programmes reported under his name."
              meta="10 initiatives · with start year & sources"
              accent="leaf"
              onClick={() => setOpen("social")}
            />
          </StaggerItem>
        </Stagger>

        <Reveal className="mt-6">
          <div className="rounded-lg border border-rule bg-paper px-4 py-3 text-sm text-muted">
            Tip: You can also open <span className="font-mono text-xs text-faint">Kota — the seat behind the Chair</span> and the full <span className="font-mono text-xs text-faint">Speaker deep-dive</span> from inside their modals — or keep scrolling for the concise versions below.
          </div>
        </Reveal>
      </Section>

      {/* ---------- Quick inline teasers (compact, not the full tables) ---------- */}
      <Section eyebrow="Quick look" title="At a glance — inside the modals">
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="record-card p-6">
              <h3 className="font-display text-base text-ink">Salary snapshot (current law)</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indelible" aria-hidden /><span><strong className="text-ink">MP (Lok Sabha):</strong> ₹1,24,000 pm salary (from 1 Apr 2023) + ₹87k constituency + ₹70k office + ₹2,500 daily → assured ~₹2.81 lakh pm excl. daily.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indelible" aria-hidden /><span><strong className="text-ink">MLA (Rajasthan):</strong> basic ₹40k (2019 Act) + vehicle/sumptuary/secretarial/travel → ~₹1.47 lakh pm total (2025 est.).</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indelible" aria-hidden /><span><strong className="text-ink">Speaker:</strong> Officers of Parliament Act, 1953 — equated to Cabinet Minister; plus ₹1,000 sumptuary + furnished residence.</span></li>
              </ul>
              <button onClick={() => setOpen("posts")} className="text-link mt-3 text-sm">See all 9 posts with tenure & pay →</button>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="record-card p-6">
              <h3 className="font-display text-base text-ink">Net-worth snapshot</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Self-declared affidavits: <strong className="text-ink">₹1.19 Cr (2008)</strong> → <strong className="text-ink">₹10.62 Cr (2024)</strong> (+311% vs 2014; cohort avg +110%). Movable ₹5.2 Cr, immovable ₹5.5 Cr, liabilities <strong className="text-leaf">Nil</strong>, cases <strong className="text-leaf">0 in 2024</strong> (2 in 2014, 1 in 2019, all protest-related, no conviction).
              </p>
              <button onClick={() => setOpen("networth")} className="text-link mt-3 text-sm">Open affidavit timeline →</button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ================== MODALS ================== */}

      {/* Posts & Salaries */}
      <Modal
        open={open === "posts"}
        onClose={() => setOpen(null)}
        eyebrow="Posts, tenures & pay — 1979 → present"
        title="His All Post Details"
        intro="Every post with when he served, how he entered it, who was before/after, and what that office pays — with the law that sets the pay."
      >
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-rule">
            <div className="overflow-x-auto">
              <table className="data-table min-w-[820px]">
                <thead>
                  <tr>
                    <th>Office</th>
                    <th>Period</th>
                    <th>Salary</th>
                    <th>Allowances</th>
                    <th>Total approx.</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.salaries.map((s, i) => (
                    <tr key={i}>
                      <td className="max-w-[20rem]">
                        <span className="font-medium text-ink">{s.office}</span>
                        <span className="mt-1 block font-mono text-xs text-faint">{s.legalBasis}</span>
                        {s.notes ? <span className="mt-1 block text-xs leading-relaxed text-muted">{s.notes}</span> : null}
                        <span className="mt-1 block font-mono text-xs text-faint">
                          Sources: {s.citationIds.map((c, idx) => (
                            <span key={c}>{idx ? ", " : ""}<a href={profile.citations[c]?.url} target="_blank" rel="noreferrer" className="underline">{profile.citations[c]?.label ?? c}</a></span>
                          ))}
                        </span>
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
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Student/BJYM/cooperative posts were honorary party/cooperative work — no parliamentary salary. MLA pay is set by the Rajasthan Act (basic ₹40k from 2019, ~₹1.47 lakh total); earlier 2003–14 basic was lower. MP pay is unified nationwide — ₹1.24 lakh salary from 1 Apr 2023 (notified 24 Mar 2025, G.S.R. 188(E)) plus constituency/office/daily; Speaker is equated by law to a Cabinet Minister under the Officers of Parliament Act, 1953, Art. 97.
            </p>
          </div>

          {/* also render officesHeld compact */}
          <div>
            <h4 className="eyebrow">Offices held — full list (from the dossier)</h4>
            <div className="mt-3 overflow-hidden rounded-lg border border-rule">
              <table className="data-table min-w-[700px]">
                <thead>
                  <tr>
                    <th>Office</th>
                    <th>Jurisdiction</th>
                    <th>Term</th>
                    <th>Entry</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.officesHeld.map((o, i) => (
                    <tr key={i}>
                      <td className="max-w-[22rem]">
                        <span className="font-medium text-ink">{o.office}</span>
                        {o.predecessor || o.successor ? (
                          <span className="mt-1 block font-mono text-xs text-faint">
                            {o.predecessor ? `Pre: ${o.predecessor}` : ""}{o.predecessor && o.successor ? " · " : ""}{o.successor ? `Succ: ${o.successor}` : ""}
                          </span>
                        ) : null}
                        {o.notes ? <span className="mt-1 block text-xs text-muted">{o.notes}</span> : null}
                      </td>
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

      {/* Net worth */}
      <Modal
        open={open === "networth"}
        onClose={() => setOpen(null)}
        eyebrow="Money & declarations — ECI affidavits, ADR/Myneta compilations"
        title="Net Worth & Assets"
        intro="Self-declared election affidavits (ECI) — the only public, comparable money record. Valuation effects (especially jewellery/market price) dominate the 2019→2024 jump."
      >
        <div className="space-y-6">
          <div className="overflow-hidden rounded-lg border border-rule">
            <div className="overflow-x-auto">
              <table className="data-table min-w-[900px]">
                <thead>
                  <tr>
                    <th>Election / Year</th>
                    <th>Total assets</th>
                    <th>Movable</th>
                    <th>Immovable</th>
                    <th>Liabilities / Cases</th>
                    <th>Income (self / spouse)</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.netWorthTimeline.map((n) => (
                    <tr key={n.election}>
                      <td>
                        <span className="font-medium text-ink">{n.election}</span>
                        <span className="block font-mono text-xs text-faint">{n.year}</span>
                        <span className="mt-1 block font-mono text-xs text-faint">
                          {n.citationIds.map((c, idx) => (
                            <span key={c}>{idx ? ", " : ""}<a href={profile.citations[c]?.url} target="_blank" rel="noreferrer" className="underline">{profile.citations[c]?.label ?? c}</a></span>
                          ))}
                        </span>
                      </td>
                      <td className="font-mono text-xs font-medium text-ink">{n.totalAssets}</td>
                      <td className="max-w-[16rem] text-xs leading-relaxed text-muted">{n.movable}</td>
                      <td className="max-w-[16rem] text-xs leading-relaxed text-muted">{n.immovable}</td>
                      <td className="max-w-[14rem] text-xs leading-relaxed text-muted">
                        <span className="block">{n.liabilities}</span>
                        <span className="block font-mono text-xs text-faint">{n.cases}</span>
                      </td>
                      <td className="font-mono text-xs text-muted">
                        {n.incomeSelf ? <span className="block">Self: {n.incomeSelf}</span> : null}
                        {n.incomeSpouse ? <span className="block">Spouse: {n.incomeSpouse}</span> : null}
                        {!n.incomeSelf && !n.incomeSpouse ? <span className="text-faint">—</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <ul className="space-y-2">
            {profile.netWorthNotes.map((note) => (
              <li key={note} className="flex gap-2 text-sm leading-relaxed text-muted">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                <span>{note}</span>
              </li>
            ))}
          </ul>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-rule bg-paper p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-faint">Bank deposits (combined)</p>
              <p className="mt-1 font-display text-lg text-ink">₹55 lakh (2019) → ₹2.80 Cr (2024)</p>
              <p className="mt-1 text-xs text-muted">Self ₹19.75 lakh→₹1.85 Cr; spouse ₹35.50 lakh→₹94.94 lakh — Times Now/ETVBharat breakdown.</p>
            </div>
            <div className="rounded-lg border border-rule bg-paper p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-faint">Jewellery & vehicles</p>
              <p className="mt-1 font-display text-lg text-ink">₹11 lakh → ₹39 lakh (jewellery total)</p>
              <p className="mt-1 text-xs text-muted">Cars: ₹16 lakh (2 cars 2019) → ₹5 lakh (2 cars 2024) after depreciation.</p>
            </div>
            <div className="rounded-lg border border-rule bg-paper p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-faint">Land held (area unchanged)</p>
              <p className="mt-1 font-display text-lg text-ink">Self 34.8 acres · Spouse 28.95 acres</p>
              <p className="mt-1 text-xs text-muted">Value revised ₹32→₹40 lakh and ₹28→₹35 lakh — area flat, price effect.</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Work that made news */}
      <Modal
        open={open === "work"}
        onClose={() => setOpen(null)}
        eyebrow="In the news — praised, contested and mixed"
        title="Work That Made News"
        intro="Every item is labelled positive / mixed / critical and source-tagged — not a score, but a balanced press record."
      >
        <div className="space-y-4">
          {profile.workHighlights.map((w) => (
            <div key={w.title} className="record-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-faint">{w.date} · {w.sourceLabel}</p>
                  <h4 className="mt-1 font-display text-base text-ink">{w.title}</h4>
                </div>
                <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[0.64rem] uppercase tracking-wide ${w.kind === "positive" ? "border-leaf/40 text-leaf bg-leaf/[0.06]" : w.kind === "critical" ? "border-saffron/40 text-saffron bg-saffron/[0.06]" : "border-rule-strong text-muted bg-paper"}`}>
                  {w.kind}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.summary}</p>
              <p className="mt-2 font-mono text-xs text-faint">
                Source: <a href={profile.citations[w.citationId]?.url} target="_blank" rel="noreferrer" className="underline">{profile.citations[w.citationId]?.label ?? w.citationId}</a>
              </p>
            </div>
          ))}
          <div className="rounded-md bg-paper px-4 py-3 text-xs leading-relaxed text-faint">
            Tip: For productivity and time-share numbers, the authoritative record is the Lok Sabha debates/journals and the official statistical reports — secondary reporting is attributed, not adjudicated.
          </div>
        </div>
      </Modal>

      {/* Allegations */}
      <Modal
        open={open === "allegations"}
        onClose={() => setOpen(null)}
        eyebrow="Scrutiny — with context and outcome"
        title="Allegations & Controversies"
        intro="Each allegation is shown with its context, the response on record, and the outcome where the House or a court has pronounced — neutral, citation-linked, and updateable."
      >
        <div className="space-y-5">
          {profile.allegations.map((a) => (
            <div key={a.title} className="record-card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-saffron/70 via-rule-strong to-indelible/30" aria-hidden />
              <div className="p-5">
                <p className="font-mono text-xs uppercase tracking-wide text-faint">{a.date}</p>
                <h4 className="mt-1 font-display text-base text-ink">{a.title}</h4>
                <div className="mt-4 grid gap-4 text-sm leading-relaxed">
                  <div>
                    <p className="eyebrow !mb-1 !text-[0.64rem]">Allegation</p>
                    <p className="text-muted">{a.allegation}</p>
                  </div>
                  <div>
                    <p className="eyebrow !mb-1 !text-[0.64rem]">Context</p>
                    <p className="text-muted">{a.context}</p>
                  </div>
                  <div>
                    <p className="eyebrow !mb-1 !text-[0.64rem]">Response / Status</p>
                    <p className="text-muted">{a.responseOrStatus}</p>
                  </div>
                  {a.outcome ? (
                    <div className="rounded-md bg-indelible-tint px-3 py-2">
                      <p className="eyebrow !mb-1 !text-[0.64rem]">Outcome</p>
                      <p className="text-sm text-indelible">{a.outcome}</p>
                    </div>
                  ) : null}
                </div>
                <p className="mt-3 font-mono text-xs text-faint">
                  Sources: {a.citationIds.map((c, idx) => (
                    <span key={c}>{idx ? ", " : ""}<a href={profile.citations[c]?.url} target="_blank" rel="noreferrer" className="underline">{profile.citations[c]?.label ?? c}</a></span>
                  ))}
                </p>
              </div>
            </div>
          ))}
          <p className="font-mono text-xs leading-relaxed text-faint">
            No Lokpal/PMLA/Economic Offences corruption FIR against Om Birla appears in the compiled reputable secondary record through 2024; the dossier treats “no allegation found” as a neutral fact and will update if a filed case appears in an authoritative source.
          </p>
        </div>
      </Modal>

      {/* Timeline */}
      <Modal
        open={open === "timeline"}
        onClose={() => setOpen(null)}
        eyebrow="1962 → present · birth to the Chair"
        title="Complete Timeline"
        intro="Where two reputable sources differ, the entry notes the alternative rather than choosing silently."
      >
        <div className="relative">
          <div className="pointer-events-none absolute bottom-0 left-[11px] top-2 hidden w-px bg-rule sm:block" aria-hidden />
          <ol className="space-y-6">
            {profile.timeline.map((ev) => {
              const cat = CATEGORY_STYLE[ev.category] ?? CATEGORY_STYLE.parliament;
              return (
                <li key={ev.date + ev.title} className="flex gap-4">
                  <span className={`mt-1 hidden h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white shadow-sm sm:flex ${cat.dot}`} aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                  <div className="record-card flex-1 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-wide text-faint">{ev.dateLabel} · {cat.label}</p>
                        <h3 className="mt-1 font-display text-base leading-snug text-ink">{ev.title}</h3>
                      </div>
                      <span className="inline-flex rounded-full border border-rule bg-paper px-2 py-0.5 font-mono text-[0.64rem] uppercase tracking-wide text-faint">
                        {ev.category}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{ev.description}</p>
                    <p className="mt-2 font-mono text-xs text-faint">
                      Sources:{" "}
                      {ev.citationIds.map((c, idx) => (
                        <span key={c}>
                          {idx > 0 ? ", " : ""}
                          <a href={profile.citations[c]?.url} target="_blank" rel="noreferrer" className="underline decoration-rule underline-offset-2 hover:decoration-indelible">
                            {profile.citations[c]?.label ?? c}
                          </a>
                        </span>
                      ))}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Modal>

      {/* Social */}
      <Modal
        open={open === "social"}
        onClose={() => setOpen(null)}
        eyebrow="Kota & beyond · constituency programmes"
        title="Social Work & Constituency Initiatives"
        intro="Programmes reported under his name in constituency coverage — not an official parliamentary record but part of the public biography."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {profile.socialInitiatives.map((s) => (
            <li key={s.name} className="record-card flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-base leading-snug text-ink">{s.name}</h3>
                <span className="shrink-0 rounded-full border border-rule bg-paper px-2 py-0.5 font-mono text-[0.64rem] uppercase tracking-wide text-faint">
                  {s.since}
                </span>
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.description}</p>
              <p className="mt-3 font-mono text-xs text-faint">
                Sources:{" "}
                {s.citationIds.map((c, idx) => (
                  <span key={c}>
                    {idx > 0 ? ", " : ""}
                    <a href={profile.citations[c]?.url} target="_blank" rel="noreferrer" className="underline decoration-rule underline-offset-2">
                      {profile.citations[c]?.label ?? c}
                    </a>
                  </span>
                ))}
              </p>
            </li>
          ))}
        </ul>
      </Modal>

      {/* ---------- Speakership & Kota — compact inline (kept, but modals have the deep dive) ---------- */}
      <Section
        eyebrow="The Chair — summary"
        title="Speaker of the Lok Sabha — two terms"
        intro="A compact summary stays on the page; the full, citation-rich version lives in the modals above (Timeline, Work, Allegations)."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="record-card p-6">
              <h3 className="font-display text-lg text-ink">Two elections</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wide text-faint">17th Lok Sabha · 19 June 2019</dt>
                  <dd className="mt-1 leading-relaxed text-muted">
                    Unanimous. Motion moved by Prime Minister Narendra Modi; succeeding Sumitra Mahajan. Among the youngest Speakers. House had a single-party majority (BJP 303).
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wide text-faint">18th Lok Sabha · 26 June 2024</dt>
                  <dd className="mt-1 leading-relaxed text-muted">
                    Voice vote after a rare contest — NDA&apos;s Om Birla vs. INDIA bloc&apos;s K. Suresh (INC, Mavelikara, 8-time MP). Motion for Birla moved by PM Modi; the opposition candidate&apos;s bid moved by Shiv Sena (UBT) MP Arvind Sawant. Only the second contested Speaker election since 1952, first since 1976.
                  </dd>
                </div>
              </dl>
              <ul className="mt-5 space-y-2">
                {profile.speakership.historicNotes.map((n) => (
                  <li key={n} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indelible" aria-hidden />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setOpen("timeline")} className="text-link text-sm">Full timeline →</button>
                <span className="text-faint">·</span>
                <button onClick={() => setOpen("posts")} className="text-link text-sm">Posts & pay →</button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="record-card p-6">
              <h3 className="font-display text-lg text-ink">What changed & what was criticised</h3>
              <ul className="mt-4 space-y-2">
                {profile.speakership.reforms.slice(0, 2).map((r) => (
                  <li key={r} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-4 space-y-2">
                {profile.speakership.criticisms.slice(0, 1).map((c) => (
                  <li key={c} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" aria-hidden />
                    <span className="line-clamp-3">{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => setOpen("work")} className="text-link text-sm">All news that made headlines →</button>
                <span className="text-faint">·</span>
                <button onClick={() => setOpen("allegations")} className="text-link text-sm">Allegations →</button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="Constituency" title="Kota — the seat behind the Chair">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="record-card p-6">
              <h3 className="font-display text-lg text-ink">Kota (Kota-Bundi) · Rajasthan</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                A general (unreserved) Lok Sabha constituency. Om Birla has represented it continuously since the 16th Lok Sabha. The constituency covers Kota and Bundi districts — the Hadoti region where booth-level organisation became his recognised strength.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { e: "16th", v: ">2,00,000", n: "Margin vs Ijyaraj Singh (INC)" },
                  { e: "17th", v: "~2,50,000", n: "Margin vs Ramnarayan Meena (INC)" },
                  { e: "18th", v: "Re-elected", n: "2024 — third term (vs Prahlad Gunjal per secondary reports)" },
                ].map((b) => (
                  <div key={b.e} className="rounded-md border border-rule bg-paper px-3 py-3 text-center">
                    <p className="font-mono text-xs uppercase tracking-wide text-faint">{b.e} · 2014–</p>
                    <p className="mt-1 font-display text-lg text-indelible">{b.v}</p>
                    <p className="mt-1 text-xs leading-snug text-muted">{b.n}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 font-mono text-xs text-faint">
                Margins per secondary summaries; official ECI result sheets are the authoritative record for exact figures.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="record-card p-6">
              <h3 className="font-display text-lg text-ink">As Speaker — what you won&apos;t see in the stats</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                PRS Legislative Research notes: “As a Speaker, this MP does not sign the attendance register and participate in debates and questions. Data corresponds to the period 24-06-2024 to 13-08-2026.” So attendance, questions and debates show as N/A/0 — by convention, not by absence.
              </p>
              <div className="mt-4 rounded-md bg-paper px-3 py-3">
                <p className="font-mono text-xs uppercase tracking-wide text-faint">By convention</p>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  <li>• No attendance signature · no participation in debates</li>
                  <li>• No questions asked · no private member bills</li>
                  <li>• Presides neutrally over the House</li>
                </ul>
              </div>
              <Link href="/parliament/lok-sabha" className="text-link mt-4 inline-block text-sm">
                Explore the Lok Sabha composition →
              </Link>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------- Sources ---------- */}
      <Section eyebrow="Provenance" title="Sources" intro="Primary is the official roster; secondary sources provide biographical context. Every timeline and initiative entry above links back to at least one source below.">
        <Stagger as="ul" className="grid gap-3 sm:grid-cols-2" stagger={0.05}>
          {Object.values(profile.citations).map((c) => (
            <StaggerItem key={c.label} as="li" y={10}>
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="record-card block h-full p-4 no-underline transition-colors hover:border-indelible/30"
              >
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
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Official Lok Sabha member data (Digital Sansad, Parliament of India) is the controlling Tier-1 source for current status, constituency, party and house. Biographical context (school, BJYM years, cooperative posts, social programmes, speakership commentary) draws on attributed secondary reporting and the subject&apos;s official site. Where reputable sources differ (e.g., “1991–1997” vs. “1993–1997” for state BJYM presidency; “two daughters” vs. “four children”), the dossier states the dominant record and notes the alternative. The Lok Sabha&apos;s own journals and debates remain the final authority on procedure. Pay is governed by distinct Acts (MPs: 1954 Act + G.S.R. 188(E); MLAs: Rajasthan Act 1956; Speaker: Officers of Parliament Act 1953 + Art. 97). Net-worth is ECI-affidavit data compiled by ADR/Myneta — verify line items in the affidavit PDFs.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <SourceNote
            publisher="Lok Sabha Secretariat, Parliament of India"
            title="List of Members / current Lok Sabha member service (ls-4716)"
            url="https://sansad.in/ls/members"
            retrievedAt="2025-08-15T14:09:37.975701Z"
            authorityTier="Tier 1"
            notes="Official roster. Personal contact, address, email, phone, birth date and portrait fields are intentionally omitted from this site's dataset per its own provenance note."
          />
        </Reveal>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <SourceNote
            publisher="Parliament of India — Digital Sansad"
            title="Hon'ble Speaker"
            url="https://sansad.in/ls/about/speaker"
            authorityTier="Tier 1"
            notes="Speaker page — incumbent list (26 June 2024 – Present; 19 June 2019 – 24 June 2024)."
          />
          <SourceNote
            publisher="PRS Legislative Research"
            title="Om Birla — MP Track (18th Lok Sabha)"
            url="https://prsindia.org/mptrack/18th-lok-sabha/om-birla"
            authorityTier="Tier 4 — cross-check"
            notes="Shows ‘Speaker does not sign attendance…’ caveat; constituency Kota, party BJP, third term, window 24-06-2024 to 13-08-2026."
          />
          <SourceNote
            publisher="Om Birla — Official website"
            title="Lok Sabha Speaker Om Birla — official site"
            url="https://ombirla.in/"
            authorityTier="Primary subject site (non-governmental)"
            notes="Reforms claimed: paperless transition, Hindi promotion."
          />
        </div>

        <p className="mt-6 font-mono text-xs leading-relaxed text-faint">
          Dossier last verified {profile.lastVerified}. {profile.disclaimer}
        </p>
        <p className="mt-2 flex flex-wrap gap-2 text-xs">
          <Link href="/methodology" className="text-link">
            Methodology
          </Link>
          <span className="text-faint">·</span>
          <Link href="/sources" className="text-link">
            Source registry
          </Link>
          <span className="text-faint">·</span>
          <Link href="/corrections" className="text-link">
            Report a correction
          </Link>
          <span className="text-faint">·</span>
          <a href="https://sansad.in/ls/members" target="_blank" rel="noreferrer" className="text-link">
            Official roster →
          </a>
        </p>
      </Section>
    </div>
  );
}
