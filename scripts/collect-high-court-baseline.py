"""Collect the dated Department of Justice High Court judge baseline.

The central DOJ page publishes PDFs dated 1 April 2026.  This script keeps
that baseline separate from a current court-level roster because judges can
be appointed, transferred, or retire between central publications.
"""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "app/data/judiciary/high-court-judges-baseline.json"

PDFS = {
    "allahabad": "https://www.doj.gov.in/static/uploads/2026/04/8e013ecf2f060fe73cdb726fb2348a46.pdf",
    "bombay": "https://www.doj.gov.in/static/uploads/2026/04/bb4061a02f134ff1b589f091c525e9a9.pdf",
    "gujarat": "https://www.doj.gov.in/static/uploads/2026/04/dc33533c2f53e9a853d41c14607cf834.pdf",
    "karnataka": "https://www.doj.gov.in/static/uploads/2026/04/bb2618cb2e1c8c717a7272aa2eeb5b23.pdf",
    "kerala": "https://www.doj.gov.in/static/uploads/2026/04/8a2480007a5050692aae450c69675ced.pdf",
    "madhya-pradesh": "https://www.doj.gov.in/static/uploads/2026/04/f300965863de253aff840c5745363be4.pdf",
    "madras": "https://www.doj.gov.in/static/uploads/2026/04/997ed3936ae0854d4ffaea8a61e926dc.pdf",
    "orissa": "https://www.doj.gov.in/static/uploads/2026/04/c05fb4ff240ec2650d9ce606f19bae96.pdf",
    "punjab-haryana": "https://www.doj.gov.in/static/uploads/2026/04/2de3524e61849856f45571cafbdeb2a6.pdf",
    "rajasthan": "https://www.doj.gov.in/static/uploads/2026/04/8c2672d2f0e45942f84740627cba1a67.pdf",
    "telangana": "https://www.doj.gov.in/static/uploads/2026/04/3af8ece2ba6c74b20b1cd70cf967b6b5.pdf",
}


def clean_name(value: str) -> str:
    value = re.sub(r"\s+", " ", value.replace("\n", " ")).strip(" .")
    value = re.sub(r"^(?:Smt\.?|SMT\.?|Ms\.?|MR\.?|DR\.?)\s+", "", value, flags=re.I)
    return value


def parse_pdf(url: str) -> tuple[str, list[dict[str, str | None]]]:
    request = Request(url, headers={"User-Agent": "indian-democracy-data-collector/1.0"})
    with urlopen(request, timeout=60) as response:
        content = response.read()
    temp = ROOT / ".tmp-high-court-baseline.pdf"
    temp.write_bytes(content)
    try:
        text = "\n".join(page.extract_text() or "" for page in PdfReader(temp).pages)
    finally:
        temp.unlink(missing_ok=True)

    title_match = re.search(r"\n\s*((?:[A-Z][A-Z &-]+)HIGH COURT|HIGH COURT FOR THE STATE OF [A-Z ]+)", text)
    title = title_match.group(1).strip() if title_match else "High Court"
    main_text = text.split("JUDGES TRANSFERRED", 1)[0]
    primary_section = main_text.split("ADDITIONAL JUDGES", 1)[0]
    pattern = re.compile(
        r"(?m)^\s*(\d+)\.\s+(.+?)\s+(BAR|SERVICE)\s+((?:--|\d{2}/\d{2}/\d{4}))\s+((?:--|\d{2}/\d{2}/\d{4}))\s+(\d{2}/\d{2}/\d{4})"
    )
    additional_pattern = re.compile(
        r"(?m)^\s*(\d+)\.\s+(.+?)\s+(BAR|SERVICE)\s+(\d{2}/\d{2}/\d{4})\s+(\d{2}/\d{2}/\d{4})\s+(\d{2}/\d{2}/\d{4})"
    )
    judges = []
    seen = set()
    matches = pattern.findall(primary_section)
    # Some DOJ PDFs place the active list after an empty ADDITIONAL JUDGES
    # heading (or use a different table layout). Keep those records rather
    # than silently returning an empty court.
    if len(matches) < 5:
        fallback = text.split("JUDGES TRANSFERRED", 1)[0]
        if "JUDGES TRANSFERRED" in text and len(fallback) < 1000:
            fallback = text.split("JUDGES TRANSFERRED", 1)[1]
        matches = pattern.findall(fallback)
    for number, raw_name, source, addl_date, permanent_date, retirement in matches:
        name = clean_name(raw_name)
        if not name or name in seen or len(name) > 120:
            continue
        seen.add(name)
        judges.append({
            "name": name,
            "sourceCategory": source.lower(),
            "appointmentAsAdditionalJudge": None if addl_date == "--" else addl_date,
            "appointmentAsPermanentJudge": None if permanent_date == "--" else permanent_date,
            "projectedRetirement": retirement,
            "baselineListNumber": int(number),
        })
    additional_section = main_text.split("ADDITIONAL JUDGES", 1)[1] if "ADDITIONAL JUDGES" in main_text else ""
    for number, raw_name, source, date_of_birth, initial_date, expiry_date in additional_pattern.findall(additional_section):
        name = clean_name(raw_name)
        if not name or name in seen or len(name) > 120:
            continue
        seen.add(name)
        judges.append({
            "name": name,
            "judgeType": "additional",
            "sourceCategory": source.lower(),
            "dateOfBirth": date_of_birth,
            "initialAppointment": initial_date,
            "termExpiry": expiry_date,
            "baselineListNumber": int(number),
        })
    return title, judges


def main() -> None:
    courts = []
    total = 0
    for court_id, url in PDFS.items():
        title, judges = parse_pdf(url)
        courts.append({
            "highCourtId": court_id,
            "publishedCourtName": title,
            "judgeCount": len(judges),
            "sourceAsOn": "2026-04-01",
            "sourceUrl": url,
            "judges": judges,
        })
        total += len(judges)

    payload = {
        "schemaVersion": "1.0.0",
        "dataset": "india-high-court-judges-baseline",
        "snapshotDate": "2026-08-21",
        "retrievedAt": datetime.now(timezone.utc).isoformat(),
        "coverageStatus": "11-of-25-high-courts-dated-central-baseline",
        "sourcePolicy": "These are dated DOJ baseline records, not a claim of current sitting membership on 2026-08-21. Use high-court-jurisdictions.json and high-court-judge-roster-sources.json to reconcile the remaining courts and current court-level rosters.",
        "counts": {"highCourtsCovered": len(courts), "highCourtsInIndia": 25, "judges": total},
        "courts": courts,
    }
    OUTPUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {OUTPUT} ({len(courts)} courts, {total} judges)")


if __name__ == "__main__":
    main()
