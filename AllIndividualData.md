# All Individual Data — Reference Schema

> **Purpose:** This file lists every heading/section heading collected for **Om Birla (`ls-4716`)** in `src/om-birla/profile.ts` and rendered via `src/om-birla/OmBirlaProfile.tsx`. Use it as a **checklist and template** when collecting the same depth of data for any other public office-holder (MP, MLA, Minister, Judge, Speaker, etc.). Copy the structure, fill each field, cite every fact, and leave a field blank or mark `Not available / Not applicable` rather than guessing.

> **Reference implementation:** `src/om-birla/types.ts` (TypeScript contracts), `src/om-birla/profile.ts` (filled example), `src/om-birla/OmBirlaProfile.tsx` (6 modal cards + At-a-glance). Verified 28 August 2026.

---

## How to Use This Template

1. Create `src/<slug>/` with `types.ts`, `profile.ts`, `index.ts`, and a client `XProfile.tsx` following the Om Birla pattern.
2. Fill headings 1–14 below in order. Every factual line needs a `citationId` that resolves in `§14 Citations`.
3. Where reputable sources diverge (dates, counts, titles), record **both** and note which you treat as primary.
4. Never publish private contact (phone/email/address), identity numbers, or family personal data beyond role-relevant public facts.
5. Re-run `pnpm build` and `pnpm lint`; keep `lastVerified` ISO date and a neutral disclaimer.

---

## 1. Identity & Basic Identification

- `id` — stable roster ID (e.g., `ls-4716`, must match `app/data/parliament/...` or other dataset)
- `slug` — URL-safe slug (e.g., `om-birla`)
- `fullName` — official full name
- `displayName` — name as displayed (without honorific)
- `alsoKnownAs` — alternate spellings / roster forms (e.g., `"Shri Om Birla"`, `"Birla, Shri Om"`)

## 2. Birth & Early Background

- `birth.date` — ISO date (`YYYY-MM-DD`)
- `birth.displayDate` — human date (`23 November 1962`)
- `birth.place` — city/state/country
- `birth.parents.father` / `birth.parents.mother`
- `birth.familyBackground` — 1–2 lines: community/place, early political association (e.g., ABVP/RSS), school politics

## 3. Personal Details

- `personal.spouse` — name + marriage year (e.g., `Dr. Amita Birla (m. 1991)`)
- `personal.marriageYear`
- `personal.children` — short line (e.g., `Two daughters — Akansha and Anjali`)
- `personal.childrenNote` — if sources vary, record the variation and which you treat as primary
- `personal.profession` — array (e.g., `["Politician","Businessperson","Social worker"]`)
- `personal.website` — official site (e.g., `https://ombirla.in`)
- `personal.party` / `personal.partyAbbreviation` (e.g., `Bharatiya Janata Party` / `BJP`)

## 4. Education

For each `education[]` record:
- `degree` (e.g., `M.Com.`)
- `institution` (e.g., `Government Commerce College, Kota`)
- `university` (e.g., `Maharshi Dayanand Saraswati University, Ajmer`)
- `year` — include graduation vs post-graduation years if known (e.g., `Graduation 1985 · Post-graduation 1987`)
- `field` (e.g., `Commerce`)

## 5. Offices Held — All Post Details

> Rendered in modal **“His All Post Details — Tenures, Entry & Salaries”** (also duplicated inside the salary modal for context).

For each `officesHeld[]` / `officeRecord`:
- `office` — full office title (e.g., `Member of Parliament, Lok Sabha, Kota (Kota-Bundi)` / `Speaker of the Lok Sabha (17th Lok Sabha)`)
- `jurisdiction` — scope (e.g., `Parliament of India — Lok Sabha` / `Rajasthan Legislative Assembly`)
- `term` — human term (e.g., `December 2003 – May 2014 (three terms: 12th, 13th, 14th Rajasthan Assembly)` / `19 June 2019 – 24 June 2024`)
- `entryMethod` — how they entered (`Direct election (FPTP)` / `Organisational appointment` / `Elected by the House; motion moved by ...`)
- `predecessor` / `successor` — name if applicable
- `notes` — margins, achievements, or caveats (e.g., `Defeated X by Y votes; facilitated ₹50 lakh patient assistance`)

**Coverage checklist for Om Birla (use as row checklist):** Students' Union 1979 → BJYM District 1987–91 → BJYM State 1991–97 → NCCF Vice Chairman / CONFED Chairman Jun 1992–Jun 1995 → BJYM National VP 1997–2003 → MLA Kota South 2003–14 → Parliamentary Secretary (MoS rank) 2003–08 → MP Kota 16th/17th/18th 2014–present → Speaker 17th 19 Jun 2019–24 Jun 2024 → Speaker 18th 26 Jun 2024–present.

## 6. Salaries & Emoluments per Post

> Rendered in modal **“His All Post Details”** — table with 5 columns per row.

