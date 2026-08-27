import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/src/components/motion-primitives";
import { StatusBadge } from "@/src/components/badges";
import { SourceNote } from "@/src/components/source-note";
import { OM_BIRLA_PROFILE } from "./profile";

const profile = OM_BIRLA_PROFILE;

/* ---------- small helpers ---------- */

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

/* ---------- exported enriched profile ---------- */

export function OmBirlaProfile() {
  return (
    <div className="mt-14 space-y-16">
      {/* ---------- At a glance ---------- */}
      <Section
        eyebrow="From birth to the Chair · a sourced record"
        title="At a glance"
        intro="A concise dossier drawn only from official rosters and attributed reporting. Every date is linked to its source below — variations are noted rather than smoothed over."
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
                <strong className="font-semibold">How to read this:</strong> Dates labelled “reported” or with alternative ranges are kept as such and cited — see Sources. For current status, the official roster at{" "}
                <a href="https://sansad.in/ls/members" target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  sansad.in/ls/members
                </a>{" "}
                governs.
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------- Full offices table ---------- */}
      <Section
        eyebrow="Offices held"
        title="Offices — from the classroom to the Chair"
        intro="Every office is a separate relationship with its own jurisdiction, method of entry and term. Acting or parliamentary-secretary duties are listed distinctly from membership."
      >
        <div className="overflow-hidden rounded-lg border border-rule bg-surface">
          <div className="overflow-x-auto">
            <table className="data-table min-w-[720px]">
              <caption className="px-4 pt-4">
                Ordered chronologically. “Entry method” distinguishes direct election, organisational appointment and election by the House.
              </caption>
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
                          {o.predecessor ? `Pre: ${o.predecessor}` : ""}
                          {o.predecessor && o.successor ? " · " : ""}
                          {o.successor ? `Succ: ${o.successor}` : ""}
                        </span>
                      ) : null}
                      {o.notes ? <span className="mt-1 block text-xs leading-relaxed text-muted">{o.notes}</span> : null}
                    </td>
                    <td className="whitespace-nowrap text-muted">{o.jurisdiction}</td>
                    <td className="whitespace-nowrap font-mono text-xs tabular-nums text-muted">{o.term}</td>
                    <td className="max-w-[14rem] text-xs leading-relaxed text-muted">{o.entryMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* ---------- Timeline ---------- */}
      <Section
        eyebrow="Timeline"
        title="A life in public office — birth to present"
        intro="A vertical chronology built from the secondary record. Where two reputable sources differ, the entry notes the alternative rather than choosing silently."
      >
        <div className="relative">
          {/* vertical rule */}
          <div className="pointer-events-none absolute bottom-0 left-[11px] top-2 hidden w-px bg-rule sm:block" aria-hidden />
          <Stagger as="ol" stagger={0.06} className="space-y-6">
            {profile.timeline.map((ev) => {
              const cat = CATEGORY_STYLE[ev.category] ?? CATEGORY_STYLE.parliament;
              return (
                <StaggerItem key={ev.date + ev.title} as="li" y={16}>
                  <div className="flex gap-4">
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
                            <a
                              href={profile.citations[c]?.url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline decoration-rule underline-offset-2 hover:decoration-indelible"
                            >
                              {profile.citations[c]?.label ?? c}
                            </a>
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Section>

      {/* ---------- Speakership deep dive ---------- */}
      <Section
        eyebrow="The Chair"
        title="Speaker of the Lok Sabha — two terms"
        intro="The Speaker is elected by the House and is its custodian — presiding, maintaining order, deciding procedure, and representing the Lok Sabha internationally. The details below stay close to the official record; political assessments are explicitly attributed."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="record-card p-6">
              <h3 className="font-display text-lg text-ink">Two elections</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-wide text-faint">17th Lok Sabha · 19 June 2019</dt>
                  <dd className="mt-1 leading-relaxed text-muted">
                    Unanimous. Motion moved by Prime Minister Narendra Modi; succeeding Sumitra Mahajan. Among the youngest Speakers at that time. House had a single-party majority (BJP 303).
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
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="record-card p-6">
              <h3 className="font-display text-lg text-ink">What the record says changed</h3>
              <ul className="mt-4 space-y-2">
                {profile.speakership.reforms.map((r) => (
                  <li key={r} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" aria-hidden />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-md bg-paper px-3 py-2 font-mono text-xs leading-relaxed text-faint">
                The “70 years” remark is a political speech note on the official site — reproduced as a claim, not a procedural KPI.
              </p>

              <h4 className="eyebrow mt-6 !mb-2">Ex-officio &amp; parliamentary roles</h4>
              <ul className="space-y-2">
                {profile.speakership.committeesAndRoles.map((c) => (
                  <li key={c} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rule-strong" aria-hidden />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="record-card border-saffron/30 bg-saffron/[0.04] p-6 lg:col-span-2">
              <h3 className="font-display text-base text-ink">Reported assessments — attributed</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Parliamentary procedure is contested political terrain. The following are reported secondary assessments — not House findings — and are included for balance with attribution.
              </p>
              <ul className="mt-3 space-y-2">
                {profile.speakership.criticisms.map((c) => (
                  <li key={c} className="flex gap-2 text-sm leading-relaxed text-muted">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" aria-hidden />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-mono text-xs text-faint">
                Suspension figures (100 Lok Sabha, 146 both Houses, 13–21 Dec 2023) and bill-timing averages are per cited reporting; verify against the official Lok Sabha debates/journals for the authoritative record.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ---------- Social initiatives ---------- */}
      <Section
        eyebrow="Kota &amp; beyond"
        title="Social initiatives associated with the office"
        intro="These programmes are reported under his name in constituency coverage. They are not an official parliamentary record but part of the public biography; each is citation-linked."
      >
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2" stagger={0.06}>
          {profile.socialInitiatives.map((s) => (
            <StaggerItem key={s.name} as="li" y={12}>
              <div className="record-card flex h-full flex-col p-5">
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
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ---------- Constituency & parliamentary note ---------- */}
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
              Official Lok Sabha member data (Digital Sansad, Parliament of India) is the controlling Tier-1 source for current status, constituency, party and house. Biographical context (school, BJYM years, cooperative posts, social programmes, speakership commentary) draws on attributed secondary reporting and the subject&apos;s official site. Where reputable sources differ (e.g., “1991–1997” vs. “1993–1997” for state BJYM presidency; “two daughters” vs. “four children”), the dossier states the dominant record and notes the alternative. The Lok Sabha&apos;s own journals and debates remain the final authority on procedure.
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
