# Indian Democracy Information Platform: Implementation Guide

Last reviewed: 21 August 2026

This guide converts `planning.md` and `architecture.md` into an ordered delivery plan for the existing Next.js 16.3.1, React 19.2, TypeScript, Tailwind CSS 4, and pnpm project.

**Architecture note:** This project does not use a database. All published facts live in dated, source-linked JSON files under `app/data/`, refreshed by `scripts/collect-national-data.mjs`. Public pages read those files at build time through typed server-only data modules. There is no ingestion worker, editorial review queue, or authentication layer in this build; recollection happens by re-running the collection scripts and reviewing the diff in version control.

## 1. Implementation Rules

- Read the installed documentation under `node_modules/next/dist/docs/` before using a Next.js API because this project uses Next.js 16 with breaking changes.
- Use App Router and Server Components by default.
- Add Client Components only around browser interaction such as search input focus, filters, and 3D rendering.
- Public requests read the local JSON datasets. They never scrape a government website.
- Keep route files thin. Put dataset access in server-only modules, domain rules (aggregation, reconciliation, geometry) in `src/lib`.
- Validate dataset shapes with TypeScript types at the module boundary; the collector script is the only writer of `app/data`.
- Add a dependency only when the phase that needs it starts; verify current compatibility first.

## 2. Technology Choices

| Concern | Choice | Reason |
| --- | --- | --- |
| Web application | Existing Next.js 16 App Router | Server rendering, metadata, static generation, cache invalidation |
| Language | TypeScript strict mode | Shared domain contracts over the JSON datasets |
| Styling | Existing Tailwind CSS 4 plus CSS custom properties | Fast accessible UI implementation |
| Data store | Dated JSON files in `app/data/` | Versioned, reviewable, no infrastructure; snapshot date and sources travel with each file |
| Search | Server-rendered substring/token index built from the datasets | Sufficient for the current corpus; works without JavaScript |
| 3D | Direct Three.js, dynamically imported on user action | Small isolated client boundary and controlled lifecycle |
| Tests | Vitest for domain/aggregation/geometry tests | Fast TypeScript tests over the datasets |

## 3. Target Repository Layout

```text
app/
  layout.tsx
  page.tsx
  institutions/
    page.tsx
    [slug]/page.tsx
  parliament/
    page.tsx
    lok-sabha/page.tsx
    rajya-sabha/page.tsx
  states/
    page.tsx
    [slug]/page.tsx
  people/
    page.tsx
    [id]/page.tsx
  high-courts/
    page.tsx
    [slug]/page.tsx
  search/page.tsx
  methodology/page.tsx
  sources/page.tsx
  coverage/page.tsx
  corrections/page.tsx
  data/                  # dated public-record datasets (JSON) + README
  sitemap.ts
  robots.ts
src/
  components/            # shared UI (badges, citations, tables, chamber views)
  lib/
    site.ts              # site constants (name, snapshot date)
    format.ts            # date/name formatting helpers
    parties.ts           # party metadata and colors
    chamber.ts           # deterministic hemicycle seat geometry
    search-index.ts      # server-side search index over the datasets
    data/                # server-only loaders: geography, parliament, executive, judiciary, sources
```

## 4. Quality Commands

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

Run lint and a production build before every merge. When tests are introduced, add `"test": "vitest run"`.

## 5. Static Data Layer

### Step 5.1: Dataset Contracts

Each JSON file carries its own provenance (`schemaVersion`, `dataset`, `snapshotDate`, `retrievedAt`, `source`). Typed loader modules under `src/lib/data/` import the JSON directly and export narrow DTOs plus aggregations:

- `geography`: 36 states/UTs (LGD codes) and 784 districts grouped by state code.
- `parliament`: Lok Sabha sitting members + official vacancies (543-seat house), Rajya Sabha sitting members + vacancy (245-seat house).
- `executive`: constitutional officeholders (President, Vice-President, Prime Minister) and the Union Council of Ministers with portfolios.
- `judiciary`: Supreme Court judges, High Court jurisdictions, dated DOJ judge baseline, roster source index.
- `sources`: source registry entries and machine-readable coverage/gaps.

### Step 5.2: Derived Aggregations

Composition totals are computed from member records, never hand-maintained:

- Party/group counts per house with mutually exclusive buckets: assigned seats + named vacancies = sanctioned house size. The table, 2D view, and 3D view must render the same computed snapshot; this is a release-blocking check.
- State-wise representation lists for jurisdiction pages (normalize state-name variants such as "Jammu & Kashmir" vs "Jammu And Kashmir" and leading "The").
- Ministerial rosters grouped by category (Prime Minister, Cabinet, MoS Independent Charge, MoS).

### Step 5.3: Coverage Honesty

Every page section renders its dataset citation (publisher, title, URL, retrieval/snapshot date, authority tier). Partial or absent coverage displays explicit status labels ("dated baseline, not current", "not yet collected") drawn from `coverage.json`; the UI never silently fills gaps.

### Step 5.4: Caching Model

All dataset reads happen at build time via static generation; no request-time fetching exists. Pages that accept `searchParams` (member tables, search) render dynamically but still read only local files.

## 6. Public Frontend

### Step 6.1: Design Foundations

Create:

