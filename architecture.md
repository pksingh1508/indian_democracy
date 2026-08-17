# Indian Democracy Information Platform: Architecture

Last reviewed: 18 August 2026

## 1. Architecture Goals

The architecture must optimize for:

- Correct, cited, time-aware public information.
- Availability even when official source sites are unavailable.
- Safe handling of inconsistent HTML, PDFs, scans, and provisional records.
- Clear editorial control over every public change.
- Fast server-rendered pages with strong SEO and accessibility.
- A small team's ability to operate the system.
- Progressive 3D enhancement without making WebGL a core dependency.

The hardest problem is not page rendering. It is maintaining trustworthy identities and dated facts across fragmented sources.

## 2. Architectural Style

Use a **modular monolith with a separate worker process**.

```text
                       OFFICIAL PUBLIC SOURCES
        Parliament | ECI | Courts | PMO | States | Gazette | OGD
                                  |
                                  v
                     +--------------------------+
                     | Ingestion worker         |
                     | fetch, archive, extract, |
                     | normalize, compare       |
                     +------------+-------------+
                                  |
                                  v
                  +--------------------------------+
                  | PostgreSQL staging/evidence    |
                  | observations + review queue    |
                  +---------------+----------------+
                                  |
                           human approval
                                  |
                                  v
              +-----------------------------------------+
              | PostgreSQL approved temporal records   |
              | publication + citations + audit log    |
              +------------------+----------------------+
                                 |
                   +-------------+-------------+
                   |                           |
                   v                           v
         +--------------------+       +---------------------+
         | Next.js public app |       | Editorial app       |
         | SSR/cache/search   |       | compare/review/edit |
         +---------+----------+       +----------+----------+
                   |                             |
                   v                             v
          HTML/table/2D/3D              authenticated editors
```

The web app and worker share domain types, runtime schemas, normalization rules, and database definitions. They deploy separately so document processing cannot exhaust public web resources.

## 3. Trust Boundaries

### Boundary A: External Sources

All downloaded HTML, JSON, CSV, images, and PDFs are untrusted input even when hosted by an official domain. They may be malformed, compromised, unexpectedly large, stale, or provisional.

### Boundary B: Staging And Evidence

Extracted observations are not public facts. They retain raw values, confidence, parser metadata, and source locators until reviewed.

### Boundary C: Approved Publication

Only approved, transactionally published records may be returned by the public DAL. This is the central safety boundary.

### Boundary D: Editorial Access

Authentication alone is insufficient. Every mutation and preview query requires role-based authorization and an audit event.

### Boundary E: Browser

The browser receives only public DTOs. It never receives source credentials, private artifacts, editor identities, internal notes, or unpublished observations.

## 4. Runtime Components

### 4.1 Next.js Public Application

Responsibilities:

- Public routes and navigation.
- Server-rendered institution, jurisdiction, office, person, and source pages.
- Search and filters.
- Metadata, sitemap, robots, canonical URLs, and Open Graph images.
- Public REST endpoints where necessary.
- Cached reads of approved publications.
- 2D visualization and optional client-loaded 3D.

It does not crawl or parse external sources.

### 4.2 Editorial Application

Implemented as protected Next.js routes in the same deployment initially.

Responsibilities:

- Source registry management.
- Observation-to-entity mapping.
- Side-by-side evidence review.
- Manual corrections and temporal edits.
- Approval and publication.
- Identity merge/split workflows.
- Source health, stale data, and correction queue.

It uses uncached preview queries and server-side authorization.

### 4.3 Ingestion Worker

Responsibilities:

- Scheduled and manually authorized source checks.
- Rate-limited secure fetching.
- Immutable artifact storage.
- HTML/JSON/CSV extraction.
- PDF text extraction and optional OCR.
- Normalization and candidate identity resolution.
- Validation and material-change detection.
- Review-task creation.

It has write access to staging/evidence tables but cannot mark records published.

### 4.4 PostgreSQL

Responsibilities:

- Canonical identities and relationships.
- Valid-time and selected system-time revisions.
- Evidence and observation records.
- Transactional editorial publication.
- Full-text/trigram search projection.
- Queue state for the worker.
- Audit trail.

### 4.5 Object Storage

Private by default. Stores only source responses permitted by the endpoint's artifact policy, uploaded review files, permitted extracted text, and approved image originals/derivatives. Database records hold checksums and object keys.

Do not publicly mirror official PDFs automatically. Public citations link to the official URL unless legal review permits redistribution.

### 4.6 Cache/CDN

