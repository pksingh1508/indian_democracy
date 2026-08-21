# Indian Democracy Information Platform: Architecture

Last reviewed: 21 August 2026

## 1. Architecture Goals

The platform is a **fully static website**. There is no backend runtime, no database, no authentication system, and no server-side API. All data lives in versioned dataset files that ship with the frontend and are compiled into the site at build time.

The architecture must optimize for:

- Correct, cited, time-aware public information.
- Zero server operations: hosting is a CDN serving static files.
- Safe handling of provisional or conflicting official information through human review before publication.
- A clear, auditable change trail using Git history and pull-request reviews.
- Fast statically-rendered pages with strong SEO and accessibility.
- One or two maintainers being able to operate the entire system.
- Progressive 3D enhancement without making WebGL a core dependency.

The hardest problem remains what it always was: maintaining trustworthy identities and dated facts across fragmented official sources. The static constraint does not change this problem; it removes infrastructure so effort concentrates on data quality.

## 2. Architectural Style

Use **static-site generation from typed datasets stored in the repository** ("data-as-code").

```text
                 OFFICIAL PUBLIC SOURCES
   Parliament | ECI | Courts | PMO | States | Gazette | OGD
                             |
                             v
              +----------------------------+
              | Manual/offline research    |
              | (maintainer-run local      |
              | helper scripts allowed)    |
              +-------------+--------------+
                            |
                            v
        +---------------------------------------+
        | Versioned datasets in the repository  |
        | TypeScript/JSON + Zod schemas         |
        | changed only through pull requests    |
        +--------------------+------------------+
                             |
                      peer review + merge
                             |
                             v
                 +------------------------+
                 | Build pipeline         |
                 | next build             |
                 | output: 'export'       |
                 | validates, renders,    |
                 | generates search index |
                 +-----------+------------+
                             |
                             v
                  +---------------------+
                  | Static hosting/CDN  |
                  | HTML + JSON + JS    |
                  +---------+-----------+
                            |
                            v
                     browser (public)
```

There is one deployment artifact: the static export produced by `next build`. Nothing runs on a server afterward. A failed validation fails the build; a merged pull request is a publication.

## 3. Trust Boundaries

### Boundary A: External Sources

All downloaded HTML, JSON, CSV, and PDFs from official domains remain untrusted input during research. They may be malformed, stale, or provisional. Helper scripts may parse them locally, but their output never enters the datasets automatically; a human curates every accepted value into a reviewed change.

### Boundary B: Dataset Boundary

Only records that conform to the Zod domain schemas enter `content/data/`. Schema validation runs in tests and again during the build. Records carry their own citations, effective-date intervals, and verification timestamps. Anything that cannot be cited and dated does not belong in the datasets.

### Boundary C: Publication Boundary

A merge to the main branch followed by a successful build and deploy is the single act of publication. Because the whole site rebuilds from validated data, an invalid or uncited fact cannot reach the public site without passing schema checks and review.

### Boundary D: Repository Access

Write access to the repository replaces the old editorial RBAC. Branch protection requires at least one approving review for every change, and two approving reviews for high-impact paths (for example, files defining the President, Prime Minister, Chief Justice, Governors, and Chief Ministers) via a code-owners rule.

### Boundary E: Browser

Everything shipped to the browser is public by definition. Datasets must therefore contain only role-relevant public facts. There are no private artifacts, drafts, editor identities, internal notes, or credentials to leak, because such things are never created.

## 4. System Components

### 4.1 Versioned Datasets

Responsibilities:

- Single source of truth for every fact shown on the site.
- Typed, schema-validated TypeScript modules (or JSON) organized by domain.
- Temporal fields on every factual relationship: `validFrom`, `validTo` (exclusive), date precision, and a typed status where applicable.
- Embedded citations: publisher, title, official URL, retrieval/verification date, and locator.
- Stable IDs; slugs are separate alias records so URLs can change without breaking identity.

### 4.2 Build-Time Validation Pipeline

Responsibilities:

- Parse and validate every dataset against its Zod schema.
- Enforce cross-record integrity: referenced IDs exist, seat totals reconcile, no overlapping intervals for single-holder offices, slugs unique.
- Fail the build on any violation. Broken data must never deploy.
- Emit a build manifest recording the build timestamp and dataset versions used, which pages display as "data updated on".

### 4.3 Next.js Static Application

Responsibilities:

- Statically render every route at build time from the datasets (`output: 'export'`).
- Every dynamic route provides `generateStaticParams()`; there are no runtime-dynamic routes.
- Institution, jurisdiction, office, and person pages with timelines, tables, and citations.
- Metadata, sitemap, robots, canonical URLs, and Open Graph images generated at build time.
- 2D SVG visualizations prerendered as markup.

It performs no network requests to government sites during build or at run time. All inputs come from committed datasets and committed image assets.

### 4.4 Client Enhancements

Client Components, loaded only where interaction requires them:

- Search interface reading a prebuilt, lazy-fetched JSON index.
- Filter controls with browser state.
- Optional Three.js chamber view loaded on explicit user action.

Core discovery (indexes, listings, tables) must remain usable without JavaScript. Search enhancement is progressive, never the only path to any fact.

### 4.5 Static Hosting/CDN

Responsibilities:

- Serve the immutable `out/` export with long-lived caching for hashed assets and revalidate-on-deploy for HTML.
- Provide per-pull-request preview deployments used as the review environment.
- Host-level configuration supplies what Next.js cannot in export mode: root/locale redirects, legacy-slug redirects, and security headers.

## 5. Domain Architecture

### 5.1 Core Entities

```text
Jurisdiction
  -> Institution
      -> Office
          -> OfficeHolding <- Person

Institution
  -> Term
      -> Membership <- Person
          -> Constituency
          -> PartyAffiliation

Election
  -> ElectionContest
      -> Candidacy <- Person
      -> ElectionResult
          -> evidence considered for Membership publication
```

Every fact carries citation references directly on the record.

### 5.2 Why Person, Office, Institution, And Holding Are Separate

- A person can hold multiple offices at once.
- One office persists after its holder changes.
- An institution can be renamed or reorganized without becoming a person-specific record.
- Acting and additional-charge arrangements can overlap.
- Historical queries need the relationship's dates, not a mutable property on the person.

These modeling reasons are independent of storage technology and survive the move to flat files.

### 5.3 Entity Catalog

| Entity | Meaning | Important fields |
| --- | --- | --- |
| `jurisdiction` | India, state, or UT | type, parent, official codes |
| `institution` | Persistent public body | type, jurisdiction, legal basis, predecessor/successor |
| `office` | Role within an institution | category, allowed entry methods, cardinality |
| `person` | Stable human identity | stable ID, display names, aliases |
| `term` | Institutional/electoral period | number/name, start/end and precision |
| `office_holding` | Person occupying an office | dates, status, entry method, citations |
| `holding_event` | Appointment, oath, resignation, death, removal | event date/type/source |
| `membership` | Person's membership in a house/term | constituency, route, dates |
| `party` | Political party/group identity | official names and identifiers |
| `party_affiliation` | Dated person-party relationship | dates, status, citations |
| `constituency` | Electoral area | house type, jurisdiction, code |
| `portfolio_assignment` | Dated minister-to-portfolio relation | ministry/department, rank, dates |
| `election` | A specific election event | type, jurisdiction, dates, source identifiers |
| `election_contest` | Constituency/seat contest within an election | constituency, status |
| `candidacy` | One person's dated participation in a contest | nomination/contest status and events |
| `election_result` | Outcome of an election contest | provisional/final status, votes, margin, declared outcome, evidence |
| `result_event` | Declaration, correction, recount, or supersession | event type/date and source |
| `slug_alias` | URL identity and redirects | entity, locale, slug, active period |

Records are grouped into dataset files by domain (geography, institutions, people, holdings, parties, elections) rather than one file per entity instance, keeping diffs reviewable.

### 5.4 Officeholder Classification

Store both office category and entry method. This avoids inaccurate labels such as calling a judge or civil servant an elected politician.

Office categories:

- `representative`
- `political_executive`
- `constitutional_officeholder`
- `judicial_officeholder`
- `statutory_officeholder`
- `senior_public_official`
- `legislative_presiding_officer`

Entry methods:

- `direct_election`
- `indirect_election`
- `nomination`
- `appointment`
- `ex_officio`
- `unknown`

Candidacy is neither an office category nor a second person entity. One person may have many dated candidacies and many office holdings.

## 6. Temporal Architecture

### 6.1 Two Time Dimensions, Simplified Roles

**Valid time** is when a fact was true in the public institution. It is stored explicitly on every relationship: `valid_from`, `valid_to_exclusive`, and precision values (`day`, `month`, `year`, `unknown`).

