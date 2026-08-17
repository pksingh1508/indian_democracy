# Indian Public Institutions And Officeholders: Data Collection Research

Research snapshot: 18 August 2026

## 1. Scope And Important Limitation

This document identifies practical, primarily official sources for an independent website about Indian public institutions and currently serving officeholders. It is a research snapshot, not a representation that every URL exposes a stable API or permits automated collection.

There is no single authoritative database of all Indian politicians, judges, constitutional officeholders, statutory officeholders, and government employees. The data is distributed across Parliament, the Election Commission of India (ECI), the Gazette, Union ministries, courts, 28 state governments, 8 Union Territory administrations, and many legislatures.

The correct strategy is:

1. Define a narrow coverage matrix.
2. Discover the responsible institution.
3. Use the controlling event record and current roster together.
4. Store dated evidence and provenance.
5. Review every material change before publication.

"All government employees" should not be promised. No comprehensive public source exists, and aggregation would create serious privacy, security, impersonation, and maintenance risks. Start with elected representatives, constitutional/statutory officeholders, judges, ministers, and selected senior officials intentionally listed by their institution.

## 2. Research Method

Sources were evaluated on:

- Whether the publisher is legally or operationally responsible for the record.
- Whether the record establishes an event or only summarizes current status.
- Whether data is final or provisional.
- Whether the source states an update date.
- Whether the format is HTML, client-rendered HTML, PDF, scan, spreadsheet, download, or documented API.
- Whether terms, copyright, license, privacy, robots, or technical controls restrict use.
- Whether a current claim can be independently corroborated.

URLs and observed behavior can change. Recheck each source's terms, robots policy, accessibility, schema, and update status before implementing an adapter.

## 3. Reliability And Source Roles

### Reliability Tiers

| Tier | Meaning | Examples |
| --- | --- | --- |
| Tier 1 | Controlling legal/electoral record or direct responsible institution | Gazette appointment, statutory Returning Officer result record, official Parliament/court roster |
| Tier 2 | Direct official publication, but informational or carrying a disclaimer | Official biography, civil list, ministry "Who's Who" |
| Tier 3 | Official aggregator/discovery layer, operational dashboard, or provisional feed | IGOD, NeVA coverage index, live affidavit status |
| Tier 4 | Reputable non-government secondary source | PRS, ADR/MyNeta, research datasets |
| Tier 5 | Open-edit/general web source | Wikipedia, search snippets, social media |

Tier 4 and 5 sources can identify a lead or discrepancy, but should not be the sole evidence for a current or sensitive fact.

### Event Source Versus Current Roster

Use both when possible:

- A Gazette/appointment order proves that an appointment event occurred.
- A Returning Officer's applicable statutory declaration/result sheet is the strongest result event evidence. The ECI display portal helps discover and cross-check that result.
- A current institutional roster helps confirm that the person still serves.
- A later resignation, death, disqualification, transfer, retirement, or vacancy can end the relationship.

Never infer "currently serving" only from an old election result, affidavit, appointment notice, or open-ended database row.

## 4. National Discovery And Legal Records

### 4.1 Integrated Government Online Directory (IGOD)

- Main portal: https://igod.gov.in/
- Union government categories: https://igod.gov.in/ug/categories
- State/UT index: https://igod.gov.in/sg/states
- Legislature categories: https://igod.gov.in/leg/categories
- Judiciary categories: https://igod.gov.in/jud/categories
- Apex body categories: https://igod.gov.in/apx/categories
- Website policies: https://igod.gov.in/website_policies

Useful data:

- Official institution names and abbreviations.
- Government level and category.
- Ministry, department, state/UT, legislature, court, board, and commission website links.
- Discovery entry points for all 28 states and 8 UTs.

Format and cadence:

- Server-readable HTML directory.
- The state/UT index was marked last updated 17 August 2026 when reviewed.
- Updates appear continuous/event-driven, but that cadence is inferred unless a page states otherwise.

Caveats:

- IGOD is a directory, not the controlling roster of current officeholders.
- Its pages advise confirmation with the relevant organization.
- Treat it as Tier 3 discovery data.
- Review its copyright/website policy and request permission before systematic reproduction.

### 4.2 eGazette Of India

- Portal: https://egazette.gov.in/
- Legacy/linked entry points may use `egazette.nic.in`; store the final URL actually retrieved.

Useful data:

- Appointment, resignation, transfer, and retirement notifications.
- Election and statutory notifications.
- Rules, amendments, orders, and institutional changes.
- Gazette part/section, notification number, ministry, date, and official PDF.

Format and cadence:

- Search interface and official PDFs.
- Daily/event-driven publication.
- Some older PDFs are scans requiring OCR.

Caveats:

