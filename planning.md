# Indian Democracy Information Platform: Product Plan

Last reviewed: 18 August 2026

## 1. Purpose

Build an independent, non-partisan public information website that helps people understand Indian democratic institutions and identify the people currently serving in important public offices. The website should answer four questions clearly:

1. What is this institution or public office?
2. Who currently serves in it?
3. How did that person enter the office, and for what period?
4. Which official source supports each fact, and when was it last checked?

The product is an explanatory and discovery service, not an official government service, election predictor, news outlet, or allegation database.

## 2. Product Principles

- **Accuracy before breadth:** publish a smaller, verified dataset before promising every public official in India.
- **Evidence with every material fact:** every current office holding, term, party affiliation, constituency, and portfolio must cite a source.
- **Time-aware data:** a person, party, constituency, and portfolio can change. Store dated terms rather than overwriting a single "current" value.
- **Institution first:** explain the institution and office, not only the personality holding it.
- **Neutral language:** describe constitutional and statutory roles without praise, criticism, campaign language, or partisan framing.
- **Public interest with data minimization:** publish role-relevant public facts, not a dossier of personal or family information.
- **Accessible by default:** all information available in 3D must also be available in semantic HTML and a 2D view.
- **Transparent limitations:** display coverage, freshness, conflicts, and uncertainty instead of silently filling gaps.
- **Independent identity:** state prominently that the website is not affiliated with the Government of India, a state government, a court, the Election Commission, or a political party.

## 3. Terminology And Scope

The product should not call every person a "politician." Keep one stable person identity and model office category, entry method, and election candidacy as separate dated dimensions:

| Dimension | Values/examples | Meaning |
| --- | --- | --- |
| Office category | Representative, political executive, constitutional officeholder, judge, statutory officeholder, senior public official | What kind of public role this is |
| Entry method | Direct election, indirect election, nomination, appointment, ex officio | How a particular holding or membership began |
| Holding/service status | Confirmed current, acting, additional charge, ended, projected end, uncertain | The service condition of a particular holding |
| Candidacy status | Filed, accepted, rejected, withdrawn, contesting, elected, not elected | A person's status in a particular election contest, not their identity type |

Examples:

- Lok Sabha MPs and MLAs are normally directly elected representatives.
- Most Rajya Sabha MPs and many MLCs are indirectly elected representatives.
- A nominated Rajya Sabha member has a representative office category and a nomination entry method.
- The President, Vice President, Governors, CAG, and Election Commissioners are constitutional officeholders with office-specific election/appointment methods.
- Supreme Court and High Court judges are judicial officeholders.
- A person can simultaneously be a current officeholder and a candidate in another election; never create a second person entity for that candidacy.

### 3.1 MVP Scope

The MVP should cover:

- India, all 28 states, and all 8 Union Territories.
- Core explainers for Parliament, Lok Sabha, Rajya Sabha, Union executive, President, Vice President, Supreme Court, Election Commission, CAG, UPSC, state executive, state legislatures, High Courts, and local government structure.
- Current President, Vice President, Prime Minister, Union Council of Ministers, Lok Sabha MPs, Rajya Sabha MPs, Chief Justice of India, and Supreme Court judges.
- For every state/UT: constitutional or administrative head, Chief Minister where applicable, Council of Ministers when maintainable, legislature and presiding officers, MPs associated with the jurisdiction, and High Court relationship.
- Current MLAs/MLCs only after a state-specific source adapter and review process are proven reliable. Roll this out state by state.
- Historical terms for people already in scope when official sources support them.
- Search by person, office, institution, constituency, state/UT, and party.
- A chamber-style Lok Sabha and Rajya Sabha composition view, with table, 2D, and optional 3D presentations.
- English at launch with architecture ready for Hindi and additional Indian languages.

### 3.2 Explicitly Out Of MVP Scope