**Publication time** is when this platform published that version. In a Git-based system, publication time is the merge/deploy date and is recoverable from history. Pages do not need to store it per record; the build manifest records the release, and Git preserves every prior version.

Example:

- An appointment was effective on 1 August.
- The official source published it on 2 August.
- The maintainer commits the change on 3 August and it deploys the same day.

The first date is stored on the record; the last is the release date; the middle is captured in the citation's retrieval date.

### 6.2 Record Shape

```ts
type OfficeHolding = {
  id: string;
  officeId: string;
  personId: string;
  entryMethod: EntryMethod;
  status: HoldingStatus; // confirmed_current | acting | additional_charge | ended | projected_end | uncertain
  validFrom: PartialDate;
  validTo?: PartialDate; // exclusive
  events: HoldingEvent[];
  citations: Citation[];
};
```

Rules preserved from the relational design:

- Published facts are corrected by adding a new commit that supersedes the old interval, never by silent deletion. History remains in Git.
- Valid intervals are half-open.
- An expected retirement/end date is marked `projected_end` until confirmed.
- Missing `valid_to` does not prove current service; the typed `status` field carries that meaning.
- Holding/service state, entry method, candidacy state, affiliation state, and result state use separate enums. Never overload one generic `status`.

### 6.3 Query Semantics Under Static Rendering

- "Current" views are computed **at build time**: for each office/house, the renderer resolves holders whose interval covers the build date and whose status is current. Pages display "Serving as of [date]" using the record's latest verified date and "Data updated [release date]" from the build manifest.
- Historical views render the full dated timeline of a person, office, or house; the complete history is small enough to prerender as static timelines.
- An interactive "as of" explorer, if added later, filters dated records client-side. This is an enhancement over prerendered timelines, never a replacement.
- Interpret all public dates in `Asia/Kolkata`.

## 7. Provenance Architecture

### 7.1 Citations On Records

Every material fact carries one or more citations stored directly on the record:

- Publisher.
- Document/page title.
- Official URL.
- Source publication/update date when stated.
- Retrieval/verification date (when the maintainer checked it).
- Locator: heading, table row, or PDF page.
- Relationship: supports, contradicts, or supersedes.
- Short excerpt only where reuse is clearly permitted.

Because there is no private object storage, the platform does not mirror official PDFs or archive artifacts. It links out to official URLs. If a source disappears, the citation still names precisely what was seen, where, and when; maintainers may optionally keep sanitized research fixtures out of the public dataset or in a private notes location if licensing demands it.

### 7.2 What Must Not Enter Datasets

Since everything in the datasets ships to every visitor:

- No personal contact details, addresses, signatures, identity numbers, or family information.
- No affidavit personal financial details beyond officially declared summary facts, and then only if legal review approves the field.
- No unpublished observations, editor identities, or internal commentary.

Data minimization here is absolute: the publication boundary is the browser.

### 7.3 Source Ranking

Source authority is contextual. Maintain documented guidance:

- Gazette notification, formal appointment order, declared election result, or signed official record outranks rosters.
- Current roster from the responsible institution outranks member profiles and press releases.
- Reputable secondary reporting is a temporary lead, never the sole source for a current fact.

A Gazette can establish an appointment event while a current institutional roster is better evidence that the person continues to serve. This guidance lives in the methodology pages and in reviewer expectations, enforced by human review.

## 8. Data Update Workflow

This replaces the former ingestion-worker and editorial-app architecture. There is no scheduled crawling and no in-app editorial tooling.

### 8.1 Pipeline

```text
notice change (manual monitoring, alerts from official feeds where offered)
  -> maintainer fetches/reviews source locally
  -> optional local helper script extracts candidate rows
  -> maintainer curates values, dates, identities, citations
  -> edit dataset files on a branch
  -> open pull request (CI validates schemas + reconciliation tests)
  -> review per risk class (one or two approving reviews)
  -> merge -> automatic build + deploy
  -> site reflects new data within minutes
```

### 8.2 Local Helper Scripts

Small, maintained CLI tools under `scripts/` may:

- Fetch a known source URL and extract candidate rows to a scratch format.
- Compare candidate rows with current datasets and print a proposed diff.
- Generate a skeleton dataset edit for manual completion.

Scripts assist curation; they never write directly to `content/data/` on a main branch, and their output is always reviewed as a diff. Parsers include checked-in fixtures and expected-count checks so a redesigned source page fails loudly instead of producing plausible garbage.

### 8.3 Idempotency And Failure Model