For each `salaries[]` / `salaryRecord`:
- `office` — mirrors `officesHeld` title for join
- `period` — effective period for that pay scale
- `salary` — basic pay rule (e.g., `₹1,24,000 pm (from 1 Apr 2023, G.S.R. 188(E))` / `₹40,000 pm basic from 1 Apr 2019 (Rajasthan Act 1956 §4)`)
- `allowances` — constituency/office/daily/sumptuary/vehicle/secretarial/travel/residence etc.
- `totalApprox` — illustrative assured total (e.g., `~₹2.81 lakh pm excl. daily` for MP; `~₹1.47 lakh pm` for Rajasthan MLA 2025 est.; honorary posts → `Unpaid`)
- `legalBasis` — Act/Article/Notification (e.g., `Salary, Allowances and Pension of Members of Parliament Act, 1954 §§3, 8A + Finance Act 2018 + G.S.R.188(E)` / `Rajasthan Legislative Assembly Act 1956 §§4,8` / `Officers of Parliament Act 1953 §§3–5 + Constitution Art.97`)
- `notes` — historical variation (e.g., earlier MLA basic lower; Speaker equated to Cabinet Minister)
- `citationIds[]` — law/gazette/reporting sources

## 7. Timeline / Chronology — Birth to Present

> Rendered in modal **“Complete Timeline”** — vertical chronology.

For each `timeline[]` / `timelineEvent`:
- `date` — ISO or range (sorting key)
- `dateLabel` — human label (`23 November 1962` / `June 1992 – June 1995`)
- `title` — event title
- `description` — 1–3 neutral sentences
- `category` — `birth` | `education` | `youth` | `cooperative` | `assembly` | `parliament` | `speakership` | `social`
- `citationIds[]`

**Required coverage:** birth → first school election → each education step → each organisational post → each assembly term → each Lok Sabha term → Speaker elections → major social launches → current incumbent note → any reported no-confidence/measurement notice (with “reported, per secondary source” caveat).

## 8. Net Worth & Assets — Affidavit Timeline

> Rendered in modal **“Net Worth & Assets”** — table + notes + 3 summary cards.

For each `netWorthTimeline[]` / `netWorthSnapshot`:
- `election` — affidavit context (e.g., `Lok Sabha 2024 — Kota (Winner, 3rd term)`)
- `year` — election year
- `totalAssets` — headline (e.g., `₹10,62,06,645 (~₹10.62 Cr)`)
- `movable` — breakdown (deposits, jewellery weight/value, vehicles, investments)
- `immovable` — land area (acres, unchanged vs value) + buildings/houses/flats with value
- `liabilities` — amount or `Nil`
- `cases` — case count + short sections (e.g., `0 (2024: No cases)` / `1 (FIR 224/12, IPC 143/283 + Sec 8(b) NH Act)`)
- `incomeSelf` / `incomeSpouse` — annual income as declared
- `citationIds[]` — `myneta*`, `adr*`, `timesNowAsset`, etc.

Additional:
- `netWorthNotes[]` — 3–4 notes explaining valuation effects, liability history, cohort comparison (e.g., 102 re-elected MPs avg +110% vs subject +311%), “no house in own name” clarification.

## 9. Work Highlights — Work That Made News

> Rendered in modal **“Work That Made News”** — cards labelled by `kind`.

For each `workHighlights[]` / `workNewsItem`:
- `title` (e.g., `Paperless Lok Sabha & digital transition`)
- `date` — period or single date
- `kind` — `positive` | `mixed` | `critical`
- `summary` — neutral 1–2 sentences; if a government claim, tag `Government-side stat — treat as claim`
- `sourceLabel` — short press label (e.g., `ThePrint` / `Akashvani`)
- `citationId` — single primary citation key

**Must include both:** reforms/praised work **and** criticised/mixed record (e.g., suspensions, bill-timing, mic/camera) with equal attribution.

## 10. Allegations, Cases & Controversies

> Rendered in modal **“Allegations & Controversies”** — allegation → context → response → outcome cards.

For each `allegations[]` / `allegationRecord`:
- `title`
- `date`
- `allegation` — what was alleged, in neutral terms
- `context` — case numbers/courts/Articles/Rules (e.g., `FIR 224/12 PS Modak, Case 896/2018 JM Ramganjmandi, IPC 143/283` / `Art.94(c), Rules 349/353, Art.93/95(2)`), plus how many MPs/days
- `responseOrStatus` — rebuttal or official stance (Speaker denial, treasury defence, act citation)
- `outcome` — `No conviction`, `Defeated by voice vote 12 Mar 2026`, or `Pending — verify ECI affidavit/court record`
- `citationIds[]`

**Mandatory records to check for every person:**
- Affidavit criminal cases (with `Cases where Convicted — No Cases` if clean; latest count vs earlier)
- Any no-confidence / removal motion (rare for Speakers — note 1954/1966/1987 precedents)
- Institutional vacancies attributed (e.g., Deputy Speaker 7 years)
- Published “no X allegation found” neutral fact if nothing on reputable record (and note you will update if a filed FIR appears)

