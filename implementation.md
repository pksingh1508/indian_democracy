# Indian Democracy Information Platform: Implementation Guide

Last reviewed: 18 August 2026

This guide converts `planning.md` and `architecture.md` into an ordered delivery plan for the existing Next.js 16.3.1, React 19.2, TypeScript, Tailwind CSS 4, and pnpm project.

## 1. Implementation Rules

- Read the installed documentation under `node_modules/next/dist/docs/` before using a Next.js API because this project uses Next.js 16 with breaking changes.
- Use App Router and Server Components by default.
- Add Client Components only around browser interaction such as search suggestions, filters, and 3D rendering.
- Public requests read approved local data. They never scrape a government website.
- Ingestion never publishes directly. It creates evidence and proposed observations for review.
- Keep the first system a modular monolith plus one worker process.
- Use runtime validation at every untrusted boundary.
- Make schema migrations forward-only and reviewed.
- Add a dependency only when the phase that needs it starts; verify current compatibility first.

## 2. Proposed Technology Choices

| Concern | Initial choice | Reason |
| --- | --- | --- |
| Web application | Existing Next.js 16 App Router | Server rendering, metadata, route handlers, cache invalidation |
| Language | TypeScript strict mode | Shared domain contracts and safer ingestion |
| Styling | Existing Tailwind CSS 4 plus CSS custom properties | Fast accessible UI implementation |
| Database | Managed PostgreSQL | Relational, temporal, search, constraints, and transactions |
| Database layer | Drizzle ORM plus SQL migrations | Typed queries while retaining PostgreSQL features |
| Runtime schemas | Zod or equivalent | Validate imports, APIs, forms, and parser output |
| Authentication | Supabase Auth or Auth.js with invite-only access | Editorial users only; no public accounts |
| Object storage | Private S3-compatible/Supabase Storage bucket | Immutable source artifacts and images |
| Background jobs | PostgreSQL-backed queue such as `pg-boss` | No separate Redis/Kafka for MVP |
| Worker | Node.js Docker process | Scheduled fetch, PDF tools, OCR, validation |
| Search | PostgreSQL full-text plus `pg_trgm` | Sufficient for initial corpus |
| 3D | Direct Three.js, dynamically imported | Small isolated client boundary and controlled lifecycle |
| Unit tests | Vitest | Fast TypeScript/domain/parser tests |
| Browser tests | Playwright plus axe integration | User flows and accessibility |
| Observability | OpenTelemetry and Sentry/OTLP backend | Web, job, source, and release diagnostics |

Provider names are recommendations, not hard requirements. Confirm budget, data location, backup, and export needs before provisioning.

## 3. Target Repository Layout

```text
app/
  [locale]/
    (public)/
      page.tsx
      institutions/
      jurisdictions/
      offices/
      people/
      parliament/
      search/
      learn/
      methodology/
      corrections/
    layout.tsx
  admin/
    layout.tsx
    sources/
    observations/
    publications/
  api/
    v1/
    internal/
  robots.ts
  sitemap.ts
  opengraph-image.tsx
src/
  components/
    public/
    editorial/
    visualization/
  db/
    schema/
    migrations/
    client.ts
  domain/
    institutions/
    people/
    holdings/
    elections/
    citations/
  dal/
  editorial/
  search/
  i18n/
  security/
  validation/
  observability/
worker/
  jobs/
  sources/
  parsers/
  extractors/
  fixtures/
  validation/
content/
  dictionaries/
  seed/
tests/
  integration/
  e2e/
```

Keep route files thin. Put database access in `server-only` DAL modules, domain rules in `src/domain`, and source-specific code in `worker/sources`.

## 4. Environment And Tooling Setup

### Step 4.1: Establish Quality Commands