- A repeated research pass produces the same dataset state; helpers deduplicate by stable IDs and deterministic keys (source, subject, predicate, value, effective date).
- Source unreachable or parse failure: nothing changes on the site; the existing data remains published with its last-verified date visible. Freshness decays visibly instead of availability collapsing.
- Conflicting sources: both citations are retained on records with an explicit conflict/disputed marker pending resolution in review.
- Bad merge (validation gap discovered post-deploy): fix-forward with a new reviewed commit, or revert; deploys are atomic swaps of the whole export, so rollback is redeploying the previous build.

### 8.4 Update Cadence

Suggested classes, subject to maintainer capacity and source terms:

- Tier 1 national offices (President, VP, PM, CJI): check after known events and monthly regardless.
- Union Council of Ministers: after cabinet changes and weekly during active periods.
- Lok Sabha/Rajya Sabha rosters: weekly, daily during elections/by-elections.
- State/UT heads and ministers: after known changes and monthly.
- Static explainers/legal bases: quarterly or event-triggered.

Cadence is an operational policy, not permission to crawl. Respect robots and terms; prefer official feeds, RSS, and notifications; request API/bulk access where available.

## 9. Editorial Governance

### 9.1 Status Model

The editorial workflow state machine collapses into Git and review states: a change is *proposed* (open PR), *approved* (required reviews passed), or *published* (merged and deployed). Superseded/retracted facts are simply later commits; Git history is the audit log.

Domain status enums remain explicit fields exactly as before:

```text
HoldingStatus:      confirmed_current | acting | additional_charge | ended | projected_end | uncertain
CandidacyStatus:    filed | accepted | rejected | withdrawn | contesting | elected | not_elected
AffiliationStatus:  active | ended
ResultStatus:       provisional | final | corrected | superseded
```

Never combine these dimensions into one field.

### 9.2 High-Risk Changes

Require two approving reviews via code-owner rules on paths covering:

- President, Vice President, Prime Minister, Chief Justice, Governors/LGs, Chief Ministers.
- Current house membership and vacancy changes.
- Identity merges.
- Retroactive date corrections.

Identity merges deserve special care: perform them as a reviewed commit that maps one ID onto another and preserves the old ID as an alias, so merges remain reversible through Git.

### 9.3 Audit

Git history plus pull-request discussions constitute the audit trail: who changed what, when, why, and with whose approval. Public pages need not expose maintainer identity beyond an optional credits/methodology statement.

## 10. Web Rendering Architecture

### 10.1 Static Generation Rules

- Every route is statically exported. Every dynamic segment implements `generateStaticParams()`.
- Server Components run at build time only; they import datasets directly. There are no Route Handlers that read the request, no cookies, no Server Actions, no ISR, no Proxy/Middleware, and no `next.config` redirects/rewrites/headers — all unsupported in export mode.
- Redirects for renamed slugs and locale roots are emitted as hosting-level redirect rules by a build script (for example, `_redirects`/`vercel.json`) derived from `slug_alias` data.
- Images are committed, sized assets served statically (`images.unoptimized` or unoptimized `<img>`); no runtime optimizer exists.
- Mark the smallest possible `"use client"` boundaries; everything below joins the client bundle.

### 10.2 Data Access

Pages import typed dataset accessor functions (`src/lib/data/*`) — pure functions over the in-memory datasets supporting `asOf` filtering. These are plain framework-free modules, unit-testable with Vitest, consumed by Server Components during the build.

### 10.3 Caching Model

- Hashed JS/CSS/image assets: immutable, long max-age.
- HTML: cached until the next deploy; the host purges/revalidates on deployment. Publication-driven tag invalidation is unnecessary because the entire site rebuilds atomically per release.
- The search index JSON is fingerprinted and fetched lazily by the client with normal HTTP caching.

Freshness is therefore bounded by update cadence, not cache complexity. Every page shows its data-updated date so staleness is honest.

### 10.4 Route Model

```text
/{locale}
/{locale}/institutions
/{locale}/institutions/{slug}
/{locale}/jurisdictions
/{locale}/jurisdictions/{slug}
/{locale}/offices/{slug}
/{locale}/people
/{locale}/people/{slug}
/{locale}/parliament/{house}
/{locale}/parliament/{house}/seating
/{locale}/search
/{locale}/learn/{slug}
/{locale}/methodology
/{locale}/corrections
```

No `/admin`, no `/api/internal`. Locale negotiation happens via a static root page with explicit language links (Proxy is unavailable); crawlers land on real content, not redirect chains. `sitemap.ts` and `robots.ts` generate as static files at build time.