- Accessible color tokens that do not depend on party colors.
- Type scale and spacing tokens.
- Shared header, navigation, footer, breadcrumbs, citation list, source badge, freshness badge, empty state, error state, and timeline.
- Independent-project disclaimer in the footer and methodology pages.

Do not make the visual identity resemble an official government portal. Do not use the State Emblem of India as the product logo.

### Step 6.2: Page Order

Implement in this order:

1. Methodology, sources, disclaimer, privacy, and corrections.
2. Institution detail.
3. Jurisdiction detail.
4. Person detail.
5. Home and index pages.
6. Search.
7. Parliament composition (table → 2D → optional 3D).

Building detail pages first proves the data contracts before creating broad navigation.

### Step 6.3: Metadata And SEO

Use Server Component metadata APIs:

- Static `metadata` for fixed policy pages.
- `generateMetadata` for institution, jurisdiction, and person pages.
- Canonical URLs and locale alternates when locales arrive.
- `sitemap.ts` with `lastModified` from the dataset snapshot date.
- `robots.ts`.
- JSON-LD only where semantically valid: `Person`, `GovernmentOrganization`, `WebPage`, `BreadcrumbList`.

The visible HTML remains the primary source of citations and context.

### Step 6.4: Error And Missing Data States

- A missing optional fact displays "Not published in the current coverage" rather than "None".
- A stale or baseline-only source displays a warning and its as-of date.
- Unknown slugs use `notFound()`; route-level `error.tsx` avoids exposing internals.

## 7. Chamber Visualization

### Step 7.1: Deterministic Geometry

Generate seat coordinates deterministically from arcs, rows, and aisle gaps in `src/lib/chamber.ts`. The same block ordering feeds the table, the SVG view, and the 3D view. Layout is labeled conceptual ("chamber-style composition view"); it must not claim physical seating.

### Step 7.2: Progressive Experience

1. Server-rendered composition summary with explicit arithmetic (assigned + vacant = total).
2. Accessible party table with totals and vacancies.
3. 2D SVG hemicycle (server component).
4. Optional "Explore in 3D" button that dynamically imports the Three.js client boundary.

The 3D view must load only after user action, support pointer/touch selection with a synchronized DOM panel, pause when hidden, offer a reset-camera button, dispose resources on unmount, and fall back immediately if WebGL fails or is unavailable.

## 8. Security And Privacy Implementation

- No personal contact details, addresses, phone numbers, email addresses, or identity numbers anywhere in the UI. The datasets already exclude them; keep it that way.
- Do not display dates of birth even where an official roster publishes them; role-relevant term dates only.
- Security headers via platform config; no third-party scripts or trackers.
- Correction intake is a mailto/process description until a form backend exists; never publish reporter details.

## 9. Testing Plan

### Domain Unit Tests

- Party/vacancy reconciliation equals sanctioned house size for both chambers.
- State-name normalization across datasets.
- Hemicycle geometry: seat count conservation, deterministic coordinates, no overlaps beyond tolerance.
- Date formatting for partial and dd-mm-yyyy source formats.

### Frontend Checks

- Home to institution/person navigation.
- Search and filters work as normal GET URLs with JavaScript disabled.
- Chamber totals match the party table exactly.
- Mobile navigation and keyboard-only flows.

## 10. Deployment Plan

- Build statically (`next build`) and deploy the output to any Node host or static-capable platform.
- Re-deploys are the publication mechanism: refreshing data means re-running the collector scripts, reviewing the diff, and shipping a new build.
- Keep `app/data` snapshots dated; never edit collected records by hand inside the JSON without noting it in the dataset README.

## 11. Observability

Start with platform-level request logs and error monitoring. Track:

- Build success and dataset validation failures.
- Search zero-result rate (from access logs once available).
- 3D initialization and WebGL context failures without invasive tracking.

Never log tokens, private correction text, or unnecessary user/IP combinations.

## 12. Phase Checklists

### Public Alpha Checklist

- Core pages and search implemented.
- All 36 jurisdiction shells present with coverage labels.
- Citations and freshness shown everywhere.
- Sitemap, metadata, robots, redirects, and disclaimer complete.
- Corrections process described and reachable.
- No critical accessibility or security findings.

### MVP Completion: Parliament/3D Checklist

- House totals and vacancies validated against `coverage.json`.
- Layout labeled conceptual/approximate/official.
- Table and 2D complete before 3D.
- 3D loads on demand and cleans up resources.
- Reduced-motion, no-WebGL, and mobile fallbacks tested.

### Expansion Checklist For Each New Collection (state legislatures, MLAs/MLCs)

- Official house source identified and terms reviewed.
- Collector script extended with fixtures and failure checks.
- Coverage matrix updated; partial collections keep visible status labels.
- Member count, vacancies, and term reconcile before publication.

## 13. Anti-Patterns To Avoid

- Scraping official sites inside a Server Component; recollection is an offline script step.
- Hand-editing aggregated numbers instead of computing them from member records.
- Treating a dated DOJ baseline PDF as a current sitting roster.
- Merging person records across datasets by name similarity; one record per office identity, clearly labeled.
- Copying portraits without a rights record.
- Making the whole application a Client Component.
- Shipping Three.js in the initial home-page bundle.
- Displaying a source URL without retrieval time and publisher.
- Claiming comprehensive employee coverage or implying official status.