- A directory of every government employee, police officer, defence employee, PSU worker, court employee, or local-body worker.
- Personal phone numbers, residential addresses, signatures, identity numbers, tax identifiers, family-member profiles, or other unnecessary personal data.
- Live election predictions, polls, ideological scores, automated sentiment, popularity rankings, or "best/worst politician" lists.
- Unverified accusations or automatically generated criminal summaries.
- User comments, ratings, crowdsourced edits, or social feeds.
- Automatic publication directly from a scraper or language model.
- Exact physical seating claims unless an official seating plan and assignment record support them.
- Complete historical coverage from 1950 at launch.

### 3.3 Why "All Government Employees" Is Not A Valid Initial Goal

No authoritative source provides a complete roster across the Union, states, UTs, local bodies, public sector organizations, police, defence, courts, and commissions. Publishing such a directory would also create disproportionate privacy, safety, impersonation, and maintenance risks. The defensible boundary is public decision-makers and selected senior role-holders whose institutions intentionally publish their current role.

## 4. Audiences And User Needs

### 4.1 Citizens And First-Time Voters

- Understand the difference between Lok Sabha and Rajya Sabha.
- Find the MP or MLA for a constituency.
- See who holds an office and how that office is selected.
- Follow links to the original official record.

### 4.2 Students And Educators

- Use concise, sourced institutional explainers.
- Explore diagrams of how Union and state institutions relate.
- Compare representation by house, jurisdiction, and party.
- Link to stable pages for classroom use.

### 4.3 Journalists And Researchers

- Check dated office holdings and portfolio changes.
- Export or query cited, normalized records after the public data contract stabilizes.
- See source conflicts, retrieval dates, and historical revisions.

### 4.4 Editors And Maintainers

- Detect changes in official sources.
- Compare proposed changes with published data.
- approve or reject facts with source evidence.
- Correct identity matches without deleting history.

## 5. Information Architecture

### 5.1 Main Navigation

- Home
- Institutions
- Parliament
- States and UTs
- People
- Elections and representation
- Learn
- Search
- Methodology and sources
- Corrections

### 5.2 Home Page

The home page should not be a long list of undefined political terms. Organize it into a visual constitutional map:

- **Union:** President, Parliament, Prime Minister and Council of Ministers, Supreme Court.
- **Parliament:** Lok Sabha, Rajya Sabha, presiding officers, members, committees.
- **States and UTs:** map/list of all 36 jurisdictions, each with government, legislature, judiciary relationship, and current coverage status.
- **Independent institutions:** Election Commission, CAG, UPSC, Finance Commission, and selected statutory bodies.
- **Find your representatives:** constituency search when constituency data is ready.
- **Explore the chambers:** Lok Sabha and Rajya Sabha composition entry points.
- **How this data is verified:** short trust statement linking to methodology.

### 5.3 Institution Page

Every institution page should include:

- Official and common names, with abbreviations.
- Institution type and constitutional/statutory basis.
- Plain-language purpose and powers.
- Composition and method of selection.
- Term rules and vacancy rules.
- Current leadership and members within the published coverage boundary.
- Relationship to other institutions.
- Historical name/predecessor where relevant.
- Source citations and "last checked" date.
- Coverage and freshness badge.

### 5.4 Jurisdiction Page

Every state/UT page should include:

- Official name, jurisdiction type, capital(s), and official identifiers where available.
- Governor, Lieutenant Governor, or Administrator, as applicable.
- Chief Minister and Council of Ministers where applicable.
- Legislative Assembly and Legislative Council, if one exists.
- Lok Sabha and Rajya Sabha representation.
- High Court serving the jurisdiction.
- District/local-government entry points as later phases.
- Sources and coverage status for each section.

Do not imply that every UT has the same constitutional structure as a state.

### 5.5 Person Page

Every person page should include only sourced, role-relevant information:

- Official display name and alternate official spellings/scripts.
- Neutral portrait only when its reuse rights are recorded.
- Current office(s), start date, status, jurisdiction, and method of entry.
- Historical office holdings with start/end dates and date precision.
- Parliamentary/legislative membership and constituency, where applicable.
- Party affiliations as dated relationships rather than permanent identity.
- Ministerial portfolios as dated assignments.
- Education or declared-election facts only when part of the approved scope and sourced carefully.
- Citations per section, a last-verified date, and correction link.