## 11. Search Architecture

- At build time, a script generates a compact search index (names, aliases, entity types, jurisdictions, parties, current/historical flags) as one or more fingerprinted JSON chunks under `public/`.
- The search page is a Client Component that lazy-fetches the index on first focus/use and filters/ranks client-side (a small library such as MiniSearch/FlexSearch, or a hand-rolled scorer initially).
- Results label entity type and relationship status so a candidacy is never mistaken for an office holding.
- Without JavaScript, users rely on prerendered discovery surfaces: people A–Z index, jurisdiction listings, institution indexes. These are release-blocking pages, not fallback niceties.
- If the corpus grows beyond what a lazy JSON index handles well (not expected within MVP scale), revisit with measured evidence; do not add a search service preemptively.

## 12. 3D Architecture

### 12.1 Data/View Separation

The canonical composition is not a Three.js scene. It is a versioned dataset that drives table, 2D, 3D, and tests.

```text
CompositionSnapshot
  + ChamberLayout
      -> LayoutSeat[]
          -> SeatAssignment[]
```

Layouts are generated deterministically (arcs, rows, sectors, aisle gaps) and reviewed as data diffs.

### 12.2 Layout Semantics

- `conceptual`: generated composition with no physical-seat claim.
- `approximate`: based partly on a published chamber plan but incomplete assignments.
- `official`: supported by an official layout and assignment source for the effective period.

The classification and methodology are visible to users.

### 12.3 Rendering Strategy

- Prerender text/table and 2D SVG first.
- Dynamically import Three.js only on explicit user action.
- Render seats with `InstancedMesh`; cap device pixel ratio.
- Keep labels, legend, filters, and selection details in DOM.
- Preserve filter/selection in URL query params (readable client-side without a server).
- Pause when hidden/offscreen; dispose resources on unmount; fall back to 2D on WebGL failure.
- Synchronize selection with the adjacent accessible DOM list rather than canvas-only interaction.

## 13. Security Architecture

The static model removes most of the classical attack surface: no database to inject, no sessions to steal, no admin panel to breach, no server to overload.

Remaining responsibilities:

### 13.1 Repository Security

- Branch protection on main: required reviews, required status checks (lint, typecheck, tests, build).
- Code-owner rules enforcing dual review on high-impact data paths.
- Signed commits encouraged; collaborator list kept minimal.
- Dependabot/renovate updates with prompt merging for security releases.

### 13.2 Supply Chain

- Lockfile-frozen installs in CI.
- Dependency additions require justification; prefer zero-dependency implementations for parsing helpers.
- Build runs in CI from clean checkouts; local builds are not deployed directly.

### 13.3 Delivery Headers

Configured at the hosting layer (unavailable in `next.config` under export mode):

- Strict security headers: HSTS (if HTTPS-only host), nosniff, referrer policy, permissions policy, frame restrictions.
- Content-Security-Policy rolled out report-only, then enforced, accounting for inline hydration payloads and 3D asset needs.

### 13.4 Client-Side Considerations

- No secrets exist to leak: verify no environment variable carries anything sensitive; the only build env is the public site URL.
- Third-party scripts (analytics, form embeds) are minimized, subresource-integrity-hashed where possible, and disclosed in the privacy notice.
- Form endpoints (if a hosted form service is used for corrections) are rate-limited and abuse-monitored by that provider; never roll custom submission infrastructure.

## 14. Privacy And Rights Architecture

- Only role-relevant public facts exist anywhere in the repository. There is no "hidden" tier to protect because nothing sensitive is collected.
- Portraits and illustrations require a recorded rights basis, attribution, and allowed transformations in an image manifest before inclusion.
- Analytics, if any, must be aggregate/cookieless; the default is no analytics until a measured need appears.
- Correction correspondence retains minimum personal data: correspondents' emails are kept only as long as needed to resolve the correction and are never published without consent.
- Legal review precedes adding any new personal field, since every field ships worldwide.

## 15. Availability And Durability

- The public site is a set of static files on a CDN: availability equals the host's SLA (typically ≥99.9%), with no database or origin server to fail.
- Source outages reduce freshness, never availability. Pages keep showing last-verified dates honestly.
- Durability comes from redundancy of the repository: the Git host plus periodic mirrors (for example, a secondary remote or scheduled bundle archive). Losing the host loses issues/PR discussions, so scheduled archives of datasets alone are insufficient for history; mirror the repository itself.
- Restore drill: clone from mirror, `pnpm install && pnpm build`, deploy — verify the rebuilt site matches the last known good release.
- Any previous release is redeployable instantly from Git tags; hosting keeps prior deployments available for instant rollback.