- Search sessions and metadata can be awkward to automate.
- OCR and table extraction can be inaccurate.
- Cite the Gazette PDF, notification number, date, part/section, and page.
- Prefer Gazette text where it conflicts with an informal summary, subject to later amending/correcting notifications.

### 4.3 India Code

- Portal: https://www.indiacode.nic.in/
- Constitution of India entry point: https://legislative.gov.in/constitution-of-india/

Useful data:

- Central and state Acts.
- Act number/year, enactment date, ministry, department, sections, and subordinate legislation.
- Rules, regulations, notifications, orders, ordinances, statutes, and circulars.

Use it for:

- Constitutional/statutory basis of an institution or office.
- Selection, term, qualification, and removal rules.
- Distinguishing a constitutional body from a statutory or executive body.

Caveats:

- It is not a current officeholder roster.
- Check amendments, commencement notifications, and Gazette records before making a current legal claim.
- Cite the exact section and access date.

### 4.4 Open Government Data Platform India

- Portal: https://www.data.gov.in/
- API catalogue: https://www.data.gov.in/apis
- Government Open Data License - India: https://www.data.gov.in/Godl
- Terms: https://www.data.gov.in/terms-of-use
- Policies: https://www.data.gov.in/policies

Potential data:

- Publisher, dataset title, geographic and temporal coverage, update frequency, resource schema, and downloads.
- CSV, XLS/ODS, JSON, XML, and API resources depending on the publisher.
- Documented APIs generally require an API key.

Important observation on 18 August 2026:

- The fetched portal displayed a sandbox/testing warning, zero-like counters, and an epoch-style last-updated value.
- Its fetched page stated that content/functionality may be incomplete or inaccurate.
- Reassess the production status before relying on it.

License:

- GODL generally permits reuse and adaptation of covered datasets with attribution.
- It excludes categories such as personal information, identity documents, official insignia, third-party rights, and resources not actually licensed under GODL.
- Check the license metadata on every resource; the portal's existence does not automatically license every linked document.

Access caveat:

- `robots.txt` was reported as disallowing broad crawling during this research. Use documented APIs/resource downloads rather than crawling catalogue pages.

## 5. Parliament

### 5.1 Digital Sansad: Lok Sabha

- Current/list of members: https://sansad.in/ls/members
- Lok Sabha home: https://sansad.in/ls
- Accessibility statement: https://sansad.in/ls/accessibility-statement

Expected fields:

- Member name.
- Party.
- Constituency.
- State/UT.
- Membership status.
- Lok Sabha terms.
- Member profile may contain biography, public contact, committee/activity, and other fields, but availability varies.

Format/cadence:

- Client-rendered HTML backed by undocumented network calls.
- Updates are expected after general/by-elections, resignations, deaths, disqualifications, and vacancies.

Caveats:

- A simple server-side fetch returned table headings with no member rows during research.
- Do not depend on a private/undocumented endpoint without permission and a fallback.
- No stable public bulk API/export contract was verified.
- Preserve house term, constituency, membership start/end, party-at-date, membership route, and observation time.
- Request a data feed or written permission before sustained automated extraction.

### 5.2 Digital Sansad: Rajya Sabha

- Members: https://sansad.in/rs/members
- Rajya Sabha home: https://sansad.in/rs
- Terms/site policy entry point: https://sansad.in/rs/termsAndConditions

Expected fields:

- Sitting/all member lists.
- Name, party, represented state/UT, term, and retirement information.
- Elected versus President-nominated status.

Format/cadence/caveats:

- Client-rendered HTML with no verified public bulk API.
- Updated around biennial elections, nominations, retirements, resignations, and vacancies.
- Most members are indirectly elected; nominated members must be modeled separately.
- A represented state/UT is not the same as a directly elected constituency.

### 5.3 Parliament Data Collection Plan

For each house:

1. Identify the current house/term.
2. Collect official current roster and member profiles.
3. Collect ECI result/statistical records for elections where applicable.
4. Collect Gazette/house bulletins for nominations, resignations, disqualifications, and vacancies.
5. Compare official member count, published vacancies, and database totals.
6. Send all differences to review.

Do not assume party affiliation remains unchanged for a full term.

## 6. Union Executive And Ministries

### 6.1 Prime Minister's Office: Council Of Ministers

- Current portfolios page: https://www.pmindia.gov.in/en/news_updates/portfolios-of-the-union-council-of-ministers-2/
- PM profile: https://www.pmindia.gov.in/en/pms-profile/
- Former Prime Ministers: https://www.pmindia.gov.in/en/former-prime-ministers/
- PMO officer list: https://www.pmindia.gov.in/en/list-of-officers-pmo/
- Website policies: https://www.pmindia.gov.in/en/website-policies/

Useful data:

- Prime Minister.
- Cabinet Ministers.
- Ministers of State (Independent Charge).
- Ministers of State.
- Ministry/department portfolios and concurrent responsibilities.

Observed status:

- The portfolio page was marked "As on 25.07.2026" and linked a dated PDF when reviewed.
- Preserve that explicit as-on date and the PDF checksum.

Format/cadence:

- HTML plus dated PDF.
- Event-driven after appointments, resignations, and reallocations.

Caveats:

- A web page is a practical current source, but formal appointment/allocation orders and Gazette records are stronger event evidence.
- Portfolio assignment is a dated many-to-many relationship, not a string column on a person.
- PMO website policy permits certain reproduction with accuracy, attribution, non-misleading use, and third-party exclusions; recheck the exact policy before reuse.

### 6.2 Cabinet Secretariat

- Portal: https://cabsec.gov.in/

Useful data:

- Government of India (Allocation of Business) Rules.
- Transaction of Business Rules.
- Cabinet Secretariat organization/publications.

Use it for the legal/administrative structure of ministries and departments. Prefer the latest dated rule/amendment and Gazette record over a copied organizational list.

### 6.3 Ministry/Department Discovery

- IGOD Union categories: https://igod.gov.in/ug/categories

Use IGOD to discover each ministry's official site, then collect its "Who's Who," organization chart, or official directory only for selected senior decision-making roles within the approved scope.

Do not combine all ministry employee directories into a mass public-employee dataset.

## 7. President And Vice President

### 7.1 President Of India

- Official portal: https://www.presidentofindia.gov.in/
- Terms and conditions: https://www.presidentofindia.gov.in/terms-conditions
- Copyright policy: https://www.presidentofindia.gov.in/copyright-policy

Useful data:

- Current President and official profile.
- Oath date and ordinal number.
- Speeches, press releases, photographs, and former Presidents.

Classification:

- Constitutional officeholder elected indirectly through an electoral college, not a directly elected MP-style office.

Caveats:

- The copyright policy reviewed by research appeared stricter than some other government sites and referred to permission/acknowledgment. Do not copy portraits or long biographies without confirming rights.
- Use the official roster/profile plus Gazette/election/oath records for term events.

### 7.2 Vice President Of India

- Official portal: https://vicepresidentofindia.nic.in/
- Website policies: https://vicepresidentofindia.nic.in/website-policies/

Useful data:

- Current and former Vice Presidents.
- Official profile and constitutional role.
- Secretariat "Who's Who," speeches, and news.

Classification:

- Constitutional officeholder, indirectly elected, and ex officio Chair of Rajya Sabha.

Caveats:

- Keep the Vice President office and Rajya Sabha chair role as distinct linked offices.
- Link by stable internal entity ID because official page slugs can be inconsistent.

## 8. Elections, Results, Parties, And Affidavits

### 8.1 Election Commission Of India

- Main portal: https://www.eci.gov.in/
- About ECI: https://www.eci.gov.in/about-eci
- Statistical reports: https://www.eci.gov.in/statistical-reports

Useful data:

- ECI officeholders and constitutional mandate.
- Election schedules and notifications.
- Recognized political party information.
- Electoral statistics and reports.

Caveats:

- The main site blocked automated research requests with HTTP 403 in this review.
- Do not bypass access controls. Use normal browser/manual access, published downloads, formal requests, or seek an official feed.
- No general-purpose public officeholder API was verified.

### 8.2 ECI Results

- Results portal: https://results.eci.gov.in/

Expected fields:

- Election, state/UT, constituency, and constituency type.
- Candidate and party.
- Votes, vote share, result status, winner, runner-up, and margin where published.

Format/cadence:

- Dynamic election-specific pages and network resources.
- Near-real-time trends during counting, followed by operational result displays populated from election machinery.

Caveats:

- Live trends can change and must be labeled provisional.
- Election-specific URLs may be reorganized.
- Archive the election identifier, retrieval time, status, and source URL.
- Do not describe the live results portal as the final statutory record by default. Collect the applicable Returning Officer declaration/result sheet, Chief Electoral Officer repository, election notification, and final ECI statistical report where available.
- A winner record establishes an election result, not indefinite current membership.

### 8.3 Candidate Affidavit Management

- Portal: https://affidavit.eci.gov.in/candidate-affidavit

Fields commonly available:

- Candidate name and photo.
- Party, election, state, and constituency.
- Nomination status: accepted, rejected, withdrawn, or contesting.
- Form 26 declarations may include criminal cases/convictions, assets, liabilities, income/tax declarations, and education.

Critical disclaimer:

- The portal states that data is dynamically published from Returning Officer updates, is tentative and subject to change, and that the respective Returning Officer should be contacted for a confirmed list.

Rules for use:

- A candidate is not an officeholder.
- Rejected and withdrawn candidates can appear in the portal.
- Join an accepted/contesting candidacy to the statutory result record and then a current roster before showing current office.
- Store self-declared affidavit facts as claims "declared in Form 26," not independently verified facts.
- Do not republish addresses, signatures, identifiers, family details, or unnecessary sensitive/personal fields.
- Have legal/editorial review before publishing criminal and financial summaries.

### 8.4 Political Parties

Use:

- ECI registered/recognized party publications from https://www.eci.gov.in/
- ECI results for party-at-election.
- Current Parliament/legislature roster for party-at-observation.
- House bulletins/anti-defection decisions for later changes where available.

Party identity requires aliases, abbreviations, recognition status, and effective dates. Coalitions/parliamentary groups should be separate from parties.

### 8.5 Reputable Secondary Cross-Checks

- Association for Democratic Reforms/MyNeta: https://myneta.info/
- PRS Legislative Research: https://prsindia.org/

Use these as Tier 4 discovery and quality-control sources. They can help locate affidavits, member histories, and discrepancies, but their data must be linked back to the official ECI/house record. Review their terms before automated use or redistribution.

## 9. Judiciary

### 9.1 Supreme Court Of India

- Chief Justice and judges: https://www.sci.gov.in/chief-justice-judges/
- Former Chief Justices: https://www.sci.gov.in/former-chief-justices/
- Former judges: https://www.sci.gov.in/former-judges/
- Judges roster: https://www.sci.gov.in/judges-roster-2/
- Website policies: https://www.sci.gov.in/website-policies/

Fields observed:

- Current Chief Justice and judges.
- Official name and portrait.
- Date of birth.
- Date of appointment and projected retirement.
- Profile/biography.

Format/cadence:

- Server-readable HTML.
- Updated after appointment, elevation, and retirement; the page was marked last updated 17 August 2026 in this review.

Caveats:

- Judges are constitutional judicial officeholders, not politicians or ordinary civil servants.
- Treat retirement dates as projected until the term actually ends.
- The site says website information is for reference and controlling records prevail.
- Website policy permits certain attributed reproduction with restrictions and third-party exclusions; verify portrait rights independently.

### 9.2 High Court Judges

- Department of Justice list: https://doj.gov.in/list-of-high-court-judges/
- Judiciary discovery through IGOD: https://igod.gov.in/jud/categories

Useful data:

- High Court, Chief Justice/judges, appointment/seniority, and retirement-related fields depending on the current implementation.

Caveats:

- The Department of Justice page appeared client-rendered/empty to non-browser extraction during research.
- Cross-check each judge against the relevant High Court's current roster and formal appointment/transfer notification.
- A High Court can serve more than one state/UT, so model jurisdiction relationships many-to-many.

### 9.3 Judicial Dashboards Are Not Judge Rosters

- Supreme Court NJDG: https://scdg.sci.gov.in/scnjdg/
- High Court NJDG: https://njdg.ecourts.gov.in/hcnjdg_v2/
- District Court NJDG: https://njdg.ecourts.gov.in/njdg_v3/

These provide case and court operational statistics, not reliable officeholder directories. Do not bulk republish case-party information or infer a judge's service status from a case dashboard. Respect CAPTCHA and interactive access controls.

## 10. States And Union Territories

### 10.1 National Discovery Layer

- All state/UT official entry points: https://igod.gov.in/sg/states
- Legislature directory: https://igod.gov.in/leg/categories
- NeVA: https://neva.gov.in/

IGOD provides entry points for all 36 jurisdictions but not a canonical current nationwide table of Governors/LGs, Chief Ministers, ministers, Chief Secretaries, MLAs, or MLCs.

### 10.2 National e-Vidhan Application (NeVA)

- Portal: https://neva.gov.in/

Potential data for participating houses:

- House/member information.
- Notices, questions, bills, papers laid, committee reports, debates, and session material.
- House onboarding status and links to house-specific portals.

Observed coverage behavior:

- Houses are labeled `Digital House`, `Onboarded`, or `Prospective`.
- Coverage and schemas vary.
- Lok Sabha and Rajya Sabha were shown as prospective on the NeVA index during this research, so Digital Sansad remains their primary member source.

Caveats:

- NeVA is not a complete uniform national member API.
- Some records are PDFs and use multiple Indian languages.
- A documented public bulk API was not verified.
- Confirm a member roster with the responsible Assembly/Council and election results.

### 10.3 Per-State/UT Source Stack

Create one source profile per jurisdiction using:

