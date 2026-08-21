import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const snapshotDate = "2026-08-21";
const retrievedAt = new Date().toISOString();

async function getJson(url) {
  const response = await fetch(url, { headers: { "user-agent": "IndianDemocracyResearch/0.1" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function getText(url) {
  const response = await fetch(url, { headers: { "user-agent": "IndianDemocracyResearch/0.1" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

function cleanHtml(value) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8217;|&#039;|&apos;/gi, "'")
    .replace(/&#8220;|&ldquo;/gi, "\"")
    .replace(/&#8221;|&rdquo;/gi, "\"")
    .replace(/&#8211;|&ndash;/gi, "-")
    .replace(/&#8212;|&mdash;/gi, "-")
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function stripHonorific(name) {
  return name.replace(/^(Shri|Smt\.?|Dr\.?|Prof\.?|Thiru|Rao)\s+/i, "").trim();
}

async function writeJson(relativePath, value) {
  const filePath = path.join(root, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function collectLokSabha() {
  const first = await getJson("https://sansad.in/api_ls/member?loksabha=18&sitting=1&locale=en&state=&party=&month=&searchText=&page=1&size=100");
  const pages = first.metaDatasDto.totalPages;
  const records = [...first.membersDtoList];
  for (let page = 2; page <= pages; page += 1) {
    const next = await getJson(`https://sansad.in/api_ls/member?loksabha=18&sitting=1&locale=en&state=&party=&month=&searchText=&page=${page}&size=100`);
    records.push(...next.membersDtoList);
  }
  // The official vacancies view is rendered by the same Digital Sansad page.
  // Its undocumented data route returned HTTP 500 during this snapshot, so the
  // three visible vacancy rows were transcribed from https://sansad.in/ls/members?2.
  const vacancies = ["Nagaon", "Basirhat", "Shillong"].map((constituency) => ({ constituency }));
  return {
    schemaVersion: "1.0.0",
    dataset: "lok-sabha-sitting-members",
    snapshotDate,
    retrievedAt,
    source: {
      publisher: "Lok Sabha Secretariat, Parliament of India",
      title: "List of Members / current Lok Sabha member service",
      url: "https://sansad.in/ls/members",
      dataUrl: "https://sansad.in/api_ls/member",
      authorityTier: "Tier 1",
      notes: "The official Digital Sansad service returned sitting members for Lok Sabha 18. Personal contact, address, email, phone, birth date, and portrait fields were intentionally omitted."
    },
    house: { name: "Lok Sabha", term: 18, sanctionedSeats: 543 },
    counts: { sittingMembers: records.length, officialVacancies: vacancies.length },
    vacancies: vacancies.map((item) => ({ constituency: item.constituency })),
    members: records.map((item) => ({
      id: `ls-${item.mpsno}`,
      name: `${item.initial ?? ""} ${item.firstName ?? ""} ${item.lastName ?? ""}`.replace(/\s+/g, " ").trim(),
      nameAsPublished: item.mpLastFirstName?.trim(),
      party: item.partyFname?.trim(),
      partyAbbreviation: item.partySname?.trim(),
      stateOrUnionTerritory: item.stateName?.trim(),
      constituency: item.constName?.trim(),
      constituencyCategory: item.categoryCode?.trim() || null,
      membershipStatus: item.status,
      lokSabhaTerms: item.lsExpr,
      sourceRecordUpdatedAt: item.updatedAt
    }))
  };
}

async function collectRajyaSabha() {
  const result = await getJson("https://sansad.in/api_rs/member/sitting-members?state=&party=&page=1&size=500&search=&locale=en&mpFlag=1");
  return {
    schemaVersion: "1.0.0",
    dataset: "rajya-sabha-sitting-members",
    snapshotDate,
    retrievedAt,
    source: {
      publisher: "Rajya Sabha Secretariat, Parliament of India",
      title: "Sitting members",
      url: "https://sansad.in/rs/members",
      dataUrl: "https://sansad.in/api_rs/member/sitting-members",
      authorityTier: "Tier 1",
      notes: "The official Digital Sansad service returned the sitting-member roster. Personal contact, address, email, phone, birth date, and portrait fields were intentionally omitted."
    },
    house: { name: "Rajya Sabha", sanctionedSeats: 245 },
    counts: { sittingMembers: result._metadata.totalElements, officialVacancies: 245 - result._metadata.totalElements },
    members: result.records.map((item) => ({
      id: `rs-${item.mpsno}`,
      name: item.name?.trim(),
      party: item.party?.trim(),
      partyAbbreviation: item.partyCode?.trim(),
      stateOrUnionTerritory: item.state?.trim(),
      term: item.term,
      termCount: item.termCount,
      membershipStatus: item.status,
      notificationDate: item.notificationDate,
      expirationDate: item.expirationDate,
      nominated: item.state?.trim() === "Nominated"
    }))
  };
}

async function collectCouncilOfMinisters() {
  const url = "https://www.pmindia.gov.in/en/news_updates/portfolios-of-the-union-council-of-ministers-2/";
  const html = await getText(url);
  const asOn = html.match(/As on\s+([0-9.]+)/i)?.[1] ?? null;
  const table = html.match(/<table[^>]*class=["']pms-list[^>]*>([\s\S]*?)<\/table>/i)?.[1] ?? "";
  const rows = [...table.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)].map((match) => match[1]);
  let category = "Cabinet Ministers";
  const ministers = [];
  for (const row of rows) {
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => match[1]);
    const heading = row.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1];
    if (heading) {
      category = cleanHtml(heading);
      continue;
    }
    if (cells.length >= 3 && /^\s*\d+\s*$/.test(cleanHtml(cells[0]))) {
      const name = cleanHtml(cells[1]);
      ministers.push({
        id: `union-minister-${ministers.length + 1}`,
        name,
        nameWithoutHonorific: stripHonorific(name),
        category,
        portfolios: cleanHtml(cells[2]).split("\n").map((value) => value.replace(/[;.]$/, "").trim()).filter(Boolean)
      });
      continue;
    }
    if (cells.length >= 2 && /Prime Minister/i.test(cleanHtml(cells.at(-1)))) {
      const name = cleanHtml(cells[0]);
      ministers.unshift({
        id: "union-prime-minister",
        name,
        nameWithoutHonorific: stripHonorific(name),
        category: "Prime Minister",
        portfolios: cleanHtml(cells.at(-1)).split("\n").map((value) => value.replace(/[;.]$/, "").trim()).filter(Boolean)
      });
    }
  }
  return {
    schemaVersion: "1.0.0",
    dataset: "union-council-of-ministers",
    snapshotDate,
    retrievedAt,
    source: {
      publisher: "Prime Minister's Office, Government of India",
      title: "Portfolios of the Union Council of Ministers",
      url,
      authorityTier: "Tier 2",
      publisherAsOn: asOn,
      notes: "Portfolio relationships are dated to the PMO's stated as-on date and stored separately from person identity."
    },
    ministers
  };
}

async function collectSupremeCourt() {
  const url = "https://www.sci.gov.in/chief-justice-judges/";
  const html = await getText(url);
  const blocks = html.split(/(?=class=["']judge-name["'])/i).slice(1);
  const judges = blocks.map((block, index) => {
    const name = cleanHtml(block.match(/class=["']judge-name["'][^>]*>([\s\S]*?)<\/strong>/i)?.[1] ?? "");
    const dob = cleanHtml(block.match(/class=["']judge-dob["'][^>]*>[\s\S]*?<strong>[^<]*<\/strong>\s*([^<]+)/i)?.[1] ?? "") || null;
    const termStart = block.indexOf("Term of Office");
    const termDates = termStart >= 0 ? (block.slice(termStart, termStart + 420).match(/\d{2}-\d{2}-\d{4}/g) ?? []) : [];
    const termOfOffice = termDates.length >= 2 ? `${termDates[0]} to ${termDates[1]}` : null;
    return {
    id: `sci-${index + 1}`,
    name: name.replace(/^Justice\s+/i, "").trim(),
    title: name.startsWith("Justice ") ? name : `Justice ${name}`,
    dateOfBirth: dob,
    termOfOffice,
    chiefJustice: index === 0
    };
  }).filter((judge) => judge.name);
  return {
    schemaVersion: "1.0.0",
    dataset: "supreme-court-current-judges",
    snapshotDate,
    retrievedAt,
    source: {
      publisher: "Supreme Court of India",
      title: "Chief Justice and Judges",
      url,
      authorityTier: "Tier 1",
      notes: "Dates are preserved as displayed by the Court. Retirement dates are projected dates until the term ends."
    },
    court: "Supreme Court of India",
    judges
  };
}

async function main() {
  const [lokSabha, rajyaSabha, councilOfMinisters, supremeCourt] = await Promise.all([
    collectLokSabha(),
    collectRajyaSabha(),
    collectCouncilOfMinisters(),
    collectSupremeCourt()
  ]);

  await writeJson("app/data/parliament/lok-sabha-members.json", lokSabha);
  await writeJson("app/data/parliament/rajya-sabha-members.json", rajyaSabha);
  await writeJson("app/data/executive/union-council-of-ministers.json", councilOfMinisters);
  await writeJson("app/data/judiciary/supreme-court-judges.json", supremeCourt);

  console.log(JSON.stringify({
    lokSabha: lokSabha.counts,
    rajyaSabha: rajyaSabha.counts,
    unionMinisters: councilOfMinisters.ministers.length,
    supremeCourtJudges: supremeCourt.judges.length
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