Initial targets:

- RPO: 24 hours for repository mirrors (daily), effectively near-zero for published data since every change is a commit.
- RTO: under 1 hour (redeploy from any clone or host snapshot).
- Public availability: 99.9% monthly via static hosting.

## 16. Observability Architecture

Keep this deliberately light:

- CI status as the primary data-quality gate: schema validation, reconciliation totals, link-checker results.
- Hosting analytics (aggregate, cookieless) for traffic; search zero-result queries logged client-side in aggregate only if analytics supports it.
- Optional lightweight client error monitoring, disclosed in the privacy notice.
- A periodic manual "freshness sweep" checklist per source tier tracked in the repository (last-checked dates are already visible on pages).

Data-quality telemetry formerly collected at runtime (uncited facts, stale sources, queue age) moves to build-time assertions: a test fails the build if any current holding lacks a citation or exceeds its source-tier freshness threshold relative to the build date.

## 17. Deployment Topology

Recommended initial deployment:

```text
GitHub (repository: code + datasets)
   |
   +-- GitHub Actions CI (lint, typecheck, validate data, test, build)
   |
   +-- Static host with Git integration
         |-- per-PR preview deployments (review environment)
         +-- production deploy on merge to main (atomic swap of out/)
```

Suitable hosts: Vercel, Netlify, Cloudflare Pages, GitHub Pages (with Actions), or any CDN/static bucket. Choose based on preview-deploy quality, redirect-rule flexibility, headers support, and bandwidth cost.

Alternatives:

- Self-hosting the `out/` directory behind Nginx/object storage is possible but forfeits turnkey previews and rollback ergonomics.
- A tiny serverless function layer (for example, for corrections intake) can be bolted on later without changing the site's static nature; treat it as a separate, optional component.

## 18. Architectural Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Application shape | Static export, no server runtime | Minimal operations, maximal availability, adequate for read-only reference data |
| Source access | Manual research + curated commits | Reliability, legality, and review without crawling infrastructure |
| Data model | Typed datasets with temporal revision fields in files | Correct histories without a database; Git provides versioning and audit |
| Evidence model | Citations embedded on records, links out to sources | No artifact mirroring; provenance preserved with minimal rights risk |
| Publication | Reviewed pull request merge + build | Human-approved changes; CI blocks invalid data |
| Audit trail | Git history + PR review records | Free, tamper-evident within platform guarantees, sufficient for a small team |
| Search | Prebuilt client-side index | No server; corpus is small; no-JS discovery pages remain authoritative |
| API | None initially; datasets are the contract | Anyone can consume the same typed data; bulk JSON export can be added as static files later |
| 3D | Direct Three.js, opt-in, lazy-loaded | Bundle control; identical to serverful plan |
| Editorial tooling | Git + code owners + CI checks | Generic CMS poorly models temporal facts/evidence; bespoke UI unjustified at this scale |
| Corrections intake | External channel (email/form service/link) | No server of our own; revisit if volume justifies it |
| Hosting | Static CDN with PR previews | Instant rollbacks, preview-per-change aligns review with publication |

## 19. Deferred Complexity

Do not add these until a measured requirement exists:

- Any server runtime component (including serverless APIs).
- Authentication or user accounts of any kind.
- A headless CMS or database.
- Scheduled crawling workers.
- Elasticsearch/Typesense/Meilisearch.
- GraphQL or a public REST API surface (static JSON exports suffice first).
- Kubernetes, containers, queues, event brokers.
- Universal AI extraction without source-specific validation.
- Public comments or crowdsourced edits.
- Exact digital twins of chambers.

## 20. Architecture Fitness Tests

The architecture remains valid only if these tests continue to pass:

- An invalid or uncited fact cannot reach the public site (schema + CI gates block it).
- A historical query returns the correct holder for a past date from committed data.
- The system can reconstruct what it published at any earlier time via Git tags/history.
- A source outage leaves public pages available with visible last-verified dates.
- Table, 2D, and 3D seat totals always reconcile from the same dataset.
- Core content, including a path to every person and office, remains usable without JavaScript/WebGL.
- Everything shipped to the browser is safe to be public.
- A maintainer can go from "official source says X changed" to "live on the site" in under an hour without touching infrastructure.