| Data | Preferred source | Corroboration |
| --- | --- | --- |
| Governor/LG/Administrator | Official Raj Bhavan/LG/UT site | President's Secretariat appointment release and Gazette |
| Chief Minister | Official CMO/state portal | Appointment/oath notification and state Gazette |
| State ministers/portfolios | CMO/Cabinet/General Administration Department | Appointment/portfolio order and Gazette |
| Assembly/MLC roster | Official legislature or NeVA house portal | Returning Officer result record, ECI display, and vacancy bulletins |
| Presiding officers | Official house page/bulletin | Election proceeding/notification |
| Chief Secretary/selected senior officials | Official state directory/department roster | Appointment/transfer order |
| Lok Sabha MPs | Digital Sansad | Returning Officer result record and ECI display |
| Rajya Sabha MPs | Digital Sansad | ECI election record/house roster |
| High Court | Court roster/Department of Justice | Appointment/transfer notification |

### 10.4 State Adapter Checklist

Before publishing a jurisdiction's full member data:

- Confirm official domains through IGOD.
- Record terms/copyright/robots for each site.
- Identify current-term roster, member profile, vacancies, and presiding-officer pages.
- Identify ECI election and by-election results.
- Identify Gazette/notification source.
- Establish expected seat count and council existence.
- Build parser fixtures and empty-page protection.
- Reconcile roster + vacancies against sanctioned/current house totals.
- Assign an editor and freshness threshold.

Do not assume all states use the same schema, language, election cycle, or bicameral structure.

### 10.5 Geography, Delimitation, And Local Elections

- Local Government Directory (LGD): https://lgdirectory.gov.in/
- Census of India: https://censusindia.gov.in/
- ECI main portal/delimitation publications: https://www.eci.gov.in/
- Election Commission for designated UTs: https://secforuts.mha.gov.in/

Use LGD as the primary official directory for standardized state/UT, district, sub-district, village, block, local-body, and ward codes. It also publishes mappings/reports between Parliamentary/Assembly constituencies and land regions/local bodies. Preserve code validity and invalidation history rather than assuming names are stable.

Use Census administrative/location codes and tables as versioned statistical/geographic references, not automatically as the current local-government directory. Record the Census year.

Parliamentary and Assembly constituency boundaries come from applicable Delimitation Commission/ECI orders and later legally effective changes. Store a boundary/version entity, order date, effective election, and source document. The ECI site may block automated access, so use permitted official downloads/manual import and do not bypass controls.

Local-body elections are conducted by State Election Commissions, not the ECI. Discover and register each state's official SEC separately; use https://secforuts.mha.gov.in/ for the UTs within that Commission's stated remit. Sources, schemas, and historical availability vary, so local representatives remain a separate later-phase programme.

## 11. Constitutional And Statutory Bodies

Use India Code to establish the legal basis and each body's own current roster for holders.

### 11.1 Union Public Service Commission

- Commission: https://www.upsc.gov.in/about-us/commission-

Data:

- Chairperson and members, profiles, and Commission structure.

Distinguish Commission members (constitutional officeholders) from UPSC Secretariat employees and civil-service candidates.

### 11.2 Comptroller And Auditor General

- Portal: https://cag.gov.in/
- Who's Who: https://cag.gov.in/en/pages/whos-who

Data:

- CAG and selected senior Indian Audit and Accounts Department leadership.

Distinguish the constitutional CAG office from career department officials. Use appointment/Gazette evidence for term events.

Availability caveat: the CAG portal/Who's Who timed out repeatedly during automated research. Keep Gazette/appointment records and manually verified official pages as fallbacks, and do not treat a fetch timeout as a vacancy.

### 11.3 Finance Commission

- Current commission portal: https://fincomindia.nic.in/
- Composition: https://fincomindia.nic.in/compositions

Data:

- Commission number, chairperson, full-/part-time members, roles, terms of reference, reports, and biographies.

Finance Commissions are periodically constituted. Always store commission number and operative period; do not model one permanent current roster.

### 11.4 National Human Rights Commission

- Composition: https://nhrc.nic.in/about-us/composition_of_commission

Data:

- Chairperson, members, assumed date, public official contact, profiles, deemed members, and Secretary-General.

Separate statutory members, deemed members who hold another office, and career executive officials.

### 11.5 Central Information Commission

- Present Commission: https://cic.gov.in/cic-profile

Data:

- Chief Information Commissioner, Information Commissioners, profiles, and terms where published.

Separate commissioners from secretariat staff.

### 11.6 Lokpal Of India

- Chairperson: https://lokpal.gov.in/about/chairperson
- Present members: https://lokpal.gov.in/about/present-members

Data:

- Current chairperson, judicial/non-judicial members, biographies, and former members.

### 11.7 Central Vigilance Commission

- Portal: https://www.cvc.gov.in/

Potential data:

- Central Vigilance Commissioner, Vigilance Commissioners, profiles, and senior officers.

Caveat:

- The site was difficult to extract through ordinary automated research. Confirm current visible profiles and Gazette appointments before ingestion.

### 11.8 Other Bodies

Apply the same pattern to:

- Election Commission of India.
- National Commissions for Scheduled Castes, Scheduled Tribes, and Backward Classes.
- National Commission for Women.
- National Commission for Minorities.
- National Commission for Protection of Child Rights.
- NITI Aayog and other executive bodies.

IGOD can discover official sites, but each body's legal classification and member roster must be verified separately.

## 12. Senior Government Officials And Civil Services

### 12.1 IAS Civil List

- Portal: https://iascivillist.dopt.gov.in/

Observed data:

- IAS cadre and officer records.
- Snapshot identified as "as on 01.01.2026" during research.
- Cadre strength and officer-in-position counts.
- Archives/e-book and query interfaces.

Caveats:

- IAS only, not all civil services or government employees.
- It carries an accuracy disclaimer.
- An annual snapshot can be stale after transfers, retirement, or other events.
- Do not bulk republish birth dates, personal histories, or other fields merely because they are viewable.
- Use it to corroborate selected senior role-holders, not as the product's entire purpose.

### 12.2 Official Department Directories

Examples:

- PMO officers: https://www.pmindia.gov.in/en/list-of-officers-pmo/
- Supreme Court registry officers: https://www.sci.gov.in/registry-officers/
- Supreme Court officers/officials: https://www.sci.gov.in/officers-officials/
- Ministry and department sites discovered via https://igod.gov.in/ug/categories

These are selected functional directories, not complete employee rolls. Collect only role title, official name, office unit, effective/observed date, and official role contact if the public product genuinely needs it. Prefer linking to the institution's directory over copying phone numbers.

### 12.3 RTI Proactive Disclosure

- Right to Information Act resources/official legal text: search via https://www.indiacode.nic.in/
- Central RTI portal: https://rtionline.gov.in/

Section 4 proactive disclosures on public-authority sites may contain organization charts, powers, duties, and employee/officer directories. They are fragmented and often published as PDFs. RTI availability does not automatically make unlimited aggregation or republication appropriate; apply purpose limitation, privacy review, and source terms.

### 12.4 Recommended Boundary

Publish a senior official only if:

- The role is materially relevant to explaining public decision-making.
- The institution intentionally publishes the current named holder.
- The role has a reliable update source.
- Only official-role information is used.
- A clear retention/removal policy exists after the person leaves the role.

## 13. Field-Level Collection Matrix

| Field | Primary evidence | Secondary evidence | Notes |
| --- | --- | --- | --- |
| Person official name | Current institutional roster/profile | Appointment/result record | Preserve alternate scripts/spellings |
| Current office | Current responsible-institution roster | Gazette/event record | Require explicit current confirmation |
| Appointment/election date | Gazette/order/statutory result record | Official biography or ECI display | Keep event and oath dates distinct |
| End date | Resignation/removal/retirement/vacancy record | Updated roster | Do not infer from disappearance alone |
| Constituency | House roster + statutory result record | ECI display/statistical report | Store election/term and boundary version |
| Party at election | Statutory result record | ECI display and candidate affidavit | Not necessarily current affiliation |
| Current party/group | Current house roster/bulletin | Party announcement | Store effective date and conflict |
| Ministerial portfolio | PMO/CMO dated portfolio list/order | Ministry roster | Many-to-many and time-bound |
| Selection method | Constitution/statute/house rules | Official explainer | Direct, indirect, nomination, appointment |
| Judge appointment | Gazette/DoJ notification | Court profile | Court profile for current status |
| Expected retirement | Court profile/legal age rule | DoJ list | Mark projected |
| Education/assets/cases | Signed Form 26 affidavit | ADR/MyNeta transcription | Self-declared; minimize fields and review |
| Portrait | Official source with reusable rights | Licensed media/Wikimedia asset | Store rights, credit, and source |
| Institution powers | Constitution/Act/rules | Official institution explainer | Cite exact provision and update date |

## 14. Collection And Publication Workflow

### Step 1: Register The Source

Record publisher, URL, scope, authority, format, expected cadence, terms, robots, license, rate limit, and contact method.

### Step 2: Obtain Access Correctly

Prefer, in order:

1. Documented API or licensed download.
2. Stable official HTML/CSV/PDF download.
3. Written data-sharing permission/feed.
4. Rate-limited public-page fetch permitted by policy.
5. Manual reviewed import for high-value inaccessible records.

Never bypass CAPTCHA, authentication, bot blocking, or technical access controls.

### Step 3: Preserve Permitted Evidence

First assign the source `retain_full`, `retain_redacted`, `retain_metadata_only`, or `do_not_collect`, including purpose, access class, and deletion period. Then store only what that policy permits:

- Original bytes, only when the assigned artifact policy allows them.
- Retrieval timestamp and final URL.
- HTTP status and selected headers.
- SHA-256 checksum.
- Publisher-stated update date.
- Content type and byte size.
- Terms/license snapshot/reference.

For affidavits or other documents containing addresses, signatures, family details, tax-related data, or identifiers, private storage alone is not adequate. Prefer official links plus minimized field-level evidence; where an original must be retained for a documented purpose, use redaction where valid, strict access logging, encryption, and short reviewed retention.

### Step 4: Extract

- HTML: use semantic headers, labels, and table columns.
- JSON/CSV: validate schema and field types.
- Text PDF: extract with layout and page references.
- Scanned PDF: OCR with appropriate language packs, then review.
- Image-only/complex table: transcribe through a two-person-reviewed import template when needed.

### Step 5: Normalize Without Losing Raw Values

Normalize names, dates, titles, parties, constituencies, and jurisdictions, but retain original source values and transformation version.

### Step 6: Resolve Identity

Use official IDs first, exact name plus context second, approved aliases third, and fuzzy matching only to suggest candidates to an editor.

### Step 7: Validate

Examples:

- House roster + vacancies equals expected total.
- Single-holder office has no unexplained overlapping confirmed holders.
- End date is not before start date.
- Candidate status is not converted to member status.
- Nominated/indirectly elected status is not labeled directly elected.
- Composition totals equal visualization totals.
- Every material fact has evidence.

### Step 8: Review And Publish

An editor compares existing and proposed values with source evidence. Publication is atomic, audited, and followed by precise cache invalidation.

### Step 9: Recheck

Track separately:

- Last fetch attempt.
- Last successful fetch.
- Last content change.
- Last successful parse.
- Last human verification.
- Published fact's effective date.

## 15. Update Cadence And Freshness

These are proposed operational targets, not source promises:

| Source/data | Check target | Escalation threshold |
| --- | --- | --- |
| National current officeholders | Daily | 2 consecutive failures or 3 days stale |
| Parliament rosters/vacancies | Daily | 2 consecutive failures or count mismatch |
| State/UT heads | Daily to every 3 days | 7 days stale |
| Councils of Ministers | Every 3 days and event-driven | 7 days after known reshuffle |
| State legislature rosters | Weekly; daily around elections | Count mismatch or 14 days stale |
| Supreme/High Court rosters | Daily/weekly by source | 7 days after known event |
| Election results during count | Minutes only if live scope approved | Label provisional continuously |
| Final election/statistical reports | Weekly around publication | Manual follow-up after election |
| Static institution explainers | Monthly/quarterly | Legal amendment alert |
| Annual civil lists | Monthly around expected issue | Preserve prior snapshot |

Show the last verified date publicly and a stale warning after the source-specific threshold.

## 16. Legal, Licensing, Privacy, And Editorial Safeguards

This section is engineering/editorial guidance, not legal advice. Obtain qualified legal review before launch and before expanding sensitive data.

### 16.1 Government Open Data License

- Official text: https://www.data.gov.in/Godl

Use GODL-covered resources with required attribution and within exclusions. Do not assume an ordinary government web page is GODL-licensed.

### 16.2 Site-Specific Copyright Policies

Review each publisher's current policy. Examples:

- PMO: https://www.pmindia.gov.in/en/website-policies/
- President: https://www.presidentofindia.gov.in/copyright-policy
- Vice President: https://vicepresidentofindia.nic.in/website-policies/
- Supreme Court: https://www.sci.gov.in/website-policies/
- IGOD: https://igod.gov.in/website_policies

Store policy URL, review date, allowed use, attribution, third-party exclusions, and image restrictions in the source registry.

### 16.3 Digital Personal Data Protection Framework

- MeitY data-protection framework: https://www.meity.gov.in/data-protection-framework
- Official corrigendum reviewed in this research: https://www.meity.gov.in/static/uploads/2025/12/3c7ebbae0e5456f493f486e6845df86b.pdf
- India Code legal search: https://www.indiacode.nic.in/

Research found that the Digital Personal Data Protection Act/Rules framework uses phased commencement notifications. The core obligations were reported as scheduled for a later phase than this research date, with other provisions already in force. Verify the exact current commencement status, Rules, and corrigenda immediately before launch rather than relying on this snapshot.

Regardless of legal phase, follow:

- Purpose limitation.
- Data minimization.
- Accuracy and correction.
- Security safeguards.
- Retention limits.
- Clear privacy notice for editor accounts, correction forms, analytics, or newsletters.

### 16.4 Accessibility

- GIGW portal/manual: https://guidelines.india.gov.in/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