The Next.js platform caches public HTML/RSC output and approved data queries. Publication invalidates entity tags. The cache is a performance layer, never the source of truth.

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
      -> ElectionResultRevision
          -> ResultEvent
          -> evidence considered for Membership publication

Canonical fact/revision
  -> EvidenceLink
      -> Observation
          -> Extraction (optional for manual citation)
              -> SourceArtifact (optional under retention policy)
      -> FetchRun/source metadata
          -> SourceEndpoint
```

### 5.2 Why Person, Office, Institution, And Holding Are Separate

- A person can hold multiple offices at once.
- One office persists after its holder changes.
- An institution can be renamed or reorganized without becoming a person-specific record.
- Acting and additional-charge arrangements can overlap.
- Historical queries need the relationship's dates, not a mutable property on the person.

### 5.3 Entity Catalog

| Entity | Meaning | Important fields |
| --- | --- | --- |
| `jurisdiction` | India, state, or UT | type, parent, official codes |
| `institution` | Persistent public body | type, jurisdiction, legal basis, predecessor/successor |
| `office` | Role within an institution | category, allowed entry methods, cardinality |
| `person` | Stable human identity | internal UUID, public status |
| `term` | Institutional/electoral period | number/name, start/end and precision |
| `office_holding` | Person occupying an office | dates, status, entry method |
| `holding_event` | Election, appointment, oath, resignation, death, removal | event date/type/source |
| `membership` | Person's membership in a house/term | constituency, route, dates |
| `party` | Political party/group identity | official names and identifiers |
| `party_affiliation` | Dated person-party relationship | dates, status, evidence |
| `constituency` | Electoral area | house type, jurisdiction, code, boundary version |
| `portfolio_assignment` | Dated minister-to-portfolio relation | ministry/department, rank, dates |
| `election` | A specific election event | type, jurisdiction, dates, source identifiers |
| `election_contest` | Constituency/seat contest within an election | constituency, status, result-record references |
| `candidacy` | One person's dated participation in a contest | nomination/contest status and events |
| `election_result` | Versioned outcome of an election contest | provisional/final status, votes, margin, declared outcome, evidence |
| `result_event` | Declaration, correction, recount, or supersession | event type/date and statutory/operational source |
| `content_revision` | Localized institutional explainer | locale, review state, revision |
| `image_asset` | Portrait or illustration | source, rights, credit, crop, status |
| `slug_alias` | URL identity and redirects | entity, locale, slug, active period |

### 5.4 Officeholder Classification

Store both office category and entry method. This avoids inaccurate labels such as calling a judge or civil servant an elected politician.

Suggested office categories:

- `representative`
- `political_executive`
- `constitutional_officeholder`
- `judicial_officeholder`
- `statutory_officeholder`
- `senior_public_official`
- `legislative_presiding_officer`

Suggested entry methods:

- `direct_election`
- `indirect_election`
- `nomination`
- `appointment`
- `ex_officio`
- `unknown`

Candidacy is neither an office category nor a second person entity. One person may have many dated candidacies and many office holdings.

## 6. Temporal Architecture

### 6.1 Two Time Dimensions

**Valid time** is when a fact was true in the public institution.

**System time** is when this platform recorded/published that version.

Example:

- An appointment was effective on 1 August.
- The official source published it on 2 August.
- The platform learned and published it on 3 August.

All three dates can matter. Do not replace them with one `updated_at` timestamp.

### 6.2 Revision Pattern

For high-value factual relationships:

```text
logical_id
revision_id
valid_from
valid_to_exclusive
start_precision
end_precision
recorded_from
recorded_to
publication_status
```

- Published revisions are immutable.
- A correction closes `recorded_to` and inserts a replacement revision.
- Valid intervals are half-open.
- An expected retirement/end date is marked projected until confirmed.
- Missing `valid_to` does not prove current service.
- A holding has a separate typed status such as `confirmed_current`, `acting`, `additional_charge`, `ended`, or `uncertain`.
- Editorial workflow, publication lifecycle, holding/service state, entry method, candidacy state, affiliation state, and result state use separate enums. A relationship includes only its applicable typed status field.

### 6.3 Query Semantics

Public pages default to the current date in `Asia/Kolkata`. Historical pages accept an `asOf` date. The public site shows:

- "Serving as of [valid date]"
- "Sources last checked [verification timestamp/date]"

This prevents a crawler success from being misrepresented as a human editorial review.

## 7. Provenance Architecture

### 7.1 Three Layers

1. **Evidence:** immutable retrieved artifact and source metadata.
2. **Observation:** what a parser or editor read from that evidence.
3. **Canonical fact:** the approved interpretation used by public pages.

### 7.2 Evidence Record

An evidence link should include:

- Publisher.
- Document/page title.
- Official URL and final retrieved URL.
- Source publication/update date when stated.
- Retrieval timestamp.
- Artifact checksum when the source's retention policy permits an artifact; otherwise preserve source/fetch metadata and the manual locator.
- HTML heading/table/row/selector or PDF page/region.
- Short excerpt when reuse is allowed.
- Relationship to the fact: supports, contradicts, or supersedes.
- Rights/license policy and review date.

Artifact retention is source-specific. Each endpoint is classified as `retain_full`, `retain_redacted`, `retain_metadata_only`, or `do_not_collect`, with a purpose, access class, and retention period. Sensitive affidavits must not be retained wholesale merely because storage is private; use minimized/redacted evidence or official links where feasible and legally appropriate.

### 7.3 Source Ranking

Source authority is contextual, not a universal numeric truth. Store dimensions:

- Publisher authority.
- Legal force.
- Direct responsibility for the roster.
- Provisional/final status.
- Freshness.
- Completeness.
- Machine-readability.
- Licensing/access restrictions.

A Gazette can control an appointment event while a current institutional roster is better evidence that the person continues to serve.

## 8. Ingestion Architecture

### 8.1 Pipeline

```text
schedule
  -> preflight policy/rate/retention check
  -> fetch or reviewed manual citation
  -> validate permitted response/metadata
  -> checksum/archive only when policy permits
  -> extract text/tables
  -> normalize values
  -> propose identity mappings
  -> apply domain validations
  -> compare with published data
  -> create review tasks
  -> human approval
  -> atomic publication
  -> cache invalidation
