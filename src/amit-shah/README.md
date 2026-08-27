# Amit Shah — sourced dossier (`src/amit-shah/`)

This folder holds the enriched, citation-linked biography for **Amit Shah (`ls-5021` / `union-minister-3`)** — from birth to present — and the components that render it on `/people/ls-5021` and `/people/union-minister-3`.

Follows `AllIndividualData.md` (15 headings) — identical structure to `src/om-birla/`.

## What is here

- `types.ts` — TypeScript contracts (Citation, TimelineEvent, OfficeRecord, SalaryRecord, NetWorthSnapshot, WorkNewsItem, AllegationRecord, AmitShahProfile).
- `profile.ts` — single typed constant `AMIT_SHAH_PROFILE` with:
  - identity, birth (22 Oct 1964, Mumbai/Mansa), family (Anilchandra/Kusumben, Sonal, Jay Shah + 3 grandchildren, six sisters), education (B.Sc. Biochemistry, CU Shah Science College / affidavit “12th Pass” variation noted), profession
  - every office held (RSS 1980 → ABVP 1982–83 → BJP/BJYM 1987 → State VP 1999 → MLA Sarkhej 1997–2012 ×4 → MLA Naranpura 2012–17 → MoS Home + 11 portfolios 2002–2010 → National GS & UP in-charge 2013 → BJP President Jul 2014–Jan 2020 → Rajya Sabha 2017–19 → Lok Sabha Gandhinagar 2019/2024 → Home 1 Jun 2019–present + Cooperation 7 Jul 2021–present)
  - dated timeline (1964→2025, 22+ events) with citationIds
  - social initiatives (AUDA, cooperative bank, Public Undertakings Committee, Somnath Trust, GCA)
  - `ministerial` — portfolios, longest-serving Home Minister 6+ years, reforms (Art.370, new criminal codes), major decisions (CAA, J&K reorganisation), criticisms
  - `salaries[]` — pay per post (honorary → MLA ~₹1.47L → Rajya Sabha/Lok Sabha ₹1.24L→~₹2.81L → Cabinet Minister Home scale, Art.97 + Acts) with legal basis
  - `netWorthTimeline[]` — 2007 ₹5.57 Cr → 2012 ₹11.77 Cr → 2019 ₹40.32 Cr → 2024 ₹65.67 Cr (+63%, 3 cases in 2024, 0 vehicle) with movable/immovable/liabilities/income + `netWorthNotes[]`
  - `workHighlights[]` — 8 items labelled positive/mixed/critical (370, new codes, CAA, BJP expansion, Cooperation, CAA-NRC chronology, Assam NRC, Valley lockdown)
  - `allegations[]` — 5 records (Sohrabuddin/Ishrat discharged/clean chit → acquittal upheld 2026, Snoop-gate, asset scrutiny, 2024 pending-cases header) with allegation→context→response→outcome, all neutral and citation-linked
  - `citations` map — every fact links to a source URL (Tier-1: sansad.in/mha.gov.in/pib/myneta ADR/ECI/Gazette/India Code; Tier-4: Britannica/Wiki/ToI/BBC/Scroll/Wire etc.)
- `AmitShahProfile.tsx` — **client** enriched UI built with `paper`/`indelible`/`rule`, `record-card`, `Reveal`/`Stagger`, `SourceNote`. Same 6-card modal pattern as Om Birla: *His All Post Details*, *Net Worth & Assets*, *Work That Made News*, *Allegations & Controversies*, *Complete Timeline*, *Social Work & Constituency*. Page stays compact; detail lives in modals (backdrop, Esc, scroll-lock, sticky header).
- `index.ts` — barrel re-export.

## How it is rendered

`app/people/[id]/page.tsx:35` imports `AmitShahProfile` from `@/src/amit-shah`:

```ts
import { AmitShahProfile } from "@/src/amit-shah";
{(id === "ls-5021" || id === "union-minister-3") ? <><div className="my-12 h-px ..." /><AmitShahProfile /></> : null}
```

Both the Lok Sabha route (`/people/ls-5021`) and the minister route (`/people/union-minister-3`) resolve to the same dossier (two stable IDs for one natural person — see `planning.md:28` one-person-one-identity vs dated candidacy/holding). No runtime fetch to a government site.

## Maintenance

Update `profile.ts` (dates, terms, affidavits, citations) and re-run `pnpm build`. Keep language neutral, note variations (e.g., “12th Pass” header vs “B.Sc.” biography), and preserve `lastVerified` ISO date + disclaimer. Verify line-items against ECI affidavit PDFs and House journals/court orders for current status.

Last verified: 30 August 2026 — see `AMIT_SHAH_PROFILE.lastVerified`.
