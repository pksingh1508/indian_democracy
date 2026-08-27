# Om Birla — sourced dossier (`src/om-birla/`)

This folder holds the enriched, citation-linked biography for **Om Birla (ls-4716)** — from birth to present — and the components that render it on `/people/ls-4716`.

## What is here

- `types.ts` — TypeScript contracts for the profile, timeline, offices and citations.
- `profile.ts` — single typed constant `OM_BIRLA_PROFILE` with:
  - identity, birth, family, education
  - every office held (student union → BJYM → CONFED → MLA → MP → Speaker ×2)
  - a dated timeline (1979–present) with citation ids
  - social initiatives
  - speakership details (reforms, ex-officio roles, attributed criticisms)
  - a `citations` map — every fact links back to a source URL
- `OmBirlaProfile.tsx` — the enriched UI (server component) used on the person page. Built with the site's tokens (`paper`/`indelible`/`rule`), `record-card`, `Reveal`/`Stagger`, and `SourceNote`.
- `index.ts` — barrel re-export.

## Source policy

- Tier-1: Lok Sabha Secretariat / Digital Sansad (`sansad.in/ls/members`, `sansad.in/ls/about/speaker`) for current roster, constituency, party, Speaker status.
- Attributed secondary Tier-4: Wikipedia, The Times of India, The Indian Express, ThePrint, Firstpost, The Economic Times, OneIndia, PRS Legislative Research, and the subject's official site `ombirla.in`.
- Where reputable sources diverge (e.g., state BJYM dates `1991–1997` vs `1993–1997`; “two daughters” vs “four children”), the dossier records the dominant value and notes the alternative — it does not silently smooth over conflicts.
- No private contact, address, phone, email or identifier is published. Birth details are included as public-record biographical facts with citations; for authoritative current status the official roster governs.

## How it is rendered

`app/people/[id]/page.tsx:35` imports `OmBirlaProfile` from `@/src/om-birla`.

```ts
import { OmBirlaProfile } from "@/src/om-birla";
...
{id === "ls-4716" && kind === "lok-sabha" ? <OmBirlaProfile /> : null}
```

The page keeps its original roster facts/citation and appends the dossier below a divider. The dossier is statically generated — no runtime fetch to a government site.

## Maintenance

Update `profile.ts` (dates, terms, citations) and re-run `pnpm build`. Citations must include publisher, title, URL and `accessedOn`. Keep language neutral and date formats consistent (`23 November 1962` in prose, ISO in data).

Last verified: 28 August 2026 — see `OM_BIRLA_PROFILE.lastVerified`.
