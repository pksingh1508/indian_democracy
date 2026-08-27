# Om Birla — sourced dossier (`src/om-birla/`)

This folder holds the enriched, citation-linked biography for **Om Birla (ls-4716)** — from birth to present — and the components that render it on `/people/ls-4716`.

## What is here

- `types.ts` — TypeScript contracts for the profile, timeline, offices, salaries, net-worth, work-news, allegations and citations.
- `profile.ts` — single typed constant `OM_BIRLA_PROFILE` with:
  - identity, birth, family, education
  - every office held (student union → BJYM → CONFED → MLA → MP → Speaker ×2)
  - a dated timeline (1979–present) with citation ids
  - social initiatives
  - speakership details (reforms, ex-officio roles, attributed criticisms)
  - `salaries[]` — pay per post (honorary → MLA ₹1.47L pm → MP ₹1.24L + allowances → Speaker Cabinet scale) with legal basis (MP Act 1954/G.S.R.188(E), Rajasthan Act 1956, Officers of Parliament Act 1953, Art.97)
  - `netWorthTimeline[]` — affidavit snapshots 2008 (₹1.19 Cr) → 2024 (₹10.62 Cr, +311%, 0 cases) with movable/immovable/liabilities/income breakdown and `netWorthNotes[]` (valuation effects)
  - `workHighlights[]` — 9 news-making items labelled positive/mixed/critical (paperless, Hindi, productivity, suspensions 100/146, mic/camera, no-confidence)
  - `allegations[]` — 5 records (affidavit cases, partisan-Speaker/no-confidence, Deputy Speaker vacancy 7y, Mahua Moitra context, no financial-corruption FIR found) with allegation → context → response → outcome
  - a `citations` map — every fact links back to a source URL
- `OmBirlaProfile.tsx` — **client** enriched UI built with `paper`/`indelible`/`rule`, `record-card`, `Reveal`/`Stagger`, `SourceNote`. The page itself stays compact: an **At a glance** card + a **6-card grid** (`His All Post Details`, `Net Worth & Assets`, `Work That Made News`, `Allegations & Controversies`, `Complete Timeline`, `Social Work & Constituency`). Each card opens a **modal** (backdrop, Esc to close, body-scroll lock, sticky header) with the full tables/timelines. Quick inline teasers link into the modals so the page never becomes a long scroll.
- `index.ts` — barrel re-export.

## Source policy

- Tier-1: Lok Sabha Secretariat / Digital Sansad (`sansad.in/ls/members`, `sansad.in/ls/about/speaker`) for current roster, constituency, party, Speaker status; Gazette G.S.R.188(E) for MP pay; Rajasthan Act 1956 + India Code for MLA pay; Officers of Parliament Act 1953 + Art.97 for Speaker pay; ECI affidavits (via ADR/Myneta) for net-worth/cases.
- Attributed secondary Tier-4: Wikipedia, The Times of India, The Indian Express, ThePrint, Firstpost, The Economic Times, OneIndia, Business Standard, The Hindu, Times Now, ETV Bharat, India TV, PRS Legislative Research, The Wire, The News Minute, Business Today, Akashvani (AIR) and the subject's official site `ombirla.in`.
- Where reputable sources diverge (e.g., state BJYM dates `1991–1997` vs `1993–1997`; “two daughters” vs “four children”; salary revisions over time), the dossier records the dominant value and notes the alternative — it does not silently smooth over conflicts.
- No private contact, address, phone, email or identifier is published. Birth and affidavit details are public-record biographical facts with citations; for authoritative current status the official roster / ECI affidavit PDF governs.

## How it is rendered

`app/people/[id]/page.tsx:35` imports `OmBirlaProfile` from `@/src/om-birla`.

```ts
import { OmBirlaProfile } from "@/src/om-birla";
...
{id === "ls-4716" && kind === "lok-sabha" ? <OmBirlaProfile /> : null}
```

The page keeps its original roster facts/citation and appends the dossier below a divider. The dossier is **client-side modal-driven**: the page renders only an At-a-glance card + 6 heading-cards + compact teasers; each detailed table/timeline lives inside a modal (`open` state, backdrop, Esc handler, body-scroll lock, sticky header). No runtime fetch to a government site; detail is bundled as typed data and shown on click so the page never becomes a long scroll.

## Maintenance

Update `profile.ts` (dates, terms, citations) and re-run `pnpm build`. Citations must include publisher, title, URL and `accessedOn`. Keep language neutral and date formats consistent (`23 November 1962` in prose, ISO in data).

Last verified: 28 August 2026 — see `OM_BIRLA_PROFILE.lastVerified`.