Keep existing commands and add, as dependencies are introduced:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "worker": "tsx worker/index.ts"
  }
}
```

Do not blindly add these scripts before their tools exist.

### Step 4.2: Environment Contract

Create a validated server-side environment module. Expected variables:

- `DATABASE_URL`
- `DATABASE_DIRECT_URL` for migrations if the provider requires it
- `AUTH_SECRET` and provider-specific keys
- `STORAGE_ENDPOINT`, `STORAGE_BUCKET`, and storage credentials
- `INTERNAL_WEBHOOK_SECRET`
- `SENTRY_DSN` or OTLP endpoint
- `APP_BASE_URL`

Rules:

- Put local secrets in `.env.local` and never commit them.
- No secret uses the `NEXT_PUBLIC_` prefix.
- Fail startup with a clear message when required values are missing.
- Use different credentials and databases for local, preview, and production.

### Step 4.3: CI Baseline

Run on every pull request:

1. Lockfile-frozen `pnpm install`.
2. Lint.
3. Typecheck.
4. Unit and parser fixture tests.
5. Migration validation against an ephemeral PostgreSQL database.
6. Next.js production build.
7. Playwright smoke test on a preview build when practical.

## 5. Database Implementation

### Step 5.1: Core Identity Tables

Create these first:

- `jurisdiction`
- `jurisdiction_name`
- `institution`
- `institution_name`
- `institution_relation`
- `office`
- `office_name`
- `person`
- `person_name`
- `party`
- `party_name`
- `constituency`
- `term`
- `election`
- `election_contest`
- `candidacy_revision`
- `candidacy_event`
- `election_result_revision`
- `result_event`
- `slug_alias`

Use UUID primary keys. Keep official codes in unique nullable columns or a separate external-identifier table. A URL slug is mutable and must not be the identity key.

### Step 5.2: Temporal Fact Tables

Implement:

- `office_holding_revision`
- `holding_event`
- `membership_revision`
- `party_affiliation_revision`
- `portfolio_assignment_revision`

`candidacy_revision` links one stable `person` to one `election_contest`; it never creates a separate candidate identity. It records nomination/contest status independently from membership or office holding. `election_result_revision` stores provisional/final status, votes, margin, declared outcome, source type, and evidence; a `result_event` records declaration/correction events. A result is evidence considered when publishing membership, not an automatic membership mutation.

Common fields:

```text
id
logical_id
revision_number
valid_from
valid_to_exclusive
start_precision
end_precision
recorded_from
recorded_to
publication_status
created_by
created_at
```

Rules:

- Legal dates use PostgreSQL `DATE`.
- Audit/fetch/publication times use UTC `TIMESTAMPTZ`.
- Intervals are half-open: `[valid_from, valid_to_exclusive)`.
- Unknown or partial dates retain `day`, `month`, `year`, or `unknown` precision.
- "Current" is a query over approved intervals and the relationship's typed status, not a stored Boolean.
- Acting, additional-charge, nominated, and elected status are explicit fields.
- Define separate database enums for editorial workflow, publication lifecycle, holding/service state, entry method, and candidacy state. Never overload one generic status field.
- Add typed status only where applicable, such as `holding_status`, `candidacy_status`, `affiliation_status`, or `result_status`. Editorial workflow belongs to observations/review tasks, not every fact revision.
- Use database constraints to prevent impossible overlap only for offices configured as single-holder.

### Step 5.3: Evidence And Workflow Tables

Implement:

- `source`
- `source_endpoint`
- `source_policy`
- `fetch_run`
- `source_artifact`
- `extraction`
- `observation`
- `evidence_link`
- `review_task`
- `publication`
- `publication_item`
- `audit_event`
- `identity_resolution`

Retained artifacts should record SHA-256, media type, byte count, retrieval timestamp, final URL, HTTP metadata, and private object key. The object key and artifact checksum are nullable when policy permits metadata-only evidence or a reviewed manual citation. Evidence links always reference source/fetch metadata and record page/table/heading/selector locators when applicable.

### Step 5.4: Visualization Tables

Implement only when Phase 2 starts:

- `chamber_layout`
- `layout_seat`
- `seat_assignment_revision`
- `composition_snapshot`

A layout records whether it is `conceptual`, `approximate`, or `official`. Coordinates and assignments are versioned independently.

### Step 5.5: Search Projection

Create a denormalized `search_document` table with:

- Entity type and entity ID.
- Locale.
- Official name and aliases.
- Search text.
- Jurisdiction and institution IDs.
- Current/historical flags.
- Weighted `tsvector`.

Enable `pg_trgm` and add indexes for exact names, full text, and trigram similarity. Fuzzy matches may rank results but must never perform automatic identity merges.

## 6. Seed Data

### Step 6.1: Stable Geography

Seed:

- India.
- 28 states.
- 8 Union Territories.
- Official abbreviations/codes from an authoritative source.
- Parent-child jurisdiction relationships.

Review changes through migrations or a versioned seed import, not ad hoc production edits.

### Step 6.2: Core Institutions And Offices

Seed persistent institutions and offices without putting current people in seed files. Examples:

- Parliament of India, Lok Sabha, Rajya Sabha.
- Union executive, President, Vice President, Prime Minister, Council of Ministers.
- Supreme Court, Election Commission, CAG, UPSC.
- State/UT government and legislature institution shells.

### Step 6.3: Manual Golden Dataset

Before automation, create a small, manually reviewed dataset that exercises:

- A single-holder office.
- A multi-member institution.
- A person with simultaneous offices.
- A completed historical term.
- An acting/additional-charge term.
- A directly elected member.
- An indirectly elected or nominated member.
- A source conflict.

Use this dataset for page development and domain tests.

Before loading it outside local development, implement the Phase 0 minimal reviewed import and atomic publication transaction described in `planning.md`. Do not seed published production facts through direct SQL.

## 7. Data Access Layer

### Step 7.1: Server-Only Boundary

Every DAL module starts with:

```ts
import "server-only";
```

The DAL returns narrow DTOs, not raw database records. It enforces publication status and prevents drafts, editor identity, private artifact paths, and internal confidence scores from reaching public components.

### Step 7.2: Required Queries

Implement and unit-test:

- `getInstitutionBySlug(locale, slug, asOf)`
- `getJurisdictionBySlug(locale, slug, asOf)`
- `getPersonBySlug(locale, slug, asOf)`
- `getOfficeHolders(officeId, asOf)`
- `getMemberships(houseId, termId, asOf)`
- `getComposition(houseId, termId, asOf)`
- `searchPublishedEntities(locale, query, filters, cursor)`
- `getCitationsForRecords(recordIds)`

Interpret public `asOf` dates in `Asia/Kolkata`, then query date intervals consistently.

### Step 7.3: Next.js Cache Model

Based on the installed Next.js 16 documentation:

- Enable `cacheComponents` when the team is ready to follow its explicit caching/Suspense model.
- Put `"use cache"` in published-data query helpers, not arbitrary route-handler bodies.
- Pair every cache scope with `cacheLife`.
- Add `cacheTag` values such as `person:{id}`, `institution:{id}`, `jurisdiction:{id}`, and `publication`.
- Use `revalidateTag(tag, { expire: 0 })` from the signed publication webhook for high-impact current-holder changes that require the next request to block for fresh data.
- Use `revalidateTag(tag, "max")` only for low-risk content where serving one stale response and lazy background refresh is explicitly acceptable.
- Use `updateTag` only for editor read-your-own-write flows in Server Actions.
- Prefer precise tag invalidation over broad `revalidatePath`.
- Decide and configure a durable remote cache handler for request-time `"use cache"` entries if deployment depends on cross-instance persistence. Otherwise treat the platform/CDN prerender cache as the main public cache and do not promise persistence for ephemeral serverless entries.
- Keep admin preview queries uncached.

Use React `cache` only for request-scoped deduplication, such as sharing one lookup between `generateMetadata` and a page. It is not a cross-request data cache.

## 8. Public Frontend

### Step 8.1: Design Foundations

Create:

- Accessible color tokens that do not depend on party colors.
- Type scale and spacing tokens.
- Shared header, navigation, footer, breadcrumbs, citation list, source badge, freshness badge, empty state, error state, and timeline.
- Independent-project disclaimer in the footer and methodology pages.

Do not make the visual identity resemble an official government portal. Do not use the State Emblem of India as the product logo.

### Step 8.2: Locale Routing

Use `/{locale}` routes from the start, initially supporting `en`. In Next.js 16, request interception uses `proxy.ts`, not the old Middleware filename.

- Keep one root-level `proxy.ts` only if locale negotiation is needed.
- Do not perform slow data fetching in Proxy.
- Prefer an explicit language selector.
- Do not force search crawlers through locale redirects.
- Store dictionaries separately from localized database content.

### Step 8.3: Page Order

Implement in this order:

1. Methodology, sources, disclaimer, privacy, and corrections.
2. Institution detail.
3. Jurisdiction detail.
4. Person detail.
5. Home and index pages.
6. Search.
7. Parliament composition.
8. 3D visualization.

Building detail pages first proves the domain model before creating broad navigation.

### Step 8.4: Metadata And SEO

Use Server Component metadata APIs:

- Static `metadata` for fixed policy pages.
- `generateMetadata` for institution, jurisdiction, and person pages.
- Canonical and locale alternates.
- `sitemap.ts` with `lastModified` from publication time.
- `robots.ts` that blocks admin, preview, and internal routes.
- Deterministic Open Graph images for key entities.
- JSON-LD only where semantically valid: `Person`, `GovernmentOrganization`, `WebPage`, `BreadcrumbList`, and later `Dataset`.

The visible HTML, not JSON-LD, remains the primary source of citations and context.

### Step 8.5: Error And Missing Data States

- A missing optional fact displays "Not published in the current coverage" rather than "None."
- A stale source displays a warning and last successful check.
- A disputed fact displays a neutral status and source links.
- A failed query uses route-level `error.tsx` without exposing internal details.
- Unknown slugs use `notFound()` and preserve old slugs through `slug_alias` redirects.

## 9. Editorial Application

Phase 0 must already provide a minimal audited review and publication transaction. This section expands that foundation into the complete compare/review interface; it must not introduce the first safe publication path.

### Step 9.1: Authentication And Roles

Implement invite-only roles:

| Role | Allowed work |
| --- | --- |
| Researcher | Manage source leads, run imports, map observations |
| Editor | Correct mappings, edit drafts, approve routine changes |
| Publisher | Publish high-impact changes and rollback by new revision |
| Administrator | Users, role policies, source configuration, emergency actions |

Require MFA for publishers and administrators. Enforce every permission in server-side DAL/mutation code, not only navigation.

### Step 9.2: Review Screen

Show:

- Existing published record.
- Proposed normalized record.
- Effective dates and precision.
- Source title, URL, publisher, and retrieved date.
- HTML excerpt or PDF page/region.
- Parser version and diagnostics.
- Entity-match explanation.
- Validation warnings.
- Pages and cache tags affected.
- Reviewer notes and publication reason.

### Step 9.3: Atomic Publication

One database transaction must:

1. Recheck permissions and expected current revision.
2. Close superseded system-time revisions.
3. Insert approved replacement revisions.
4. Attach evidence links.
5. Record publication items and audit events.
6. Enqueue a signed cache-invalidation event.

If any step fails, publish nothing.

## 10. Ingestion Worker

### Step 10.1: Source Registry

For each endpoint store:

- Publisher and authority level.
- URL and expected format.
- Data scope.
- Fetch cadence and freshness threshold.
- robots/terms/license review status.
- Artifact policy, access class, and retention/deletion period.
- Rate limit and allowed hours if required.
- Parser name/version.
- Expected record-count range.
- Last success, content change, parse success, and editorial review.

Do not schedule crawling until terms, robots, and access methods are reviewed.

### Step 10.2: Secure Fetcher

- Allowlist hosts.
- Reject private, loopback, link-local, and metadata-service addresses after DNS resolution.
- Limit redirects, response size, decompressed size, time, and retry count.
- Use conditional requests with ETag/Last-Modified where supported.
- Apply host-level rate limits and a descriptive user agent with contact details.
- Detect CAPTCHA, login, maintenance, and generic error pages.
- Identify format from bytes as well as headers.
- Apply the endpoint's artifact-retention policy before storage, then save permitted immutable artifact metadata before parsing.

Never bypass a block or CAPTCHA. Request official access or use a documented/manual workflow.

### Step 10.3: HTML Adapters

- Create one adapter per important source family.
- Select by headings, labels, and table headers rather than brittle element positions.
- Normalize whitespace without changing source meaning.
- Keep a checked-in sanitized fixture for every parser.
- Treat unexpectedly empty output as failure, not a valid empty roster.
- Compare record counts and known invariants before creating observations.

### Step 10.4: PDF Pipeline

Recommended container flow:

```text
validate PDF and limits
  -> pdftotext with layout
  -> text/language density check
  -> OCRmyPDF + Tesseract for scans
  -> source-specific table/text parser
  -> observations with page and bounding-box locators