```

### 8.2 Adapter Contract

Each adapter implements a shared contract conceptually like:

```ts
type SourceAdapter = {
  sourceKey: string;
  supports(artifact: ArtifactMetadata): boolean;
  extract(artifact: Artifact): Promise<ExtractionResult>;
  normalize(result: ExtractionResult): Promise<ObservationCandidate[]>;
  validate(candidates: ObservationCandidate[]): ValidationIssue[];
};
```

Adapters return candidate observations, not database mutations.

### 8.3 Idempotency

- A fetch artifact is deduplicated by endpoint, content checksum, and relevant response metadata.
- A parse result records parser version and artifact checksum.
- A normalized observation has a deterministic key based on source, subject candidate, predicate, value, and effective date.
- Retried jobs may update job diagnostics but must not duplicate review tasks or facts.

### 8.4 Failure Model

- Fetch failure: retain previous approved data, mark source check failed.
- Parse failure: retain previous approved data, open parser incident.
- Empty/unexpected count: quarantine result, never infer vacancies or term endings.
- Identity ambiguity: create mapping task.
- Source conflict: retain both observations and create editorial dispute task.
- Publication failure: roll back transaction and leave cache untouched.
- Cache webhook failure: retry safely; approved database remains source of truth.

### 8.5 Scheduling

Suggested initial classes, subject to source terms:

- Tier 1 current national rosters: daily check.
- State/UT heads and ministers: daily or every few days.
- Legislature memberships: daily during elections/by-elections, weekly otherwise.
- Static explainers/legal bases: monthly or event-triggered.
- Annual civil lists: monthly URL check around expected publication, otherwise quarterly.

Cadence is an operational policy, not permission to crawl. Respect access controls and seek written/API access where needed.

## 9. Editorial Architecture

### 9.1 Separate State Machines

```text
detected
  -> needs_mapping
  -> needs_review
  -> approved