Target WCAG 2.2 AA and use GIGW 3.0 as an India-specific quality reference. A private website should not falsely claim GIGW/STQC certification without completing the actual assessment.

### 16.5 Editorial Norms And Corrections

- Press Council of India, Norms of Journalistic Conduct 2022: http://presscouncil.nic.in/WriteReadData/Pdf/Norms2022.pdf

The official PDF was reachable only over HTTP during research, while HTTPS presented a certificate problem. Keep an internally verified copy only if the source policy permits it, record its checksum, and seek a stable secure official citation rather than silently bypassing certificate warnings for users.

Relevant principles include prompt correction/right of reply, privacy safeguards, presumption of innocence, and distinguishing public interest from public curiosity.

For criminal cases or allegations:

- Attribute the claim precisely to the affidavit/court record.
- Distinguish pending case, charge, conviction, acquittal, and appeal.
- Never imply guilt from a pending matter.
- Record the record date and later disposition when available.
- Require enhanced editorial/legal review.

### 16.6 Images And Official Symbols

- Do not use the State Emblem as the product logo or imply official status.
- Record portrait copyright/license, attribution, original URL, and allowed transformations.
- Official publication does not automatically mean unrestricted portrait reuse.
- Prefer neutral placeholders when rights are unclear.

## 17. robots.txt, Terms, And Responsible Access

- `robots.txt` is not a license, and absence of a disallow rule is not permission.
- Terms/copyright permission does not necessarily grant high-frequency automated access.
- A `403`, CAPTCHA, login wall, or rate limit must be respected.
- Use a descriptive user agent and contact address.
- Cache responses, send conditional requests, and rate-limit per host.
- Fetch outside peak service periods where reasonable.
- Request an official feed for client-rendered or frequently changing rosters.
- Document manual collection when automation is not permitted/reliable.

## 18. Sources Not Suitable As Primary Evidence

Do not use these alone for current-role claims:

- Search-engine snippets.
- Social media posts, including official accounts, unless corroborated by an official record.
- Wikipedia or Wikidata.
- News articles.
- Political party promotional biographies.
- AI-generated summaries.
- Old cached copies without provenance.
- Candidate affidavits without statutory result records/current roster.

They may provide aliases, leads, or discrepancy alerts for human research.

## 19. Source Registry Template

For every endpoint, maintain:

```text
source_key:
publisher:
institution_responsible:
url:
data_scope:
authority_tier:
event_or_roster:
format:
provisional_or_final:
publisher_update_date:
expected_cadence:
freshness_threshold:
terms_url:
copyright_url:
license:
robots_reviewed_at:
automation_permission:
rate_limit:
artifact_policy:
artifact_access_class:
artifact_retention_period:
parser_key_and_version:
expected_record_count_range:
last_fetch_success:
last_parse_success:
last_editor_verification:
known_caveats:
contact_or_access_request:
```

## 20. Data Record Provenance Template

Every canonical fact should be traceable to:

```text
subject_id:
predicate:
normalized_value:
raw_source_value:
valid_from:
valid_to_exclusive:
date_precision:
publication_status:
relationship_status_and_type_if_applicable:
source_publisher:
source_title:
official_url:
source_publication_date:
retrieved_at:
artifact_sha256_if_retained:
html_or_pdf_locator_if_applicable:
supports_or_contradicts:
reviewer_approval:
publication_id:
```

## 21. Recommended First Source Adapters

Build adapters in this order:

1. Supreme Court current judges: server-readable, structured, high-value roster.
2. PMO Council of Ministers: dated HTML/PDF and clear portfolios.
3. President and Vice President profiles: small, high-value office set.
4. IGOD jurisdiction/institution discovery: seed official links, subject to policy review.
5. One stable NeVA/official state legislature as a pilot.
6. Statutory result-record import for one completed election, using the ECI display/statistical report as cross-checks.
7. Digital Sansad only after confirming a permitted, stable access method.
8. Gazette manual/assisted import before attempting generalized Gazette automation.

This order proves the evidence workflow on manageable sources before tackling client-rendered Parliament lists and 36 heterogeneous state/UT systems.

## 22. Final Data Quality Checklist

Before a public release, confirm:

- Every current office holding has an authoritative citation.
- Every page shows source last checked and coverage status.
- Candidacy relationships and representative, judge, constitutional officeholder, and career-official categories are distinct.
- Party and portfolio data are dated.
- House/member/vacancy totals reconcile.
- No sensitive affidavit fields or personal employee contacts leaked into public DTOs.
- Every portrait has a rights record.
- Source terms/robots/license reviews are current.
- Failed/empty parsers cannot remove public records.
- Conflicts and stale sources are visible to editors and, where material, users.
- A correction and right-of-reply process is operational.
- The site states clearly that it is independent and not an official government service.