```

Rules:

- Cite the official PDF and page, not the OCR output as an independent authority.
- Store OCR confidence and extraction diagnostics internally.
- Use a reviewed CSV import template when a one-off PDF table is not reliably parseable.
- Run parsers as non-root with limited filesystem, CPU, memory, time, and no unnecessary network access.

### Step 10.5: Normalization

Normalize but preserve original values for:

- Names and honorifics.
- Dates and date precision.
- Institution and office titles.
- Party names and aliases.
- Constituency names and codes.
- State/UT names.
- Election/term identifiers.

Never silently "fix" a source value. Store raw and normalized values with a transformation version.

### Step 10.6: Entity Resolution

Match in this order:

1. Official stable identifier.
2. Exact normalized name plus institution/jurisdiction/term.
3. Approved alias or transliteration.
4. Fuzzy candidate for human review.

Do not automatically merge people by name similarity. Every merge/split is an audited editorial action.

### Step 10.7: Change Detection

Create moderation tasks only for meaningful differences. Classify:

- New entity.
- New term or appointment.
- Ended term or vacancy.
- Portfolio/party/constituency change.
- Profile-only change.
- Source correction.
- Suspected parser regression.
- Official-source conflict.

A source fetch failure or empty extraction never generates mass end dates.

## 11. Public API

Do not build a large API before internal page queries stabilize. When needed, add versioned Route Handlers:

```text
GET /api/v1/jurisdictions
GET /api/v1/institutions
GET /api/v1/offices/{slug}/holders?asOf=2026-08-18
GET /api/v1/people/{slug}
GET /api/v1/chambers/{slug}/composition
GET /api/v1/search?q=...
```

Use:

- Cursor pagination.
- ISO dates and documented interval semantics.
- ETags based on publication revision.
- `application/problem+json` errors.
- Rate limits.
- Runtime response validation.
- OpenAPI generated from shared schemas.

Do not expose draft observations, private artifacts, editor identities, internal notes, or confidence scores.

## 12. 3D Implementation

### Step 12.1: Data First

Produce a versioned JSON/DTO with:

- House and term.
- Layout classification and methodology link.
- Stable seat key.
- Sector, row, and ordinal.
- Normalized `x`, `y`, `z`, and orientation.
- Group/party/person assignment where supported.
- Accessible label.
- Source snapshot/publication ID.

Generate coordinates deterministically from arcs, rows, sectors, aisle gaps, and speaker orientation. Review layout changes as data diffs.

### Step 12.2: 2D View

Build the SVG/HTML view first. It establishes:

- Geometry.
- Selection/filter behavior.
- Legend and totals.
- URL state.
- Accessibility labels.
- Screenshot baseline.

### Step 12.3: Three.js Boundary

- Put the renderer in one small `"use client"` component.
- Dynamically import it after the user chooses 3D.
- Use `InstancedMesh` for seats.
- Cap device pixel ratio.
- Render on demand when the camera changes, not continuously at idle.
- Pause when the document is hidden or renderer is offscreen.
- Use raycasting for pointer/touch selection.
- Keep headings, labels, filters, legend, and person details in DOM.
- Dispose geometries, materials, controls, and listeners on unmount.
- Recover to 2D after `webglcontextlost`.

### Step 12.4: Accessible Synchronization

Do not create hundreds of hidden DOM nodes that pretend to make the canvas accessible. Use the adjacent table/list as the authoritative accessible interface and synchronize its current selection with the visual view.

## 13. Security And Privacy Implementation

### Application

- Authorization in each mutation and protected query.
- Parameterized database access.
- Sanitized, allowlisted rich text rather than arbitrary HTML.
- CSRF-safe mutation pattern and secure session cookies.
- HMAC-signed internal webhooks with timestamp/replay protection.
- Rate limits on authentication, search, API, correction form, and manual fetch triggers.
- Security headers: HSTS, content-type sniffing protection, referrer policy, permissions policy, and frame restrictions.
- Start Content Security Policy in report-only mode, then enforce after testing Next.js and 3D asset requirements.

### Personal Data

- Store only facts necessary for the public-role purpose.
- Do not ingest personal contact details or identity documents from affidavits.
- Record why any full date of birth is necessary before publishing it.
- Give every source an artifact policy: `retain_full`, `retain_redacted`, `retain_metadata_only`, or `do_not_collect`.
- For affidavits and other sensitive documents, minimize collection, use redacted evidence where legally and technically valid, strictly limit access, and define deletion/retention periods. Private storage alone is not sufficient.
- Keep permitted source artifacts private by default and log access to sensitive evidence.
- Define retention for failed uploads, fetch logs, auth logs, and correction submissions.
- Complete legal review against the DPDP Act/Rules commencement schedule before adding accounts, analytics identifiers, newsletters, or behavioral tracking.

## 14. Testing Plan

### Domain Unit Tests

- Valid-time and system-time queries.
- Half-open interval boundaries.
- Partial/unknown dates.
- Acting and overlapping roles.
- Single-holder cardinality.
- Party and portfolio changes.
- Citation completeness.
- "Current" status rules.

### Parser Tests

- Golden HTML/PDF fixtures.
- Changed element order.
- Missing columns.
- Duplicate names.
- CAPTCHA/maintenance/error pages.
- Empty extraction protection.
- OCR and non-OCR branches.
- Expected count/invariant failures.

### Integration Tests

- Migrations on real PostgreSQL.
- Database role isolation.
- Publication transaction rollback.
- Job idempotency/retry.
- Artifact checksum deduplication.
- Signed webhook validation.
- Search projection updates.

### Frontend And E2E Tests

- Home to institution/person navigation.
- Search and filters with normal GET URLs.
- Person history and citation opening.
- Locale and canonical metadata.
- JavaScript-disabled core pages.
- Mobile navigation.
- 3D unavailable/context-lost fallback.
- Visual total reconciliation.

### Accessibility Tests

- Automated axe checks in CI.
- Keyboard-only navigation.
- VoiceOver and NVDA smoke tests.
- 200% zoom and narrow reflow.
- Reduced motion.
- Forced colors and contrast.
- Table/2D/3D information equivalence.

### Operational Tests

- Backup restoration.
- Worker restart during a job.
- Source outage and stale-data display.
- Oversized/malicious document rejection.
- Popular-page and search load tests.
- Secret and dependency scanning.

## 15. Deployment Plan

### Environments

- **Local:** local PostgreSQL and fixture artifacts.
- **Preview/staging:** isolated database, auth tenant, storage bucket, and synthetic data where possible.
- **Production:** managed PostgreSQL with point-in-time recovery, private artifacts, restricted worker credentials.

### Release Pipeline

```text
lint + typecheck + unit tests
  -> migration compatibility
  -> integration/parser tests
  -> next build
  -> preview deploy
  -> Playwright + accessibility smoke
  -> production migration/deploy
  -> synthetic checks and source-health check