needs_review -> rejected
needs_review -> disputed
```

This is the editorial workflow only. Approval can create a publication draft. The separate publication lifecycle is `draft -> published -> superseded/retracted`. Store holding/service state (`confirmed_current`, `acting`, `additional_charge`, `ended`, `uncertain`), entry method, and candidacy/result states in separate fields/enums.

### 9.2 High-Risk Changes

Use enhanced review for:

- President, Vice President, Prime Minister, Chief Justice, Governors/LGs, and Chief Ministers.
- Current house membership and vacancy changes.
- Criminal/financial declarations if this scope is later approved.
- Identity merges.
- Retroactive date corrections.
- Source overrides.

### 9.3 Audit

Audit events are append-only and include actor ID, role, action, target, before/after revision IDs, reason, and timestamp. Public pages need not expose editor identity.

## 10. Web Rendering Architecture

### 10.1 Server And Client Split

Server Components handle:

- Database queries.
- Public page structure.
- Source citations.
- Timelines and tables.
- Metadata.
- 2D SVG when it does not need browser-only interaction.

Client Components handle:

- Search autocomplete enhancement.
- Filter controls with browser state.
- Shareable selection interactions.
- 3D renderer and camera controls.

Mark the smallest possible boundary with `"use client"` because all imported modules below that boundary join the client graph.

### 10.2 Data Access

Server Components call the DAL directly. They do not make HTTP calls to this application's own API. REST Route Handlers exist for external consumers and integrations.

### 10.3 Next.js 16 Cache Components

When `cacheComponents` is enabled:

- Approved public DTO queries use `"use cache"`, `cacheLife`, and `cacheTag`.
- Request-specific or uncached content is isolated behind `Suspense`.
- Search is request-time rendered around `searchParams` with a meaningful fallback.
- Admin preview bypasses public caches.
- Publication triggers tag-based invalidation.
- High-impact current-holder changes call `revalidateTag(tag, { expire: 0 })` so the next request blocks for fresh data. Low-risk content may use `revalidateTag(tag, "max")` and stale-while-revalidate.
- If request-time cached functions need to survive across serverless instances, configure a durable remote cache handler explicitly; do not assume default in-memory runtime entries persist.

The architecture avoids relying on legacy assumptions that `fetch` is cached by default. Installed Next.js 16 documentation states it is not cached by default.

### 10.4 Route Model

```text
/{locale}
/{locale}/institutions
/{locale}/institutions/{slug}
/{locale}/jurisdictions
/{locale}/jurisdictions/{slug}
/{locale}/offices/{slug}
/{locale}/people/{slug}
/{locale}/parliament/{house}
/{locale}/parliament/{house}/seating
/{locale}/search
/{locale}/learn/{slug}
/{locale}/methodology
/{locale}/sources/{id}
/{locale}/corrections
/admin/...
/api/v1/...
/api/internal/...
```

Use root `proxy.ts` only for lightweight locale/request handling. Next.js 16 renamed Middleware to Proxy and explicitly discourages slow data fetching there.

## 11. Search Architecture

### Initial Index

Use a PostgreSQL projection populated on publication:

- `tsvector` for English text.
- `pg_trgm` for partial names/spelling variation.
- Curated alternate names and scripts.
- Boosts for exact names, currently serving people, and jurisdiction matches.
- Filters by entity type, jurisdiction, institution, party, and time status.

The normal search route is a server-rendered GET form. Autocomplete is only an enhancement.

### Future Search Service

Adopt Typesense/Meilisearch only when measured multilingual relevance or scale exceeds PostgreSQL. Keep publication events as the indexing source so migration is straightforward.

## 12. 3D Architecture

### 12.1 Data/View Separation

The canonical composition is not a Three.js scene. It is a versioned dataset that can drive table, 2D, 3D, API, and tests.

```text
CompositionSnapshot
  + ChamberLayout
      -> LayoutSeat[]
          -> SeatAssignment[]