Avoid honorific-heavy URLs and primary keys. Use stable IDs and redirectable slugs.

### 5.6 Search And Discovery

Search must handle:

- Official names and known aliases.
- Romanized and Indian-script forms where curated.
- Constituencies with duplicate/similar names.
- Former and current offices.
- Filters for entity type, jurisdiction, institution, party, and current/historical status.

Search results must label entity type and relationship status clearly so a person's candidacy is not mistaken for an office holding.

## 6. 3D Chamber Experience

### 6.1 User Goal

Let a user understand house composition and select a party, group, constituency, or member to open a normal HTML detail panel or person page.

### 6.2 Correct Product Claim

For the MVP, call the visualization a **chamber-style composition view**. It represents totals and grouping. It must not claim to show actual physical seat assignments unless an official seating source verifies every assignment.

### 6.3 Progressive Experience

Every chamber page should provide, in this order:

1. Server-rendered composition summary.
2. Accessible party/group table with totals and vacancies.
3. 2D SVG/HTML chamber view.
4. Optional "Explore in 3D" button.

The 3D view should:

- Load only after user action.
- Support pointer, touch, and keyboard-assisted selection through a synchronized DOM list.
- Use party colors plus labels/patterns, never color alone.
- Respect reduced-motion and data-saver preferences.
- Pause rendering when hidden or offscreen.
- Have a reset-camera button and no automatic continuous camera movement.
- Preserve selected filters/person in the URL.
- Fall back immediately if WebGL fails or context is lost.

### 6.4 Reconciliation Requirement

Define mutually exclusive canonical seat buckets: assigned, vacant, and unresolved/excluded. Their sum must equal the effective house total. Party/group totals are aggregations of assigned seats, not an additional bucket. The table, 2D view, and 3D view must each match the same canonical snapshot; this is a release-blocking automated test.

## 7. Editorial And Data Policy

### 7.1 Separate Status Dimensions

Do not combine unrelated state machines in one `status` field:

| Dimension | Example values |
| --- | --- |
| Editorial workflow | Detected, needs identity match, needs source, needs review, approved, rejected, disputed |
| Publication lifecycle | Draft, published, superseded, retracted |
| Holding/service state | Confirmed current, acting, additional charge, ended, projected end, uncertain |
| Candidacy state | Filed, accepted, rejected, withdrawn, contesting, elected, not elected |

An observation can be disputed while the last approved fact remains published. A candidate can withdraw without any published office holding being withdrawn.

### 7.2 Source Priority

Use context-specific judgment, with this default order:

1. Gazette notification, formal appointment order, declared election result, or signed official record.
2. Current roster from the institution responsible for the office.
3. Official member profile or biography.
4. Official press release.
5. Official aggregator used for discovery.
6. Reputable secondary reporting only as a temporary lead, never the sole source for a sensitive or disputed current fact.

### 7.3 Publication Rules

- No current office holding without at least one authoritative citation.
- High-impact national changes should receive two-person review when staffing permits.
- A failed scraper must never delete or end an office holding.
- An open-ended term is not automatically proof that a person still serves.
- Conflicting official sources remain recorded and are escalated to editorial review.
- Show "serving as of" separately from "source last checked."
- Preserve the source's publication date, retrieval date, URL, title, publisher, applicable locator, and license. Preserve a checksum/archive only when the source's artifact policy permits retention.

### 7.4 Corrections And Disputes

- Publish a correction form and a monitored contact address.
- Require the reporter to identify the page, disputed fact, and supporting source.
- Acknowledge high-risk corrections within one business day.
- Correct verified errors promptly without erasing the audit history.
- Display a correction note when the error was material.
- Offer a right of reply for consequential disputed personal claims.
- Never expose private editor identities or reporter contact details.

## 8. Language And Content Strategy

### 8.1 Launch Language

