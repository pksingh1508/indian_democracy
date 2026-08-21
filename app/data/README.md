# Indian democracy data

This directory contains dated, source-linked public records collected on 21 August 2026. Each JSON file keeps its own source metadata so a consumer can show provenance beside a record.

## Folders

- `geography/`: all 36 LGD states and Union Territories plus 784 LGD districts.
- `parliament/`: current Lok Sabha and Rajya Sabha sitting-member rosters.
- `executive/`: President, Vice-President, Prime Minister, and Union Council of Ministers.
- `judiciary/`: current Supreme Court roster, High Court jurisdiction mapping, and High Court roster sources.
- `sources/`: the source registry used by the datasets.
- `coverage.json`: machine-readable completeness and known gaps.

## Important coverage notes

- Lok Sabha is represented as 540 sitting members plus three official vacancies, preserving the 543-seat house size.
- Rajya Sabha is represented as 244 sitting members plus one vacant seat in the official current-member service.
- High Court jurisdiction is complete for all 25 High Courts. The central Department of Justice judge PDFs are dated 1 April 2026 and are preserved as a baseline source index; they are not mislabeled as an August current roster. Court-level official current roster URLs are recorded for reconciliation.
- This is a public-office dataset, not a directory of every government employee. It intentionally excludes personal contact details, private addresses, email addresses, phone numbers, and other unnecessary personal data.
- State ministers, MLAs, MPs of past Lok Sabhas, district-level judicial officers, and every government employee are separate collections and are not silently inferred from the current datasets.

## Recollection

Run `node scripts/collect-national-data.mjs` to refresh the national datasets from the official public services. Re-run the LGD browser extraction for geography and refresh High Court rosters from the court-level official sources when a new snapshot is needed.