```

Use expand-and-contract migrations for schema changes used by multiple deployments. Back up before destructive migrations and test restoration periodically.

## 16. Observability

Create `instrumentation.ts` and correlate logs with:

- Request ID.
- User-safe route template.
- Publication ID.
- Source/fetch/job ID.
- Parser version.

Track:

- Web latency, errors, cache behavior, database latency, and search zero-results.
- Source last success, consecutive failures, checksum changes, parser failures, and extracted count changes.
- Unmatched identities, moderation queue age, uncited records, and facts beyond freshness thresholds.
- Publication-to-visible time.
- 3D initialization and WebGL context failures without invasive user tracking.

Never log tokens, complete source documents, private correction text, or unnecessary user/IP combinations.

## 17. Phase Checklists

### Foundation Checklist

- Database and migration path operational.
- Temporal/evidence model tested.
- Source and privacy policy approved.
- Invite-only auth and audit log operational.
- Golden dataset published in staging.
- Backups and error monitoring operational.

### Public Alpha Checklist

- Core pages and search implemented.
- All 36 jurisdiction shells present with coverage labels.
- Citations and freshness shown everywhere.
- Sitemap, metadata, robots, redirects, and disclaimer complete.
- Corrections intake and response process operational.
- No critical accessibility or security findings.

### MVP Completion: Parliament/3D Checklist

- House totals and vacancies validated.
- Layout labeled conceptual/approximate/official.
- Table and 2D complete before 3D.
- 3D loads on demand and cleans up resources.
- Reduced-motion, no-WebGL, and mobile fallbacks tested.
- Screenshot and reconciliation tests pass.

### Expansion Checklist For Each State Legislature

- Official house source identified and terms reviewed.
- Election result/current roster cross-check designed.
- Source adapter has fixtures and failure tests.
- Editor capacity and freshness threshold assigned.
- Member count, vacancies, and term reconcile.
- Public coverage badge updated only after publication.

## 18. Anti-Patterns To Avoid

- Scraping official sites inside a Server Component.
- A single `people` table with mutable `current_role`, `party`, and `constituency` columns.
- Treating ECI candidate affidavits as proof of current office.
- Ending terms because a parser returned zero rows.
- Copying portraits without a rights record.
- Making the whole application a Client Component.
- Shipping Three.js in the initial home-page bundle.
- Storing only a source URL without retrieval time and field-level evidence.
- Using a language model to publish facts without deterministic validation and human approval.
- Claiming comprehensive employee coverage.
- Adding Elasticsearch, Kafka, microservices, GraphQL, or Kubernetes before measured need.