Launch in English, but introduce locale-prefixed routes and localized fields from the beginning. Pilot reviewed Hindi navigation, glossary terms, and selected institution explainers after English editorial workflows stabilize.

### 8.2 Translation Rules

- Use official localized titles where available.
- Do not mechanically translate constitutional/legal terminology.
- Store translated revisions separately with draft/reviewed/published status.
- Mark a translation stale when its source-language content changes.
- Keep citations in their source language and add a translated label, not an altered quotation.

### 8.3 Writing Style

- Plain, factual, and politically neutral.
- Explain acronyms on first use.
- Distinguish constitutional rule, ordinary law, convention, and current practice.
- Cite legal text rather than presenting an unsourced legal interpretation.
- Use dates such as "18 August 2026" in prose and ISO `2026-08-18` in data.

## 9. Accessibility, Mobile, And Performance

- Target WCAG 2.2 AA and use GIGW 3.0 as an additional India-specific reference.
- Make all primary tasks work with keyboard, screen reader, zoom, and JavaScript disabled except the optional 3D feature.
- Use semantic landmarks, heading order, tables, captions, and visible focus states.
- Test at 320 CSS pixels, common mobile sizes, desktop, 200% zoom, and forced colors.
- Keep public pages primarily server-rendered and minimize client JavaScript.
- Set initial performance targets: LCP under 2.5 seconds at p75, CLS under 0.1, INP under 200 ms on representative pages.
- Lazy-load portraits and 3D assets; never make a large WebGL bundle part of the home-page path.

## 10. Success Measures

### 10.1 Trust And Quality

- 100% of published current office holdings have citations.
- 0 automatically published scraper changes.
- 0 silent deletions caused by source failure.
- 100% of pages show scope and verification date.
- Material correction median resolution under two business days.

### 10.2 Coverage

- All 36 state/UT overview pages published.
- National MVP institution pages complete.
- Current Lok Sabha and Rajya Sabha member totals reconcile with official sources.
- State legislature member coverage expands only through a visible state-by-state matrix.

### 10.3 User Outcomes

- Users can reach a person or institution from search within two interactions.
- Search zero-result rate and correction rate are monitored.
- At least 90% task completion in usability tests for "find current holder," "find source," and "understand selection method."

### 10.4 Technical

- 99.9% monthly public-site availability target.
- Cached public page p95 server response under 500 ms in the primary region.
- Search p95 under 750 ms for the initial corpus.
- Immediately invalidated high-impact publication visible within five minutes. Low-risk stale-while-revalidate content is measured separately from first post-publication visit to successful refresh.

## 11. Delivery Phases

### Phase 0: Policy And Foundations, 2-3 Weeks

- Approve scope, terminology, source ranking, privacy boundary, and correction policy.
- Define database entities and temporal rules.
- Set up database, migrations, source registry, private evidence storage, authentication, and audit logs.
- Seed India, 28 states, 8 UTs, and core institutions.
- Build a minimal audited import, review, and atomic publication transaction.
- Use it to publish a small set of fully cited office holdings without direct production database edits.
- Build CI, basic observability, backup, and restore procedures.

Exit criteria:

- A historical office holding can be corrected without losing the old published revision.
- Every seeded fact has evidence and an explicit status.
- Editor authorization is enforced server-side.

### Phase 1: Public Information Alpha, 4-6 Weeks

- Build home, institution, jurisdiction, office, person, methodology, sources, search, and corrections pages.
- Add current national officeholders and all state/UT heads within the scope matrix.
- Build citation components, timelines, freshness labels, metadata, sitemap, and redirects.
- Implement the editorial compare/review/publish workflow.
- Add the first high-value HTML and PDF source adapters.
- Launch English content and locale-ready URLs.

Exit criteria:

- All published current facts are cited.
- No source fetch occurs during a public page request.
- Parser failures preserve the last approved publication.
- Mobile and accessibility smoke tests pass.

Phase 1 is an alpha milestone. The complete product MVP defined in section 3.1 is reached after Phase 2 adds the full Parliament scope.