## 11. Social Initiatives & Constituency Work

> Rendered in modal **“Social Work & Constituency Initiatives”** — 2-column cards.

For each `socialInitiatives[]`:
- `name` (e.g., `Medicine Bank (Nishulk Dawa Yojna)`)
- `since` — year or `As MP` / `As MLA/MP`
- `description` — beneficiary, mechanism, scale (1 sentence)
- `citationIds[]`

Checklist from Om Birla: Medicine Bank, Prasadam, Nishulk Paridhan Uphaar Kendra, Meri Paathshala, Matru Gyan Kendras / Suposhit Maa Abhiyan, Rain Baseras / Kambal Nidhi Prakalp, Ek Mutthi Ann Rahat Abhiyaan, Slippers Distribution, Azadi ke Swar, Green Kota / Green Quota Forestation.

## 12. Speakership / Institutional Roles (if applicable)

For `speakership`:
- `firstTerm` / `secondTerm` — date + election mode (`unanimous` / `voice vote after rare contest`)
- `predecessor`
- `historicNotes[]` — youngest, first re-elected in 20y, contested-election rarity, cohort comparators (Jakhar, Dhillon, etc.)
- `reforms[]` — paperless, Hindi, language count
- `committeesAndRoles[]` — ex-officio chairs (BAC/Rules/General Purposes), IPG/CPA presidencies, earlier standing committees
- `criticisms[]` — only as **attributed** secondary assessments (suspensions, bill-timing) plus the reported notice count

If subject is not Speaker, replace with `Ministerial portfolios[]` / `Judicial tenure` / `Legislative committee memberships[]` as applicable.

## 13. Constituency & Electoral Record (Quick Reference)

- Constituency name, state/UT, reservation (`General` / `SC` / `ST`)
- District(s) covered, region note
- Term-wise margins and opponents (with `vs X (Party)` and `~Y votes`; caveat: exact figures per ECI result sheet)
- Attendance/debates/questions caveat if subject is Speaker (`PRS: does not sign attendance / 0 by convention`)

## 14. Citations & Provenance

For each `citations[key]` / `citation`:
- `label` — short key (e.g., `mpSalaryGazette`)
- `publisher` — full publisher
- `title` — source title
- `url` — canonical URL (prefer ECI/Myneta PDF, Gazette PDF, sansad.in, India Code, ADR PDF, then reputable press)
- `accessedOn` — access date (`28 August 2026`)

**Tiering to preserve:** Tier-1 = sansad.in/eci.gov.in/gazette/indiacode/ADR-Myneta PDFs; Tier-4 = reputable press (ToI/Express/ThePrint/Firstpost/The Wire/NewsMinute); subject site = non-governmental primary. Every `citationIds[]` above must resolve here.

## 15. Verification, Freshness & Disclaimer

- `lastVerified` — ISO date of last editorial + source re-check
- `disclaimer` — neutral paragraph: official roster / ECI affidavit governs current status; secondary biographical detail is attributed; variations are noted not smoothed; no private contact/ID published; House journals / court records are final authority

---

## Minimal Field Checklist (copy-paste for a new person)

```
- [ ] 1. Identity (id, slug, fullName, displayName, alsoKnownAs)
- [ ] 2. Birth (date, displayDate, place, parents, familyBackground)
- [ ] 3. Personal (spouse, marriageYear, children + note, profession[], website, party)
- [ ] 4. Education (degree, institution, university, year, field) × n
- [ ] 5. Offices Held (office, jurisdiction, term, entryMethod, predecessor/successor, notes) × n
- [ ] 6. Salaries per Post (salary, allowances, totalApprox, legalBasis, citationIds) × n
- [ ] 7. Timeline (date, dateLabel, title, description, category, citationIds) × ~15–25 events
- [ ] 8. Net Worth Timeline (election, year, totalAssets, movable, immovable, liabilities, cases, incomeSelf/Spouse, citationIds) + netWorthNotes[]
- [ ] 9. Work Highlights (title, date, kind, summary, sourceLabel, citationId) × ~6–10 (balanced positive/critical)
- [ ] 10. Allegations/Cases (title, date, allegation, context, responseOrStatus, outcome, citationIds) — or explicit “no X found”
- [ ] 11. Social Initiatives (name, since, description, citationIds) × n
- [ ] 12. Speakership/Institutional Roles (firstTerm, secondTerm, predecessor, historicNotes[], reforms[], committeesAndRoles[], criticisms[]) — or Minister/Judge equivalent
- [ ] 13. Constituency & Electoral Record (margins, reservation, districts)
- [ ] 14. Citations (label, publisher, title, url, accessedOn) — every citationIds[] resolves
- [ ] 15. lastVerified + disclaimer
```

---

*File generated from `src/om-birla/profile.ts` (769 lines) as the canonical example. To add a new person, duplicate that file’s structure, fill this checklist, keep the modal rendering pattern in `OmBirlaProfile.tsx`, and update `app/people/[id]/page.tsx:35` routing.*