```

### 12.2 Layout Semantics

- `conceptual`: generated composition with no physical-seat claim.
- `approximate`: based partly on a published chamber plan but not complete assignments.
- `official`: supported by an official layout and assignment source for the effective period.

The classification and methodology are visible to users.

### 12.3 Rendering Strategy

- Server-render text/table and 2D first.
- Dynamically load Three.js on explicit user action.
- Render seats with `InstancedMesh`.
- Keep labels and controls in HTML.
- Use URL state for current filter/selection.
- Pause/render on demand and dispose resources.
- Use a synchronized DOM list rather than inaccessible canvas-only selection.

## 13. Security Architecture

### 13.1 Database Roles

- Public web role: read approved public projections only.
- Editorial role: read drafts and call controlled publication functions/transactions.
- Worker role: write fetch/evidence/observation tables, no publication rights.
- Migration role: schema ownership, unavailable to runtime services.

### 13.2 Source-Fetch SSRF Controls

- Explicit source-host allowlist.
- DNS/IP validation before every connection and redirect.
- Reject private, loopback, link-local, multicast, and cloud metadata ranges.
- HTTPS by default.
- Response/decompression/page/time limits.
- File signature validation.
- Sandboxed parser process.

### 13.3 Web Controls

- Invite-only auth and MFA for elevated roles.
- Secure, HTTP-only, same-site cookies.
- Server-side RBAC.
- CSRF protection appropriate to the auth/mutation mechanism.
- Runtime validation and output DTOs.
- Rate limiting.
- HMAC-signed internal endpoints with replay window.
- Strict security headers and staged CSP rollout.
- Dependency/container scanning and secret management.

## 14. Privacy And Rights Architecture

- Public database stores role-relevant public facts only.
- Sensitive fields from source documents are excluded at normalization, not merely hidden in UI.
- Raw artifacts are private and access logged.
- Image assets require source, rights basis, attribution, and allowed transformations.
- Correction submissions and editor accounts have retention rules.
- Analytics should be aggregate/cookieless where practical.
- Legal review is required before expanding personal fields or external data sharing.

## 15. Availability And Disaster Recovery

- The public site uses the last approved database publication during source outages.
- Managed PostgreSQL uses automated backups and point-in-time recovery.
- Object storage uses versioning or immutable keys.
- Restore drills verify both database and artifact references.
- Publication events can be replayed to rebuild search projections and caches.
- Source failures reduce freshness, not public-site availability.

Initial targets:

- RPO: 15 minutes for production database where provider support permits.
- RTO: 4 hours for public read service.
- Public availability: 99.9% monthly.
- Immediately invalidated high-impact publication visibility: under 5 minutes. Track low-risk stale-while-revalidate refresh separately.

## 16. Observability Architecture

### Technical Telemetry

- Next.js request latency/error and cache behavior.
- Database query latency, locks, and pool saturation.
- Worker job duration/retries/timeouts.
- Object storage errors.
- Search latency and zero-result rate.
- 3D initialization/context-loss aggregate events.

### Data-Quality Telemetry

- Last source fetch and parse success.
- Source content checksum change.
- Unexpected extraction count.
- Unmapped identity count.
- Review queue age.
- Current facts without citations.
- Facts beyond freshness threshold.
- Conflicting observations.
- Publication-to-cache visibility delay.

Alerts should link to the affected source, fetch, parser version, and current published records.

## 17. Deployment Topology

Recommended initial deployment:

```text
Vercel (Next.js public + editorial routes)
        |
        +-- managed PostgreSQL (Supabase or equivalent)
        +-- private object storage
        +-- auth provider

Cloud Run / Render / Railway (Docker worker)
        |
        +-- PostgreSQL job queue
        +-- object storage
        +-- allowlisted public source hosts
```

Alternatives:

- Self-host Next.js with `output: "standalone"` when portability/data-location needs justify the operational cost.
- Use separate Neon, R2, and Auth providers when specialist features outweigh vendor count.
- Use a managed workflow platform later if job orchestration becomes complex.

Static export is not suitable because search, editorial authentication, APIs, and publication revalidation require a server.

## 18. Architectural Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Application shape | Modular monolith + worker | Minimum operational complexity with process isolation |
| Public source access | Offline ingestion only | Reliability, rate control, and review |
| Data model | Relational temporal revisions | Correct histories and explainable queries |
| Evidence model | Artifact -> observation -> fact | Auditability and conflict handling |
| Publication | Human-approved transaction | Prevent automated misinformation |
| Search | PostgreSQL first | Dataset fits; avoids another service |
| API | REST later | Simple caching/versioning and known queries |
| 3D | Direct Three.js, opt-in | Bundle control and framework independence |
| Editorial | Narrow custom workflow | Generic CMS poorly models temporal facts/evidence |
| Public cache | Next.js Cache Components/tags | Fast HTML with publication-driven freshness |
| Images | Rights-recorded assets only | Avoid copyright and privacy risk |

## 19. Deferred Complexity

Do not add these until a measured requirement exists:

- Microservices per institution.
- Kafka or another event broker.
- Elasticsearch.
- GraphQL.
- Kubernetes.
- Generic event sourcing for every table.
- Universal AI extraction without source-specific validation.
- Public user accounts/comments.
- Exact digital twins of chambers.

## 20. Architecture Fitness Tests

The architecture remains valid only if these tests continue to pass:

- A failed parser cannot alter public records.
- A current fact cannot publish without evidence.
- A historical query returns the correct holder for a past date.
- The system can reconstruct what it published at an earlier system time.
- Worker credentials cannot publish.
- Public credentials cannot read drafts/private artifacts.
- An identity merge is reversible by audited revisions.
- A source outage leaves public pages available with freshness warning.
- Table, 2D, and 3D seat totals always reconcile.
- Core content remains usable without JavaScript/WebGL.