### Phase 2: Parliament And 3D, 3-4 Weeks

- Import and review Lok Sabha and Rajya Sabha members and composition.
- Build composition APIs/projections.
- Build accessible table and 2D views.
- Build opt-in Three.js view with deterministic generated seat coordinates.
- Add mobile, reduced-motion, low-performance, and WebGL failure handling.
- Publish a visualization methodology page.

Exit criteria:

- Visual totals reconcile with source totals in automated tests.
- The page remains fully usable without JavaScript or WebGL.
- The visualization is clearly labeled conceptual/approximate where appropriate.

### Phase 3: Reliability And Launch, 2-3 Weeks

- Schedule source checks by source tier.
- Add source-freshness dashboards and alerts.
- Run security, accessibility, performance, backup-restore, and parser-failure reviews.
- Complete legal/policy review of data fields, image rights, and terms of use.
- Pilot reviewed Hindi navigation and glossary.
- Publish public coverage and source-health pages.

Exit criteria:

- Freshness alerts, correction process, and incident response are exercised.
- No critical accessibility/security findings remain.
- Public disclaimer, privacy notice, methodology, and correction policy are live.

### Phase 4: Controlled Expansion

- Add MLAs/MLCs one jurisdiction at a time.
- Add individual chamber seats only when assignment evidence exists.
- Add historical terms and predecessor institutions.
- Add reviewed Hindi explainers, then other languages based on editorial capacity.
- Publish versioned bulk data and OpenAPI only after the data contract is stable.
- Add local-government leaders only after a separate source and privacy assessment.

## 12. Team And Operating Model

Minimum practical team:

- 1 product/engineering lead.
- 1 full-stack/data engineer.
- 1 researcher/editor, initially part-time but increasing with state coverage.
- Periodic accessibility, security, and legal review.

The editorial workload, not page rendering, will be the principal scaling constraint. Coverage must grow only when the team can keep each source fresh.

## 13. Key Risks And Mitigations

| Risk | Consequence | Mitigation |
| --- | --- | --- |
| Official site changes structure | Parser fails or extracts wrong values | Source-specific adapters, fixtures, checksums, row-count checks, fail closed |
| Two official sources disagree | Reputational error | Preserve both observations, use precedence rules, require review |
| Similar names are merged | Incorrect biography/history | Stable IDs, jurisdiction context, manual merge approval |
| Source is stale | Former holder shown as current | Freshness thresholds, current-roster cross-check, visible warnings |
| Election affidavit is treated as result | Candidate shown as officeholder | One person identity with separate candidacy and holding relationships; require statutory result/current roster |
| 3D view implies real seating | Misleading presentation | "Chamber-style" label and published methodology |
| Portrait rights are unclear | Copyright/privacy complaint | Image-rights registry, licensed or official-policy-approved images only |
| Scope expands too quickly | Unmaintainable stale data | Public coverage matrix and phase gates |
| Political pressure or vandalism | Loss of neutrality/trust | Invite-only editing, MFA, audit trail, citations, correction policy |
| Translation changes meaning | Legal/political misinformation | Human review and stale-translation workflow |

## 14. Decisions Required Before Coding The Data Platform

- Final MVP officeholder coverage list.
- Editorial staffing and freshness commitments.
- Hosting region, budget, and evidence-retention policy.
- Database/auth/storage provider choice.
- Whether the Phase 1 alpha contains only institutional leadership or a reviewed subset of MPs; the complete MVP includes all current MPs.
- Portrait policy and legal review owner.
- Hindi launch depth.
- Public API timing and license for original normalized data.

## 15. Definition Of Done For Any Public Fact

A fact is publishable only when:

- Its subject has a stable identity.
- Its meaning and time interval are explicit.
- Its source is authoritative enough for the claim.
- The source URL, publisher, title, retrieval date, and locator are stored.
- Applicable license/use restrictions are recorded.
- A reviewer has approved it.
- Automated domain checks pass.
- The public page shows the citation and verification date.
- A correction path is available.
